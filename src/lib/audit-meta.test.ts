import { describe, it, expect } from "vitest";

import { sanitizeMeta, truncateSubject, SUBJECT_MAX } from "./audit-meta";

describe("truncateSubject", () => {
  it("leaves short strings intact", () => {
    expect(truncateSubject("hello")).toBe("hello");
  });
  it("truncates long strings to the cap with an ellipsis", () => {
    const long = "x".repeat(200);
    const out = truncateSubject(long);
    expect(out.length).toBe(SUBJECT_MAX);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("sanitizeMeta", () => {
  it("strips content-bearing keys", () => {
    const out = sanitizeMeta({
      threadId: "t1",
      body: "secret email body",
      bodyHtml: "<p>secret</p>",
      snippet: "preview text",
      content: "more secret",
    });
    expect(out).toEqual({ threadId: "t1" });
    expect("body" in out).toBe(false);
    expect("snippet" in out).toBe(false);
  });

  it("truncates all string values (defense in depth)", () => {
    const out = sanitizeMeta({ subject: "y".repeat(120), note: "z".repeat(120) });
    expect((out.subject as string).length).toBe(SUBJECT_MAX);
    expect((out.note as string).length).toBe(SUBJECT_MAX);
  });

  it("keeps ids, counts, booleans", () => {
    const out = sanitizeMeta({ count: 5, ok: true, targetId: "abc", nil: null });
    expect(out).toEqual({ count: 5, ok: true, targetId: "abc", nil: null });
  });

  it("recurses into nested objects and arrays, dropping content", () => {
    const out = sanitizeMeta({
      nested: { body: "x", id: "n1" },
      ids: ["a", "b"],
    });
    expect(out.nested).toEqual({ id: "n1" });
    expect(out.ids).toEqual(["a", "b"]);
  });

  it("returns {} for non-objects", () => {
    expect(sanitizeMeta(null)).toEqual({});
    expect(sanitizeMeta("string")).toEqual({});
  });
});
