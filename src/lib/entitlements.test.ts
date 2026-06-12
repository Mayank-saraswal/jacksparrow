import { describe, it, expect } from "vitest";

import {
  PLAN_LIMITS,
  GRACE_DAYS,
  effectivePlan,
  isInGrace,
  monthlyPeriodStart,
  metricLimit,
  isWithinLimit,
  decideLimit,
  type SubscriptionSnapshot,
} from "./entitlements";

const day = 86_400_000;

describe("plan limits", () => {
  it("free is 1 account / 100 AI actions, no team features", () => {
    expect(PLAN_LIMITS.free.maxAccounts).toBe(1);
    expect(PLAN_LIMITS.free.aiActionsPerMonth).toBe(100);
    expect(PLAN_LIMITS.free.sharedInboxes).toBe(false);
    expect(PLAN_LIMITS.free.slack).toBe(false);
  });

  it("pro is unlimited accounts / 2000 actions / shared inboxes, no slack", () => {
    expect(PLAN_LIMITS.pro.maxAccounts).toBe(Number.POSITIVE_INFINITY);
    expect(PLAN_LIMITS.pro.aiActionsPerMonth).toBe(2000);
    expect(PLAN_LIMITS.pro.sharedInboxes).toBe(true);
    expect(PLAN_LIMITS.pro.slack).toBe(false);
  });

  it("business adds slack", () => {
    expect(PLAN_LIMITS.business.slack).toBe(true);
  });
});

describe("effectivePlan", () => {
  const now = new Date("2025-06-15T00:00:00Z");
  const sub = (over: Partial<SubscriptionSnapshot>): SubscriptionSnapshot => ({
    plan: "pro",
    status: "active",
    currentPeriodEnd: new Date("2025-06-20T00:00:00Z"),
    cancelAtPeriodEnd: false,
    ...over,
  });

  it("no subscription → free", () => {
    expect(effectivePlan(null, now)).toBe("free");
  });

  it("active/trialing keep their plan", () => {
    expect(effectivePlan(sub({ status: "active" }), now)).toBe("pro");
    expect(effectivePlan(sub({ status: "trialing", plan: "business" }), now)).toBe(
      "business",
    );
  });

  it("canceled → free (fail closed)", () => {
    expect(effectivePlan(sub({ status: "canceled" }), now)).toBe("free");
  });

  it("past_due keeps plan within grace, downgrades after", () => {
    const periodEnd = new Date("2025-06-10T00:00:00Z");
    const pastDue = sub({ status: "past_due", currentPeriodEnd: periodEnd });
    // 3 days into grace
    expect(effectivePlan(pastDue, new Date(periodEnd.getTime() + 3 * day))).toBe(
      "pro",
    );
    // past the grace window
    expect(
      effectivePlan(pastDue, new Date(periodEnd.getTime() + (GRACE_DAYS + 1) * day)),
    ).toBe("free");
  });
});

describe("isInGrace", () => {
  it("true only for past_due within the window", () => {
    const end = new Date("2025-06-10T00:00:00Z");
    const pastDue: SubscriptionSnapshot = {
      plan: "pro",
      status: "past_due",
      currentPeriodEnd: end,
      cancelAtPeriodEnd: false,
    };
    expect(isInGrace(pastDue, new Date(end.getTime() + day))).toBe(true);
    expect(isInGrace(pastDue, new Date(end.getTime() + (GRACE_DAYS + 1) * day))).toBe(
      false,
    );
    expect(isInGrace({ ...pastDue, status: "active" }, end)).toBe(false);
  });
});

describe("monthlyPeriodStart", () => {
  it("returns the first of the month in UTC", () => {
    const start = monthlyPeriodStart(new Date("2025-06-15T13:45:00Z"));
    expect(start.toISOString()).toBe("2025-06-01T00:00:00.000Z");
  });
});

describe("limit checks", () => {
  it("metricLimit follows the plan's AI budget", () => {
    expect(metricLimit("free", "ai_action")).toBe(100);
    expect(metricLimit("pro", "summary")).toBe(2000);
  });

  it("isWithinLimit is strict (used < limit)", () => {
    expect(isWithinLimit("free", "ai_action", 99)).toBe(true);
    expect(isWithinLimit("free", "ai_action", 100)).toBe(false);
  });
});

describe("decideLimit decision table", () => {
  it("allows under limit", () => {
    expect(decideLimit({ plan: "free", metric: "ai_action", used: 5, transientError: false })).toEqual(
      { allowed: true, reason: "within_limit" },
    );
  });

  it("blocks at/over limit (fail closed)", () => {
    expect(
      decideLimit({ plan: "free", metric: "ai_action", used: 100, transientError: false }),
    ).toEqual({ allowed: false, reason: "limit_exceeded" });
  });

  it("fails OPEN on a transient error even when over limit", () => {
    expect(
      decideLimit({ plan: "free", metric: "ai_action", used: 999, transientError: true }),
    ).toEqual({ allowed: true, reason: "fail_open" });
  });
});
