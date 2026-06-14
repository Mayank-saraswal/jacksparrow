import { describe, it, expect } from "vitest";

import { knownSenderDecision } from "./known-sender";

describe("knownSenderDecision", () => {
  it("is known when a sample exists for the domain", () => {
    expect(
      knownSenderDecision({
        hasSampleForDomain: true,
        hasSyncItemFromSender: false,
      }),
    ).toBe(true);
  });

  it("is known when a sync item from the sender exists", () => {
    expect(
      knownSenderDecision({
        hasSampleForDomain: false,
        hasSyncItemFromSender: true,
      }),
    ).toBe(true);
  });

  it("is unknown when there are no local signals", () => {
    expect(
      knownSenderDecision({
        hasSampleForDomain: false,
        hasSyncItemFromSender: false,
      }),
    ).toBe(false);
  });
});
