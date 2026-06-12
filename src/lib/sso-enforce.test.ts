import { describe, it, expect } from "vitest";

import {
  decideSsoAccess,
  isSsoStrategy,
  normalizeBreakGlass,
  MAX_BREAK_GLASS,
} from "./sso-enforce";

describe("isSsoStrategy", () => {
  it("recognises saml/oidc/enterprise strategies", () => {
    expect(isSsoStrategy("saml")).toBe(true);
    expect(isSsoStrategy("enterprise_sso")).toBe(true);
    expect(isSsoStrategy("oidc")).toBe(true);
  });
  it("rejects password / oauth / null", () => {
    expect(isSsoStrategy("password")).toBe(false);
    expect(isSsoStrategy("oauth_google")).toBe(false);
    expect(isSsoStrategy(null)).toBe(false);
  });
});

describe("decideSsoAccess decision table", () => {
  const base = { breakGlassUserIds: ["admin1"], userId: "u1" };

  it("not enforced → always allowed", () => {
    expect(decideSsoAccess({ ...base, enforceSso: false, strategy: "password" })).toEqual(
      { allowed: true, reason: "not_enforced" },
    );
  });
  it("enforced + sso session → allowed", () => {
    expect(decideSsoAccess({ ...base, enforceSso: true, strategy: "saml" })).toEqual(
      { allowed: true, reason: "sso_session" },
    );
  });
  it("enforced + non-sso + not break-glass → rejected", () => {
    expect(
      decideSsoAccess({ ...base, enforceSso: true, strategy: "password" }),
    ).toEqual({ allowed: false, reason: "sso_required" });
  });
  it("enforced + non-sso + break-glass → allowed", () => {
    expect(
      decideSsoAccess({
        enforceSso: true,
        strategy: "password",
        breakGlassUserIds: ["u1"],
        userId: "u1",
      }),
    ).toEqual({ allowed: true, reason: "break_glass" });
  });
});

describe("normalizeBreakGlass", () => {
  it("dedupes and caps at the max", () => {
    expect(normalizeBreakGlass(["a", "a", "b", "c"])).toEqual(["a", "b"]);
    expect(normalizeBreakGlass(["a", "b", "c"]).length).toBe(MAX_BREAK_GLASS);
  });
});
