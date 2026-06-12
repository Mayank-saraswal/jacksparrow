import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/inngest/client";
import {
  recordFeedbackSafe,
  recordFeedback,
} from "@/server/triage-feedback";
import {
  manualOverrideWeight,
  decayedScore,
  AFFINITY_FLOOR_THRESHOLD,
  AFFINITY_CAP_THRESHOLD,
} from "@/lib/affinity";
import { parseSplitRules, type SplitRule } from "@/lib/split-rules";

const PRIORITY = z.enum(["urgent", "important", "normal", "low"]);

// Signals the client may report (manual_override is recorded server-side).
const CLIENT_SIGNALS = [
  "archive_unopened",
  "archive_after_open",
  "reply",
  "reply_within_1h",
  "open_no_action",
  "snooze",
  "star",
] as const;

export const triageRouter = createTRPCRouter({
  /** Kicks off the one-time "Score my inbox" backfill job. */
  scoreInbox: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "triage/backfill.requested",
      data: { clerkUserId: ctx.userId },
    });
    return { ok: true };
  }),

  /** Fire-and-forget behavioral signal capture from the UI. */
  recordSignal: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1),
        fromEmail: z.string().min(1),
        signal: z.enum(CLIENT_SIGNALS),
      }),
    )
    .mutation(({ ctx, input }) => {
      recordFeedbackSafe({
        userId: ctx.userId,
        threadId: input.threadId,
        fromEmail: input.fromEmail,
        signal: input.signal,
      });
      return { ok: true };
    }),

  /** Manual override: pins a thread's priority (ground truth) + records feedback. */
  setPriority: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        corsairEntityId: z.string().default(""),
        fromEmail: z.string().default(""),
        label: PRIORITY,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.priorityScore.upsert({
        where: {
          userId_threadId: { userId: ctx.userId, threadId: input.threadId },
        },
        create: {
          userId: ctx.userId,
          threadId: input.threadId,
          corsairEntityId: input.corsairEntityId || input.threadId,
          label: input.label,
          reason: "manual override",
          model: null,
          source: "manual",
        },
        update: {
          label: input.label,
          reason: "manual override",
          model: null,
          source: "manual",
        },
      });

      if (input.fromEmail) {
        await recordFeedback({
          userId: ctx.userId,
          threadId: input.threadId,
          fromEmail: input.fromEmail,
          signal: "manual_override",
          weight: manualOverrideWeight(input.label),
        }).catch(() => undefined);
      }
      return { ok: true };
    }),

  // ── Learned-sender settings ────────────────────────────────────────────────
  /** Top VIPs and most-muted senders by current (decayed) affinity. */
  learnedSenders: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.senderAffinity.findMany({
      where: { userId: ctx.userId },
      select: { key: true, score: true, signalCount: true, updatedAt: true },
    });
    const now = new Date();
    const scored = rows.map((r) => {
      const [type, identifier] = r.key.split(":");
      return {
        key: r.key,
        type: type ?? "email",
        identifier: identifier ?? "",
        score: decayedScore(r.score, r.updatedAt, now),
        signalCount: r.signalCount,
      };
    });
    const vips = scored
      .filter((s) => s.score >= AFFINITY_FLOOR_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
    const muted = scored
      .filter((s) => s.score <= AFFINITY_CAP_THRESHOLD)
      .sort((a, b) => a.score - b.score)
      .slice(0, 15);
    return { vips, muted };
  }),

  resetSender: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.senderAffinity.deleteMany({
        where: { userId: ctx.userId, key: input.key },
      });
      return { ok: true };
    }),

  resetAllLearning: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.$transaction([
      ctx.db.senderAffinity.deleteMany({ where: { userId: ctx.userId } }),
      ctx.db.triageFeedback.deleteMany({ where: { userId: ctx.userId } }),
    ]);
    return { ok: true };
  }),

  // ── Rule suggestions ─────────────────────────────────────────────────────--
  suggestions: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.ruleSuggestion.findMany({
      where: { userId: ctx.userId, status: "proposed" },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      payload: r.payload as {
        key?: string;
        identifier?: string;
        score?: number;
        signalCount?: number;
      },
    }));
  }),

  dismissSuggestion: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.ruleSuggestion.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });
      if (!row) throw new Error("Not found");
      if (row.userId !== ctx.userId) throw new Error("Not found");
      await ctx.db.ruleSuggestion.update({
        where: { id: input.id },
        data: { status: "dismissed" },
      });
      return { ok: true };
    }),

  /** Accept a suggestion → write a matching split rule (human-in-the-loop). */
  acceptSuggestion: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.ruleSuggestion.findUnique({
        where: { id: input.id },
      });
      if (!row) throw new Error("Not found");
      if (row.userId !== ctx.userId) throw new Error("Not found");
      if (row.status !== "proposed") throw new Error("Already resolved");

      const payload = row.payload as { key?: string; identifier?: string };
      const identifier = payload.identifier ?? "";
      const isEmail = (payload.key ?? "").startsWith("email:");

      const pref = await ctx.db.userPreference.findUnique({
        where: { userId: ctx.userId },
        select: { splitInboxRules: true },
      });
      const rules = parseSplitRules(
        (pref?.splitInboxRules as { rules?: unknown })?.rules ??
          pref?.splitInboxRules,
      );

      const targetName = row.kind === "mute" ? "Muted" : "VIP";
      const existing = rules.find((r) => r.name === targetName);
      const field = isEmail ? "from" : "domain";

      let next: SplitRule[];
      if (existing) {
        const list = new Set(existing.conditions[field] ?? []);
        if (identifier) list.add(identifier);
        next = rules.map((r) =>
          r.id === existing.id
            ? {
                ...r,
                conditions: { ...r.conditions, [field]: Array.from(list) },
              }
            : r,
        );
      } else {
        next = [
          ...rules,
          {
            id: `${row.kind}_${Date.now().toString(36)}`,
            name: targetName,
            conditions: { [field]: identifier ? [identifier] : [] },
            order: rules.length,
          },
        ];
      }

      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.userPreference.upsert({
        where: { userId: ctx.userId },
        create: { userId: ctx.userId, splitInboxRules: { rules: next } },
        update: { splitInboxRules: { rules: next } },
      });
      await ctx.db.ruleSuggestion.update({
        where: { id: input.id },
        data: { status: "accepted" },
      });
      return { ok: true };
    }),
});
