/**
 * Pure seat-count derivation from a stream of membership events. Used to test
 * that join/leave/role-change sequences converge on the right billable seat
 * count (every active member = one seat, regardless of role).
 */

export type MembershipEventType =
  | "organizationMembership.created"
  | "organizationMembership.updated"
  | "organizationMembership.deleted";

export interface MembershipEvent {
  type: MembershipEventType;
  userId: string;
  role: "admin" | "member";
}

/** Replays events and returns the set of currently-active member user ids. */
export function deriveActiveMembers(events: MembershipEvent[]): Set<string> {
  const members = new Set<string>();
  for (const e of events) {
    if (e.type === "organizationMembership.deleted") {
      members.delete(e.userId);
    } else {
      // created or updated (role change) → still an active member
      members.add(e.userId);
    }
  }
  return members;
}

/** Billable seats = number of active members (minimum 1 to keep a live sub). */
export function deriveSeatCount(events: MembershipEvent[]): number {
  return Math.max(1, deriveActiveMembers(events).size);
}
