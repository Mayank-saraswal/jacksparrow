import { describe, it, expect } from "vitest";

import { pickProvider } from "./pick-provider";

const ORDER = ["todoist", "asana"] as const;

describe("pickProvider", () => {
  it("honors a connected preference", () => {
    expect(
      pickProvider(ORDER, { todoist: true, asana: true }, "asana"),
    ).toEqual({ ok: true, provider: "asana" });
  });

  it("ignores a preference that isn't connected and falls to order", () => {
    expect(
      pickProvider(ORDER, { todoist: true, asana: false }, "asana"),
    ).toEqual({ ok: true, provider: "todoist" });
  });

  it("uses the first connected provider in order when no preference", () => {
    expect(pickProvider(ORDER, { todoist: true, asana: true })).toEqual({
      ok: true,
      provider: "todoist",
    });
    expect(pickProvider(ORDER, { todoist: false, asana: true })).toEqual({
      ok: true,
      provider: "asana",
    });
  });

  it("errors when none connected", () => {
    expect(pickProvider(ORDER, { todoist: false, asana: false })).toEqual({
      ok: false,
      reason: "none-connected",
    });
  });

  it("works for a three-way support order", () => {
    const order = ["zendesk", "intercom"] as const;
    expect(
      pickProvider(order, { zendesk: false, intercom: true }, "zendesk"),
    ).toEqual({ ok: true, provider: "intercom" });
  });
});
