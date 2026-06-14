import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { assertMember } from "@/server/authz";
import {
  assertFeature,
  hasFeature,
  orgOwner,
} from "@/server/billing/entitlements";
import { getOrgTenant, isConnected } from "@/server/corsair";
import { audit } from "@/server/audit";
import { OPERATION_PATH, summarizePendingAction } from "@/server/agent/pending";

/** Safely coerce an unknown HubSpot property value to a display string. */
function toStr(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

/**
 * HubSpot CRM surface for the thread reader (Phase 2). Read context is shown
 * inline; "Log to HubSpot" creates a PendingAction (executed only on approval).
 * All access is org-scoped and plan-gated (crm capability).
 */
export const crmRouter = createTRPCRouter({
  /**
   * Deal context for a contact email. Never throws on missing plan/connection —
   * returns a `state` the reader panel renders as a connect/upgrade CTA.
   */
  contactContext: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.orgId) return { state: "no-org" as const };
      await assertMember(ctx.orgId, ctx.userId);
      if (!(await hasFeature(orgOwner(ctx.orgId), "crm")))
        return { state: "upgrade-required" as const };
      if (!(await isConnected({ kind: "org", orgId: ctx.orgId }, "hubspot")))
        return { state: "not-connected" as const };

      const orgTenant = getOrgTenant(ctx.orgId);
      const res = await orgTenant.hubspot.api.deals.search({
        query: input.email,
        limit: 10,
        properties: ["dealname", "dealstage", "amount", "closedate"],
      });
      const results =
        (res as { results?: { properties?: Record<string, unknown> }[] })
          .results ?? [];
      const deals = results.map((d) => {
        const p: Record<string, unknown> = d.properties ?? {};
        const amount = toStr(p.amount);
        const closeDate = toStr(p.closedate);
        return {
          name: toStr(p.dealname) || "(deal)",
          stage: toStr(p.dealstage),
          amount: amount.length > 0 ? amount : null,
          closeDate: closeDate.length > 0 ? closeDate : null,
        };
      });
      return { state: "ok" as const, deals };
    }),

  /** Create a pending action to log a thread to a HubSpot contact. */
  logEmail: protectedProcedure
    .input(
      z.object({
        contactEmail: z.string().email(),
        threadId: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) throw new Error("No active organization");
      await assertMember(ctx.orgId, ctx.userId);
      await assertFeature(orgOwner(ctx.orgId), "crm");

      const payload = {
        orgId: ctx.orgId,
        contactEmail: input.contactEmail,
        threadId: input.threadId,
        subject: input.subject,
        body: input.body,
        occurredAt: new Date().toISOString(),
      };

      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });
      const row = await ctx.db.pendingAction.create({
        data: {
          userId: ctx.userId,
          channel: "web",
          kind: "hubspot_log_email",
          draftPayload: payload,
          corsairOperationPath: OPERATION_PATH.hubspot_log_email,
          status: "pending",
        },
      });
      audit(ctx, "integration.crm_logged", {
        targetType: "hubspot_contact",
        targetId: input.contactEmail,
        meta: { pendingActionId: row.id, threadId: input.threadId },
      });
      return {
        id: row.id,
        summary: summarizePendingAction("hubspot_log_email", payload),
      };
    }),
});
