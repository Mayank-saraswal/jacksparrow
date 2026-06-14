import { z } from "zod";

/**
 * Pure, dependency-free definitions for agent PendingActions: the kind union,
 * zod payload schemas, human-readable draft summaries, confirmation copy, and
 * bulk-result aggregation. The server executor (`src/server/agent/pending.ts`)
 * imports these and adds the only side-effectful piece (executePendingAction).
 *
 * Keeping this pure means every copy/validation branch is unit-testable without
 * the `server-only` guard.
 */

// ── Payload schemas ───────────────────────────────────────────────────────────
export const sendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().default(""),
  body: z.string().default(""),
  html: z.string().optional(),
  threadId: z.string().optional(),
  inReplyTo: z.string().optional(),
  references: z.string().optional(),
});
export type SendEmailInput = z.infer<typeof sendEmailSchema>;

export const sharedReplySchema = z.object({
  sharedInboxId: z.string().min(1),
  threadId: z.string().min(1),
  to: z.array(z.string().email()).min(1),
  cc: z.array(z.string().email()).optional(),
  subject: z.string().default(""),
  body: z.string().default(""),
  inReplyTo: z.string().optional(),
});

export const slackReplySchema = z.object({
  orgId: z.string().min(1),
  channel: z.string().min(1),
  text: z.string().min(1),
  threadTs: z.string().optional(),
});

export const createEventSchema = z.object({
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  start: z.string(),
  end: z.string(),
  timeZone: z.string().optional(),
  attendees: z.array(z.string().email()).default([]),
  calendarId: z.string().default("primary"),
  // Phase 2: attach a video meeting created via Zoom/Teams/Meet before the event.
  meetingProvider: z.enum(["none", "zoom", "teams", "meet"]).default("none"),
});

export const deleteEventSchema = z.object({
  eventId: z.string(),
  calendarId: z.string().default("primary"),
});

export const respondInviteSchema = z.object({
  eventId: z.string().optional(),
  iCalUID: z.string().optional(),
  response: z.enum(["accepted", "declined", "tentative"]),
  calendarId: z.string().default("primary"),
});

// ── Phase 1 — new write kinds ─────────────────────────────────────────────────
export const bulkArchiveSchema = z.object({
  threadIds: z.array(z.string().min(1)).min(1).max(100),
});

export const bulkLabelSchema = z
  .object({
    threadIds: z.array(z.string().min(1)).min(1).max(100),
    addLabels: z.array(z.string().min(1)).optional(),
    removeLabels: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (v) => (v.addLabels?.length ?? 0) + (v.removeLabels?.length ?? 0) > 0,
    { message: "Provide at least one label to add or remove" },
  );

export const snoozeThreadSchema = z.object({
  threadId: z.string().min(1),
  snoozeUntil: z.string().datetime(),
});

export const scheduleSendSchema = sendEmailSchema.extend({
  sendAt: z.string().datetime(),
});

// ── Phase 2 — integration write kinds ─────────────────────────────────────────
export const hubspotLogEmailSchema = z.object({
  orgId: z.string().min(1),
  contactEmail: z.string().email(),
  threadId: z.string().min(1),
  subject: z.string().default(""),
  body: z.string().default(""),
  occurredAt: z.string().datetime().optional(),
});

export const hubspotCreateTaskSchema = z.object({
  orgId: z.string().min(1),
  contactEmail: z.string().email(),
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const notionCreatePageSchema = z.object({
  parentId: z.string().optional(),
  title: z.string().min(1),
  contentMarkdown: z.string().default(""),
});

export const notionAppendBlockSchema = z.object({
  pageId: z.string().min(1),
  contentMarkdown: z.string().min(1),
});

export const linearCreateIssueSchema = z.object({
  orgId: z.string().min(1),
  teamId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  priority: z.number().int().min(0).max(4).optional(),
  assigneeId: z.string().optional(),
});

export const jiraCreateIssueSchema = z.object({
  orgId: z.string().min(1),
  projectKey: z.string().min(1),
  issueType: z.string().default("Task"),
  summary: z.string().min(1),
  description: z.string().default(""),
  assigneeId: z.string().optional(),
});

// ── Kind registry ─────────────────────────────────────────────────────────────
export const PENDING_KINDS = [
  "send_email",
  "create_event",
  "delete_event",
  "respond_invite",
  "shared_reply",
  "slack_reply",
  "bulk_archive",
  "bulk_label",
  "snooze_thread",
  "schedule_send",
  "hubspot_log_email",
  "hubspot_create_task",
  "notion_create_page",
  "notion_append_block",
  "linear_create_issue",
  "jira_create_issue",
] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

export const OPERATION_PATH: Record<PendingKind, string> = {
  send_email: "gmail.api.messages.send",
  create_event: "googlecalendar.api.events.create",
  delete_event: "googlecalendar.api.events.delete",
  respond_invite: "googlecalendar.api.events.update",
  shared_reply: "mail.send",
  slack_reply: "slack.api.messages.post",
  bulk_archive: "mail.archive",
  bulk_label: "mail.modifyLabels",
  snooze_thread: "mail.archive",
  schedule_send: "mail.scheduleSend",
  hubspot_log_email: "hubspot.api.engagements.create",
  hubspot_create_task: "hubspot.api.engagements.create",
  notion_create_page: "notion.api.pages.createPage",
  notion_append_block: "notion.api.blocks.appendBlock",
  linear_create_issue: "linear.api.issues.create",
  jira_create_issue: "jira.api.issues.create",
};

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
}

/** Human-readable one-liner for a pending action's draft. */
export function summarizePendingAction(kind: string, payload: unknown): string {
  switch (kind) {
    case "send_email": {
      const p = sendEmailSchema.parse(payload);
      const preview = p.subject || p.body.slice(0, 50);
      return `Send email to ${p.to.join(", ")}: "${preview}"`;
    }
    case "create_event": {
      const p = createEventSchema.parse(payload);
      const who = p.attendees.length ? ` with ${p.attendees.join(", ")}` : "";
      return `Create event "${p.summary}" at ${fmtTime(p.start)}${who}`;
    }
    case "delete_event": {
      const p = deleteEventSchema.parse(payload);
      return `Delete event ${p.eventId}`;
    }
    case "respond_invite": {
      const p = respondInviteSchema.parse(payload);
      return `RSVP "${p.response}" to the invite`;
    }
    case "shared_reply": {
      const p = sharedReplySchema.parse(payload);
      const preview = p.subject || p.body.slice(0, 50);
      return `Reply from shared inbox to ${p.to.join(", ")}: "${preview}"`;
    }
    case "slack_reply": {
      const p = slackReplySchema.parse(payload);
      return `Send Slack message: "${p.text.slice(0, 60)}"`;
    }
    case "bulk_archive": {
      const p = bulkArchiveSchema.parse(payload);
      return `Archive ${p.threadIds.length} thread${p.threadIds.length === 1 ? "" : "s"}`;
    }
    case "bulk_label": {
      const p = bulkLabelSchema.parse(payload);
      const add = p.addLabels?.length ? ` +${p.addLabels.join(", ")}` : "";
      const remove = p.removeLabels?.length
        ? ` -${p.removeLabels.join(", ")}`
        : "";
      return `Label ${p.threadIds.length} thread${p.threadIds.length === 1 ? "" : "s"}:${add}${remove}`;
    }
    case "snooze_thread": {
      const p = snoozeThreadSchema.parse(payload);
      return `Snooze thread until ${fmtTime(p.snoozeUntil)}`;
    }
    case "schedule_send": {
      const p = scheduleSendSchema.parse(payload);
      const preview = p.subject || p.body.slice(0, 50);
      return `Schedule email to ${p.to.join(", ")} at ${fmtTime(p.sendAt)}: "${preview}"`;
    }
    case "hubspot_log_email": {
      const p = hubspotLogEmailSchema.parse(payload);
      return `Log email to HubSpot contact ${p.contactEmail}`;
    }
    case "hubspot_create_task": {
      const p = hubspotCreateTaskSchema.parse(payload);
      return `Create HubSpot task "${p.title}" for ${p.contactEmail}`;
    }
    case "notion_create_page": {
      const p = notionCreatePageSchema.parse(payload);
      return `Create Notion page "${p.title}"`;
    }
    case "notion_append_block": {
      const p = notionAppendBlockSchema.parse(payload);
      return `Append to Notion page ${p.pageId}`;
    }
    case "linear_create_issue": {
      const p = linearCreateIssueSchema.parse(payload);
      return `Create Linear issue "${p.title}"`;
    }
    case "jira_create_issue": {
      const p = jiraCreateIssueSchema.parse(payload);
      return `Create Jira ${p.issueType} "${p.summary}" in ${p.projectKey}`;
    }
    default:
      return `Unknown action: ${kind}`;
  }
}

/** Confirmation copy shown after an action executes (web tray + channels). */
export function confirmationCopy(kind: string): string {
  switch (kind) {
    case "send_email":
      return "Sent ✅";
    case "create_event":
      return "Event created ✅";
    case "delete_event":
      return "Event deleted ✅";
    case "respond_invite":
      return "RSVP sent ✅";
    case "shared_reply":
      return "Reply sent ✅";
    case "slack_reply":
      return "Slack message sent ✅";
    case "bulk_archive":
      return "Threads archived ✅";
    case "bulk_label":
      return "Labels updated ✅";
    case "snooze_thread":
      return "Snoozed ✅";
    case "schedule_send":
      return "Email scheduled ✅";
    case "hubspot_log_email":
      return "Logged to HubSpot ✅";
    case "hubspot_create_task":
      return "HubSpot task created ✅";
    case "notion_create_page":
      return "Notion page created ✅";
    case "notion_append_block":
      return "Added to Notion ✅";
    case "linear_create_issue":
      return "Linear issue created ✅";
    case "jira_create_issue":
      return "Jira issue created ✅";
    default:
      return "Done ✅";
  }
}

// ── Bulk-result aggregation (pure) ─────────────────────────────────────────────
export interface BulkOutcome {
  id: string;
  ok: boolean;
  error?: string;
}

export interface BulkResult {
  succeeded: number;
  failed: { id: string; error: string }[];
}

/** Collapse per-item outcomes into a success count + failure list. */
export function aggregateBulkResults(outcomes: BulkOutcome[]): BulkResult {
  const failed = outcomes
    .filter((o) => !o.ok)
    .map((o) => ({ id: o.id, error: o.error ?? "unknown" }));
  return { succeeded: outcomes.length - failed.length, failed };
}

/** One-line summary of a completed bulk operation. */
export function summarizeBulkResult(action: string, result: BulkResult): string {
  const base = `${action}: ${result.succeeded} succeeded`;
  return result.failed.length > 0
    ? `${base}, ${result.failed.length} failed`
    : base;
}
