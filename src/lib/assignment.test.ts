import { describe, it, expect } from "vitest";

import {
  applyAssignmentAction,
  assignmentEventKind,
  isStaleUpdate,
  type AssignmentState,
} from "./assignment";

const open: AssignmentState = { status: "open", assigneeUserId: null };

describe("applyAssignmentAction", () => {
  it("open → assigned", () => {
    const r = applyAssignmentAction(open, { type: "assign", assigneeUserId: "u1" });
    expect(r).toEqual({
      ok: true,
      next: { status: "assigned", assigneeUserId: "u1" },
    });
  });

  it("assigned → closed → reopened (back to assigned, assignee preserved)", () => {
    const assigned = applyAssignmentAction(open, {
      type: "assign",
      assigneeUserId: "u1",
    });
    expect(assigned.ok).toBe(true);
    const closed = applyAssignmentAction(
      (assigned as { ok: true; next: AssignmentState }).next,
      { type: "close" },
    );
    expect(closed).toEqual({
      ok: true,
      next: { status: "closed", assigneeUserId: "u1" },
    });
    const reopened = applyAssignmentAction(
      (closed as { ok: true; next: AssignmentState }).next,
      { type: "reopen" },
    );
    expect(reopened).toEqual({
      ok: true,
      next: { status: "assigned", assigneeUserId: "u1" },
    });
  });

  it("reopen of an unassigned closed thread goes to open", () => {
    const closed: AssignmentState = { status: "closed", assigneeUserId: null };
    const r = applyAssignmentAction(closed, { type: "reopen" });
    expect(r).toEqual({ ok: true, next: { status: "open", assigneeUserId: null } });
  });

  it("rejects invalid transitions", () => {
    // reopen a non-closed thread
    expect(applyAssignmentAction(open, { type: "reopen" })).toEqual({
      ok: false,
      reason: "invalid_transition",
    });
    // close an already-closed thread
    const closed: AssignmentState = { status: "closed", assigneeUserId: "u1" };
    expect(applyAssignmentAction(closed, { type: "close" })).toEqual({
      ok: false,
      reason: "invalid_transition",
    });
  });

  it("unassign returns to open", () => {
    const assigned: AssignmentState = { status: "assigned", assigneeUserId: "u1" };
    expect(applyAssignmentAction(assigned, { type: "unassign" })).toEqual({
      ok: true,
      next: { status: "open", assigneeUserId: null },
    });
  });
});

describe("assignmentEventKind", () => {
  it("maps actions to audit kinds", () => {
    expect(assignmentEventKind({ type: "assign", assigneeUserId: "u" })).toBe("assigned");
    expect(assignmentEventKind({ type: "unassign" })).toBe("unassigned");
    expect(assignmentEventKind({ type: "close" })).toBe("closed");
    expect(assignmentEventKind({ type: "reopen" })).toBe("reopened");
  });
});

describe("isStaleUpdate", () => {
  const t1 = new Date("2025-06-15T10:00:00Z");
  const t2 = new Date("2025-06-15T10:00:05Z");

  it("conflict when the row changed since the caller's snapshot", () => {
    expect(isStaleUpdate(t2, t1)).toBe(true);
  });

  it("no conflict when timestamps match", () => {
    expect(isStaleUpdate(t1, t1)).toBe(false);
  });

  it("no conflict when the caller opted out (no expected timestamp)", () => {
    expect(isStaleUpdate(t2, undefined)).toBe(false);
  });
});
