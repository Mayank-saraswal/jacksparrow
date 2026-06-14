import "server-only";

import { tool } from "ai";
import { z } from "zod";

import type { Prisma } from "../../../generated/prisma";
import { db } from "@/server/db";
import { getTenant, type TenantRef } from "@/server/corsair";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import { normalizeEvent, type RawCalEvent } from "@/server/calendar";
import {
  OPERATION_PATH,
  summarizePendingAction,
  sendEmailSchema,
  createEventSchema,
  deleteEventSchema,
  respondInviteSchema,
  type PendingKind,
} from "./pending";

/** Inserts a pending action and returns the message the model should relay. */
async function createPending(
  userId: string,
  channel: string,
  kind: PendingKind,
  payload: Record<string, unknown>,
): Promise<string> {
  await db.user.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  });
  await db.pendingAction.create({
    data: {
      userId,
      channel,
      kind,
      draftPayload: payload as Prisma.InputJsonValue,
      corsairOperationPath: OPERATION_PATH[kind],
      status: "pending",
    },
  });
  const summary = summarizePendingAction(kind, payload);
  return `Drafted — awaiting the user's approval: ${summary}. This has NOT been done yet; tell the user to approve it.`;
}

export function buildAgentTools(userId: string, channel = "web") {
  const tenant = getTenant(userId);
  const ref: TenantRef = { kind: "user", userId };

  return {
    // ── Read-only (pass through) ──────────────────────────────────────────
    listThreads: tool({
      description: "List recent email threads. Optional Gmail search query.",
      inputSchema: z.object({
        query: z.string().optional().describe('e.g. "in:inbox", "from:bob"'),
      }),
      execute: async ({ query }) => {
        try {
          const provider = getMailProvider(await resolveMailPlugin(ref), ref);
          const items = await provider.listThreads(query ?? "in:inbox", 10);
          return items.map((i) => ({
            threadId: i.threadId,
            subject: i.subject,
            from: i.from,
            date: i.date,
            snippet: i.snippet,
          }));
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    getThread: tool({
      description: "Read the full messages of one email thread by id.",
      inputSchema: z.object({ threadId: z.string() }),
      execute: async ({ threadId }) => {
        try {
          const provider = getMailProvider(await resolveMailPlugin(ref), ref);
          const detail = await provider.getThreadDetail(threadId);
          return {
            subject: detail.subject,
            messages: detail.messages.map((m) => ({
              from: m.fromEmail,
              date: m.date,
              text: (m.bodyText ?? m.snippet).slice(0, 2000),
            })),
          };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    listEvents: tool({
      description: "List calendar events between two ISO datetimes.",
      inputSchema: z.object({
        timeMin: z.string().describe("ISO start"),
        timeMax: z.string().describe("ISO end"),
      }),
      execute: async ({ timeMin, timeMax }) => {
        try {
          const res = await tenant.googlecalendar.api.events.getMany({
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 50,
          });
          const items = (res.items ?? []) as unknown as RawCalEvent[];
          return items.map(normalizeEvent).map((e) => ({
            eventId: e.id,
            title: e.title,
            start: e.start,
            end: e.end,
            attendees: e.attendees.map((a) => a.email).filter(Boolean),
          }));
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    // ── Writes (wrapped → PendingAction, never executed directly) ─────────
    sendEmail: tool({
      description:
        "Draft an email to send. Creates a pending action the user must approve.",
      inputSchema: sendEmailSchema,
      execute: (args) => createPending(userId, channel, "send_email", args),
    }),

    createEvent: tool({
      description:
        "Draft a calendar event (ISO start/end). Creates a pending action the user must approve.",
      inputSchema: createEventSchema,
      execute: (args) => createPending(userId, channel, "create_event", args),
    }),

    deleteEvent: tool({
      description:
        "Draft deletion of a calendar event. Creates a pending action the user must approve.",
      inputSchema: deleteEventSchema,
      execute: (args) => createPending(userId, channel, "delete_event", args),
    }),

    respondInvite: tool({
      description:
        "Draft an RSVP to a calendar invite. Creates a pending action the user must approve.",
      inputSchema: respondInviteSchema,
      execute: (args) => createPending(userId, channel, "respond_invite", args),
    }),
  };
}
