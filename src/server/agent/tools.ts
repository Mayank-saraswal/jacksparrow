import "server-only";

import { tool } from "ai";
import { z } from "zod";

import type { Prisma } from "../../../generated/prisma";
import { env } from "@/env";
import { db } from "@/server/db";
import { getTenant, getOrgTenant, isConnected, type TenantRef } from "@/server/corsair";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import { resolveIssueTracker } from "@/server/issues/provider";
import { availableMeetingProviders } from "@/server/meetings/provider";
import { getMembership } from "@/server/authz";
import { normalizeEvent, type RawCalEvent } from "@/server/calendar";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { resolveThreadSummary } from "@/server/summary";
import {
  ownerForContext,
  orgOwner,
  hasFeature,
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

export function buildAgentTools(
  userId: string,
  channel = "web",
  orgId: string | null = null,
) {
  const tenant = getTenant(userId);
  const ref: TenantRef = { kind: "user", userId };

  /**
   * Gate an org-level integration: requires an active org, membership, and the
   * plan capability. Returns a structured error the tool surfaces to the model.
   */
  const orgGate = async (
    feature: "crm" | "issueTracker" | "meetings",
  ): Promise<
    { ok: true; orgId: string } | { ok: false; error: Record<string, string> }
  > => {
    if (!orgId) return { ok: false, error: { error: "no-org" } };
    const member = await getMembership(orgId, userId);
    if (!member) return { ok: false, error: { error: "forbidden" } };
    if (!(await hasFeature(orgOwner(orgId), feature)))
      return { ok: false, error: { error: "upgrade-required" } };
    return { ok: true, orgId };
  };

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
        "Draft a calendar event (ISO start/end) and invite attendees (e.g. a client). Set meetingProvider to add a video link: 'meet' (Google Meet — default for Google users, link lands on the Google Calendar event and the invite is emailed to attendees), 'zoom' (needs Zoom connected), or 'teams' (needs a Microsoft/Outlook account). Call meetingAvailableProviders to see what's connected. Creates a pending action the user must approve.",
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

    // ── HubSpot (org-level CRM) ───────────────────────────────────────────
    hubspotFindContact: tool({
      description:
        "Look up a HubSpot contact by email (org CRM). Returns id, name, company, lifecycle stage.",
      inputSchema: z.object({ email: z.string().email() }),
      execute: async ({ email }) => {
        const gate = await orgGate("crm");
        if (!gate.ok) return gate.error;
        if (!(await isConnected({ kind: "org", orgId: gate.orgId }, "hubspot")))
          return { error: "not-connected", plugin: "hubspot" };
        try {
          const orgTenant = getOrgTenant(gate.orgId);
          const res = await orgTenant.hubspot.api.contacts.search({
            query: email,
            limit: 1,
            properties: ["email", "firstname", "lastname", "company", "lifecyclestage"],
          });
          const contact = (res as { results?: Record<string, unknown>[] })
            .results?.[0];
          if (!contact) return { found: false };
          return { found: true, contact };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    hubspotContactContext: tool({
      description:
        "HubSpot deal context for a contact email (org CRM): open deals (name, stage, amount, close date).",
      inputSchema: z.object({ email: z.string().email() }),
      execute: async ({ email }) => {
        const gate = await orgGate("crm");
        if (!gate.ok) return gate.error;
        if (!(await isConnected({ kind: "org", orgId: gate.orgId }, "hubspot")))
          return { error: "not-connected", plugin: "hubspot" };
        try {
          const orgTenant = getOrgTenant(gate.orgId);
          const deals = await orgTenant.hubspot.api.deals.search({
            query: email,
            limit: 10,
            properties: ["dealname", "dealstage", "amount", "closedate"],
          });
          return {
            deals:
              (deals as { results?: Record<string, unknown>[] }).results ?? [],
          };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    hubspotLogEmail: tool({
      description:
        "Log an email thread to a HubSpot contact (org CRM). Creates a pending action the user must approve.",
      inputSchema: z.object({
        contactEmail: z.string().email(),
        threadId: z.string().min(1),
        subject: z.string().default(""),
        body: z.string().default(""),
        occurredAt: z.string().datetime().optional(),
      }),
      execute: async (args) => {
        const gate = await orgGate("crm");
        if (!gate.ok) return gate.error;
        return createPending(userId, channel, "hubspot_log_email", {
          ...args,
          orgId: gate.orgId,
        });
      },
    }),

    hubspotCreateTask: tool({
      description:
        "Create a HubSpot task for a contact (org CRM). Creates a pending action the user must approve.",
      inputSchema: z.object({
        contactEmail: z.string().email(),
        title: z.string().min(1),
        dueDate: z.string().datetime().optional(),
        notes: z.string().optional(),
      }),
      execute: async (args) => {
        const gate = await orgGate("crm");
        if (!gate.ok) return gate.error;
        return createPending(userId, channel, "hubspot_create_task", {
          ...args,
          orgId: gate.orgId,
        });
      },
    }),

    // ── Notion (user-level docs) ──────────────────────────────────────────
    notionSearch: tool({
      description: "Search the user's Notion pages/databases by text.",
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(20).default(10),
      }),
      execute: async ({ query, limit }) => {
        if (!(await isConnected(ref, "notion")))
          return { error: "not-connected", plugin: "notion" };
        try {
          const res = await tenant.notion.api.pages.searchPage({
            query,
            page_size: limit,
          });
          const results =
            (res as { results?: Record<string, unknown>[] }).results ?? [];
          return { results };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    notionCreatePage: tool({
      description:
        "Create a Notion page from markdown content (e.g. an email thread). Creates a pending action the user must approve.",
      inputSchema: z.object({
        parentId: z.string().optional(),
        title: z.string().min(1),
        contentMarkdown: z.string().default(""),
      }),
      execute: async (args) => {
        if (!(await isConnected(ref, "notion")))
          return { error: "not-connected", plugin: "notion" };
        return createPending(userId, channel, "notion_create_page", args);
      },
    }),

    notionAppendBlock: tool({
      description:
        "Append markdown content to an existing Notion page. Creates a pending action the user must approve.",
      inputSchema: z.object({
        pageId: z.string().min(1),
        contentMarkdown: z.string().min(1),
      }),
      execute: async (args) => {
        if (!(await isConnected(ref, "notion")))
          return { error: "not-connected", plugin: "notion" };
        return createPending(userId, channel, "notion_append_block", args);
      },
    }),

    // ── Issue trackers (org-level Linear/Jira) ────────────────────────────
    linearListTeams: tool({
      description: "List Linear teams for the org (issue tracker).",
      inputSchema: z.object({}),
      execute: async () => {
        const gate = await orgGate("issueTracker");
        if (!gate.ok) return gate.error;
        if (!(await isConnected({ kind: "org", orgId: gate.orgId }, "linear")))
          return { error: "not-connected", plugin: "linear" };
        const resolved = await resolveIssueTracker(gate.orgId, "linear");
        if (!resolved.ok) return { error: "not-connected", plugin: "linear" };
        try {
          return { teams: await resolved.provider.listTargets() };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    jiraListProjects: tool({
      description: "List Jira projects for the org (issue tracker).",
      inputSchema: z.object({}),
      execute: async () => {
        const gate = await orgGate("issueTracker");
        if (!gate.ok) return gate.error;
        if (!(await isConnected({ kind: "org", orgId: gate.orgId }, "jira")))
          return { error: "not-connected", plugin: "jira" };
        const resolved = await resolveIssueTracker(gate.orgId, "jira");
        if (!resolved.ok) return { error: "not-connected", plugin: "jira" };
        try {
          return { projects: await resolved.provider.listTargets() };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    searchIssues: tool({
      description:
        "Search existing issues in the org's issue tracker (Linear or Jira, whichever is connected).",
      inputSchema: z.object({
        query: z.string().min(1),
        provider: z.enum(["linear", "jira"]).optional(),
      }),
      execute: async ({ query, provider }) => {
        const gate = await orgGate("issueTracker");
        if (!gate.ok) return gate.error;
        const resolved = await resolveIssueTracker(gate.orgId, provider);
        if (!resolved.ok) return { error: "not-connected", plugin: "issues" };
        try {
          return {
            provider: resolved.provider.tracker,
            issues: await resolved.provider.searchIssues(query),
          };
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) };
        }
      },
    }),

    createIssue: tool({
      description:
        "Create an issue from an email (org issue tracker). Routes to Linear or Jira based on what's connected. `target` is the Linear teamId or Jira projectKey. Creates a pending action the user must approve.",
      inputSchema: z.object({
        target: z.string().min(1),
        title: z.string().min(1),
        description: z.string().default(""),
        provider: z.enum(["linear", "jira"]).optional(),
        issueType: z.string().optional(),
        priority: z.number().int().min(0).max(4).optional(),
        assigneeId: z.string().optional(),
      }),
      execute: async (args) => {
        const gate = await orgGate("issueTracker");
        if (!gate.ok) return gate.error;
        const resolved = await resolveIssueTracker(gate.orgId, args.provider);
        if (!resolved.ok) return { error: "not-connected", plugin: "issues" };
        if (resolved.provider.tracker === "linear") {
          return createPending(userId, channel, "linear_create_issue", {
            orgId: gate.orgId,
            teamId: args.target,
            title: args.title,
            description: args.description,
            ...(args.priority !== undefined ? { priority: args.priority } : {}),
            ...(args.assigneeId ? { assigneeId: args.assigneeId } : {}),
          });
        }
        return createPending(userId, channel, "jira_create_issue", {
          orgId: gate.orgId,
          projectKey: args.target,
          issueType: args.issueType ?? "Task",
          summary: args.title,
          description: args.description,
          ...(args.assigneeId ? { assigneeId: args.assigneeId } : {}),
        });
      },
    }),

    // ── Meeting links ─────────────────────────────────────────────────────
    meetingAvailableProviders: tool({
      description:
        "Which video meeting providers (zoom/teams) are connected, for attaching a join link to a new calendar event.",
      inputSchema: z.object({}),
      execute: () => availableMeetingProviders(userId, orgId),
    }),
  };
}
