import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  buildKeymap,
  detectConflicts,
  type ShortcutOverrides,
} from "@/lib/shortcuts";
import {
  parseSplitRules,
  splitRulesSchema,
  DEFAULT_SPLITS,
} from "@/lib/split-rules";

/** Reads stored split rules out of the (object|array) JSON shape. */
function readSplitRules(value: unknown) {
  const wrapped = (value as { rules?: unknown })?.rules;
  return parseSplitRules(wrapped ?? value);
}

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
        create: { userId: ctx.userId, shortcutOverrides: next },
        update: { shortcutOverrides: next },
      });
      return { ok: true };
    }),

  /** Bulk-replace shortcut overrides, rejecting any binding conflicts. */
  updateShortcuts: protectedProcedure
    .input(z.object({ overrides: z.record(z.string(), z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const overrides = input.overrides as ShortcutOverrides;
      const conflicts = detectConflicts(buildKeymap(overrides));
      if (conflicts.length > 0) {
        throw new Error(
          `Conflicting bindings: ${conflicts
            .map((c) => `${c.key} (${c.ids.join(", ")})`)
            .join("; ")}`,
        );
      }
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.userPreference.upsert({
        where: { userId: ctx.userId },
        create: { userId: ctx.userId, shortcutOverrides: overrides },
        update: { shortcutOverrides: overrides },
      });
      return { ok: true };
    }),

  resetShortcuts: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
    await ctx.db.userPreference.upsert({
      where: { userId: ctx.userId },
      create: { userId: ctx.userId },
      update: { shortcutOverrides: {} },
    });
    return { ok: true };
  }),

  /** The user's split-inbox rules (falls back to DEFAULT_SPLITS). */
  getSplits: protectedProcedure.query(async ({ ctx }) => {
    const pref = await ctx.db.userPreference.findUnique({
      where: { userId: ctx.userId },
      select: { splitInboxRules: true },
    });
    return readSplitRules(pref?.splitInboxRules);
  }),

  /** Replace the split-inbox rules. */
  updateSplits: protectedProcedure
    .input(z.object({ rules: splitRulesSchema }))
    .mutation(async ({ ctx, input }) => {
      // Reject duplicate ids so split tabs stay addressable.
      const ids = new Set<string>();
      for (const r of input.rules) {
        if (ids.has(r.id)) throw new Error(`Duplicate split id: ${r.id}`);
        ids.add(r.id);
      }
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.userPreference.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          splitInboxRules: { rules: input.rules },
        },
        update: { splitInboxRules: { rules: input.rules } },
      });
      return { ok: true };
    }),

  resetSplits: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
    await ctx.db.userPreference.upsert({
      where: { userId: ctx.userId },
      create: {
        userId: ctx.userId,
        splitInboxRules: { rules: DEFAULT_SPLITS },
      },
      update: { splitInboxRules: { rules: DEFAULT_SPLITS } },
    });
    return { ok: true };
  }),

  /** General preferences: Undo-Send window + default follow-up window. */
  getGeneral: protectedProcedure.query(async ({ ctx }) => {
    const pref = await ctx.db.userPreference.findUnique({
      where: { userId: ctx.userId },
      select: { undoSendSeconds: true, followUpDays: true },
    });
    return {
      undoSendSeconds: pref?.undoSendSeconds ?? 10,
      followUpDays: pref?.followUpDays ?? 3,
    };
  }),

  updateGeneral: protectedProcedure
    .input(
      z.object({
        undoSendSeconds: z.number().int().min(0).max(60).optional(),
        followUpDays: z.number().int().min(1).max(60).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      await ctx.db.userPreference.upsert({
        where: { userId: ctx.userId },
        create: { userId: ctx.userId, ...input },
        update: { ...input },
      });
      return { ok: true };
    }),
});

