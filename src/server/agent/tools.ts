import "server-only";

import { tool } from "ai";
import { z } from "zod";

import type { Prisma } from "../../../generated/prisma";
import { db } from "@/server/db";
import { getTenant } from "@/server/corsair";
import { threadPreview, threadDetail } from "@/server/gmail";
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

const METADATA_HEADERS = ["Subject", "From", "To", "Date"];

/** Inserts a pending action and returns the message the model should relay. */
async function createPending(
  userId: string,
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
      channel: "web",
      kind,
      draftPayload: payload as Prisma.InputJsonValue,
      corsairOperationPath: OPERATION_PATH[kind],
      status: "pending",
    },
  });
  const summary = summarizePendingAction(kind, payload);
  return `Drafted — awaiting the user's approval in the Pending Actions tray: ${summary}. This has NOT been done yet; tell the user to approve it.`;
}

export function buildAgentTools(userId: string) {
  const tenant = getTenant(userId);

  return {
    // ── Read-only (pass through) ──────────────────────────────────────────
    listThreads: tool({
      description: "List recent email threads. Optional Gmail search query.",
      inputSchema: z.object({
        query: z.string().optional().describe('e.g. "in:inbox", "from:bob"'),
      }),
      execute: async ({ query }) => {
        const list = await tenant.gmail.api.threads.list({
          q: query ?? "in:inbox",
          maxResults: 10,
        });
        const ids = (list.threads ?? [])
          .map((t) => t.id)
          .filter((id): id is string => typeof id === "string");
        const threads = await Promise.all(
          ids.map((id) =>
            tenant.gmail.api.threads.get({
              id,
              format: "metadata",
              metadataHeaders: METADATA_HEADERS,
            }),
          ),
        );
        return threads.map((t) => {
          const p = threadPreview(t);
          return {
            threadId: p.threadId,
            subject: p.subject,
            from: p.fromEmail,
            date: p.date,
            snippet: p.snippet,
          };
        });
      },
    }),

    getThread: tool({
      description: "Read the full messages of one email thread by id.",
      inputSchema: z.object({ threadId: z.string() }),
      execute: async ({ threadId }) => {
        const thread = await tenant.gmail.api.threads.get({
          id: threadId,
          format: "full",
        });
        const detail = threadDetail(thread);
        return {
          subject: detail.subject,
          messages: detail.messages.map((m) => ({
            from: m.fromEmail,
            date: m.date,
            text: (m.bodyText ?? m.snippet).slice(0, 2000),
          })),
        };
      },
    }),

    listEvents: tool({
      description: "List calendar events between two ISO datetimes.",
      inputSchema: z.object({
        timeMin: z.string().describe("ISO start"),
        timeMax: z.string().describe("ISO end"),
      }),
      execute: async ({ timeMin, timeMax }) => {
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
      },
    }),

    // ── Writes (wrapped → PendingAction, never executed directly) ─────────
    sendEmail: tool({
      description:
        "Draft an email to send. Creates a pending action the user must approve.",
      inputSchema: sendEmailSchema,
      execute: (args) => createPending(userId, "send_email", args),
    }),

    createEvent: tool({
      description:
        "Draft a calendar event (ISO start/end). Creates a pending action the user must approve.",
      inputSchema: createEventSchema,
      execute: (args) => createPending(userId, "create_event", args),
    }),

    deleteEvent: tool({
      description:
        "Draft deletion of a calendar event. Creates a pending action the user must approve.",
      inputSchema: deleteEventSchema,
      execute: (args) => createPending(userId, "delete_event", args),
    }),

    respondInvite: tool({
      description:
        "Draft an RSVP to a calendar invite. Creates a pending action the user must approve.",
      inputSchema: respondInviteSchema,
      execute: (args) => createPending(userId, "respond_invite", args),
    }),
  };
}
