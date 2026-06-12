import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/inngest/client";
import type { StyleProfileSummary } from "@/server/style";

export const draftsRouter = createTRPCRouter({
  /** Lightweight hint for the composer: how many samples back the voice model. */
  styleHint: protectedProcedure.query(async ({ ctx }) => {
    const [sampleCount, profile] = await Promise.all([
      ctx.db.sentMessageSample.count({ where: { userId: ctx.userId } }),
      ctx.db.styleProfile.findUnique({
        where: { userId: ctx.userId },
        select: { sampleCount: true },
      }),
    ]);
    return { sampleCount, hasProfile: !!profile };
  }),

  /** Full profile preview for the Settings page. */
  profile: protectedProcedure.query(async ({ ctx }) => {
    const [profile, sampleCount] = await Promise.all([
      ctx.db.styleProfile.findUnique({ where: { userId: ctx.userId } }),
      ctx.db.sentMessageSample.count({ where: { userId: ctx.userId } }),
    ]);
    return {
      sampleCount,
      profile: (profile?.summary as StyleProfileSummary | undefined) ?? null,
      updatedAt: profile?.updatedAt?.toISOString() ?? null,
    };
  }),

  /** Kick off the one-time sent-mail backfill. */
  runBackfill: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.upsert({
      where: { id: ctx.userId },
      create: { id: ctx.userId },
      update: {},
    });
    await inngest.send({ name: "style/backfill", data: { userId: ctx.userId } });
    return { ok: true };
  }),

  /** Privacy: delete all of the user's style samples and profile. */
  deleteStyleData: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.$transaction([
      ctx.db.sentMessageSample.deleteMany({ where: { userId: ctx.userId } }),
      ctx.db.styleProfile.deleteMany({ where: { userId: ctx.userId } }),
    ]);
    return { ok: true };
  }),
});
