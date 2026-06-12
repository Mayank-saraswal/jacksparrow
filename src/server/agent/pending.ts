import "server-only";

import { z } from "zod";

import { getTenant } from "@/server/corsair";
import { buildRawMessage } from "@/server/gmail";

/**
 * Shared draft-summary + execution logic for PendingActions, used by both the
 * web approval tray and (later) the Telegram/WhatsApp handlers so the UX copy
 * and the execution path stay identical everywhere.
 */

export const sendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1),
  cc: z.array(z.string().email()).optional(),
  subject: z.string().default(""),
  body: z.string().default(""),
  threadId: z.string().optional(),
  inReplyTo: z.string().optional(),
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
] as const;
export type PendingKind = (typeof PENDING_KINDS)[number];

export const OPERATION_PATH: Record<PendingKind, string> = {
  send_email: "gmail.api.messages.send",
  create_event: "googlecalendar.api.events.create",
  delete_event: "googlecalendar.api.events.delete",
  respond_invite: "googlecalendar.api.events.update",
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
    default:
      return `Unknown action: ${kind}`;
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
      const p = sendEmailSchema.parse(payload);
      const raw = buildRawMessage({
        to: p.to,
        cc: p.cc,
        subject: p.subject,
        body: p.body,
        inReplyTo: p.inReplyTo,
      });
      await tenant.gmail.api.messages.send({ raw, threadId: p.threadId });
      return { summary: `Sent email to ${p.to.join(", ")}` };
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
    default:
      throw new Error(`Unknown pending action kind: ${kind}`);
  }
}
