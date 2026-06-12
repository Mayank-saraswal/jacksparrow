import { describe, it, expect } from "vitest";

import {
  avgFirstResponseMinutes,
  tallyPerUser,
  deltaPct,
  dayKey,
  type AssignmentSample,
} from "./analytics-agg";

const at = (iso: string) => new Date(iso);

describe("dayKey", () => {
  it("returns the UTC date", () => {
    expect(dayKey(at("2025-06-15T23:30:00Z"))).toBe("2025-06-15");
  });
});

describe("avgFirstResponseMinutes", () => {
  it("averages assignment→reply durations", () => {
    const samples: AssignmentSample[] = [
      { threadId: "a", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: at("2025-06-15T10:30:00Z") },
      { threadId: "b", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: at("2025-06-15T11:00:00Z") },
    ];
    expect(avgFirstResponseMinutes(samples)).toBe(45);
  });

  it("excludes threads with no reply", () => {
    const samples: AssignmentSample[] = [
      { threadId: "a", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: at("2025-06-15T10:20:00Z") },
      { threadId: "b", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: null },
    ];
    expect(avgFirstResponseMinutes(samples)).toBe(20);
  });

  it("clamps a reply-before-assignment to 0", () => {
    const samples: AssignmentSample[] = [
      { threadId: "a", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: at("2025-06-15T09:50:00Z") },
      { threadId: "b", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: at("2025-06-15T10:40:00Z") },
    ];
    // (0 + 40) / 2 = 20
    expect(avgFirstResponseMinutes(samples)).toBe(20);
  });

  it("returns 0 when nothing qualifies", () => {
    expect(avgFirstResponseMinutes([])).toBe(0);
    expect(
      avgFirstResponseMinutes([
        { threadId: "a", assignedAt: at("2025-06-15T10:00:00Z"), firstReplyAt: null },
      ]),
    ).toBe(0);
  });
});

describe("tallyPerUser", () => {
  it("emits per-user rows plus an org total", () => {
    const rows = tallyPerUser("emails_sent", { u1: 3, u2: 7 });
    expect(rows).toContainEqual({ metric: "emails_sent", value: 3, dims: { userId: "u1" } });
    expect(rows).toContainEqual({ metric: "emails_sent", value: 7, dims: { userId: "u2" } });
    expect(rows).toContainEqual({ metric: "emails_sent", value: 10, dims: {} });
  });
});

describe("deltaPct", () => {
  it("computes signed percentage change", () => {
    expect(deltaPct(150, 100)).toBe(50);
    expect(deltaPct(50, 100)).toBe(-50);
  });
  it("handles zero previous", () => {
    expect(deltaPct(0, 0)).toBe(0);
    expect(deltaPct(5, 0)).toBe(100);
  });
});
