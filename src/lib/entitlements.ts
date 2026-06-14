/**
 * Pure billing/entitlement logic — plan limits, effective-plan resolution
 * (including the past-due grace window), monthly usage buckets, and the
 * fail-open/fail-closed decision. No I/O so it's fully unit-testable.
 */

export type Plan = "free" | "pro" | "business" | "enterprise";
export type UsageMetric = "ai_action" | "embedding" | "summary";

export interface PlanLimits {
  /** Max connected accounts (Infinity = unlimited). */
  maxAccounts: number;
  /** AI actions allowed per USER per month (== metricLimits.ai_action). */
  aiActionsPerMonth: number;
  /** Per-metric monthly caps so embeddings/summaries don't share one budget. */
  metricLimits: Record<UsageMetric, number>;
  sharedInboxes: boolean;
  slack: boolean;
  // Phase 2 — integration capability gates.
  crm: boolean;
  issueTracker: boolean;
  meetings: boolean;
  // Phase 3 — integration capability gates.
  support: boolean;
  meetingIntelligence: boolean;
  // Phase 4 — Enterprise-only capabilities.
  sso: boolean;
  auditLogs: boolean;
  retention: boolean;
  analytics: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxAccounts: 1,
    aiActionsPerMonth: 100,
    metricLimits: { ai_action: 100, embedding: 1000, summary: 50 },
    sharedInboxes: false,
    slack: false,
    crm: false,
    issueTracker: false,
    meetings: false,
    support: false,
    meetingIntelligence: false,
    sso: false,
    auditLogs: false,
    retention: false,
    analytics: false,
  },
  pro: {
    maxAccounts: Number.POSITIVE_INFINITY,
    aiActionsPerMonth: 2000,
    metricLimits: { ai_action: 2000, embedding: 20000, summary: 1000 },
    sharedInboxes: true,
    slack: false,
    crm: false,
    issueTracker: false,
    meetings: false,
    support: false,
    meetingIntelligence: true,
    sso: false,
    auditLogs: false,
    retention: false,
    analytics: false,
  },
  business: {
    maxAccounts: Number.POSITIVE_INFINITY,
    aiActionsPerMonth: 2000,
    metricLimits: { ai_action: 2000, embedding: 20000, summary: 1000 },
    sharedInboxes: true,
    slack: true,
    crm: true,
    issueTracker: true,
    meetings: true,
    support: true,
    meetingIntelligence: true,
    sso: false,
    auditLogs: false,
    retention: false,
    analytics: false,
  },
  enterprise: {
    maxAccounts: Number.POSITIVE_INFINITY,
    aiActionsPerMonth: 10000,
    metricLimits: { ai_action: 10000, embedding: 200000, summary: 5000 },
    sharedInboxes: true,
    slack: true,
    crm: true,
    issueTracker: true,
    meetings: true,
    support: true,
    meetingIntelligence: true,
    sso: true,
    auditLogs: true,
    retention: true,
    analytics: true,
  },
};

/** Enterprise-gated feature flags, keyed off PlanLimits. */
export type EnterpriseFeature =
  | "sso"
  | "auditLogs"
  | "retention"
  | "analytics"
  | "crm"
  | "issueTracker"
  | "meetings"
  | "support"
  | "meetingIntelligence";

export function planLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

/** Days a `past_due` subscription keeps its paid entitlements before downgrade. */
export const GRACE_DAYS = 7;
const MS_PER_DAY = 86_400_000;

export interface SubscriptionSnapshot {
  plan: Plan;
  status: string; // active | trialing | past_due | canceled | unpaid | ...
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Resolves the plan a subscription currently entitles. No subscription → free.
 * `past_due` keeps its plan through a grace window past `currentPeriodEnd`, then
 * downgrades to free. Definitively dead statuses map straight to free.
 */
export function effectivePlan(
  sub: SubscriptionSnapshot | null,
  now: Date = new Date(),
): Plan {
  if (!sub) return "free";

  switch (sub.status) {
    case "active":
    case "trialing":
      return sub.plan;
    case "past_due":
    case "unpaid": {
      const end = sub.currentPeriodEnd?.getTime() ?? 0;
      const graceEnds = end + GRACE_DAYS * MS_PER_DAY;
      return now.getTime() <= graceEnds ? sub.plan : "free";
    }
    case "canceled":
    case "incomplete_expired":
    default:
      return "free";
  }
}

/** Whether a subscription is in the past-due grace window (show the banner). */
export function isInGrace(
  sub: SubscriptionSnapshot | null,
  now: Date = new Date(),
): boolean {
  if (!sub) return false;
  if (sub.status !== "past_due" && sub.status !== "unpaid") return false;
  const end = sub.currentPeriodEnd?.getTime() ?? 0;
  return now.getTime() <= end + GRACE_DAYS * MS_PER_DAY;
}

/** First instant of the current month in UTC — the usage bucket key. */
export function monthlyPeriodStart(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** The monthly cap for a metric under a plan (Infinity = unlimited). */
export function metricLimit(plan: Plan, metric: UsageMetric): number {
  // Per-metric budgets so embeddings/summaries don't drain the agent-action cap.
  return planLimits(plan).metricLimits[metric];
}

/** True when one more action of `metric` is allowed given `used` so far. */
export function isWithinLimit(
  plan: Plan,
  metric: UsageMetric,
  used: number,
): boolean {
  return used < metricLimit(plan, metric);
}

export type LimitDecision =
  | { allowed: true; reason: "within_limit" | "fail_open" }
  | { allowed: false; reason: "limit_exceeded" };

/**
 * The fail-open/fail-closed decision used by `assertWithinLimit`:
 *  - transient infra error reading usage/subscription → fail OPEN (allow),
 *  - otherwise enforce the plan's monthly cap.
 *
 * Note: an expired/canceled subscription is already resolved to the Free plan
 * by `effectivePlan`, so "fail closed on dead subscription" means enforcing the
 * Free limits here (not a transient error).
 */
export function decideLimit(args: {
  plan: Plan;
  metric: UsageMetric;
  used: number;
  transientError: boolean;
}): LimitDecision {
  if (args.transientError) return { allowed: true, reason: "fail_open" };
  return isWithinLimit(args.plan, args.metric, args.used)
    ? { allowed: true, reason: "within_limit" }
    : { allowed: false, reason: "limit_exceeded" };
}
