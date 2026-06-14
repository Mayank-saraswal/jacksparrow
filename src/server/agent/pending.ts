import "server-only";

import { getTenant, getOrgTenant } from "@/server/corsair";
import { sendEmail } from "@/server/agent/execute";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import { inngest } from "@/inngest/client";
import { db } from "@/server/db";
import {
  sendEmailSchema,
  sharedReplySchema,
  slackReplySchema,
  createEventSchema,
  deleteEventSchema,
  respondInviteSchema,
  bulkArchiveSchema,
  bulkLabelSchema,
  snoozeThreadSchema,
  scheduleSendSchema,
  PENDING_KINDS,
  OPERATION_PATH,
  summarizePendingAction,
  confirmationCopy,
  aggregateBulkResults,
  summarizeBulkResult,
  type BulkOutcome,
  type PendingKind,
} from "@/lib/pending-kinds";

/**
 * Server-side execution for PendingActions. The pure pieces (schemas, kind
 * registry, draft summaries, confirmation copy, bulk aggregation) live in
 * `@/lib/pending-kinds`; this module adds only the side-effectful executor used
 * by the web approval tray and the Telegram/WhatsApp handlers — keeping copy +
 * execution identical everywhere.
 */

export {
  sendEmailSchema,
  sharedReplySchema,
  slackReplySchema,
  createEventSchema,
  deleteEventSchema,
  respondInviteSchema,
  bulkArchiveSchema,
  bulkLabelSchema,
  snoozeThreadSchema,
  scheduleSendSchema,
  PENDING_KINDS,
  OPERATION_PATH,
  summarizePendingAction,
  confirmationCopy,
  type PendingKind,
};

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
    case "bulk_archive": {
      const p = bulkArchiveSchema.parse(payload);
      const ref = { kind: "user", userId } as const;
      const provider = getMailProvider(await resolveMailPlugin(ref), ref);
      const outcomes: BulkOutcome[] = [];
      for (const id of p.threadIds) {
        try {
          await provider.archive(id);
          outcomes.push({ id, ok: true });
        } catch (err) {
          outcomes.push({
            id,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
      const result = aggregateBulkResults(outcomes);
      return { summary: summarizeBulkResult("Archived", result) };
    }
    case "bulk_label": {
      const p = bulkLabelSchema.parse(payload);
      const ref = { kind: "user", userId } as const;
      const provider = getMailProvider(await resolveMailPlugin(ref), ref);
      const add = p.addLabels ?? [];
      const remove = p.removeLabels ?? [];
      const outcomes: BulkOutcome[] = [];
      for (const id of p.threadIds) {
        try {
          await provider.modifyLabels(id, add, remove);
          outcomes.push({ id, ok: true });
        } catch (err) {
          outcomes.push({
            id,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
      const result = aggregateBulkResults(outcomes);
      return { summary: summarizeBulkResult("Labeled", result) };
    }
    case "snooze_thread": {
      const p = snoozeThreadSchema.parse(payload);
      const wakeAt = new Date(p.snoozeUntil);
      if (wakeAt.getTime() < Date.now() - 60_000) {
        throw new Error("Snooze time must be in the future");
      }
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      const row = await db.snoozedThread.upsert({
        where: { userId_threadId: { userId, threadId: p.threadId } },
        create: {
          userId,
          threadId: p.threadId,
          corsairEntityId: p.threadId,
          snoozeUntil: wakeAt,
          status: "snoozed",
        },
        update: { snoozeUntil: wakeAt, status: "snoozed", wokenAt: null },
      });
      const ref = { kind: "user", userId } as const;
      const provider = getMailProvider(await resolveMailPlugin(ref), ref);
      await provider.archive(p.threadId);
      await inngest.send({
        name: "thread/snooze.created",
        data: { snoozeId: row.id, userId },
      });
      return { summary: `Snoozed until ${new Date(p.snoozeUntil).toISOString()}` };
    }
    case "schedule_send": {
      const p = scheduleSendSchema.parse(payload);
      const sendAt = new Date(p.sendAt);
      if (sendAt.getTime() < Date.now() - 60_000) {
        throw new Error("Scheduled time must be in the future");
      }
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      const { sendAt: _omit, ...draft } = p;
      void _omit;
      const row = await db.scheduledEmail.create({
        data: {
          userId,
          draftPayload: draft,
          sendAt,
          status: "scheduled",
        },
      });
      await inngest.send({
        name: "email/scheduled.send",
        data: { scheduledId: row.id, userId },
      });
      return { summary: `Scheduled email to ${p.to.join(", ")}` };
    }
    default:
      throw new Error(`Unknown pending action kind: ${kind}`);
  }
}
