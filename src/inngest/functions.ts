// src/inngest/functions.ts
import { inngest } from "./client";
import { db } from "@/server/db";
import { getTenant, type SupportedPlugin } from "@/server/corsair";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { startGmailWatch } from "@/server/gmail-watch";

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

function deriveMeta(
  plugin: string,
  data: Record<string, unknown>,
): DerivedMeta {
  if (plugin === "googlecalendar") {
    const ev = data as CalendarEntityData;
    const startIso = ev.start?.dateTime ?? ev.start?.date;
    return {
      type: "event",
      title: ev.summary ?? "(event)",
      snippet: ev.location ?? "",
      threadId: "",
      timestamp: startIso ? safeDate(startIso) : new Date(),
    };
  }

  const m = data as GmailEntityData;
  const subject = m.payload?.headers?.find(
    (h) => h.name?.toLowerCase() === "subject",
  )?.value;
  const snippet = m.snippet ?? "";
  return {
    type: "email",
    title: subject ?? (snippet ? snippet.slice(0, 80) : "Email"),
    snippet,
    threadId: m.threadId ?? "",
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
        data: row.data as Record<string, unknown>,
      };
    });

    if (!entity) return { skipped: "entity-not-found" };

    const meta = deriveMeta(plugin, entity.data);

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
