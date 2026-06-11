// src/inngest/functions.ts
import { inngest } from "./client";
import { db } from "@/server/db";
import { getTenant, type SupportedPlugin } from "@/server/corsair";

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
