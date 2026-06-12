import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { assertAdmin } from "@/server/authz";
import { env } from "@/env";
import { getStripe, configuredPrices } from "@/server/billing/stripe";
import {
  getEntitlements,
  ownerForContext,
  type OwnerRef,
} from "@/server/billing/entitlements";
import { monthlyPeriodStart, type UsageMetric } from "@/lib/entitlements";

const USAGE_METRICS: UsageMetric[] = ["ai_action", "embedding", "summary"];

/** Resolves the billable owner for the request; org billing is admin-only. */
async function resolveOwner(ctx: {
  userId: string;
  orgId: string | null;
}): Promise<OwnerRef> {
  if (ctx.orgId) {
    await assertAdmin(ctx.orgId, ctx.userId);
    return ownerForContext(ctx.userId, ctx.orgId);
  }
  return ownerForContext(ctx.userId, null);
}

export const billingRouter = createTRPCRouter({
  /** Current plan, limits, grace state, seats, and this user's monthly usage. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const owner = await resolveOwner(ctx);
    const entitlements = await getEntitlements(owner);

    const periodStart = monthlyPeriodStart();
    const usageRows = await ctx.db.usageRecord.findMany({
      where: {
        ownerType: owner.ownerType,
        ownerId: owner.ownerId,
        userId: ctx.userId,
        periodStart,
      },
      select: { metric: true, count: true },
    });
    const usageByMetric = Object.fromEntries(
      USAGE_METRICS.map((m) => [
        m,
        usageRows.find((r) => r.metric === m)?.count ?? 0,
      ]),
    ) as Record<UsageMetric, number>;

    return {
      ownerType: owner.ownerType,
      plan: entitlements.plan,
      limits: {
        maxAccounts: Number.isFinite(entitlements.limits.maxAccounts)
          ? entitlements.limits.maxAccounts
          : null,
        aiActionsPerMonth: entitlements.limits.aiActionsPerMonth,
        sharedInboxes: entitlements.limits.sharedInboxes,
        slack: entitlements.limits.slack,
      },
      inGrace: entitlements.inGrace,
      seats: entitlements.subscription
        ? (
            await ctx.db.subscription.findFirst({
              where: {
                billingCustomer: {
                  ownerType: owner.ownerType,
                  ownerId: owner.ownerId,
                },
              },
              orderBy: { updatedAt: "desc" },
              select: { seats: true },
            })
          )?.seats ?? 1
        : 1,
      status: entitlements.subscription?.status ?? "free",
      currentPeriodEnd:
        entitlements.subscription?.currentPeriodEnd?.toISOString() ?? null,
      usage: usageByMetric,
    };
  }),

  /** Configured paid prices (plan + interval + Stripe price id). */
  prices: protectedProcedure.query(() => {
    return configuredPrices();
  }),

  /** Creates a Stripe Checkout session and returns its URL. */
  createCheckout: protectedProcedure
    .input(z.object({ priceId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing not configured." });
      }
      const valid = configuredPrices().some((p) => p.priceId === input.priceId);
      if (!valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown price." });
      }

      const owner = await resolveOwner(ctx);

      // Reuse an existing Stripe customer for this owner if present.
      const existing = await ctx.db.billingCustomer.findUnique({
        where: {
          ownerType_ownerId: {
            ownerType: owner.ownerType,
            ownerId: owner.ownerId,
          },
        },
        select: { stripeCustomerId: true },
      });

      const seats =
        owner.ownerType === "org"
          ? Math.max(
              1,
              await ctx.db.membership.count({ where: { orgId: owner.ownerId } }),
            )
          : 1;

      const billingUrl = `${env.APP_URL}/settings/billing`;
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        ...(existing
          ? { customer: existing.stripeCustomerId }
          : { client_reference_id: `${owner.ownerType}:${owner.ownerId}` }),
        line_items: [{ price: input.priceId, quantity: seats }],
        success_url: `${billingUrl}?checkout=success`,
        cancel_url: `${billingUrl}?checkout=cancel`,
        subscription_data: {
          metadata: { ownerType: owner.ownerType, ownerId: owner.ownerId },
        },
        metadata: {
          ownerType: owner.ownerType,
          ownerId: owner.ownerId,
          userId: ctx.userId,
        },
      });

      if (!session.url) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No checkout URL." });
      }
      return { url: session.url };
    }),

  /** Creates a Stripe Customer Portal session for managing the subscription. */
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing not configured." });
    }
    const owner = await resolveOwner(ctx);
    const customer = await ctx.db.billingCustomer.findUnique({
      where: {
        ownerType_ownerId: { ownerType: owner.ownerType, ownerId: owner.ownerId },
      },
      select: { stripeCustomerId: true },
    });
    if (!customer) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No billing account yet." });
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${env.APP_URL}/settings/billing`,
    });
    return { url: session.url };
  }),
});
