import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { assertAdmin } from "@/server/authz";
import { env } from "@/env";
import { getDodo, configuredProducts } from "@/server/billing/dodo";
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

  /** Configured paid products (plan + interval + Dodo product id). */
  products: protectedProcedure.query(() => {
    return configuredProducts();
  }),

  /** Creates a Dodo Payments Checkout session and returns its URL. */
  createCheckout: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const dodo = getDodo();
      if (!dodo) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing not configured." });
      }
      const valid = configuredProducts().some((p) => p.productId === input.productId);
      if (!valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown product." });
      }

      const owner = await resolveOwner(ctx);

      const seats =
        owner.ownerType === "org"
          ? Math.max(
              1,
              await ctx.db.membership.count({ where: { orgId: owner.ownerId } }),
            )
          : 1;

      const billingUrl = `${env.APP_URL}/settings/billing`;
      const session = await dodo.checkoutSessions.create({
        product_cart: [{ product_id: input.productId, quantity: seats }],
        return_url: `${billingUrl}?checkout=success`,
        metadata: {
          ownerType: owner.ownerType,
          ownerId: owner.ownerId,
          userId: ctx.userId,
        },
      });

      if (!session.checkout_url) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "No checkout URL." });
      }
      return { url: session.checkout_url };
    }),

  /** Redirects to the Dodo Payments Customer Portal for managing the subscription. */
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const dodo = getDodo();
    if (!dodo) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing not configured." });
    }
    const owner = await resolveOwner(ctx);
    const customer = await ctx.db.billingCustomer.findUnique({
      where: {
        ownerType_ownerId: { ownerType: owner.ownerType, ownerId: owner.ownerId },
      },
      select: { dodoCustomerId: true },
    });
    if (!customer) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No billing account yet." });
    }

    // Dodo Payments provides a unified customer portal at customer.dodopayments.com.
    // The SDK's customer portal session can also be used via the @dodopayments/nextjs adapter.
    const portalUrl = `https://customer.dodopayments.com?customer_id=${encodeURIComponent(customer.dodoCustomerId)}`;
    return { url: portalUrl };
  }),
});
