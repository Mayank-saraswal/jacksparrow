import { z } from "zod";

import { createTRPCRouter, orgAdminProcedure } from "@/server/api/trpc";
import { assertFeature, orgOwner } from "@/server/billing/entitlements";
import { audit } from "@/server/audit";
import { inngest } from "@/inngest/client";
import { ANALYTICS_METRICS } from "@/lib/analytics-agg";

const metricEnum = z.enum(ANALYTICS_METRICS);

export const analyticsRouter = createTRPCRouter({
  /** Org-total timeseries for the requested metrics + range. */
  timeseries: orgAdminProcedure
    .input(
      z.object({
        metrics: z.array(metricEnum).min(1),
        from: z.string(), // YYYY-MM-DD
        to: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "analytics");
      const rows = await ctx.db.dailyOrgStat.findMany({
        where: {
          orgId: ctx.orgId,
          metric: { in: input.metrics },
          date: { gte: new Date(input.from), lte: new Date(input.to) },
          dims: { equals: {} }, // org totals only
        },
        orderBy: { date: "asc" },
        select: { date: true, metric: true, value: true },
      });
      return rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        metric: r.metric,
        value: r.value,
      }));
    }),

  /** Per-member leaderboard (respects the org's member-level analytics toggle). */
  leaderboard: orgAdminProcedure
    .input(z.object({ metric: metricEnum, from: z.string(), to: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "analytics");
      const org = await ctx.db.organization.findUnique({
        where: { id: ctx.orgId },
        select: { memberLevelAnalytics: true },
      });
      if (!org?.memberLevelAnalytics) return { enabled: false, rows: [] };

      const rows = await ctx.db.dailyOrgStat.findMany({
        where: {
          orgId: ctx.orgId,
          metric: input.metric,
          date: { gte: new Date(input.from), lte: new Date(input.to) },
          NOT: { dims: { equals: {} } },
        },
        select: { value: true, dims: true },
      });
      const byUser = new Map<string, number>();
      for (const r of rows) {
        const userId = (r.dims as { userId?: string }).userId;
        if (!userId) continue;
        byUser.set(userId, (byUser.get(userId) ?? 0) + r.value);
      }
      return {
        enabled: true,
        rows: [...byUser.entries()]
          .map(([userId, value]) => ({ userId, value }))
          .sort((a, b) => b.value - a.value),
      };
    }),

  /** Trigger a 90-day backfill (empty-state CTA). */
  requestBackfill: orgAdminProcedure.mutation(async ({ ctx }) => {
    await assertFeature(orgOwner(ctx.orgId), "analytics");
    await inngest.send({
      name: "analytics/backfill.requested",
      data: { orgId: ctx.orgId },
    });
    return { ok: true };
  }),

  /** Org toggle for per-member analytics. */
  setMemberLevel: orgAdminProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "analytics");
      await ctx.db.organization.update({
        where: { id: ctx.orgId },
        data: { memberLevelAnalytics: input.enabled },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "organization",
        targetId: ctx.orgId,
        meta: { action: "member_level_analytics", enabled: input.enabled },
      });
      return { ok: true };
    }),
});
