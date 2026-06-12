import { describe, it, expect } from "vitest";

import {
  clampDays,
  policyTightened,
  computeEffectiveAt,
  cutoffDate,
  isPurgeActive,
  matchesHold,
  isHeld,
  GRACE_HOURS,
  type RetentionDays,
} from "./retention";

const day = 86_400_000;

describe("clampDays", () => {
  it("enforces minimum floors", () => {
    expect(clampDays("email", 10)).toBe(30);
    expect(clampDays("audit", 30)).toBe(90);
    expect(clampDays("email", 60)).toBe(60);
  });
  it("passes null through (keep forever)", () => {
    expect(clampDays("email", null)).toBeNull();
  });
});

describe("policyTightened", () => {
  const base: RetentionDays = { emailDays: 90, slackDays: null, auditDays: 365 };
  it("detects forever → finite as tighter", () => {
    expect(policyTightened(base, { ...base, slackDays: 30 })).toBe(true);
  });
  it("detects shorter number as tighter", () => {
    expect(policyTightened(base, { ...base, emailDays: 30 })).toBe(true);
  });
  it("loosening is not tighter", () => {
    expect(policyTightened(base, { ...base, emailDays: 180 })).toBe(false);
    expect(policyTightened(base, { ...base, auditDays: 365 })).toBe(false);
  });
});

describe("computeEffectiveAt", () => {
  const now = new Date("2025-06-15T00:00:00Z");
  const base: RetentionDays = { emailDays: 90, slackDays: null, auditDays: 365 };

  it("adds the 72h grace when tightened", () => {
    const eff = computeEffectiveAt(base, { ...base, emailDays: 30 }, now);
    expect(eff.getTime()).toBe(now.getTime() + GRACE_HOURS * 3600 * 1000);
  });
  it("is immediate when loosened or unchanged", () => {
    expect(computeEffectiveAt(base, base, now).getTime()).toBe(now.getTime());
  });
});

describe("cutoffDate / isPurgeActive", () => {
  const now = new Date("2025-06-15T00:00:00Z");
  it("null days keeps forever", () => {
    expect(cutoffDate(null, now)).toBeNull();
  });
  it("computes the cutoff", () => {
    expect(cutoffDate(30, now)!.toISOString()).toBe("2025-05-16T00:00:00.000Z");
  });
  it("respects the grace window", () => {
    const eff = new Date(now.getTime() + day);
    expect(isPurgeActive(eff, now)).toBe(false);
    expect(isPurgeActive(null, now)).toBe(true);
    expect(isPurgeActive(new Date(now.getTime() - day), now)).toBe(true);
  });
});

describe("legal hold scope matching", () => {
  const row = {
    userId: "user_a",
    sharedInboxId: "inbox_1",
    timestamp: new Date("2025-03-01T00:00:00Z"),
  };

  it("empty scope holds everything", () => {
    expect(matchesHold({}, row)).toBe(true);
  });
  it("matches on userIds", () => {
    expect(matchesHold({ userIds: ["user_a"] }, row)).toBe(true);
    expect(matchesHold({ userIds: ["user_b"] }, row)).toBe(false);
  });
  it("ANDs userIds + date range", () => {
    expect(
      matchesHold(
        { userIds: ["user_a"], after: "2025-01-01T00:00:00Z", before: "2025-06-01T00:00:00Z" },
        row,
      ),
    ).toBe(true);
    // outside the range
    expect(
      matchesHold({ userIds: ["user_a"], after: "2025-04-01T00:00:00Z" }, row),
    ).toBe(false);
  });
  it("isHeld returns true if any hold matches", () => {
    expect(
      isHeld([{ scope: { userIds: ["x"] } }, { scope: { sharedInboxIds: ["inbox_1"] } }], row),
    ).toBe(true);
    expect(isHeld([{ scope: { userIds: ["x"] } }], row)).toBe(false);
  });
});
