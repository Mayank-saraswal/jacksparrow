import { inngest } from "../client";
import { db } from "@/server/db";
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
    triggers: { event: "integration/connected" },
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

      if (isUserTenant) {
        await step.run("mark-gmail-backfilled", async () => {
          await db.user.update({
            where: { id: clerkUserId },
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
          const out = await tenant.outlook.api.messages.list({
            top: OUTLOOK_PAGE_SIZE,
            skip,
            orderby: ["receivedDateTime desc"],
          });
          const items = (out as { value?: unknown[] }).value ?? [];
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
