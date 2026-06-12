import "server-only";

import { z } from "zod";

import { getTenant, getOrgTenant } from "@/server/corsair";
import { sendEmail, sendEmailSchema } from "@/server/agent/execute";
import { getMailProvider } from "@/server/mail/provider";
import { db } from "@/server/db";

/**
 * Shared draft-summary + execution logic for PendingActions, used by both the
 * web approval tray and (later) the Telegram/WhatsApp handlers so the UX copy
 * and the execution path stay identical everywhere.
 */

export { sendEmailSchema };

export const sharedReplySchema = z.object({
  sharedInboxId: z.string().min(1),
  threadId: z.string().min(1),
  to: z.array(z.email()).min(1),
  cc: z.array(z.email()).optional(),
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

export const PENDING_KINDS = [
  "send_email",
  "create_event",
  "delete_event",
  "respond_invite",
  "shared_reply",
  "slack_reply",
] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

export const OPERATION_PATH: Record<PendingKind, string> = {
  send_email: "gmail.api.messages.send",
  create_event: "googlecalendar.api.events.create",
  delete_event: "googlecalendar.api.events.delete",
  respond_invite: "googlecalendar.api.events.update",
  shared_reply: "mail.send",
  slack_reply: "slack.api.messages.post",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
}

/** Human-readable one-liner for a pending action's draft. */
export function summarizePendingAction(
  kind: string,
  payload: unknown,
): string {
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
    default:
      return "Done ✅";
  }
}

/** Executes an approved pending action against Corsair. */
export async function executePendingAction(
  userId: string,
  kind: string,
  payload: unknown,
): Promise<{ summary: string }> {
  const tenant = getTenant(userId);

  switch (kind) {
    case "send_email": {
      const res = await sendEmail(userId, payload);
      return { summary: res.summary };
    }
    case "create_event": {
      const p = createEventSchema.parse(payload);
      const tz = p.timeZone ?? "UTC";
      await tenant.googlecalendar.api.events.create({
        calendarId: p.calendarId,
        sendUpdates: p.attendees.length > 0 ? "all" : "none",
        event: {
          summary: p.summary,
          description: p.description,
          location: p.location,
          start: { dateTime: p.start, timeZone: tz },
          end: { dateTime: p.end, timeZone: tz },
          attendees: p.attendees.map((email) => ({ email })),
        },
      });
      return { summary: `Created event "${p.summary}"` };
    }
    case "delete_event": {
      const p = deleteEventSchema.parse(payload);
      await tenant.googlecalendar.api.events.delete({
        calendarId: p.calendarId,
        id: p.eventId,
        sendUpdates: "all",
      });
      return { summary: `Deleted event ${p.eventId}` };
    }
    case "respond_invite": {
      const p = respondInviteSchema.parse(payload);
      let eventId = p.eventId;
      if (!eventId && p.iCalUID) {
        const found = await tenant.googlecalendar.api.events.getMany({
          calendarId: p.calendarId,
          iCalUID: p.iCalUID,
        });
        eventId = (found.items ?? [])[0]?.id ?? undefined;
      }
      if (!eventId) throw new Error("Event not found for RSVP");

      const existing = await tenant.googlecalendar.api.events.get({
        calendarId: p.calendarId,
        id: eventId,
      });
      const attendees = (existing.attendees ?? []).map((a) =>
        a.self ? { ...a, responseStatus: p.response } : a,
      );
      await tenant.googlecalendar.api.events.update({
        calendarId: p.calendarId,
        id: eventId,
        sendUpdates: "all",
        event: {
          summary: existing.summary,
          description: existing.description,
          location: existing.location,
          start: existing.start,
          end: existing.end,
          attendees,
        },
      });
      return { summary: `RSVP "${p.response}" sent` };
    }
    case "shared_reply": {
      const p = sharedReplySchema.parse(payload);
      const inbox = await db.sharedInbox.findUnique({
        where: { id: p.sharedInboxId },
        select: { orgId: true, plugin: true },
      });
      if (!inbox) throw new Error("Shared inbox not found");
      // Verify the acting user belongs to the inbox's org before sending.
      const member = await db.membership.findUnique({
        where: { orgId_userId: { orgId: inbox.orgId, userId } },
        select: { id: true },
      });
      if (!member) throw new Error("Not a member of this organization");

      const provider = getMailProvider(
        inbox.plugin === "outlook" ? "outlook" : "gmail",
        { kind: "org", orgId: inbox.orgId },
      );
      await provider.send({
        to: p.to,
        cc: p.cc,
        subject: p.subject,
        body: p.body,
        threadId: p.threadId,
        inReplyTo: p.inReplyTo,
      });

      await db.assignmentEvent.create({
        data: {
          sharedInboxId: p.sharedInboxId,
          threadId: p.threadId,
          actorUserId: userId,
          kind: "replied",
          meta: { to: p.to },
        },
      });
      return { summary: `Replied from shared inbox to ${p.to.join(", ")}` };
    }
    case "slack_reply": {
      const p = slackReplySchema.parse(payload);
      const member = await db.membership.findUnique({
        where: { orgId_userId: { orgId: p.orgId, userId } },
        select: { id: true },
      });
      if (!member) throw new Error("Not a member of this organization");
      const orgTenant = getOrgTenant(p.orgId);
      await orgTenant.slack.api.messages.post({
        channel: p.channel,
        text: p.text,
        ...(p.threadTs ? { thread_ts: p.threadTs } : {}),
      });
      return { summary: "Slack message sent" };
    }
    default:
      throw new Error(`Unknown pending action kind: ${kind}`);
  }
}
