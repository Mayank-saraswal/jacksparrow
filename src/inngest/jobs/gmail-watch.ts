import { inngest } from "../client";
import { db } from "@/server/db";
import { type SupportedPlugin } from "@/server/corsair";
import { startGmailWatch } from "@/server/gmail-watch";

/**
 * Gmail push watch (Phase 5 infra). Corsair receives Gmail Pub/Sub
 * notifications but doesn't start the watch, so we call Gmail users.watch
 * ourselves: once on connect, then on a renewal cron (watches expire ~7 days).
 */

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
