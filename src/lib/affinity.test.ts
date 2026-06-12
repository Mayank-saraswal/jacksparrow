import { describe, it, expect } from "vitest";

import {
  HALF_LIFE_DAYS,
  applyPostRules,
  applySignal,
  decayedScore,
  manualOverrideWeight,
  ruleSuggestionDecision,
  suggestionForAffinity,
} from "./affinity";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

describe("decayedScore", () => {
  it("halves the score after one half-life", () => {
    const s = decayedScore(10, daysAgo(HALF_LIFE_DAYS), new Date());
    expect(s).toBeCloseTo(5, 1);
  });

  it("is unchanged at zero elapsed time", () => {
    const now = new Date();
    expect(decayedScore(8, now, now)).toBeCloseTo(8, 5);
  });

  it("quarters the score after two half-lives", () => {
    const s = decayedScore(12, daysAgo(HALF_LIFE_DAYS * 2), new Date());
    expect(s).toBeCloseTo(3, 1);
  });
});

describe("applySignal", () => {
  it("decays the old score before adding the new weight", () => {
    // 10 decays to ~5 over one half-life, then +3 → ~8.
    const next = applySignal(10, 3, daysAgo(HALF_LIFE_DAYS), new Date());
    expect(next).toBeCloseTo(8, 1);
  });
});

describe("manualOverrideWeight", () => {
  it("is positive for urgent/important, negative for low, zero for normal", () => {
    expect(manualOverrideWeight("urgent")).toBe(5);
    expect(manualOverrideWeight("important")).toBe(5);
    expect(manualOverrideWeight("low")).toBe(-5);
    expect(manualOverrideWeight("normal")).toBe(0);
  });
});

describe("applyPostRules", () => {
  it("caps at low when affinity ≤ -5", () => {
    expect(applyPostRules("urgent", -6)).toEqual({ label: "low", applied: "cap" });
    // already low → no change reported
    expect(applyPostRules("low", -6)).toEqual({ label: "low", applied: null });
  });

  it("floors at important when affinity ≥ +5", () => {
    expect(applyPostRules("normal", 7)).toEqual({
      label: "important",
      applied: "floor",
    });
    // urgent stays urgent (already above the floor)
    expect(applyPostRules("urgent", 7)).toEqual({
      label: "urgent",
      applied: null,
    });
  });

  it("leaves the label untouched in the neutral band", () => {
    expect(applyPostRules("normal", 0)).toEqual({
      label: "normal",
      applied: null,
    });
  });

  it("cap precedence: a strongly-negative sender forces low even for urgent", () => {
    expect(applyPostRules("urgent", -10).label).toBe("low");
  });
});

describe("suggestionForAffinity / ruleSuggestionDecision", () => {
  it("requires both magnitude and signal count", () => {
    expect(suggestionForAffinity(10, 4)).toBeNull(); // too few signals
    expect(suggestionForAffinity(4, 10)).toBeNull(); // too weak
    expect(suggestionForAffinity(9, 6)).toBe("vip");
    expect(suggestionForAffinity(-9, 6)).toBe("mute");
  });

  it("returns no suggestion when the pattern is already handled", () => {
    expect(
      ruleSuggestionDecision({ score: 9, signalCount: 6, alreadyHandled: true }),
    ).toBeNull();
    expect(
      ruleSuggestionDecision({ score: 9, signalCount: 6, alreadyHandled: false }),
    ).toBe("vip");
  });
});
