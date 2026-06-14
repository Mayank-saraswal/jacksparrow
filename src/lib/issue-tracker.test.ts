import { describe, it, expect } from "vitest";

import { pickIssueTracker } from "./issue-tracker";

describe("pickIssueTracker", () => {
  it("honors a connected preference", () => {
    expect(
      pickIssueTracker({ linear: true, jira: true }, "jira"),
    ).toEqual({ ok: true, provider: "jira" });
  });

  it("ignores a preference that isn't connected", () => {
    expect(
      pickIssueTracker({ linear: true, jira: false }, "jira"),
    ).toEqual({ ok: true, provider: "linear" });
  });

  it("defaults to linear when both connected and no preference", () => {
    expect(pickIssueTracker({ linear: true, jira: true })).toEqual({
      ok: true,
      provider: "linear",
    });
  });

  it("uses the only connected provider", () => {
    expect(pickIssueTracker({ linear: false, jira: true })).toEqual({
      ok: true,
      provider: "jira",
    });
  });

  it("errors when none connected", () => {
    expect(pickIssueTracker({ linear: false, jira: false })).toEqual({
      ok: false,
      reason: "none-connected",
    });
  });
});
