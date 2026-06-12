import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getTenant } from "@/server/corsair";
import { inngest } from "@/inngest/client";
import {
  buildRawMessage,
  threadDetail,
  threadPreview,
  type GmailThread,
  type ThreadPreview,
} from "@/server/gmail";
import {
  looksLikeCalendarInvite,
  matchThreadToSplit,
  parseSplitRules,
  type MatchableThread,
} from "@/lib/split-rules";
import {
  generateThreadSummary,
  getThreadEntityVersion,
  shouldAutoSummarize,
  type ThreadSummaryResult,
} from "@/server/summary";
import { summaryCacheDecision } from "@/lib/summary-cache";
import {
  assertWithinLimit,
  incrementUsage,
  ownerForContext,
} from "@/server/billing/entitlements";

const METADATA_HEADERS = ["Subject", "From", "To", "Date"];

/** Build the split-matchable view of a preview (priority + invite heuristic). */
function toMatchable(p: ThreadPreview): MatchableThread {
  return {
    fromEmail: p.fromEmail,
    subject: p.subject,
    priorityLabel: (p.priority?.label as MatchableThread["priorityLabel"]) ?? null,
    hasCalendarInvite: looksLikeCalendarInvite(p.subject),
  };
}

export const inboxRouter = createTRPCRouter({
  /**
   * Lists threads for the current view. Gmail's list endpoint returns only ids,
   * so we hydrate each thread via threads.get (format=metadata) to get
   * subject/from/date — which also warms Corsair's local cache.
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
      const tenant = getTenant(ctx.userId);

      const list = await tenant.gmail.api.threads.list({
        q: input.q,
        maxResults: input.limit,
        pageToken: input.pageToken,
      });

      const ids = (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");

      const threads = await Promise.all(
        ids.map((id) =>
          tenant.gmail.api.threads.get({
            id,
            format: "metadata",
            metadataHeaders: METADATA_HEADERS,
          }),
        ),
      );

      const previews = threads.map((t) =>
        threadPreview(t as unknown as GmailThread),
      );

      // Attach priority labels (Phase 6) by thread id.
      const scores = await ctx.db.priorityScore.findMany({
        where: {
          userId: ctx.userId,
          threadId: { in: previews.map((p) => p.threadId) },
        },
        select: { threadId: true, label: true, reason: true },
      });
      const scoreByThread = new Map(scores.map((s) => [s.threadId, s]));
      for (const preview of previews) {
        const s = scoreByThread.get(preview.threadId);
        preview.priority = s ? { label: s.label, reason: s.reason ?? "" } : null;
      }

      // Annotate each thread with its split bucket and exclude snoozed threads.
      const pref = await ctx.db.userPreference.findUnique({
        where: { userId: ctx.userId },
        select: { splitInboxRules: true },
      });
      const rules = parseSplitRules(
        (pref?.splitInboxRules as { rules?: unknown })?.rules ??
          pref?.splitInboxRules,
      );

      const snoozed = await ctx.db.snoozedThread.findMany({
        where: {
          userId: ctx.userId,
          status: "snoozed",
          threadId: { in: previews.map((p) => p.threadId) },
        },
        select: { threadId: true },
      });
      const snoozedSet = new Set(snoozed.map((s) => s.threadId));

      const annotated = previews
        .filter((p) => !snoozedSet.has(p.threadId))
        .map((p) => ({
          ...p,
          splitId: matchThreadToSplit(toMatchable(p), rules),
        }));

      const splitCounts: Record<string, number> = {};
      for (const t of annotated) {
        splitCounts[t.splitId] = (splitCounts[t.splitId] ?? 0) + 1;
      }

      const threadsForSplit =
        input.splitId && input.splitId !== "all"
          ? annotated.filter((t) => t.splitId === input.splitId)
          : annotated;

      return {
        threads: threadsForSplit,
        splitCounts,
        nextPageToken: list.nextPageToken ?? null,
      };
    }),

  getThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const thread = await tenant.gmail.api.threads.get({
        id: input.threadId,
        format: "full",
      });
      return threadDetail(thread);
    }),

  archiveThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        removeLabelIds: ["INBOX"],
      });
      return { ok: true };
    }),

  unarchiveThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: ["INBOX"],
      });
      return { ok: true };
    }),

  untrashThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.untrash({ id: input.threadId });
      return { ok: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        removeLabelIds: ["UNREAD"],
      });
      return { ok: true };
    }),

  markUnread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: ["UNREAD"],
      });
      return { ok: true };
    }),

  toggleStar: protectedProcedure
    .input(z.object({ threadId: z.string(), starred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: input.starred ? ["STARRED"] : [],
        removeLabelIds: input.starred ? [] : ["STARRED"],
      });
      return { ok: true };
    }),

  trashThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.trash({ id: input.threadId });
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
      const tenant = getTenant(ctx.userId);
      const raw = buildRawMessage({
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        subject: input.subject,
        body: input.body,
        html: input.html,
        inReplyTo: input.inReplyTo,
      });

      const result = await tenant.gmail.api.messages.send({
        raw,
        threadId: input.threadId,
      });
      return { id: result.id ?? null, threadId: result.threadId ?? null };
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
      const tenant = getTenant(ctx.userId);
      const raw = buildRawMessage({
        to: input.to,
        cc: input.cc,
        subject: input.subject,
        body: input.body,
        html: input.html,
      });

      const message = { raw, threadId: input.threadId };

      if (input.draftId) {
        const updated = await tenant.gmail.api.drafts.update({
          id: input.draftId,
          draft: { message },
        });
        return { draftId: updated.id ?? null };
      }

      const created = await tenant.gmail.api.drafts.create({
        draft: { message },
      });
      return { draftId: created.id ?? null };
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

      const tenant = getTenant(ctx.userId);
      // Verify ownership implicitly: the tenant can only see its own threads.
      await tenant.gmail.api.threads.get({
        id: input.threadId,
        format: "minimal",
      });

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
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        removeLabelIds: ["INBOX"],
      });

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

      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: ["INBOX"],
      });
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
      const tenant = getTenant(ctx.userId);
      const raw = await tenant.gmail.api.threads.get({
        id: input.threadId,
        format: "full",
      });
      const detail = threadDetail(raw);
      const currentVersion = await getThreadEntityVersion(
        ctx.userId,
        input.threadId,
        detail,
      );

      const wordCount = detail.messages.reduce(
        (n, m) => n + (m.bodyText ?? m.snippet ?? "").split(/\s+/).length,
        0,
      );

      const cached = await ctx.db.threadSummary.findFirst({
        where: { userId: ctx.userId, threadId: input.threadId },
        orderBy: { createdAt: "desc" },
      });

      const state = summaryCacheDecision(currentVersion, cached?.entityVersion);

      const toResult = (
        row: NonNullable<typeof cached>,
        stale: boolean,
      ) => ({
        tldr: row.summary,
        keyPoints: row.keyPoints as string[],
        actionItems: row.actionItems as ThreadSummaryResult["actionItems"],
        unansweredQuestions: row.unansweredQuestions as string[],
        stale,
        generatedAt: row.createdAt.toISOString(),
        autoRender: shouldAutoSummarize(detail.messages.length, wordCount),
      });

      if (state === "fresh" && cached) return toResult(cached, false);
      if (state === "stale" && cached && !input.refresh)
        return toResult(cached, true);

      // Generating a fresh summary is a paid AI action — enforce the budget.
      const owner = ownerForContext(ctx.userId, ctx.orgId);
      await assertWithinLimit(owner, ctx.userId, "summary");

      const generated = await generateThreadSummary(detail);
      if (!generated) {
        if (cached) return toResult(cached, state === "stale");
        return null;
      }
      void incrementUsage(owner, ctx.userId, "summary");

      const saved = await ctx.db.threadSummary.upsert({
        where: {
          userId_threadId_entityVersion: {
            userId: ctx.userId,
            threadId: input.threadId,
            entityVersion: currentVersion,
          },
        },
        create: {
          userId: ctx.userId,
          threadId: input.threadId,
          entityVersion: currentVersion,
          summary: generated.tldr,
          keyPoints: generated.keyPoints,
          actionItems: generated.actionItems,
          unansweredQuestions: generated.unansweredQuestions,
          model: "gpt-4o-mini",
        },
        update: {
          summary: generated.tldr,
          keyPoints: generated.keyPoints,
          actionItems: generated.actionItems,
          unansweredQuestions: generated.unansweredQuestions,
        },
      });
      return toResult(saved, false);
    }),
});
