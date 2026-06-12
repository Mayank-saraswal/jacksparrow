import { describe, it, expect } from "vitest";

import { deriveActiveMembers, deriveSeatCount, type MembershipEvent } from "./seats";

const ev = (
  type: MembershipEvent["type"],
  userId: string,
  role: "admin" | "member" = "member",
): MembershipEvent => ({ type, userId, role });

describe("deriveActiveMembers", () => {
  it("adds on create, removes on delete", () => {
    const members = deriveActiveMembers([
      ev("organizationMembership.created", "a"),
      ev("organizationMembership.created", "b"),
      ev("organizationMembership.deleted", "a"),
    ]);
    expect([...members].sort()).toEqual(["b"]);
  });

  it("role change keeps the member active", () => {
    const members = deriveActiveMembers([
      ev("organizationMembership.created", "a", "member"),
      ev("organizationMembership.updated", "a", "admin"),
    ]);
    expect(members.has("a")).toBe(true);
    expect(members.size).toBe(1);
  });

  it("re-adding after delete works", () => {
    const members = deriveActiveMembers([
      ev("organizationMembership.created", "a"),
      ev("organizationMembership.deleted", "a"),
      ev("organizationMembership.created", "a"),
    ]);
    expect(members.has("a")).toBe(true);
  });
});

describe("deriveSeatCount", () => {
  it("counts active members", () => {
    expect(
      deriveSeatCount([
        ev("organizationMembership.created", "a"),
        ev("organizationMembership.created", "b"),
        ev("organizationMembership.created", "c"),
        ev("organizationMembership.deleted", "b"),
      ]),
    ).toBe(2);
  });

  it("never drops below 1 seat", () => {
    expect(
      deriveSeatCount([
        ev("organizationMembership.created", "a"),
        ev("organizationMembership.deleted", "a"),
      ]),
    ).toBe(1);
  });
});
