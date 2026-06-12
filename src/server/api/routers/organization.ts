import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  orgProcedure,
  orgAdminProcedure,
} from "@/server/api/trpc";
import { audit } from "@/server/audit";

/**
 * Organization management. Reads come from our mirrored Membership table
 * (synced from Clerk webhooks); role changes are admin-only and write through
 * to Clerk via its Backend SDK so Clerk stays the source of truth.
 */
export const organizationRouter = createTRPCRouter({
  /** The orgs the current user belongs to (for a custom switcher). */
  myOrganizations: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await ctx.db.membership.findMany({
      where: { userId: ctx.userId },
      select: {
        role: true,
        organization: { select: { id: true, name: true } },
      },
    });
    return memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      role: m.role,
    }));
  }),

  /** Current org summary + the caller's role. */
  current: orgProcedure.query(async ({ ctx }) => {
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.orgId },
      select: { id: true, name: true, createdAt: true },
    });
    const memberCount = await ctx.db.membership.count({
      where: { orgId: ctx.orgId },
    });
    return {
      id: ctx.orgId,
      name: org?.name ?? "Organization",
      role: ctx.role,
      memberCount,
    };
  }),

  /** Member list for the active org. */
  members: orgProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.membership.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "asc" },
      select: { userId: true, role: true, createdAt: true },
    });
    return rows.map((r) => ({
      userId: r.userId,
      role: r.role,
      joinedAt: r.createdAt.toISOString(),
      isSelf: r.userId === ctx.userId,
    }));
  }),

  /** Admin: change a member's role (writes to Clerk + mirrors locally). */
  setRole: orgAdminProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      await client.organizations.updateOrganizationMembership({
        organizationId: ctx.orgId,
        userId: input.userId,
        role: input.role === "admin" ? "org:admin" : "org:member",
      });
      // Optimistically mirror; the Clerk webhook will confirm.
      await ctx.db.membership.update({
        where: { orgId_userId: { orgId: ctx.orgId, userId: input.userId } },
        data: { role: input.role },
      });
      audit(ctx, "member.role_changed", {
        targetType: "membership",
        targetId: input.userId,
        meta: { role: input.role },
      });
      return { ok: true };
    }),

  /** Admin: remove a member from the org. */
  removeMember: orgAdminProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      await client.organizations.deleteOrganizationMembership({
        organizationId: ctx.orgId,
        userId: input.userId,
      });
      await ctx.db.membership.deleteMany({
        where: { orgId: ctx.orgId, userId: input.userId },
      });
      audit(ctx, "member.removed", {
        targetType: "membership",
        targetId: input.userId,
        meta: { source: "admin_action" },
      });
      return { ok: true };
    }),
});
