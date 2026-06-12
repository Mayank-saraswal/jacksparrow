import "server-only";

import { TRPCError } from "@trpc/server";

import { db } from "@/server/db";
import {
  type Plan,
  type PlanLimits,
  type UsageMetric,
  type SubscriptionSnapshot,
  effectivePlan,
  isInGrace,
  planLimits,
  monthlyPeriodStart,
  decideLimit,
} from "@/lib/entitlements";

/**
 * Billing enforcement. `assertWithinLimit` is called at the START of every paid
 * AI mutation; it fails OPEN on transient billing-db errors (never hard-blocks
 * on infra flake) and fails CLOSED (Free limits) on a definitively
 * expired/canceled subscription — that resolution lives in `effectivePlan`.
 */

export type OwnerRef = { ownerType: "user" | "org"; ownerId: string };

export function userOwner(userId: string): OwnerRef {
  return { ownerType: "user", ownerId: userId };
}
export function orgOwner(orgId: string): OwnerRef {
  return { ownerType: "org", ownerId: orgId };
}

/** The billable owner for an action: the active org if present, else the user. */
export function ownerForContext(
  userId: string,
  orgId: string | null,
): OwnerRef {
  return orgId ? orgOwner(orgId) : userOwner(userId);
}

async function getSubscriptionSnapshot(
  owner: OwnerRef,
): Promise<SubscriptionSnapshot | null> {
  const customer = await db.billingCustomer.findUnique({
    where: {
      ownerType_ownerId: { ownerType: owner.ownerType, ownerId: owner.ownerId },
    },
    select: { id: true },
  });
  if (!customer) return null;

  const sub = await db.subscription.findFirst({
    where: { billingCustomerId: customer.id },
    orderBy: { updatedAt: "desc" },
  });
  if (!sub) return null;

  return {
    plan: (sub.plan as Plan) ?? "free",
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
  };
}

export interface Entitlements {
  plan: Plan;
  limits: PlanLimits;
  inGrace: boolean;
  subscription: SubscriptionSnapshot | null;
}

/** Resolves the owner's effective plan + limits (free when unconfigured). */
export async function getEntitlements(owner: OwnerRef): Promise<Entitlements> {
  let snapshot: SubscriptionSnapshot | null = null;
  try {
    snapshot = await getSubscriptionSnapshot(owner);
  } catch (err) {
    // Fail open to the caller; surface a free-ish view but log loudly.
    console.error("[entitlements] subscription read failed (fail-open):", err);
  }
  const plan = effectivePlan(snapshot);
  return {
    plan,
    limits: planLimits(plan),
    inGrace: isInGrace(snapshot),
    subscription: snapshot,
  };
}

async function getUsageCount(
  owner: OwnerRef,
  userId: string,
  metric: UsageMetric,
  periodStart: Date,
): Promise<number> {
  const row = await db.usageRecord.findUnique({
    where: {
      ownerType_ownerId_userId_metric_periodStart: {
        ownerType: owner.ownerType,
        ownerId: owner.ownerId,
        userId,
        metric,
        periodStart,
      },
    },
    select: { count: true },
  });
  return row?.count ?? 0;
}

/**
 * Throws TRPCError FORBIDDEN ("limit_exceeded") when the owner/user is over the
 * monthly cap for `metric`. Transient billing-db errors fail open (allow).
 */
export async function assertWithinLimit(
  owner: OwnerRef,
  userId: string,
  metric: UsageMetric,
): Promise<void> {
  let plan: Plan;
  let used: number;
  const periodStart = monthlyPeriodStart();

  try {
    const snapshot = await getSubscriptionSnapshot(owner);
    plan = effectivePlan(snapshot);
    used = await getUsageCount(owner, userId, metric, periodStart);
  } catch (err) {
    console.error("[entitlements] limit check failed (fail-open):", err);
    return; // fail OPEN on transient infra errors
  }

  const decision = decideLimit({ plan, metric, used, transientError: false });
  if (!decision.allowed) {
    throw new TRPCError({ code: "FORBIDDEN", message: "limit_exceeded" });
  }
}

/** Atomically increments the monthly usage bucket for a metric. Best-effort. */
export async function incrementUsage(
  owner: OwnerRef,
  userId: string,
  metric: UsageMetric,
  by = 1,
): Promise<void> {
  const periodStart = monthlyPeriodStart();
  try {
    await db.usageRecord.upsert({
      where: {
        ownerType_ownerId_userId_metric_periodStart: {
          ownerType: owner.ownerType,
          ownerId: owner.ownerId,
          userId,
          metric,
          periodStart,
        },
      },
      create: {
        ownerType: owner.ownerType,
        ownerId: owner.ownerId,
        userId,
        metric,
        periodStart,
        count: by,
      },
      update: { count: { increment: by } },
    });
  } catch (err) {
    console.error("[entitlements] usage increment failed:", err);
  }
}

/** Whether connecting another account is allowed under the owner's plan. */
export async function assertCanConnectAccount(
  owner: OwnerRef,
  currentAccountCount: number,
): Promise<void> {
  const { limits } = await getEntitlements(owner);
  if (currentAccountCount >= limits.maxAccounts) {
    throw new TRPCError({ code: "FORBIDDEN", message: "limit_exceeded" });
  }
}
