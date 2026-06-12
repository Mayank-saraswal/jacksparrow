import { describe, it, expect } from "vitest";

import {
  computeSnoozePresets,
  tzOffsetMinutes,
  zonedWallToUtc,
} from "./snooze-presets";

describe("tzOffsetMinutes", () => {
  it("computes a positive offset for IST", () => {
    // India has no DST; always +5:30.
    const d = new Date("2025-06-01T00:00:00Z");
    expect(tzOffsetMinutes(d, "Asia/Kolkata")).toBe(330);
  });

  it("computes UTC offset of zero", () => {
    const d = new Date("2025-06-01T00:00:00Z");
    expect(tzOffsetMinutes(d, "UTC")).toBe(0);
  });

  it("reflects DST changes in America/New_York", () => {
    const summer = new Date("2025-07-01T12:00:00Z"); // EDT = -240
    const winter = new Date("2025-01-01T12:00:00Z"); // EST = -300
    expect(tzOffsetMinutes(summer, "America/New_York")).toBe(-240);
    expect(tzOffsetMinutes(winter, "America/New_York")).toBe(-300);
  });
});

describe("zonedWallToUtc", () => {
  it("maps 08:00 IST to 02:30 UTC", () => {
    const utc = zonedWallToUtc(2025, 6, 2, 8, 0, "Asia/Kolkata");
    expect(utc.toISOString()).toBe("2025-06-02T02:30:00.000Z");
  });

  it("maps 08:00 EDT to 12:00 UTC in summer", () => {
    const utc = zonedWallToUtc(2025, 7, 2, 8, 0, "America/New_York");
    expect(utc.toISOString()).toBe("2025-07-02T12:00:00.000Z");
  });

  it("maps 08:00 EST to 13:00 UTC in winter", () => {
    const utc = zonedWallToUtc(2025, 1, 2, 8, 0, "America/New_York");
    expect(utc.toISOString()).toBe("2025-01-02T13:00:00.000Z");
  });
});

describe("computeSnoozePresets", () => {
  const tz = "America/New_York";
  // A Wednesday afternoon in summer (EDT).
  const now = new Date("2025-07-02T18:00:00Z"); // 14:00 EDT Wed

  const presets = computeSnoozePresets(now, tz);
  const byId = Object.fromEntries(presets.map((p) => [p.id, p.at]));

  it("returns all four presets, each strictly in the future", () => {
    expect(presets.map((p) => p.id)).toEqual([
      "later_today",
      "tomorrow",
      "this_weekend",
      "next_week",
    ]);
    for (const p of presets) {
      expect(new Date(p.at).getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("later today is now + 3h", () => {
    expect(byId.later_today).toBe("2025-07-02T21:00:00.000Z");
  });

  it("tomorrow is 08:00 local the next day", () => {
    // Thu 2025-07-03 08:00 EDT = 12:00 UTC
    expect(byId.tomorrow).toBe("2025-07-03T12:00:00.000Z");
  });

  it("this weekend is the upcoming Saturday 08:00 local", () => {
    // Sat 2025-07-05 08:00 EDT = 12:00 UTC
    expect(byId.this_weekend).toBe("2025-07-05T12:00:00.000Z");
  });

  it("next week is the next Monday 08:00 local", () => {
    // Mon 2025-07-07 08:00 EDT = 12:00 UTC
    expect(byId.next_week).toBe("2025-07-07T12:00:00.000Z");
  });

  it("jumps to next Saturday when run on a weekend", () => {
    const saturday = new Date("2025-07-05T18:00:00Z"); // Sat 14:00 EDT
    const p = Object.fromEntries(
      computeSnoozePresets(saturday, tz).map((x) => [x.id, x.at]),
    );
    // Should be the *following* Saturday, not the same day.
    expect(p.this_weekend).toBe("2025-07-12T12:00:00.000Z");
  });
});
