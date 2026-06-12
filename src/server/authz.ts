import "server-only";

import { TRPCError } from "@trpc/server";

import { db } from "@/server/db";

/**
 * Central org authorization. EVERY org-scoped procedure must pass through
 * `assertMember` / `assertAdmin`; the orgId is always derived from verified
 * Clerk context (never client input), and membership is checked against our
 * locally-mirrored Membership table (synced from Clerk webhooks).
 *
 * See SECURITY.md for the full authorization model.
 */

export type OrgRole = "admin" | "member";

export interface MembershipInfo {
  orgId: string;
  userId: string;
  role: OrgRole;
}

function normalizeRole(role: string): OrgRole {
  return role === "admin" ? "admin" : "member";
}

/** Returns the membership row, or null if the user is not in the org. */
export async function getMembership(
  orgId: string,
  userId: string,
): Promise<MembershipInfo | null> {
  const row = await db.membership.findUnique({
    where: { orgId_userId: { orgId, userId } },
    select: { orgId: true, userId: true, role: true },
  });
  if (!row) return null;
  return { orgId: row.orgId, userId: row.userId, role: normalizeRole(row.role) };
}

/** Throws FORBIDDEN unless the user is a member of the org. */
export async function assertMember(
  orgId: string,
  userId: string,
): Promise<MembershipInfo> {
  const membership = await getMembership(orgId, userId);
  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization.",
    });
  }
  return membership;
}

/** Throws FORBIDDEN unless the user is an admin of the org. */
export async function assertAdmin(
  orgId: string,
  userId: string,
): Promise<MembershipInfo> {
  const membership = await assertMember(orgId, userId);
  if (membership.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This action requires an organization admin.",
    });
  }
  return membership;
}

/**
 * Verifies the user may access a shared inbox: the inbox must belong to an org
 * the user is a member of. Returns the inbox + membership for convenience.
 */
export async function assertSharedInboxAccess(
  sharedInboxId: string,
  userId: string,
): Promise<{ orgId: string; corsairAccountId: string | null; role: OrgRole }> {
  const inbox = await db.sharedInbox.findUnique({
    where: { id: sharedInboxId },
    select: { orgId: true, corsairAccountId: true },
  });
  if (!inbox) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Shared inbox not found." });
  }
  const membership = await assertMember(inbox.orgId, userId);
  return {
    orgId: inbox.orgId,
    corsairAccountId: inbox.corsairAccountId,
    role: membership.role,
  };
}
