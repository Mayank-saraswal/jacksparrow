import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/inngest/client";
import { sendEmailSchema } from "@/server/agent/execute";

/**
 * Send Later + Undo Send. Every outbound message becomes a ScheduledEmail row
 * with a `sendAt`. For Undo Send that's `now + undoSendSeconds`; for Send Later
 * it's the user-picked time. An Inngest function (`email/scheduled.send`) sleeps
 * until `sendAt` and re-reads status before sending, so cancelling is race-safe.
 */

const MIN_GRACE_MS = 60_000;

export const schedulingRouter = createTRPCRouter({
  /**
   * Queue an email to send at `sendAt` (Send Later). Omit `sendAt` to use the
   * Undo-Send delay (now + undoSendSeconds) — this is how the inbox sends every
   * message so it can be undone.
   */
  schedule: protectedProcedure
    .input(
      z.object({
        draft: sendEmailSchema,
        sendAt: z.string().datetime().optional(),
        useUndoDelay: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });

      let sendAt: Date;
      if (input.useUndoDelay || !input.sendAt) {
        const pref = await ctx.db.userPreference.findUnique({
          where: { userId: ctx.userId },
          select: { undoSendSeconds: true },
        });
        const seconds = pref?.undoSendSeconds ?? 10;
        sendAt = new Date(Date.now() + seconds * 1000);
      } else {
        sendAt = new Date(input.sendAt);
        if (sendAt.getTime() < Date.now() - MIN_GRACE_MS) {
          throw new Error("Scheduled time must be in the future");
        }
      }

      const row = await ctx.db.scheduledEmail.create({
        data: {
          userId: ctx.userId,
          draftPayload: input.draft,
          sendAt,
          status: "scheduled",
        },
      });

      await inngest.send({
        name: "email/scheduled.send",
        data: { scheduledId: row.id, userId: ctx.userId },
      });

      return {
        id: row.id,
        sendAt: sendAt.toISOString(),
        status: row.status,
      };
    }),

  /** Cancel a still-scheduled email (Undo Send or a future Send Later). */
  cancel: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.scheduledEmail.findUnique({
        where: { id: input.id },
        select: { userId: true, status: true },
      });
      if (!row) throw new Error("Scheduled email not found");
      if (row.userId !== ctx.userId) {
        throw new Error("Scheduled email not found");
      }
      if (row.status !== "scheduled") {
        throw new Error(`Cannot cancel a ${row.status} email`);
      }
      await ctx.db.scheduledEmail.update({
        where: { id: input.id },
        data: { status: "canceled" },
      });
      return { ok: true };
    }),

  /** Retry a failed send by re-queueing it for immediate delivery. */
  retry: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.scheduledEmail.findUnique({
        where: { id: input.id },
        select: { userId: true, status: true },
      });
      if (!row) throw new Error("Scheduled email not found");
      if (row.userId !== ctx.userId) {
        throw new Error("Scheduled email not found");
      }
      if (row.status !== "failed") {
        throw new Error("Only failed emails can be retried");
      }
      const updated = await ctx.db.scheduledEmail.update({
        where: { id: input.id },
        data: {
          status: "scheduled",
          sendAt: new Date(),
          error: null,
        },
      });
      await inngest.send({
        name: "email/scheduled.send",
        data: { scheduledId: updated.id, userId: ctx.userId },
      });
      return { ok: true };
    }),

  /** List scheduled / sent / failed emails for the Scheduled view. */
  list: protectedProcedure
    .input(
      z
        .object({
          status: z
            .enum(["scheduled", "sent", "canceled", "failed"])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.scheduledEmail.findMany({
        where: {
          userId: ctx.userId,
          ...(input?.status ? { status: input.status } : {}),
        },
        orderBy: { sendAt: "asc" },
        take: 100,
      });
      return rows.map((r) => {
        const draft = r.draftPayload as {
          to?: string[];
          subject?: string;
          body?: string;
        };
        const subject = draft.subject ?? "";
        const previewText = subject.length > 0 ? subject : (draft.body ?? "");
        return {
          id: r.id,
          to: draft.to ?? [],
          subject,
          preview: previewText.slice(0, 80),
          sendAt: r.sendAt.toISOString(),
          status: r.status,
          error: r.error,
          sentAt: r.sentAt?.toISOString() ?? null,
        };
      });
    }),

  /** Count of currently-scheduled emails (for the Scheduled nav badge). */
  pendingCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.scheduledEmail.count({
      where: { userId: ctx.userId, status: "scheduled" },
    });
  }),
});
