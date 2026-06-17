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
import { hubspot } from "@corsair-dev/hubspot";
import { notion } from "@corsair-dev/notion";
import { linear } from "@corsair-dev/linear";
import { jira } from "../src/server/plugins/jira";
import { zoom } from "@corsair-dev/zoom";
import { teams } from "@corsair-dev/teams";
import { cal } from "@corsair-dev/cal";
import { calendly } from "@corsair-dev/calendly";
import { fireflies } from "@corsair-dev/fireflies";
import { zendesk } from "@corsair-dev/zendesk";
import { intercom } from "@corsair-dev/intercom";
import { todoist } from "@corsair-dev/todoist";
import { asana } from "@corsair-dev/asana";
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
    SLACK_SIGNING_SECRET,
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
    plugins: [
      gmail(),
      googlecalendar(),
      outlook(),
      slack({
        authType: "oauth_2",
        signingSecret: SLACK_SIGNING_SECRET,
      }),
      hubspot(),
      notion({ authType: "oauth_2" }),
      linear({ authType: "oauth_2" }),
      jira({ authType: "oauth_2" }),
      zoom(),
      teams(),
      cal(),
      calendly(),
      fireflies(),
      zendesk(),
      intercom(),
      todoist(),
      asana(),
    ],
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

  // Phase 2 integrations — optional, registered only when both vars are set.
  const phase2: [string, string?, string?][] = [
    ["hubspot", process.env.HUBSPOT_CLIENT_ID, process.env.HUBSPOT_CLIENT_SECRET],
    ["notion", process.env.NOTION_CLIENT_ID, process.env.NOTION_CLIENT_SECRET],
    ["linear", process.env.LINEAR_CLIENT_ID, process.env.LINEAR_CLIENT_SECRET],
    ["jira", process.env.JIRA_CLIENT_ID, process.env.JIRA_CLIENT_SECRET],
    ["zoom", process.env.ZOOM_CLIENT_ID, process.env.ZOOM_CLIENT_SECRET],
    ["teams", process.env.TEAMS_CLIENT_ID, process.env.TEAMS_CLIENT_SECRET],
    ["cal", process.env.CAL_CLIENT_ID, process.env.CAL_CLIENT_SECRET],
    ["calendly", process.env.CALENDLY_CLIENT_ID, process.env.CALENDLY_CLIENT_SECRET],
    ["fireflies", process.env.FIREFLIES_CLIENT_ID, process.env.FIREFLIES_CLIENT_SECRET],
    ["zendesk", process.env.ZENDESK_CLIENT_ID, process.env.ZENDESK_CLIENT_SECRET],
    ["intercom", process.env.INTERCOM_CLIENT_ID, process.env.INTERCOM_CLIENT_SECRET],
    ["todoist", process.env.TODOIST_CLIENT_ID, process.env.TODOIST_CLIENT_SECRET],
    ["asana", process.env.ASANA_CLIENT_ID, process.env.ASANA_CLIENT_SECRET],
  ];
  for (const [name, id, secret] of phase2) {
    if (id && secret) {
      credentials[name] = { client_id: id, client_secret: secret };
    }
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
