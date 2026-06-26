import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { executePendingAction } from "@/server/agent/pending";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { logger } from "@/server/logger";

export const feedRouter = createTRPCRouter({
  /**
   * Fetch paginated email insights for the dashboard feed.
   */
  getInsights: protectedProcedure
    .input(
      z.object({
        status: z.enum(["new", "auto_handled", "all"]).default("new"),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(), // cursor is insight ID
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.actionInsight.findMany({
        where: {
          userId: ctx.userId,
          ...(input.status !== "all" ? { status: input.status } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  /**
   * Fetch insight for a specific entity, if it exists.
   */
  getInsightByEntityId: protectedProcedure
    .input(z.object({ plugin: z.string(), pluginEntityId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.actionInsight.findUnique({
        where: { userId_plugin_pluginEntityId: { userId: ctx.userId, plugin: input.plugin, pluginEntityId: input.pluginEntityId } },
      });
    }),

  /**
   * Get counts for the dashboard header stats.
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db.actionInsight.groupBy({
      by: ["status"],
      where: { userId: ctx.userId },
      _count: true,
    });

    let needsAttention = 0;
    let autoHandled = 0;
    let total = 0;

    for (const row of counts) {
      total += row._count;
      if (row.status === "new") {
        needsAttention += row._count;
      } else if (row.status === "auto_handled") {
        autoHandled += row._count;
      }
    }

    return {
      needsAttention,
      autoHandled,
      total,
    };
  }),

  /**
   * Dismiss an insight (swipe away).
   */
  dismissInsight: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.actionInsight.update({
        where: { id: input.id, userId: ctx.userId },
        data: { status: "dismissed" },
      });
      return { ok: true };
    }),

  /**
   * Execute an action suggested by the insight.
   */
  actOnInsight: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        kind: z.string(),
        payload: z.record(z.string(), z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insight = await ctx.db.actionInsight.findUnique({
        where: { id: input.id, userId: ctx.userId },
      });
      
      if (!insight) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Insight not found" });
      }

      try {
        const result = await executePendingAction(ctx.userId, input.kind, input.payload);
        
        await ctx.db.actionInsight.update({
          where: { id: input.id },
          data: { status: "acted" },
        });

        return { ok: true, summary: result.summary };
      } catch (err) {
        logger.error("[feed] actOnInsight failed", { error: String(err), insightId: input.id });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Action failed",
        });
      }
    }),

  /**
   * Undo an auto-handled action (e.g. un-archive a newsletter).
   */
  undoAutoAction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const insight = await ctx.db.actionInsight.findUnique({
        where: { id: input.id, userId: ctx.userId },
      });
      
      if (!insight) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Insight not found" });
      }

      // We don't actually have a reverse mapping for every action yet,
      // but for "archive", we could remove the archive label.
      // For now, we just mark it back as "new" so it shows up in the feed.
      // In a full implementation, we'd call the mail provider to un-archive.
      
      await ctx.db.actionInsight.update({
        where: { id: input.id },
        data: { status: "new", autoSummary: null },
      });

      return { ok: true };
    }),
});
