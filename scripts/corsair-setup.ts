/**
 * One-time Corsair setup.
 *
 * Stores the shared Google OAuth client credentials (client_id / client_secret)
 * at the integration level, encrypted with your CORSAIR_KEK. Run this once after
 * filling in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env:
 *
 *   bun run corsair:setup
 *
 * This replaces the `corsair setup --plugin=... client_id=... client_secret=...`
 * CLI command (the `corsair` npm package does not ship a CLI binary).
 */
import "dotenv/config";

import { Pool } from "pg";
import { createCorsair } from "corsair";
import { setupCorsair } from "corsair/setup";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { outlook } from "@corsair-dev/outlook";
import { slack } from "@corsair-dev/slack";

async function main() {
  const {
    DATABASE_URL,
    CORSAIR_KEK,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GMAIL_PUBSUB_TOPIC,
    MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET,
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
  } = process.env;

  if (!DATABASE_URL || !CORSAIR_KEK) {
    throw new Error("DATABASE_URL and CORSAIR_KEK must be set in .env");
  }
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env before running setup.",
    );
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  const corsair = createCorsair({
    plugins: [gmail(), googlecalendar(), outlook(), slack()],
    database: pool,
    kek: CORSAIR_KEK,
    multiTenancy: true,
  });

  const credentials: Record<string, any> = {
    gmail: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      // Pub/Sub topic for Gmail push notifications (optional).
      ...(GMAIL_PUBSUB_TOPIC ? { topic_id: GMAIL_PUBSUB_TOPIC } : {}),
    },
    googlecalendar: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
    },
  };

  if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
    credentials.outlook = {
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
    };
  }

  if (SLACK_CLIENT_ID && SLACK_CLIENT_SECRET) {
    credentials.slack = {
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
    };
  }

  const output = await setupCorsair(corsair, {
    // Integration-level credentials are shared across all tenants.
    credentials,
  });

  console.log(output);
  if (GMAIL_PUBSUB_TOPIC) {
    console.log(`Gmail topic_id set to ${GMAIL_PUBSUB_TOPIC}`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
