// src/inngest/functions.ts
import { inngest } from "./client";
import { db } from "@/server/db";
import { getTenant, type SupportedPlugin } from "@/server/corsair";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { startGmailWatch } from "@/server/gmail-watch";
import { classifyEmail, TRIAGE_MODEL } from "@/server/triage";
import { threadPreview } from "@/server/gmail";
import { parseAddress } from "@/lib/email";
import { env } from "@/env";
import { resolveOrLink, runChannelAgent } from "@/server/channels/agent";
import { sendChannelText, sendChannelApproval } from "@/server/channels/dispatch";
import {
  summarizePendingAction,
  executePendingAction,
  confirmationCopy,
} from "@/server/agent/pending";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      const { id } = event.data as { id?: string };
      return { processed: true, id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Initial backfill
//
// Triggered by `integration/connected` (emitted from the OAuth callback). Pulls
// recent data into Corsair's local cache by calling the plugin `.api.*` list
// endpoints — Corsair upserts each response into corsair_entities. Each page is
// its own `step.run` so Inngest retries never redo a completed page.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_PAGES = 50;
const GMAIL_QUERY = "newer_than:30d";
const GMAIL_PAGE_SIZE = 100;
const CALENDAR_PAGE_SIZE = 250;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type IntegrationConnectedData = {
  clerkUserId: string;
  plugin: SupportedPlugin;
};

export const backfillIntegration = inngest.createFunction(
  {
    id: "backfill-integration",
    retries: 3,
    triggers: { event: "integration/connected" },
  },
  async ({ event, step }) => {
    const { clerkUserId, plugin } = event.data as IntegrationConnectedData;

    // Make sure a User row exists so we can record backfill timestamps.
    await step.run("ensure-user", async () => {
      await db.user.upsert({
        where: { id: clerkUserId },
        create: { id: clerkUserId },
        update: {},
      });
    });

    const tenant = getTenant(clerkUserId);

    if (plugin === "gmail") {
      let pageToken: string | undefined;
      let page = 0;
      let total = 0;

      do {
        const cursor: string | undefined = pageToken;
        const result = await step.run(`gmail-threads-page-${page}`, async () => {
          const out = await tenant.gmail.api.threads.list({
            q: GMAIL_QUERY,
            maxResults: GMAIL_PAGE_SIZE,
            pageToken: cursor,
          });
          return {
            nextPageToken: out.nextPageToken ?? null,
            count: out.threads?.length ?? 0,
          };
        });

        total += result.count;
        pageToken = result.nextPageToken ?? undefined;
        page += 1;
      } while (pageToken && page < MAX_PAGES);

      await step.run("mark-gmail-backfilled", async () => {
        await db.user.update({
          where: { id: clerkUserId },
          data: { gmailBackfilledAt: new Date() },
        });
      });

      return { plugin, pages: page, threads: total };
    }

    if (plugin === "googlecalendar") {
      const now = Date.now();
      const timeMin = new Date(now - THIRTY_DAYS_MS).toISOString();
      const timeMax = new Date(now + THIRTY_DAYS_MS).toISOString();

      let pageToken: string | undefined;
      let page = 0;
      let total = 0;

      do {
        const cursor: string | undefined = pageToken;
        const result = await step.run(
          `calendar-events-page-${page}`,
          async () => {
            const out = await tenant.googlecalendar.api.events.getMany({
              timeMin,
              timeMax,
              singleEvents: true,
              orderBy: "startTime",
              maxResults: CALENDAR_PAGE_SIZE,
              pageToken: cursor,
            });
            return {
              nextPageToken: out.nextPageToken ?? null,
              count: out.items?.length ?? 0,
            };
          },
        );

        total += result.count;
        pageToken = result.nextPageToken ?? undefined;
        page += 1;
      } while (pageToken && page < MAX_PAGES);

      await step.run("mark-calendar-backfilled", async () => {
        await db.user.update({
          where: { id: clerkUserId },
          data: { calendarBackfilledAt: new Date() },
        });
      });

      return { plugin, pages: page, events: total };
    }

    return { plugin, skipped: true };
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Realtime sync pipeline (Phase 5)
//
// Emitted from the Corsair webhook route when an entity changes. We upsert a
// lightweight sync_items row (which Supabase Realtime streams to the client)
// and, for emails, generate + store an embedding for semantic search.
// ─────────────────────────────────────────────────────────────────────────────

interface WebhookReceivedData {
  tenantId: string;
  plugin: string;
  action: string | null;
  corsairEntityId: string;
}

interface GmailEntityData {
  snippet?: string;
  threadId?: string;
  internalDate?: string | number;
  payload?: { headers?: { name?: string; value?: string }[] };
}

interface CalendarEntityData {
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
}

interface DerivedMeta {
  type: "email" | "event";
  title: string;
  snippet: string;
  sender: string;
  threadId: string;
  timestamp: Date;
}

function safeDate(value: string | number | undefined): Date {
  if (value == null) return new Date();
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? new Date() : new Date(numeric);
}

/** Best-effort: has the user previously emailed this sender? */
async function isKnownSender(
  userId: string,
  fromHeader: string,
): Promise<boolean> {
  const { email } = parseAddress(fromHeader);
  if (!email) return false;
  try {
    const tenant = getTenant(userId);
    const res = await tenant.gmail.api.messages.list({
      q: `to:${email}`,
      maxResults: 1,
    });
    return (res.messages?.length ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Scores one email thread and upserts a PriorityScore (skips manual overrides). */
async function scoreThread(args: {
  userId: string;
  threadId: string;
  corsairEntityId: string;
  subject: string;
  sender: string;
  snippet: string;
}): Promise<{ label: string } | { skipped: string }> {
  const existing = await db.priorityScore.findUnique({
    where: { userId_threadId: { userId: args.userId, threadId: args.threadId } },
    select: { model: true },
  });
  if (existing?.model === "user") return { skipped: "user-override" };

  const knownSender = await isKnownSender(args.userId, args.sender);
  const result = await classifyEmail({
    subject: args.subject,
    sender: args.sender,
    snippet: args.snippet,
    knownSender,
  });
  if (!result) return { skipped: "no-llm" };

  await db.priorityScore.upsert({
    where: { userId_threadId: { userId: args.userId, threadId: args.threadId } },
    create: {
      userId: args.userId,
      threadId: args.threadId,
      corsairEntityId: args.corsairEntityId,
      label: result.label,
      reason: result.reason,
      model: TRIAGE_MODEL,
    },
    update: {
      corsairEntityId: args.corsairEntityId,
      label: result.label,
      reason: result.reason,
      model: TRIAGE_MODEL,
    },
  });
  return { label: result.label };
}

function deriveMeta(
  plugin: string,
  entityType: string,
  entityId: string,
  data: Record<string, unknown>,
): DerivedMeta {
  if (plugin === "googlecalendar") {
    const ev = data as CalendarEntityData;
    const startIso = ev.start?.dateTime ?? ev.start?.date;
    return {
      type: "event",
      title: ev.summary ?? "(event)",
      snippet: ev.location ?? "",
      sender: "",
      threadId: "",
      timestamp: startIso ? safeDate(startIso) : new Date(),
    };
  }

  const m = data as GmailEntityData;
  const header = (name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  const snippet = m.snippet ?? "";
  return {
    type: "email",
    title: header("subject") || (snippet ? snippet.slice(0, 80) : "Email"),
    snippet,
    sender: header("from"),
    threadId: m.threadId ?? (entityType === "threads" ? entityId : ""),
    timestamp: safeDate(m.internalDate),
  };
}

export const corsairWebhookReceived = inngest.createFunction(
  {
    id: "corsair-webhook-received",
    retries: 3,
    triggers: { event: "corsair/webhook.received" },
  },
  async ({ event, step }) => {
    const { tenantId, plugin, corsairEntityId } =
      event.data as WebhookReceivedData;
    // The Corsair tenant id is the Clerk user id in our setup.
    const userId = tenantId;

    const entity = await step.run("load-entity", async () => {
      const row = await db.corsairEntity.findUnique({
        where: { id: corsairEntityId },
      });
      if (!row) return null;
      return {
        entityType: row.entityType,
        entityId: row.entityId,
        data: row.data as Record<string, unknown>,
      };
    });

    if (!entity) return { skipped: "entity-not-found" };

    const meta = deriveMeta(
      plugin,
      entity.entityType,
      entity.entityId,
      entity.data,
    );

    await step.run("upsert-sync-item", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      await db.syncItem.upsert({
        where: { userId_corsairEntityId: { userId, corsairEntityId } },
        create: {
          userId,
          corsairEntityId,
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          timestamp: meta.timestamp,
        },
        update: {
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          timestamp: meta.timestamp,
        },
      });
    });

    if (meta.type === "email") {
      await step.run("embed-email", async () => {
        const vector = await embedText(`${meta.title}\n${meta.snippet}`);
        if (!vector) return { embedded: false };
        const literal = toVectorLiteral(vector);
        await db.$executeRaw`
          INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, indexed_at)
          VALUES (gen_random_uuid()::text, ${userId}, ${corsairEntityId}, ${meta.threadId}, ${meta.title}, ${literal}::vector, now())
          ON CONFLICT (user_id, corsair_entity_id)
          DO UPDATE SET embedding = EXCLUDED.embedding,
                        subject_snippet = EXCLUDED.subject_snippet,
                        thread_id = EXCLUDED.thread_id,
                        indexed_at = now()
        `;
        return { embedded: true };
      });

      if (meta.threadId) {
        await step.run("triage-email", () =>
          scoreThread({
            userId,
            threadId: meta.threadId,
            corsairEntityId,
            subject: meta.title,
            sender: meta.sender,
            snippet: meta.snippet,
          }),
        );
      }
    }

    return { plugin, type: meta.type, corsairEntityId };
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Gmail push watch (Phase 5 infra)
//
// Corsair receives Gmail Pub/Sub notifications but doesn't start the watch, so
// we call Gmail users.watch ourselves: once on connect, then on a renewal cron
// (Gmail watches expire after 7 days).
// ─────────────────────────────────────────────────────────────────────────────

export const gmailWatchOnConnect = inngest.createFunction(
  {
    id: "gmail-watch-on-connect",
    retries: 2,
    triggers: { event: "integration/connected" },
  },
  async ({ event, step }) => {
    const { clerkUserId, plugin } = event.data as {
      clerkUserId: string;
      plugin: SupportedPlugin;
    };
    if (plugin !== "gmail") return { skipped: "not-gmail" };

    return await step.run("start-watch", () => startGmailWatch(clerkUserId));
  },
);

export const gmailWatchRenew = inngest.createFunction(
  { id: "gmail-watch-renew", triggers: { cron: "0 */6 * * *" } },
  async ({ step }) => {
    const tenantIds = await step.run("list-gmail-tenants", async () => {
      const accounts = await db.corsairAccount.findMany({
        where: { integration: { name: "gmail" } },
        select: { tenantId: true },
      });
      return Array.from(new Set(accounts.map((a) => a.tenantId)));
    });

    const results: { userId: string; ok: boolean; error?: string }[] = [];
    for (const userId of tenantIds) {
      const r = await step.run(`watch-${userId}`, () =>
        startGmailWatch(userId),
      );
      results.push({ userId, ok: r.ok, error: r.error });
    }
    return { count: tenantIds.length, results };
  },
);

// One-time "Score my inbox": classify the last ~30 days of threads. Triggered
// from /integrations for users who connected before triage shipped.
export const scoreInboxBackfill = inngest.createFunction(
  {
    id: "score-inbox-backfill",
    retries: 2,
    triggers: { event: "triage/backfill.requested" },
  },
  async ({ event, step }) => {
    const { clerkUserId } = event.data as { clerkUserId: string };
    const tenant = getTenant(clerkUserId);

    const threadIds = await step.run("list-recent-threads", async () => {
      const list = await tenant.gmail.api.threads.list({
        q: "newer_than:30d",
        maxResults: 50,
      });
      return (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");
    });

    let scored = 0;
    for (const threadId of threadIds) {
      const r = await step.run(`score-${threadId}`, async () => {
        const thread = await tenant.gmail.api.threads.get({
          id: threadId,
          format: "metadata",
          metadataHeaders: ["Subject", "From"],
        });
        const preview = threadPreview(thread);
        return scoreThread({
          userId: clerkUserId,
          threadId,
          corsairEntityId: threadId,
          subject: preview.subject,
          sender: `${preview.fromName} <${preview.fromEmail}>`,
          snippet: preview.snippet,
        });
      });
      if ("label" in r) scored += 1;
    }

    return { threads: threadIds.length, scored };
  },
);

// Historical embedding backfill (Phase 9) — indexes cached gmail entities for
// users who connected before the incremental embedding pipeline shipped.
export const searchEmbeddingsBackfill = inngest.createFunction(
  {
    id: "search-embeddings-backfill",
    retries: 2,
    triggers: { event: "search/embeddings.requested" },
  },
  async ({ event, step }) => {
    const { clerkUserId } = event.data as { clerkUserId: string };

    await step.run("ensure-user", async () => {
      await db.user.upsert({
        where: { id: clerkUserId },
        create: { id: clerkUserId },
        update: {},
      });
    });

    const entities = await step.run("load-gmail-entities", async () => {
      const accounts = await db.corsairAccount.findMany({
        where: { tenantId: clerkUserId, integration: { name: "gmail" } },
        select: { id: true },
      });
      const accountIds = accounts.map((a) => a.id);
      if (accountIds.length === 0) return [];
      const rows = await db.corsairEntity.findMany({
        where: { accountId: { in: accountIds }, entityType: "threads" },
        orderBy: { updatedAt: "desc" },
        take: 200,
        select: { id: true, entityId: true, data: true },
      });
      return rows.map((r) => ({
        id: r.id,
        entityId: r.entityId,
        snippet: (r.data as { snippet?: string }).snippet ?? "",
      }));
    });

    let indexed = 0;
    for (const e of entities) {
      const r = await step.run(`embed-${e.id}`, async () => {
        const vector = await embedText(e.snippet);
        if (!vector) return { embedded: false };
        const literal = toVectorLiteral(vector);
        await db.$executeRaw`
          INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, indexed_at)
          VALUES (gen_random_uuid()::text, ${clerkUserId}, ${e.id}, ${e.entityId}, ${e.snippet.slice(0, 200)}, ${literal}::vector, now())
          ON CONFLICT (user_id, corsair_entity_id)
          DO UPDATE SET embedding = EXCLUDED.embedding, indexed_at = now()
        `;
        return { embedded: true };
      });
      if (r.embedded) indexed += 1;
    }

    return { total: entities.length, indexed };
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Command channels (Phase 10) — Telegram & WhatsApp
// ─────────────────────────────────────────────────────────────────────────────

export const channelMessageReceived = inngest.createFunction(
  {
    id: "channel-message-received",
    retries: 2,
    triggers: { event: "channel/message.received" },
  },
  async ({ event, step }) => {
    const { channel, externalChatId, text } = event.data as {
      channel: string;
      externalChatId: string;
      text: string;
    };

    const resolved = await step.run("resolve", () =>
      resolveOrLink(channel, externalChatId, text),
    );

    if (!resolved.userId) {
      await step.run("reply-link", () =>
        sendChannelText(
          channel,
          externalChatId,
          "Link this chat first: open Jack Sparrow → Settings → Connect, then send me the code (Telegram: /link CODE).",
        ),
      );
      return { needsLink: true };
    }

    if (resolved.justLinked) {
      await step.run("reply-linked", () =>
        sendChannelText(
          channel,
          externalChatId,
          "✅ Linked! Ask me to triage email, draft replies, or schedule events.",
        ),
      );
      return { linked: true };
    }

    const userId = resolved.userId;
    const agent = await step.run("agent", () =>
      runChannelAgent(userId, channel, text),
    );

    if (agent.text) {
      await step.run("reply-text", () =>
        sendChannelText(channel, externalChatId, agent.text),
      );
    }
    for (const p of agent.pending) {
      await step.run(`approval-${p.id}`, () =>
        sendChannelApproval(
          channel,
          externalChatId,
          summarizePendingAction(p.kind, p.draftPayload),
          p.id,
        ),
      );
    }
    return { replied: true, pending: agent.pending.length };
  },
);

export const channelCallbackReceived = inngest.createFunction(
  {
    id: "channel-callback-received",
    retries: 2,
    triggers: { event: "channel/callback.received" },
  },
  async ({ event, step }) => {
    const { channel, externalChatId, decision, actionId } = event.data as {
      channel: string;
      externalChatId: string;
      decision: "approve" | "reject" | "edit";
      actionId: string;
    };

    const ctx = await step.run("authorize", async () => {
      const action = await db.pendingAction.findUnique({
        where: { id: actionId },
      });
      const link = await db.channelLink.findUnique({
        where: { channel_externalChatId: { channel, externalChatId } },
      });
      if (!action) return { ok: false as const, reason: "missing" };
      if (link?.userId !== action.userId)
        return { ok: false as const, reason: "unauthorized" };
      if (action.status !== "pending")
        return { ok: false as const, reason: "resolved" };
      return {
        ok: true as const,
        userId: action.userId,
        kind: action.kind,
        draftPayload: action.draftPayload,
      };
    });

    if (!ctx.ok) {
      await step.run("reply-invalid", () =>
        sendChannelText(channel, externalChatId, "That action is no longer available."),
      );
      return { skipped: ctx.reason };
    }

    if (decision === "edit") {
      await step.run("reply-edit", () =>
        sendChannelText(
          channel,
          externalChatId,
          `Open the app to edit: ${env.APP_URL}/inbox`,
        ),
      );
      return { edit: true };
    }

    if (decision === "reject") {
      await step.run("reject", async () => {
        await db.pendingAction.update({
          where: { id: actionId },
          data: { status: "rejected", resolvedAt: new Date() },
        });
      });
      await step.run("reply-reject", () =>
        sendChannelText(channel, externalChatId, "Cancelled ❌"),
      );
      return { rejected: true };
    }

    // approve — execute exactly once.
    const exec = await step.run("execute", async () => {
      try {
        const res = await executePendingAction(
          ctx.userId,
          ctx.kind,
          ctx.draftPayload,
        );
        await db.pendingAction.update({
          where: { id: actionId },
          data: { status: "executed", resolvedAt: new Date() },
        });
        return { ok: true as const, summary: res.summary };
      } catch (err) {
        return {
          ok: false as const,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    await step.run("reply-result", () =>
      sendChannelText(
        channel,
        externalChatId,
        exec.ok
          ? `${confirmationCopy(ctx.kind)} ${exec.summary}`
          : `Failed: ${exec.error}`,
      ),
    );
    return { executed: exec.ok };
  },
);
