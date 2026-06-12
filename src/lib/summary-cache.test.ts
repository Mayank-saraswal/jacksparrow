import { describe, it, expect } from "vitest";

import { summaryCacheDecision } from "./summary-cache";

describe("summaryCacheDecision", () => {
  it("is missing when there's no cached version", () => {
    expect(summaryCacheDecision("v2", null)).toBe("missing");
    expect(summaryCacheDecision("v2", undefined)).toBe("missing");
  });

  it("is fresh when versions match", () => {
    expect(summaryCacheDecision("v2", "v2")).toBe("fresh");
  });

  it("is stale when versions differ", () => {
    expect(summaryCacheDecision("v3", "v2")).toBe("stale");
  });
});
