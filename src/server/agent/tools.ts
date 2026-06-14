import "server-only";

import { tool } from "ai";
import { z } from "zod";

import type { Prisma } from "../../../generated/prisma";
import { env } from "@/env";
import { db } from "@/server/db";
import { getTenant, type TenantRef } from "@/server/corsair";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import { normalizeEvent, type RawCalEvent } from "@/server/calendar";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { resolveThreadSummary } from "@/server/summary";
import {
  ownerForContext,
  assertWithinLimit,
  incrementUsage,
} from "@/server/billing/entitlements";
import { computeSnoozePresets } from "@/lib/snooze-presets";
import { TRPCError } from "@trpc/server";
import {
  OPERATION_PATH,
  summarizePendingAction,
  sendEmailSchema,
  createEventSchema,
  deleteEventSchema,
  respondInviteSchema,
  bulkArchiveSchema,
  bulkLabelSchema,
  scheduleSendSchema,
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

    summarizeThread: tool({
      description:
        "Summarize one email thread (tldr, key points, action items, open questions). Use instead of getThread when the user wants the gist of a long thread.",
      inputSchema: z.object({ threadId: z.string() }),
      execute: async ({ threadId }) => {
        try {
          const provider = getMailProvider(await resolveMailPlugin(ref), ref);
          const detail = await provider.getThreadDetail(threadId);
          const resolved = await resolveThreadSummary({
            userId,
            threadId,
            detail,
            owner: ownerForContext(userId, null),
          });
          if (!resolved) return { error: "summary-unavailable" };
          return resolved.result;
        } catch (err) {
          if (err instanceof TRPCError && err.message === "limit_exceeded") {
            return { error: "limit_exceeded" };
          }
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    searchSemantic: tool({
      description:
        "Semantic (meaning-based) search over the user's indexed email. Use when the user describes what they're looking for rather than exact keywords. Returns matching threads ranked by similarity.",
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(20).default(10),
      }),
      execute: async ({ query, limit }) => {
        if (!env.OPENAI_API_KEY) return { error: "search-unavailable" };
        const owner = ownerForContext(userId, null);
        try {
          await assertWithinLimit(owner, userId, "embedding");
        } catch (err) {
          if (err instanceof TRPCError) return { error: "limit_exceeded" };
          throw err;
        }
        const vector = await embedText(query);
        if (!vector) return { error: "search-unavailable" };
        void incrementUsage(owner, userId, "embedding");
        const literal = toVectorLiteral(vector);
        const rows = await db.$queryRaw<
          { thread_id: string; subject_snippet: string; score: number }[]
        >`
          SELECT thread_id, subject_snippet,
                 1 - (embedding <=> ${literal}::vector) AS score
          FROM email_embeddings
          WHERE user_id = ${userId} AND embedding IS NOT NULL
          ORDER BY embedding <=> ${literal}::vector
          LIMIT ${limit}`;
        return rows.map((r) => ({
          threadId: r.thread_id,
          subjectSnippet: r.subject_snippet,
          score: Number(r.score),
        }));
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

    bulkArchive: tool({
      description:
        "Archive MANY threads at once (up to 100) by id. Use this instead of calling a single archive repeatedly. Creates one pending action the user must approve.",
      inputSchema: bulkArchiveSchema,
      execute: (args) => createPending(userId, channel, "bulk_archive", args),
    }),

    bulkLabel: tool({
      description:
        "Add and/or remove labels (Gmail) or categories (Outlook) on MANY threads at once (up to 100). Provide at least one label to add or remove. Creates one pending action the user must approve.",
      inputSchema: bulkLabelSchema,
      execute: (args) => createPending(userId, channel, "bulk_label", args),
    }),

    snoozeThread: tool({
      description:
        "Snooze a thread until a time. Pass either an ISO `snoozeUntil` OR a `preset` (later_today, tomorrow, this_weekend, next_week). Creates a pending action the user must approve.",
      inputSchema: z.object({
        threadId: z.string().min(1),
        snoozeUntil: z.string().datetime().optional(),
        preset: z
          .enum(["later_today", "tomorrow", "this_weekend", "next_week"])
          .optional(),
      }),
      execute: ({ threadId, snoozeUntil, preset }) => {
        let when = snoozeUntil;
        if (!when && preset) {
          const presets = computeSnoozePresets(new Date(), "UTC");
          when = presets.find((p) => p.id === preset)?.at;
        }
        if (!when) {
          return Promise.resolve(
            "Need a snoozeUntil time or a valid preset to snooze.",
          );
        }
        if (new Date(when).getTime() < Date.now() - 60_000) {
          return Promise.resolve("Snooze time must be in the future.");
        }
        return createPending(userId, channel, "snooze_thread", {
          threadId,
          snoozeUntil: when,
        });
      },
    }),

    scheduleSend: tool({
      description:
        "Draft an email to be SENT LATER at a specific ISO time (not now). Creates a pending action the user must approve; on approval it is queued, not sent immediately.",
      inputSchema: scheduleSendSchema,
      execute: (args) => {
        if (new Date(args.sendAt).getTime() < Date.now() - 60_000) {
          return Promise.resolve("Scheduled time must be in the future.");
        }
        return createPending(userId, channel, "schedule_send", args);
      },
    }),
  };
}
