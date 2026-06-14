/**
 * Manually (re)register the Gmail push watch for a tenant.
 *
 * The app normally starts the watch on `integration/connected` via the
 * `gmail-watch-on-connect` Inngest job, but if you added GMAIL_PUBSUB_TOPIC
 * AFTER connecting Gmail (or the Inngest dev server wasn't running at connect
 * time), the watch never got created. Run this once to fix it:
 *
 *   bun run gmail:watch <clerkUserId>
 *
 * If <clerkUserId> is omitted, every connected Gmail tenant is (re)watched.
 * Gmail watches expire after ~7 days; the `gmail-watch-renew` cron refreshes
 * them once everything is running.
 */
import "dotenv/config";

import { Pool } from "pg";
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

const GMAIL_WATCH_URL = "https://gmail.googleapis.com/gmail/v1/users/me/watch";

async function watchTenant(
  corsair: ReturnType<typeof createCorsair>,
  topicName: string,
  tenantId: string,
): Promise<void> {
  const tenant = corsair.withTenant(tenantId);

  // Force a token refresh if stale, then read the (valid) access token.
  await tenant.gmail.api.labels.list({});
  const accessToken = await tenant.gmail.keys.get_access_token();
  if (!accessToken) {
    console.error(`[${tenantId}] no access token — is Gmail connected?`);
    return;
  }

  const res = await fetch(GMAIL_WATCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topicName }),
  });

  if (!res.ok) {
    console.error(`[${tenantId}] watch failed ${res.status}: ${await res.text()}`);
    return;
  }
  const data = (await res.json()) as { historyId?: string; expiration?: string };
  const expires = data.expiration
    ? new Date(Number(data.expiration)).toISOString()
    : "unknown";
  console.log(
    `[${tenantId}] watch OK — historyId=${data.historyId}, expires=${expires}`,
  );
}

async function main() {
  const { DATABASE_URL, CORSAIR_KEK } = process.env;
  if (!DATABASE_URL || !CORSAIR_KEK) {
    throw new Error("DATABASE_URL and CORSAIR_KEK must be set in .env");
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  const corsair = createCorsair({
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: CORSAIR_KEK,
    multiTenancy: true,
  });

  const topicName = await corsair.keys.gmail.get_topic_id();
  if (!topicName) {
    throw new Error(
      "No Gmail topic_id stored. Set GMAIL_PUBSUB_TOPIC in .env and run `bun run corsair:setup` first.",
    );
  }
  console.log(`Using topic: ${topicName}`);

  const argTenant = process.argv[2];
  let tenantIds: string[];
  if (argTenant) {
    tenantIds = [argTenant];
  } else {
    const { rows } = await pool.query<{ tenant_id: string }>(
      `select distinct a.tenant_id
         from corsair_accounts a
         join corsair_integrations i on i.id = a.integration_id
        where i.name = 'gmail'`,
    );
    tenantIds = rows.map((r) => r.tenant_id);
  }

  if (tenantIds.length === 0) {
    console.log("No connected Gmail tenants found.");
  }
  for (const tenantId of tenantIds) {
    await watchTenant(corsair, topicName, tenantId);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
