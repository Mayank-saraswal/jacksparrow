import { inngest } from "../client";
import { db } from "@/server/db";
import { env } from "@/env";
import { withRetry } from "@/server/rate-limit";
import { threadPreview } from "@/server/gmail";
import { captureException } from "@/server/observability/sentry";
import { pageOnCall } from "@/server/observability/pagerduty";
import {
  getTenantFor,
  type SupportedPlugin,
  type TenantRef,
} from "@/server/corsair";

/**
 * Initial data backfill. Triggered by `integration/connected` (emitted from the
 * OAuth callback). Pulls recent data into Corsair's local cache by calling the
 * plugin `.api.*` list endpoints — Corsair upserts each response into
 * corsair_entities. Tenant-aware: personal connects backfill under the user
 * tenant (and stamp the per-user timestamp); org connects backfill under
 * `org:{orgId}`.
 */

const MAX_PAGES = 50;
const GMAIL_QUERY = "newer_than:30d";
const GMAIL_PAGE_SIZE = 100;
const OUTLOOK_PAGE_SIZE = 100;
const CALENDAR_PAGE_SIZE = 250;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Per-user backfill rate limiting (Phase 0, Fix 3). Overridable via env.
const BACKFILL_CONCURRENCY = env.BACKFILL_CONCURRENCY ?? 2;
const BACKFILL_THROTTLE_PER_MIN = env.BACKFILL_THROTTLE_PER_MIN ?? 60;

// How many of the most-recent pages to hydrate into sync_items so the inbox
// list renders from the DB (with subject/sender) without a live round-trip.
// The rest of the mailbox is filled in incrementally by the realtime webhook.
const HYDRATE_PAGES = 3;

interface OutlookListMessage {
  id?: string;
  subject?: string;
  bodyPreview?: string;
  conversationId?: string;
  receivedDateTime?: string;
  isRead?: boolean;
  from?: { name?: string; address?: string };
}

/** Upsert an email sync_items row (deduped per thread for the list view). */
async function upsertEmailSyncItem(row: {
  userId: string;
  orgId: string | null;
  corsairEntityId: string;
  title: string;
  snippet: string;
  threadId: string;
  fromName: string;
  fromEmail: string;
  unread: boolean;
  starred: boolean;
  timestamp: Date;
}): Promise<void> {
  const data = {
    orgId: row.orgId,
    type: "email",
    title: row.title,
    snippet: row.snippet,
    threadId: row.threadId || null,
    fromName: row.fromName || null,
    fromEmail: row.fromEmail || null,
    unread: row.unread,
    starred: row.starred,
    timestamp: row.timestamp,
  };
  await db.syncItem.upsert({
    where: {
      userId_corsairEntityId: {
        userId: row.userId,
        corsairEntityId: row.corsairEntityId,
      },
    },
    create: {
      userId: row.userId,
      corsairEntityId: row.corsairEntityId,
      ...data,
    },
    update: data,
  });
}

/** Fetch full Gmail threads and seed sync_items so the list has real metadata. */
async function hydrateGmailThreads(
  tenant: ReturnType<typeof getTenantFor>,
  userId: string,
  ids: string[],
): Promise<void> {
  for (const id of ids) {
    try {
      const raw = await withRetry(() =>
        tenant.gmail.api.threads.get({ id, format: "full" }),
      );
      const p = threadPreview(raw);
      const threadId = p.threadId || id;
      await upsertEmailSyncItem({
        userId,
        orgId: null,
        corsairEntityId: threadId,
        title: p.subject,
        snippet: p.snippet,
        threadId,
        fromName: p.fromName,
        fromEmail: p.fromEmail,
        unread: p.unread,
        starred: p.starred,
        timestamp: p.date ? new Date(p.date) : new Date(),
      });
    } catch {
      // Skip individual thread failures — the realtime pipeline backfills later.
    }
  }
}

type IntegrationConnectedData = {
  clerkUserId: string;
  plugin: SupportedPlugin;
  tenantKind?: "user" | "org";
  orgId?: string;
};

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      const { id } = event.data as { id?: string };
      return { processed: true, id };
    });
    await step.sleep("pause", "1s");
    return { message: `Task ${event.data.id} complete`, result };
  },
);

export const backfillIntegration = inngest.createFunction(
  {
    id: "backfill-integration",
    retries: 3,
    concurrency: { key: "event.data.clerkUserId", limit: BACKFILL_CONCURRENCY },
    throttle: {
      key: "event.data.clerkUserId",
      limit: BACKFILL_THROTTLE_PER_MIN,
      period: "1m",
    },
    triggers: { event: "integration/connected" },
    onFailure: async ({ error }) => {
      // Retries exhausted (pipeline-fatal): alert on-call + record in Sentry.
      captureException(error, { fn: "backfill-integration" });
      await pageOnCall(
        `backfill-integration exhausted retries: ${error.message}`,
        "error",
      );
    },
  },
  async ({ event, step }) => {
    const { clerkUserId, plugin, tenantKind, orgId } =
      event.data as IntegrationConnectedData;

    const ref: TenantRef =
      tenantKind === "org" && orgId
        ? { kind: "org", orgId }
        : { kind: "user", userId: clerkUserId };
    const isUserTenant = ref.kind === "user";

    await step.run("ensure-user", async () => {
      await db.user.upsert({
        where: { id: clerkUserId },
        create: { id: clerkUserId },
        update: {},
      });
    });

    const tenant = getTenantFor(ref);

    if (plugin === "gmail") {
      let pageToken: string | undefined;
      let page = 0;
      let total = 0;
      // Collect thread IDs from the first hydrated page to summarise on connect.
      const backfillThreadIds: string[] = [];
      do {
        const cursor: string | undefined = pageToken;
        const result = await step.run(`gmail-threads-page-${page}`, async () => {
          const out = await withRetry(() =>
            tenant.gmail.api.threads.list({
              q: GMAIL_QUERY,
              maxResults: GMAIL_PAGE_SIZE,
              pageToken: cursor,
            }),
          );
          return {
            nextPageToken: out.nextPageToken ?? null,
            ids: (out.threads ?? [])
              .map((t) => t.id)
              .filter((id): id is string => typeof id === "string"),
          };
        });

        // Seed sync_items with real metadata for the most-recent pages so the
        // inbox list renders subject/sender from the DB.
        if (isUserTenant && page < HYDRATE_PAGES && result.ids.length > 0) {
          await step.run(`gmail-hydrate-page-${page}`, async () => {
            await hydrateGmailThreads(tenant, clerkUserId, result.ids);
            return { hydrated: result.ids.length };
          });
          // Collect thread IDs for backfill summarization (cap at 25).
          for (const id of result.ids) {
            if (backfillThreadIds.length < 25) backfillThreadIds.push(id);
          }
        }

        total += result.ids.length;
        pageToken = result.nextPageToken ?? undefined;
        page += 1;
      } while (pageToken && page < MAX_PAGES);

      if (isUserTenant) {
        await step.run("mark-gmail-backfilled", async () => {
          await db.user.update({
            where: { id: clerkUserId },
            data: { gmailBackfilledAt: new Date() },
          });
          await inngest.send([
            {
              name: "search/embeddings.requested",
              data: { clerkUserId, limit: 50 },
            },
            // Eagerly generate AI TLDRs for the last 25 threads so the inbox
            // list shows summaries immediately after first connect.
            ...(backfillThreadIds.length > 0
              ? [
                  {
                    name: "thread/summarize.backfill" as const,
                    data: { userId: clerkUserId, threadIds: backfillThreadIds },
                  },
                ]
              : []),
          ]);
        });
      } else if (ref.kind === "org" && orgId) {
        await step.run("mark-org-gmail-backfilled", async () => {
          await db.organization.update({
            where: { id: orgId },
            data: { gmailBackfilledAt: new Date() },
          });
        });
      }
      return { plugin, tenant: ref.kind, pages: page, threads: total };
    }

    if (plugin === "outlook") {
      let skip = 0;
      let page = 0;
      let total = 0;
      // Outlook (Graph) uses skip/top paging rather than page tokens.
      for (; page < MAX_PAGES; page += 1) {
        const count = await step.run(`outlook-messages-page-${page}`, async () => {
          const out = await withRetry(() =>
            tenant.outlook.api.messages.list({
              top: OUTLOOK_PAGE_SIZE,
              skip,
              orderby: ["receivedDateTime desc"],
            }),
          );
          const items =
            (out as { value?: OutlookListMessage[] }).value ?? [];

          // Seed sync_items directly from the list payload (subject/from/etc.
          // are already present — no per-message fetch needed).
          if (isUserTenant && page < HYDRATE_PAGES) {
            for (const m of items) {
              const conv = m.conversationId ?? m.id;
              if (!conv) continue;
              await upsertEmailSyncItem({
                userId: clerkUserId,
                orgId: null,
                corsairEntityId: conv,
                title: m.subject ?? "",
                snippet: m.bodyPreview ?? "",
                threadId: conv,
                fromName: m.from?.name ?? "",
                fromEmail: (m.from?.address ?? "").toLowerCase(),
                unread: m.isRead === false,
                starred: false,
                timestamp: m.receivedDateTime
                  ? new Date(m.receivedDateTime)
                  : new Date(),
              });
            }
          }

          return items.length;
        });
        total += count;
        skip += OUTLOOK_PAGE_SIZE;
        if (count < OUTLOOK_PAGE_SIZE) break;
      }

      if (isUserTenant) {
        await step.run("mark-outlook-backfilled", async () => {
          await db.user.update({
            where: { id: clerkUserId },
            data: { outlookBackfilledAt: new Date() },
          });
          await inngest.send({
            name: "search/embeddings.requested",
            data: { clerkUserId, limit: 50 },
          });
        });
      } else if (ref.kind === "org" && orgId) {
        await step.run("mark-org-outlook-backfilled", async () => {
          await db.organization.update({
            where: { id: orgId },
            data: { outlookBackfilledAt: new Date() },
          });
        });
      }
      return { plugin, tenant: ref.kind, pages: page, messages: total };
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
        const result = await step.run(`calendar-events-page-${page}`, async () => {
          const out = await withRetry(() =>
            tenant.googlecalendar.api.events.getMany({
              timeMin,
              timeMax,
              singleEvents: true,
              orderBy: "startTime",
              maxResults: CALENDAR_PAGE_SIZE,
              pageToken: cursor,
            }),
          );
          return {
            nextPageToken: out.nextPageToken ?? null,
            count: out.items?.length ?? 0,
          };
        });
        total += result.count;
        pageToken = result.nextPageToken ?? undefined;
        page += 1;
      } while (pageToken && page < MAX_PAGES);

      if (isUserTenant) {
        await step.run("mark-calendar-backfilled", async () => {
          await db.user.update({
            where: { id: clerkUserId },
            data: { calendarBackfilledAt: new Date() },
          });
        });
      }
      return { plugin, tenant: ref.kind, pages: page, events: total };
    }

    // Slack (org-level): v1 ingests via webhooks rather than a bulk backfill.
    return { plugin, tenant: ref.kind, skipped: true };
  },
);
