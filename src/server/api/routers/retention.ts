import { z } from "zod";

import { createTRPCRouter, orgAdminProcedure } from "@/server/api/trpc";
import { assertFeature, orgOwner } from "@/server/billing/entitlements";
import { audit } from "@/server/audit";
import { tenantId } from "@/server/corsair";
import {
  computeEffectiveAt,
  cutoffDate,
  type RetentionDays,
} from "@/lib/retention";

/** Defaults applied when an org has no explicit policy yet. */
const DEFAULTS: RetentionDays & { derivedFollowsSource: boolean } = {
  emailDays: null,
  slackDays: null,
  auditDays: 365,
  derivedFollowsSource: true,
};

export const retentionRouter = createTRPCRouter({
  get: orgAdminProcedure.query(async ({ ctx }) => {
    await assertFeature(orgOwner(ctx.orgId), "retention");
    const policy = await ctx.db.retentionPolicy.findUnique({
      where: { orgId: ctx.orgId },
    });
    return {
      emailDays: policy?.emailDays ?? null,
      slackDays: policy?.slackDays ?? null,
      auditDays: policy?.auditDays ?? DEFAULTS.auditDays,
      derivedFollowsSource: policy?.derivedFollowsSource ?? true,
      effectiveAt: policy?.effectiveAt?.toISOString() ?? null,
    };
  }),

  /** Count of email entities that a given email policy would purge now. */
  dryRun: orgAdminProcedure
    .input(z.object({ emailDays: z.number().int().min(30).nullable() }))
    .query(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "retention");
      const cutoff = cutoffDate(input.emailDays);
      if (!cutoff) return { estimate: 0 };
      const estimate = await ctx.db.corsairEntity.count({
        where: {
          account: { tenantId: tenantId({ kind: "org", orgId: ctx.orgId }) },
          updatedAt: { lt: cutoff },
        },
      });
      return { estimate };
    }),

  update: orgAdminProcedure
    .input(
      z.object({
        emailDays: z.number().int().min(30).nullable(),
        slackDays: z.number().int().min(30).nullable(),
        auditDays: z.number().int().min(90),
        derivedFollowsSource: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "retention");
      const existing = await ctx.db.retentionPolicy.findUnique({
        where: { orgId: ctx.orgId },
      });
      const prev: RetentionDays = {
        emailDays: existing?.emailDays ?? null,
        slackDays: existing?.slackDays ?? null,
        auditDays: existing?.auditDays ?? DEFAULTS.auditDays,
      };
      const next: RetentionDays = {
        emailDays: input.emailDays,
        slackDays: input.slackDays,
        auditDays: input.auditDays,
      };
      const now = new Date();
      const effectiveAt = computeEffectiveAt(prev, next, now);

      await ctx.db.retentionPolicy.upsert({
        where: { orgId: ctx.orgId },
        create: {
          orgId: ctx.orgId,
          ...input,
          effectiveAt,
          updatedByUserId: ctx.userId,
        },
        update: { ...input, effectiveAt, updatedByUserId: ctx.userId },
      });
      audit(ctx, "retention.policy_changed", {
        targetType: "organization",
        targetId: ctx.orgId,
        meta: {
          emailDays: input.emailDays,
          slackDays: input.slackDays,
          auditDays: input.auditDays,
          effectiveAt: effectiveAt.toISOString(),
        },
      });
      return { effectiveAt: effectiveAt.toISOString() };
    }),

  // ── Legal holds ─────────────────────────────────────────────────────────
  listHolds: orgAdminProcedure.query(async ({ ctx }) => {
    await assertFeature(orgOwner(ctx.orgId), "retention");
    const holds = await ctx.db.legalHold.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
    });
    return holds.map((h) => ({
      id: h.id,
      name: h.name,
      active: h.active,
      scope: h.scope,
      createdAt: h.createdAt.toISOString(),
    }));
  }),

  createHold: orgAdminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(120),
        scope: z.object({
          userIds: z.array(z.string()).optional(),
          sharedInboxIds: z.array(z.string()).optional(),
          before: z.string().datetime().optional(),
          after: z.string().datetime().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "retention");
      const hold = await ctx.db.legalHold.create({
        data: {
          orgId: ctx.orgId,
          name: input.name,
          createdByUserId: ctx.userId,
          scope: input.scope,
        },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "legal_hold",
        targetId: hold.id,
        meta: { name: input.name, action: "hold_created" },
      });
      return { id: hold.id };
    }),

  setHoldActive: orgAdminProcedure
    .input(z.object({ id: z.string().min(1), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await assertFeature(orgOwner(ctx.orgId), "retention");
      const hold = await ctx.db.legalHold.findUnique({
        where: { id: input.id },
        select: { orgId: true },
      });
      if (hold?.orgId !== ctx.orgId) {
        throw new Error("Legal hold not found");
      }
      await ctx.db.legalHold.update({
        where: { id: input.id },
        data: { active: input.active },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "legal_hold",
        targetId: input.id,
        meta: { action: input.active ? "hold_activated" : "hold_released" },
      });
      return { ok: true };
    }),
});
