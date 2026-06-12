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

async function main() {
  const {
    DATABASE_URL,
    CORSAIR_KEK,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GMAIL_PUBSUB_TOPIC,
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
    plugins: [gmail(), googlecalendar()],
    database: pool,
    kek: CORSAIR_KEK,
    multiTenancy: true,
  });

  const output = await setupCorsair(corsair, {
    // Integration-level credentials are shared across all tenants.
    credentials: {
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
    },
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
