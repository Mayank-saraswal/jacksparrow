import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/inngest/client";

export const triageRouter = createTRPCRouter({
  /** Kicks off the one-time "Score my inbox" backfill job. */
  scoreInbox: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "triage/backfill.requested",
      data: { clerkUserId: ctx.userId },
    });
    return { ok: true };
  }),

  /** Manual override: pins a thread's priority so auto-scoring won't change it. */
  setPriority: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        corsairEntityId: z.string().default(""),
        label: z.enum(["urgent", "important", "normal", "low"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.priorityScore.upsert({
        where: { userId_threadId: { userId: ctx.userId, threadId: input.threadId } },
        create: {
          userId: ctx.userId,
          threadId: input.threadId,
          corsairEntityId: input.corsairEntityId || input.threadId,
          label: input.label,
          reason: "Manually set",
          model: "user",
        },
        update: { label: input.label, reason: "Manually set", model: "user" },
      });
      return { ok: true };
    }),
});
