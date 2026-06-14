import "server-only";

import { getTenant, getOrgTenant } from "@/server/corsair";
import { sendEmail } from "@/server/agent/execute";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import { resolveIssueTracker } from "@/server/issues/provider";
import {
  resolveZoomMeeting,
  resolveTeamsMeeting,
} from "@/server/meetings/provider";
import { injectMeetingIntoDescription } from "@/lib/meeting-link";
import { createGoogleCalendarEvent } from "@/server/calendar/google-event";
import { hasFeature, orgOwner } from "@/server/billing/entitlements";
import { audit } from "@/server/audit";
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
  hubspotLogEmailSchema,
  hubspotCreateTaskSchema,
  notionCreatePageSchema,
  notionAppendBlockSchema,
  linearCreateIssueSchema,
  jiraCreateIssueSchema,
  PENDING_KINDS,
  OPERATION_PATH,
  summarizePendingAction,
  confirmationCopy,
  aggregateBulkResults,
  summarizeBulkResult,
  type BulkOutcome,
  type PendingKind,
} from "@/lib/pending-kinds";
import { markdownToBlocks } from "@/lib/notion-markdown";

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
  hubspotLogEmailSchema,
  hubspotCreateTaskSchema,
  notionCreatePageSchema,
  notionAppendBlockSchema,
  linearCreateIssueSchema,
  jiraCreateIssueSchema,
  PENDING_KINDS,
  OPERATION_PATH,
  summarizePendingAction,
  confirmationCopy,
  type PendingKind,
};

/** Verifies the actor may perform an org-level integration write. */
async function assertOrgWriteAllowed(
  userId: string,
  orgId: string,
  feature: "crm" | "issueTracker" | "meetings",
): Promise<void> {
  const member = await db.membership.findUnique({
    where: { orgId_userId: { orgId, userId } },
    select: { id: true },
  });
  if (!member) throw new Error("Not a member of this organization");
  const allowed = await hasFeature(orgOwner(orgId), feature);
  if (!allowed) throw new Error("Your plan does not include this integration");
}

interface HubspotSearchResponse {
  results?: { id?: string | number }[];
}

/** First HubSpot object id from a search response, as a number, or null. */
function firstHubspotId(res: unknown): number | null {
  const results = (res as HubspotSearchResponse).results ?? [];
  const raw = results[0]?.id;
  if (raw == null) return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isNaN(n) ? null : n;
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

      // Google Meet: created natively on the Google Calendar event via the
      // Calendar API (conferenceData) — link lands on the event, the invite is
      // sent to attendees, and everyone's calendar updates. Works for any
      // Google/Gmail user with no extra integration.
      if (p.meetingProvider === "meet") {
        const result = await createGoogleCalendarEvent(userId, {
          calendarId: p.calendarId,
          summary: p.summary,
          description: p.description,
          location: p.location,
          startDateTime: p.start,
          endDateTime: p.end,
          timeZone: tz,
          attendees: p.attendees,
          withMeet: true,
        });
        const link = result.meetLink ? " with Google Meet link" : "";
        return { summary: `Created event "${p.summary}"${link}` };
      }

      // Teams: the meeting is intrinsic to a Microsoft calendar event, so we
      // create it natively in Outlook (Graph auto-provisions the Teams link).
      if (p.meetingProvider === "teams") {
        const resolved = await resolveTeamsMeeting(userId);
        if (!resolved.ok) {
          throw new Error(
            "Connect your Microsoft (Outlook) account to create Teams meetings",
          );
        }
        const result = await resolved.createEvent({
          subject: p.summary,
          body: p.description,
          location: p.location,
          startIso: p.start,
          endIso: p.end,
          timeZone: tz,
          attendees: p.attendees,
        });
        const link = result.joinUrl ? " with Teams link" : "";
        return { summary: `Created event "${p.summary}"${link}` };
      }

      // Zoom: create a standalone meeting first (so a failure aborts before the
      // event), then embed its join link into the Google calendar event.
      let description = p.description;
      if (p.meetingProvider === "zoom") {
        const resolved = await resolveZoomMeeting(userId);
        if (!resolved.ok) throw new Error("zoom is not connected");
        const durationMinutes =
          Math.round(
            (new Date(p.end).getTime() - new Date(p.start).getTime()) / 60000,
          ) || 30;
        const meeting = await resolved.create({
          topic: p.summary,
          startTime: p.start,
          durationMinutes: Math.max(15, durationMinutes),
        });
        description = injectMeetingIntoDescription(description, meeting);
      }

      await tenant.googlecalendar.api.events.create({
        calendarId: p.calendarId,
        sendUpdates: p.attendees.length > 0 ? "all" : "none",
        event: {
          summary: p.summary,
          description,
          location: p.location,
          start: { dateTime: p.start, timeZone: tz },
          end: { dateTime: p.end, timeZone: tz },
          attendees: p.attendees.map((email) => ({ email })),
        },
      });
      const suffix =
        p.meetingProvider === "zoom" ? " with zoom link" : "";
      return { summary: `Created event "${p.summary}"${suffix}` };
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
    case "hubspot_log_email": {
      const p = hubspotLogEmailSchema.parse(payload);
      await assertOrgWriteAllowed(userId, p.orgId, "crm");
      const orgTenant = getOrgTenant(p.orgId);
      const found = await orgTenant.hubspot.api.contacts.search({
        query: p.contactEmail,
        limit: 1,
        properties: ["email", "firstname", "lastname"],
      });
      const contactId = firstHubspotId(found);
      const ts = p.occurredAt ? new Date(p.occurredAt).getTime() : Date.now();
      await orgTenant.hubspot.api.engagements.create({
        engagement: { type: "NOTE", timestamp: ts, active: true },
        associations: contactId ? { contactIds: [contactId] } : {},
        metadata: { body: `${p.subject}\n\n${p.body}`.slice(0, 65000) },
      });
      audit({ userId, orgId: p.orgId, actorType: "agent" }, "integration.crm_logged", {
        targetType: "hubspot_contact",
        targetId: p.contactEmail,
        meta: { threadId: p.threadId },
      });
      return { summary: `Logged email to HubSpot contact ${p.contactEmail}` };
    }
    case "hubspot_create_task": {
      const p = hubspotCreateTaskSchema.parse(payload);
      await assertOrgWriteAllowed(userId, p.orgId, "crm");
      const orgTenant = getOrgTenant(p.orgId);
      const found = await orgTenant.hubspot.api.contacts.search({
        query: p.contactEmail,
        limit: 1,
        properties: ["email"],
      });
      const contactId = firstHubspotId(found);
      const ts = p.dueDate ? new Date(p.dueDate).getTime() : Date.now();
      await orgTenant.hubspot.api.engagements.create({
        engagement: { type: "TASK", timestamp: ts, active: true },
        associations: contactId ? { contactIds: [contactId] } : {},
        metadata: {
          subject: p.title,
          body: p.notes ?? "",
          status: "NOT_STARTED",
        },
      });
      audit({ userId, orgId: p.orgId, actorType: "agent" }, "integration.task_created", {
        targetType: "hubspot_contact",
        targetId: p.contactEmail,
      });
      return { summary: `Created HubSpot task "${p.title}"` };
    }
    case "notion_create_page": {
      const p = notionCreatePageSchema.parse(payload);
      const userTenant = getTenant(userId);
      const children = markdownToBlocks(p.contentMarkdown);
      const parent = p.parentId
        ? { type: "page_id" as const, page_id: p.parentId }
        : { type: "workspace" as const, workspace: true };
      const arg = {
        parent,
        properties: {
          title: { title: [{ text: { content: p.title } }] },
        },
        children,
      };
      const res = (await userTenant.notion.api.pages.createPage(
        arg as unknown as Parameters<
          typeof userTenant.notion.api.pages.createPage
        >[0],
      )) as { id?: string; url?: string };
      return {
        summary: `Created Notion page "${p.title}"${res.url ? ` — ${res.url}` : ""}`,
      };
    }
    case "notion_append_block": {
      const p = notionAppendBlockSchema.parse(payload);
      const userTenant = getTenant(userId);
      const children = markdownToBlocks(p.contentMarkdown);
      const arg = { block_id: p.pageId, children };
      await userTenant.notion.api.blocks.appendBlock(
        arg as unknown as Parameters<
          typeof userTenant.notion.api.blocks.appendBlock
        >[0],
      );
      return { summary: `Appended content to Notion page ${p.pageId}` };
    }
    case "linear_create_issue": {
      const p = linearCreateIssueSchema.parse(payload);
      await assertOrgWriteAllowed(userId, p.orgId, "issueTracker");
      const resolved = await resolveIssueTracker(p.orgId, "linear");
      if (!resolved.ok) throw new Error("Linear is not connected");
      const created = await resolved.provider.createIssue({
        target: p.teamId,
        title: p.title,
        description: p.description,
        priority: p.priority,
        assigneeId: p.assigneeId,
      });
      audit({ userId, orgId: p.orgId, actorType: "agent" }, "integration.issue_created", {
        targetType: "linear_issue",
        targetId: created.identifier ?? created.id,
      });
      return {
        summary: `Created Linear issue "${p.title}"${
          created.identifier ? ` (${created.identifier})` : ""
        }`,
      };
    }
    case "jira_create_issue": {
      const p = jiraCreateIssueSchema.parse(payload);
      await assertOrgWriteAllowed(userId, p.orgId, "issueTracker");
      const resolved = await resolveIssueTracker(p.orgId, "jira");
      if (!resolved.ok) throw new Error("Jira is not connected");
      const created = await resolved.provider.createIssue({
        target: p.projectKey,
        title: p.summary,
        description: p.description,
        issueType: p.issueType,
        assigneeId: p.assigneeId,
      });
      audit({ userId, orgId: p.orgId, actorType: "agent" }, "integration.issue_created", {
        targetType: "jira_issue",
        targetId: created.identifier ?? created.id,
      });
      return {
        summary: `Created Jira issue "${p.summary}"${
          created.identifier ? ` (${created.identifier})` : ""
        }`,
      };
    }
    default:
      throw new Error(`Unknown pending action kind: ${kind}`);
  }
}
