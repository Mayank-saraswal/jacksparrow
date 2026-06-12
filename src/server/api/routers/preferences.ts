import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const preferencesRouter = createTRPCRouter({
  getShortcuts: protectedProcedure.query(async ({ ctx }) => {
    const pref = await ctx.db.userPreference.findUnique({
      where: { userId: ctx.userId },
      select: { shortcutOverrides: true },
    });
    return (pref?.shortcutOverrides as Record<string, string>) ?? {};
  }),

  setShortcut: protectedProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pref = await ctx.db.userPreference.findUnique({
        where: { userId: ctx.userId },
        select: { shortcutOverrides: true },
      });
      const current =
        (pref?.shortcutOverrides as Record<string, string>) ?? {};
      const next = { ...current, [input.id]: input.key };

      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.userPreference.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          shortcutOverrides: next,
        },
        update: { shortcutOverrides: next },
      });
      return { ok: true };
    }),

  resetShortcuts: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.userPreference.upsert({
      where: { userId: ctx.userId },
      create: { userId: ctx.userId },
      update: { shortcutOverrides: {} },
    });
    return { ok: true };
  }),
});
