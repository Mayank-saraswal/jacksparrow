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
