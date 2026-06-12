import { describe, it, expect } from "vitest";

import {
  extractDomain,
  looksLikeCalendarInvite,
  matchesConditions,
  matchThreadToSplit,
  parseSplitRules,
  DEFAULT_SPLITS,
  OTHER_SPLIT_ID,
  type MatchableThread,
  type SplitRule,
} from "./split-rules";

const thread = (over: Partial<MatchableThread> = {}): MatchableThread => ({
  fromEmail: "alice@acme.com",
  subject: "Hello there",
  priorityLabel: "normal",
  hasCalendarInvite: false,
  ...over,
});

describe("extractDomain", () => {
  it("lowercases and strips the local part", () => {
    expect(extractDomain("Bob@Example.COM")).toBe("example.com");
  });
  it("returns empty string for malformed input", () => {
    expect(extractDomain("not-an-email")).toBe("");
  });
});

describe("looksLikeCalendarInvite", () => {
  it("matches Google Calendar subject prefixes", () => {
    expect(looksLikeCalendarInvite("Invitation: Standup @ 9am")).toBe(true);
    expect(looksLikeCalendarInvite("Accepted: Lunch")).toBe(true);
    expect(looksLikeCalendarInvite("Updated invitation: Sync")).toBe(true);
  });
  it("ignores ordinary subjects", () => {
    expect(looksLikeCalendarInvite("Re: invitation to bid")).toBe(false);
    expect(looksLikeCalendarInvite("Your invoice")).toBe(false);
  });
});

describe("matchesConditions", () => {
  it("matches nothing when conditions are empty", () => {
    expect(matchesConditions(thread(), {})).toBe(false);
  });

  it("ANDs across groups", () => {
    const c = { domain: ["acme.com"], priorityLabel: ["urgent" as const] };
    expect(matchesConditions(thread({ priorityLabel: "urgent" }), c)).toBe(true);
    expect(matchesConditions(thread({ priorityLabel: "low" }), c)).toBe(false);
  });

  it("ORs within a list", () => {
    const c = { domain: ["other.com", "acme.com"] };
    expect(matchesConditions(thread(), c)).toBe(true);
  });

  it("matches subjectContains case-insensitively", () => {
    expect(
      matchesConditions(thread({ subject: "Your INVOICE #5" }), {
        subjectContains: ["invoice"],
      }),
    ).toBe(true);
  });

  it("honours hasCalendarInvite=false", () => {
    expect(
      matchesConditions(thread({ hasCalendarInvite: false }), {
        hasCalendarInvite: false,
      }),
    ).toBe(true);
  });
});

describe("matchThreadToSplit", () => {
  const rules: SplitRule[] = [
    {
      id: "vip",
      name: "VIP",
      conditions: { domain: ["acme.com"] },
      order: 1,
    },
    {
      id: "urgent",
      name: "Urgent",
      conditions: { priorityLabel: ["urgent"] },
      order: 0,
    },
  ];

  it("returns the first matching rule by order, not array position", () => {
    // urgent (order 0) beats vip (order 1) even though vip is listed first.
    expect(
      matchThreadToSplit(thread({ priorityLabel: "urgent" }), rules),
    ).toBe("urgent");
  });

  it("falls back to Other when nothing matches", () => {
    expect(
      matchThreadToSplit(thread({ fromEmail: "x@nope.io" }), [rules[0]!]),
    ).toBe(OTHER_SPLIT_ID);
  });
});

describe("parseSplitRules", () => {
  it("falls back to defaults on invalid input", () => {
    expect(parseSplitRules(null)).toEqual(DEFAULT_SPLITS);
    expect(parseSplitRules({})).toEqual(DEFAULT_SPLITS);
    expect(parseSplitRules([])).toEqual(DEFAULT_SPLITS);
  });

  it("parses a valid stored array", () => {
    const rules = [
      { id: "a", name: "A", conditions: { domain: ["x.com"] }, order: 0 },
    ];
    expect(parseSplitRules(rules)).toEqual(rules);
  });
});
