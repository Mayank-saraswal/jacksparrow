import { describe, it, expect } from "vitest";

import {
  encodeCursor,
  decodeCursor,
  syncItemToPreview,
  type SyncItemRow,
} from "./inbox-list";

describe("inbox-list cursor", () => {
  it("round-trips a cursor", () => {
    const ts = new Date("2026-06-13T10:00:00.000Z");
    const token = encodeCursor(ts, "row_123");
    expect(token).toBe("2026-06-13T10:00:00.000Z|row_123");
    const decoded = decodeCursor(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.timestamp.toISOString()).toBe(ts.toISOString());
    expect(decoded!.id).toBe("row_123");
  });

  it("preserves ids that contain a pipe separator", () => {
    const ts = new Date("2026-06-13T10:00:00.000Z");
    const decoded = decodeCursor(encodeCursor(ts, "a|b|c"));
    expect(decoded!.id).toBe("a|b|c");
  });

  it("returns null for malformed cursors", () => {
    expect(decodeCursor("")).toBeNull();
    expect(decodeCursor("no-separator")).toBeNull();
    expect(decodeCursor("not-a-date|id")).toBeNull();
    expect(decodeCursor("2026-06-13T10:00:00.000Z|")).toBeNull();
  });
});

describe("syncItemToPreview", () => {
  const base: SyncItemRow = {
    id: "row_1",
    corsairEntityId: "ent_1",
    threadId: "thread_1",
    title: "Quarterly review",
    snippet: "Let's sync on numbers",
    fromName: "Jane Doe",
    fromEmail: "jane@example.com",
    unread: true,
    starred: false,
    timestamp: new Date("2026-06-13T09:30:00.000Z"),
  };

  it("maps a populated row", () => {
    const p = syncItemToPreview(base, { label: "urgent", reason: "VIP" });
    expect(p).toEqual({
      threadId: "thread_1",
      subject: "Quarterly review",
      snippet: "Let's sync on numbers",
      fromName: "Jane Doe",
      fromEmail: "jane@example.com",
      date: "2026-06-13T09:30:00.000Z",
      unread: true,
      starred: false,
      labelIds: ["UNREAD"],
      messageCount: 1,
      priority: { label: "urgent", reason: "VIP" },
    });
  });

  it("falls back to entity id and empty fields when null", () => {
    const p = syncItemToPreview(
      {
        ...base,
        threadId: null,
        fromName: null,
        fromEmail: null,
        title: "",
        unread: false,
        starred: true,
      },
      null,
    );
    expect(p.threadId).toBe("ent_1");
    expect(p.subject).toBe("(no subject)");
    expect(p.fromName).toBe("");
    expect(p.fromEmail).toBe("");
    expect(p.priority).toBeNull();
    expect(p.labelIds).toEqual(["STARRED"]);
  });

  it("normalizes a null priority reason to empty string", () => {
    const p = syncItemToPreview(base, { label: "normal", reason: null });
    expect(p.priority).toEqual({ label: "normal", reason: "" });
  });
});
