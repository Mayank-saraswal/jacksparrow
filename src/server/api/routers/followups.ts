import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getTenant } from "@/server/corsair";
import { threadDetail } from "@/server/gmail";

/**
 * Follow-up reminders. When a user sends a message and asks to be reminded if
 * there's no reply, we create a FollowUp watching that thread. An Inngest cron
 * flips overdue watchers to "reminded" and pushes a nudge. Inbound replies on a
 * watched thread mark it "replied" (handled in the webhook pipeline).
 */

export const followupsRouter = createTRPCRouter({
  /** Start (or refresh) a follow-up watch on a thread. */
  watch: protectedProcedure
    .input(
      z.object({
        threadId: z.string().min(1),
        days: z.number().int().min(1).max(60).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });

      const pref = await ctx.db.userPreference.findUnique({
        where: { userId: ctx.userId },
        select: { followUpDays: true },
      });
      const days = input.days ?? pref?.followUpDays ?? 3;
      const now = new Date();
      const remindAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const row = await ctx.db.followUp.upsert({
        where: {
          userId_threadId: { userId: ctx.userId, threadId: input.threadId },
        },
        create: {
          userId: ctx.userId,
          threadId: input.threadId,
          lastSentAt: now,
          remindAt,
          status: "watching",
        },
        update: {
          lastSentAt: now,
          remindAt,
          status: "watching",
        },
      });
      return { id: row.id, remindAt: remindAt.toISOString() };
    }),

  /** Stop watching a thread for replies. */
  dismiss: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.followUp.findUnique({
        where: {
          userId_threadId: { userId: ctx.userId, threadId: input.threadId },
        },
        select: { id: true, userId: true },
      });
      if (!existing) throw new Error("Follow-up not found");
      if (existing.userId !== ctx.userId) {
        throw new Error("Follow-up not found");
      }
      await ctx.db.followUp.update({
        where: { id: existing.id },
        data: { status: "dismissed" },
      });
      return { ok: true };
    }),

  /** Active + recently-reminded follow-ups, soonest remind first. */
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.followUp.findMany({
      where: {
        userId: ctx.userId,
        status: { in: ["watching", "reminded"] },
      },
      orderBy: { remindAt: "asc" },
      take: 100,
    });
    return rows.map((r) => ({
      threadId: r.threadId,
      status: r.status,
      lastSentAt: r.lastSentAt.toISOString(),
      remindAt: r.remindAt.toISOString(),
    }));
  }),

  /** Watch state for a set of threads (for inbox badges). */
  statusForThreads: protectedProcedure
    .input(z.object({ threadIds: z.array(z.string()).max(100) }))
    .query(async ({ ctx, input }) => {
      if (input.threadIds.length === 0) return {};
      const rows = await ctx.db.followUp.findMany({
        where: {
          userId: ctx.userId,
          threadId: { in: input.threadIds },
          status: { in: ["watching", "reminded"] },
        },
        select: { threadId: true, status: true, remindAt: true },
      });
      const map: Record<string, { status: string; remindAt: string }> = {};
      for (const r of rows) {
        map[r.threadId] = {
          status: r.status,
          remindAt: r.remindAt.toISOString(),
        };
      }
      return map;
    }),

  /**
   * Build a follow-up draft for a watched thread and stage it as a PendingAction
   * (kind=send_email) so it flows through the normal approval/undo path.
   */
  draftFollowUp: protectedProcedure
    .input(z.object({ threadId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const raw = await tenant.gmail.api.threads.get({
        id: input.threadId,
        format: "full",
      });
      const detail = threadDetail(raw);

      // Reply to the most recent counterpart in the thread.
      const last = detail.messages[detail.messages.length - 1];
      const recipient = last?.fromEmail ?? "";
      if (!recipient) throw new Error("Could not determine recipient");

      const subject = detail.subject.startsWith("Re:")
        ? detail.subject
        : `Re: ${detail.subject}`;
      const body = [
        "Hi,",
        "",
        "Just following up on my previous note — wanted to make sure this didn't slip through. Happy to provide anything else that would help.",
        "",
        "Thanks!",
      ].join("\n");

      const action = await ctx.db.pendingAction.create({
        data: {
          userId: ctx.userId,
          channel: "web",
          kind: "send_email",
          draftPayload: {
            to: [recipient],
            subject,
            body,
            threadId: input.threadId,
            inReplyTo: last?.messageId ?? undefined,
          },
          corsairOperationPath: "gmail.api.messages.send",
          status: "pending",
        },
      });
      return { pendingActionId: action.id };
    }),
});
