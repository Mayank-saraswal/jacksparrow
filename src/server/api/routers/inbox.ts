import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "../../../../generated/prisma";
import { inngest } from "@/inngest/client";
import {
  getMailProvider,
  resolveMailPlugin,
  type MailProvider,
} from "@/server/mail/provider";
import type { TenantRef } from "@/server/corsair";
import {
  looksLikeCalendarInvite,
  matchThreadToSplit,
  parseSplitRules,
  type MatchableThread,
  type SplitRule,
} from "@/lib/split-rules";
import {
  decodeCursor,
  encodeCursor,
  syncItemToPreview,
  type SyncItemPreview,
} from "@/lib/inbox-list";
import {
  resolveThreadSummary,
  shouldAutoSummarize,
} from "@/server/summary";
import { ownerForContext } from "@/server/billing/entitlements";

/** Build the split-matchable view of a preview (priority + invite heuristic). */
function toMatchable(p: SyncItemPreview): MatchableThread {
  return {
    fromEmail: p.fromEmail,
    subject: p.subject,
    priorityLabel: (p.priority?.label as MatchableThread["priorityLabel"]) ?? null,
    hasCalendarInvite: looksLikeCalendarInvite(p.subject),
  };
}

type PreviewWithSplit = SyncItemPreview & { splitId: string };

/** Resolve the current user's mail provider (Gmail or Outlook). */
async function userProvider(userId: string): Promise<MailProvider> {
  const ref: TenantRef = { kind: "user", userId };
  return getMailProvider(await resolveMailPlugin(ref), ref);
}

/** Loads the user's split-inbox rules (falling back to defaults). */
async function loadSplitRules(
  db: PrismaClient,
  userId: string,
): Promise<SplitRule[]> {
  const pref = await db.userPreference.findUnique({
    where: { userId },
    select: { splitInboxRules: true },
  });
  return parseSplitRules(
    (pref?.splitInboxRules as { rules?: unknown })?.rules ??
      pref?.splitInboxRules,
  );
}

/**
 * Attach priority labels, drop snoozed threads, bucket into splits and count.
 * Shared by both the sync_items path and the live-provider fallback.
 */
async function annotateAndSplit(
  db: PrismaClient,
  userId: string,
  previews: SyncItemPreview[],
  splitId: string | undefined,
): Promise<{ threads: PreviewWithSplit[]; splitCounts: Record<string, number> }> {
  const threadIds = previews.map((p) => p.threadId);

  const scores = await db.priorityScore.findMany({
    where: { userId, threadId: { in: threadIds } },
    select: { threadId: true, label: true, reason: true },
  });
  const scoreByThread = new Map(scores.map((s) => [s.threadId, s]));
  for (const preview of previews) {
    if (preview.priority) continue;
    const s = scoreByThread.get(preview.threadId);
    preview.priority = s ? { label: s.label, reason: s.reason ?? "" } : null;
  }

  const snoozed = await db.snoozedThread.findMany({
    where: { userId, status: "snoozed", threadId: { in: threadIds } },
    select: { threadId: true },
  });
  const snoozedSet = new Set(snoozed.map((s) => s.threadId));

  const rules = await loadSplitRules(db, userId);
  const annotated = previews
    .filter((p) => !snoozedSet.has(p.threadId))
    .map((p) => ({ ...p, splitId: matchThreadToSplit(toMatchable(p), rules) }));

  const splitCounts: Record<string, number> = {};
  for (const t of annotated) {
    splitCounts[t.splitId] = (splitCounts[t.splitId] ?? 0) + 1;
  }

  const threads =
    splitId && splitId !== "all"
      ? annotated.filter((t) => t.splitId === splitId)
      : annotated;

  return { threads, splitCounts };
}

/**
 * Fallback list path for accounts that have not synced any items yet: hydrate
 * previews live from the provider. Provider-agnostic (Gmail or Outlook).
 */
async function listThreadsLive(
  db: PrismaClient,
  userId: string,
  input: { q: string; limit: number; splitId?: string },
): Promise<{
  threads: PreviewWithSplit[];
  splitCounts: Record<string, number>;
  nextPageToken: string | null;
}> {
  const provider = await userProvider(userId);
  const items = await provider.listThreads(input.q, input.limit);
  const previews: SyncItemPreview[] = items.map((item) => ({
    threadId: item.threadId,
    subject: item.subject || "(no subject)",
    snippet: item.snippet,
    fromName: item.fromName,
    fromEmail: item.from,
    date: item.date,
    unread: item.unread,
    starred: item.starred,
    labelIds: [
      ...(item.unread ? ["UNREAD"] : []),
      ...(item.starred ? ["STARRED"] : []),
    ],
    messageCount: 1,
    priority: null,
    aiTldr: null,
  }));
  const { threads, splitCounts } = await annotateAndSplit(
    db,
    userId,
    previews,
    input.splitId,
  );
  return { threads, splitCounts, nextPageToken: null };
}

export const inboxRouter = createTRPCRouter({
  /**
   * Lists threads for the current view from `sync_items` (the realtime feed),
   * using keyset pagination ordered by `(timestamp DESC, id DESC)`. Falls back
   * to a live provider fetch for accounts that haven't synced any items yet.
   */
  listThreads: protectedProcedure
    .input(
      z.object({
        q: z.string().default("in:inbox"),
        pageToken: z.string().optional(),
        limit: z.number().min(1).max(50).default(25),
        splitId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.pageToken ? decodeCursor(input.pageToken) : null;

      const rows = await ctx.db.syncItem.findMany({
        where: {
          userId: ctx.userId,
          type: "email",
          ...(cursor
            ? {
                OR: [
                  { timestamp: { lt: cursor.timestamp } },
                  { timestamp: cursor.timestamp, id: { lt: cursor.id } },
                ],
              }
            : {}),
        },
        orderBy: [{ timestamp: "desc" }, { id: "desc" }],
        take: input.limit,
      });

      // Cold start: no synced items — hydrate live from the provider.
      if (rows.length === 0 && !cursor) {
        return listThreadsLive(ctx.db, ctx.userId, input);
      }

      // Realtime sync writes one row per message entity; collapse to one row
      // per thread (rows are already ordered newest-first).
      const seenThreads = new Set<string>();
      const deduped = rows.filter((r) => {
        const key = r.threadId ?? r.corsairEntityId;
        if (seenThreads.has(key)) return false;
        seenThreads.add(key);
        return true;
      });

      // Batch-fetch cached AI TLDRs for all visible threads.
      const visibleThreadIds = deduped
        .map((r) => r.threadId)
        .filter((id): id is string => id !== null);
      const cachedSummaries = await ctx.db.threadSummary.findMany({
        where: { userId: ctx.userId, threadId: { in: visibleThreadIds } },
        orderBy: { createdAt: "desc" },
        select: { threadId: true, summary: true },
        distinct: ["threadId"],
      });
      const tldrByThread = new Map<string, string>(
        cachedSummaries.map((s) => [s.threadId, s.summary]),
      );

      const previews = deduped.map((r) => {
        const p = syncItemToPreview(r, null);
        p.aiTldr = tldrByThread.get(r.threadId ?? "") ?? null;
        return p;
      });
      const { threads, splitCounts } = await annotateAndSplit(
        ctx.db,
        ctx.userId,
        previews,
        input.splitId,
      );

      const last = rows[rows.length - 1];
      const nextPageToken =
        rows.length === input.limit && last
          ? encodeCursor(last.timestamp, last.id)
          : null;

      return { threads, splitCounts, nextPageToken };
    }),

  getThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      return provider.getThreadDetail(input.threadId);
    }),

  archiveThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.archive(input.threadId);
      return { ok: true };
    }),

  unarchiveThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.unarchive(input.threadId);
      return { ok: true };
    }),

  untrashThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.untrash(input.threadId);
      return { ok: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.setRead(input.threadId, true);
      return { ok: true };
    }),

  markUnread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.setRead(input.threadId, false);
      return { ok: true };
    }),

  toggleStar: protectedProcedure
    .input(z.object({ threadId: z.string(), starred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.setStar(input.threadId, input.starred);
      return { ok: true };
    }),

  trashThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      await provider.trash(input.threadId);
      return { ok: true };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        to: z.array(z.string().email()).min(1),
        cc: z.array(z.string().email()).optional(),
        bcc: z.array(z.string().email()).optional(),
        subject: z.string().default(""),
        body: z.string().default(""),
        html: z.string().optional(),
        threadId: z.string().optional(),
        inReplyTo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      const result = await provider.send({
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        subject: input.subject,
        body: input.body,
        html: input.html,
        threadId: input.threadId,
        inReplyTo: input.inReplyTo,
      });
      return { id: result.id, threadId: input.threadId ?? null };
    }),

  saveDraft: protectedProcedure
    .input(
      z.object({
        to: z.array(z.string().email()).default([]),
        cc: z.array(z.string().email()).optional(),
        subject: z.string().default(""),
        body: z.string().default(""),
        html: z.string().optional(),
        threadId: z.string().optional(),
        draftId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      const result = await provider.saveDraft(
        {
          to: input.to,
          cc: input.cc,
          subject: input.subject,
          body: input.body,
          html: input.html,
          threadId: input.threadId,
        },
        input.draftId,
      );
      return { draftId: result.draftId };
    }),

  /** Snooze a thread until `snoozeUntil`: archive it now, wake it later. */
  snooze: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1),
        snoozeUntil: z.string().datetime(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const wakeAt = new Date(input.snoozeUntil);
      // Reject past times (with a 1-minute grace window).
      if (wakeAt.getTime() < Date.now() - 60_000) {
        throw new Error("Snooze time must be in the future");
      }

      const provider = await userProvider(ctx.userId);

      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });

      const row = await ctx.db.snoozedThread.upsert({
        where: {
          userId_threadId: { userId: ctx.userId, threadId: input.threadId },
        },
        create: {
          userId: ctx.userId,
          threadId: input.threadId,
          corsairEntityId: input.threadId,
          snoozeUntil: wakeAt,
          status: "snoozed",
        },
        update: {
          snoozeUntil: wakeAt,
          status: "snoozed",
          wokenAt: null,
        },
      });

      // Remove from inbox while snoozed.
      await provider.archive(input.threadId);

      await inngest.send({
        name: "thread/snooze.created",
        data: { snoozeId: row.id, userId: ctx.userId },
      });

      return { id: row.id, snoozeUntil: wakeAt.toISOString() };
    }),

  /** Cancel a snooze early and restore the thread to the inbox. */
  unsnooze: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.snoozedThread.findUnique({
        where: {
          userId_threadId: { userId: ctx.userId, threadId: input.threadId },
        },
      });
      if (!existing) throw new Error("Snooze not found");
      if (existing.userId !== ctx.userId) {
        throw new Error("Snooze not found");
      }

      await ctx.db.snoozedThread.update({
        where: { id: existing.id },
        data: { status: "canceled" },
      });

      const provider = await userProvider(ctx.userId);
      await provider.unarchive(input.threadId);
      return { ok: true };
    }),

  /** Threads currently snoozed, soonest wake first. */
  snoozedThreads: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.snoozedThread.findMany({
      where: { userId: ctx.userId, status: "snoozed" },
      orderBy: { snoozeUntil: "asc" },
      select: { threadId: true, snoozeUntil: true },
    });
    return rows.map((r) => ({
      threadId: r.threadId,
      snoozeUntil: r.snoozeUntil.toISOString(),
    }));
  }),

  /**
   * Lazy, cached thread summary. Returns a cached summary when the thread's
   * entity version is unchanged; generates on first view; surfaces a stale flag
   * (instead of regenerating) when the thread changed, unless `refresh` is set.
   */
  summary: protectedProcedure
    .input(z.object({ threadId: z.string().min(1), refresh: z.boolean().default(false) }))
    .query(async ({ ctx, input }) => {
      const provider = await userProvider(ctx.userId);
      const detail = await provider.getThreadDetail(input.threadId);

      const wordCount = detail.messages.reduce(
        (n, m) => n + (m.bodyText ?? m.snippet ?? "").split(/\s+/).length,
        0,
      );
      const autoRender = shouldAutoSummarize(detail.messages.length, wordCount);

      const owner = ownerForContext(ctx.userId, ctx.orgId);
      const resolved = await resolveThreadSummary({
        userId: ctx.userId,
        threadId: input.threadId,
        detail,
        owner,
        refresh: input.refresh,
      });
      if (!resolved) return null;

      return {
        tldr: resolved.result.tldr,
        keyPoints: resolved.result.keyPoints,
        actionItems: resolved.result.actionItems,
        unansweredQuestions: resolved.result.unansweredQuestions,
        stale: resolved.stale,
        generatedAt: resolved.generatedAt,
        autoRender,
      };
    }),
});
