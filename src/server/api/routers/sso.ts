import { z } from "zod";

import { createTRPCRouter, orgAdminProcedure } from "@/server/api/trpc";
import { assertFeature, orgOwner } from "@/server/billing/entitlements";
import { audit } from "@/server/audit";
import { env } from "@/env";
import { normalizeBreakGlass } from "@/lib/sso-enforce";

/**
 * SSO connection management (Enterprise + admin). Clerk runs the SAML/OIDC
 * protocol; we store the connection + domain claim, enforcement, and the
 * break-glass allowlist, and surface the IdP-facing metadata.
 */
export const ssoRouter = createTRPCRouter({
  list: orgAdminProcedure.query(async ({ ctx }) => {
    await assertFeature(orgOwner(ctx.orgId), "sso");
    const conns = await ctx.db.ssoConnection.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
    });
    return conns.map((c) => ({
      id: c.id,
      domain: c.domain,
      protocol: c.protocol,
      status: c.status,
      enforceSso: c.enforceSso,
      breakGlassUserIds: c.breakGlassUserIds,
      // IdP-facing values the customer's admin configures.
      acsUrl: `https://clerk.${env.APP_URL.replace(/^https?:\/\//, "")}/v1/saml/acs/${c.clerkConnectionId}`,
      entityId: c.clerkConnectionId,
    }));
  }),

  create: orgAdminProcedure
    .input(
      z.object({
        domain: z.string().min(3),
        protocol: z.enum(["saml", "oidc"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "sso");

      // Best-effort programmatic provisioning via Clerk's Backend API. The
      // exact method differs by Clerk version, so we call it defensively and
      // fall back to a placeholder the admin can reconcile in the dashboard.
      let clerkConnectionId = `pending_${Date.now().toString(36)}`;
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = (await clerkClient()) as unknown as {
          samlConnections?: {
            createSamlConnection?: (a: unknown) => Promise<{ id: string }>;
          };
        };
        const created = await client.samlConnections?.createSamlConnection?.({
          name: `${input.domain} (${ctx.orgId})`,
          domain: input.domain,
          provider: "saml_custom",
          organizationId: ctx.orgId,
        });
        if (created?.id) clerkConnectionId = created.id;
      } catch (err) {
        console.error("[sso] Clerk provisioning failed (fallback):", err);
      }

      const conn = await ctx.db.ssoConnection.create({
        data: {
          orgId: ctx.orgId,
          clerkConnectionId,
          domain: input.domain.toLowerCase(),
          protocol: input.protocol,
          status: "pending",
        },
      });
      audit(ctx, "sso.connection_created", {
        targetType: "sso_connection",
        targetId: conn.id,
        meta: { domain: input.domain, protocol: input.protocol },
      });
      return { id: conn.id, clerkConnectionId };
    }),

  setStatus: orgAdminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.enum(["pending", "active", "disabled"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "sso");
      const conn = await ctx.db.ssoConnection.findUnique({
        where: { id: input.id },
        select: { orgId: true },
      });
      if (conn?.orgId !== ctx.orgId) throw new Error("Not found");
      await ctx.db.ssoConnection.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "sso_connection",
        targetId: input.id,
        meta: { status: input.status },
      });
      return { ok: true };
    }),

  setEnforcement: orgAdminProcedure
    .input(z.object({ id: z.string().min(1), enforceSso: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "sso");
      const conn = await ctx.db.ssoConnection.findUnique({
        where: { id: input.id },
        select: { orgId: true },
      });
      if (conn?.orgId !== ctx.orgId) throw new Error("Not found");
      await ctx.db.ssoConnection.update({
        where: { id: input.id },
        data: { enforceSso: input.enforceSso },
      });
      if (input.enforceSso) {
        audit(ctx, "sso.enforced", {
          targetType: "sso_connection",
          targetId: input.id,
          meta: { enforced: true },
        });
      }
      return { ok: true };
    }),

  setBreakGlass: orgAdminProcedure
    .input(z.object({ id: z.string().min(1), userIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "sso");
      const conn = await ctx.db.ssoConnection.findUnique({
        where: { id: input.id },
        select: { orgId: true },
      });
      if (conn?.orgId !== ctx.orgId) throw new Error("Not found");
      await ctx.db.ssoConnection.update({
        where: { id: input.id },
        data: { breakGlassUserIds: normalizeBreakGlass(input.userIds) },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "sso_connection",
        targetId: input.id,
        meta: { action: "break_glass_updated", count: input.userIds.length },
      });
      return { ok: true };
    }),
});

