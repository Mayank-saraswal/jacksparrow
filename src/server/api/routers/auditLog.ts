import { z } from "zod";

import type { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, orgAdminProcedure } from "@/server/api/trpc";
import { assertFeature, orgOwner } from "@/server/billing/entitlements";
import { audit } from "@/server/audit";
import { inngest } from "@/inngest/client";
import { AUDIT_ACTIONS } from "@/server/audit/actions";

const filterInput = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  actorUserId: z.string().optional(),
  action: z.enum(AUDIT_ACTIONS).optional(),
  targetType: z.string().optional(),
});

function whereFromFilters(
  orgId: string,
  f: z.infer<typeof filterInput>,
): Prisma.AuditLogWhereInput {
  return {
    orgId,
    ...(f.actorUserId ? { actorUserId: f.actorUserId } : {}),
    ...(f.action ? { action: f.action } : {}),
    ...(f.targetType ? { targetType: f.targetType } : {}),
    ...(f.from || f.to
      ? {
          createdAt: {
            ...(f.from ? { gte: new Date(f.from) } : {}),
            ...(f.to ? { lte: new Date(f.to) } : {}),
          },
        }
      : {}),
  };
}

export const auditLogRouter = createTRPCRouter({
  /** Cursor-paginated audit feed for the active org. */
  list: orgAdminProcedure
    .input(
      filterInput.extend({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "auditLogs");
      const rows = await ctx.db.auditLog.findMany({
        where: whereFromFilters(ctx.orgId, input),
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });
      const hasMore = rows.length > input.limit;
      const page = hasMore ? rows.slice(0, input.limit) : rows;
      return {
        items: page.map((r) => ({
          id: r.id,
          actorUserId: r.actorUserId,
          actorType: r.actorType,
          action: r.action,
          targetType: r.targetType,
          targetId: r.targetId,
          ip: r.ip,
          meta: r.meta,
          createdAt: r.createdAt.toISOString(),
        })),
        nextCursor: hasMore ? page[page.length - 1]?.id : undefined,
      };
    }),

  /** Stream matching rows to a CSV in storage (Inngest); notifies when ready. */
  requestExport: orgAdminProcedure
    .input(filterInput)
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "auditLogs");
      await inngest.send({
        name: "audit/export.requested",
        data: { orgId: ctx.orgId, userId: ctx.userId, filters: input },
      });
      audit(ctx, "export.requested", {
        targetType: "audit_log",
        targetId: ctx.orgId,
        meta: { kind: "audit_csv" },
      });
      return { ok: true };
    }),
});
