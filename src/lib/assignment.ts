/**
 * Pure shared-inbox assignment state machine + optimistic-concurrency check.
 * The server applies these to ThreadAssignment rows; keeping the logic pure
 * makes the transitions and conflict handling unit-testable.
 */

export type AssignmentStatus = "open" | "assigned" | "snoozed" | "closed";

export type AssignmentAction =
  | { type: "assign"; assigneeUserId: string }
  | { type: "unassign" }
  | { type: "close" }
  | { type: "reopen" }
  | { type: "snooze" };

export interface AssignmentState {
  status: AssignmentStatus;
  assigneeUserId: string | null;
}

export type AssignmentTransition =
  | { ok: true; next: AssignmentState }
  | { ok: false; reason: "invalid_transition" };

/**
 * Applies an action to the current state. Assigning always moves to "assigned"
 * (and sets the assignee); unassigning returns to "open"; close/reopen toggle
 * the closed state; snooze parks an open/assigned thread.
 */
export function applyAssignmentAction(
  state: AssignmentState,
  action: AssignmentAction,
): AssignmentTransition {
  switch (action.type) {
    case "assign":
      return {
        ok: true,
        next: { status: "assigned", assigneeUserId: action.assigneeUserId },
      };
    case "unassign":
      return { ok: true, next: { status: "open", assigneeUserId: null } };
    case "close":
      if (state.status === "closed") return { ok: false, reason: "invalid_transition" };
      return { ok: true, next: { ...state, status: "closed" } };
    case "reopen":
      if (state.status !== "closed") return { ok: false, reason: "invalid_transition" };
      return {
        ok: true,
        next: {
          status: state.assigneeUserId ? "assigned" : "open",
          assigneeUserId: state.assigneeUserId,
        },
      };
    case "snooze":
      if (state.status === "closed") return { ok: false, reason: "invalid_transition" };
      return { ok: true, next: { ...state, status: "snoozed" } };
    default:
      return { ok: false, reason: "invalid_transition" };
  }
}

/** Maps an action to the AssignmentEvent kind it records. */
export function assignmentEventKind(
  action: AssignmentAction,
): "assigned" | "unassigned" | "closed" | "reopened" {
  switch (action.type) {
    case "assign":
      return "assigned";
    case "unassign":
    case "snooze":
      return "unassigned";
    case "close":
      return "closed";
    case "reopen":
      return "reopened";
  }
}

/**
 * Optimistic concurrency: the caller passes the `updatedAt` it last saw. If the
 * row was modified since (someone else acted), this is a conflict the UI must
 * resolve by refetching.
 */
export function isStaleUpdate(
  currentUpdatedAt: Date,
  expectedUpdatedAt: Date | undefined,
): boolean {
  if (!expectedUpdatedAt) return false; // caller opted out of the check
  return currentUpdatedAt.getTime() !== expectedUpdatedAt.getTime();
}
