import { describe, it, expect } from "vitest";

import {
  PENDING_KINDS,
  OPERATION_PATH,
  summarizePendingAction,
  confirmationCopy,
  aggregateBulkResults,
  summarizeBulkResult,
  bulkArchiveSchema,
  bulkLabelSchema,
  snoozeThreadSchema,
  scheduleSendSchema,
} from "./pending-kinds";

describe("pending kind registry", () => {
  it("has an OPERATION_PATH for every kind (exhaustive)", () => {
    for (const kind of PENDING_KINDS) {
      expect(OPERATION_PATH[kind]).toBeTruthy();
    }
  });

  it("includes the new Phase 1 write kinds", () => {
    expect(PENDING_KINDS).toEqual(
      expect.arrayContaining([
        "bulk_archive",
        "bulk_label",
        "snooze_thread",
        "schedule_send",
      ]),
    );
  });

  it("includes the Phase 2 integration write kinds", () => {
    expect(PENDING_KINDS).toEqual(
      expect.arrayContaining([
        "hubspot_log_email",
        "hubspot_create_task",
        "notion_create_page",
        "notion_append_block",
        "linear_create_issue",
        "jira_create_issue",
      ]),
    );
  });
});

describe("summarizePendingAction — Phase 2 kinds", () => {
  it("summarizes hubspot/notion/issue kinds", () => {
    expect(
      summarizePendingAction("hubspot_log_email", {
        orgId: "o",
        contactEmail: "a@x.com",
        threadId: "t",
        subject: "Hi",
        body: "b",
      }),
    ).toContain("a@x.com");
    expect(
      summarizePendingAction("notion_create_page", {
        title: "Notes",
        contentMarkdown: "# x",
      }),
    ).toContain('"Notes"');
    expect(
      summarizePendingAction("linear_create_issue", {
        orgId: "o",
        teamId: "tm",
        title: "Bug",
        description: "",
      }),
    ).toContain("Linear issue");
    expect(
      summarizePendingAction("jira_create_issue", {
        orgId: "o",
        projectKey: "ENG",
        issueType: "Bug",
        summary: "Crash",
        description: "",
      }),
    ).toContain("ENG");
  });

  it("provides confirmation copy for Phase 2 kinds", () => {
    expect(confirmationCopy("hubspot_log_email")).toContain("HubSpot");
    expect(confirmationCopy("notion_create_page")).toContain("Notion");
    expect(confirmationCopy("linear_create_issue")).toContain("Linear");
    expect(confirmationCopy("jira_create_issue")).toContain("Jira");
  });
});

describe("summarizePendingAction — new kinds", () => {
  it("bulk_archive pluralizes", () => {
    expect(
      summarizePendingAction("bulk_archive", { threadIds: ["a", "b", "c"] }),
    ).toBe("Archive 3 threads");
    expect(summarizePendingAction("bulk_archive", { threadIds: ["a"] })).toBe(
      "Archive 1 thread",
    );
  });

  it("bulk_label lists add/remove", () => {
    const s = summarizePendingAction("bulk_label", {
      threadIds: ["a", "b"],
      addLabels: ["Work"],
      removeLabels: ["Personal"],
    });
    expect(s).toContain("Label 2 threads");
    expect(s).toContain("+Work");
    expect(s).toContain("-Personal");
  });

  it("snooze_thread formats the time", () => {
    const iso = "2026-06-20T08:00:00.000Z";
    expect(summarizePendingAction("snooze_thread", { threadId: "t", snoozeUntil: iso })).toContain(
      "Snooze thread until",
    );
  });

  it("schedule_send mentions recipient and time", () => {
    const s = summarizePendingAction("schedule_send", {
      to: ["a@x.com"],
      subject: "Hi",
      body: "",
      sendAt: "2026-06-20T08:00:00.000Z",
    });
    expect(s).toContain("Schedule email to a@x.com");
    expect(s).toContain('"Hi"');
  });
});

describe("confirmationCopy — new kinds", () => {
  it("returns specific copy", () => {
    expect(confirmationCopy("bulk_archive")).toBe("Threads archived ✅");
    expect(confirmationCopy("bulk_label")).toBe("Labels updated ✅");
    expect(confirmationCopy("snooze_thread")).toBe("Snoozed ✅");
    expect(confirmationCopy("schedule_send")).toBe("Email scheduled ✅");
  });
});

describe("schema validation", () => {
  it("bulk schemas cap at 100 ids", () => {
    const ids = Array.from({ length: 101 }, (_, i) => `t${i}`);
    expect(bulkArchiveSchema.safeParse({ threadIds: ids }).success).toBe(false);
    expect(
      bulkArchiveSchema.safeParse({ threadIds: ids.slice(0, 100) }).success,
    ).toBe(true);
  });

  it("bulkLabel requires at least one of add/remove", () => {
    expect(
      bulkLabelSchema.safeParse({ threadIds: ["a"] }).success,
    ).toBe(false);
    expect(
      bulkLabelSchema.safeParse({ threadIds: ["a"], addLabels: ["X"] }).success,
    ).toBe(true);
    expect(
      bulkLabelSchema.safeParse({ threadIds: ["a"], removeLabels: ["Y"] })
        .success,
    ).toBe(true);
  });

  it("snoozeThread requires a datetime", () => {
    expect(
      snoozeThreadSchema.safeParse({ threadId: "t", snoozeUntil: "nope" })
        .success,
    ).toBe(false);
    expect(
      snoozeThreadSchema.safeParse({
        threadId: "t",
        snoozeUntil: "2026-06-20T08:00:00.000Z",
      }).success,
    ).toBe(true);
  });

  it("scheduleSend requires recipients and sendAt", () => {
    expect(
      scheduleSendSchema.safeParse({ to: [], sendAt: "2026-06-20T08:00:00.000Z" })
        .success,
    ).toBe(false);
    expect(
      scheduleSendSchema.safeParse({
        to: ["a@x.com"],
        sendAt: "2026-06-20T08:00:00.000Z",
      }).success,
    ).toBe(true);
  });
});

describe("aggregateBulkResults", () => {
  it("counts successes and collects failures without aborting", () => {
    const result = aggregateBulkResults([
      { id: "a", ok: true },
      { id: "b", ok: false, error: "boom" },
      { id: "c", ok: true },
      { id: "d", ok: false },
    ]);
    expect(result.succeeded).toBe(2);
    expect(result.failed).toEqual([
      { id: "b", error: "boom" },
      { id: "d", error: "unknown" },
    ]);
  });

  it("summarizes with and without failures", () => {
    expect(
      summarizeBulkResult("Archived", { succeeded: 3, failed: [] }),
    ).toBe("Archived: 3 succeeded");
    expect(
      summarizeBulkResult("Archived", {
        succeeded: 2,
        failed: [{ id: "x", error: "e" }],
      }),
    ).toBe("Archived: 2 succeeded, 1 failed");
  });
});
