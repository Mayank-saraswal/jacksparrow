/**
 * Barrel for all Inngest job functions. Grouped by domain:
 *  - backfill    initial integration data pull
 *  - sync        realtime webhook → sync_items / embeddings / triage
 *  - gmail-watch Gmail push watch lifecycle
 *  - triage      one-time inbox scoring backfill
 *  - search      historical embedding backfill
 *  - channels    Telegram / WhatsApp command handling
 *  - scheduling  snooze wake, scheduled/undo send, follow-up reminders
 *  - style       voice samples + style profile (Phase 2)
 *  - suggestions learned-triage rule suggestions (Phase 2)
 */
export { processTask, backfillIntegration } from "./backfill";
export { corsairWebhookReceived } from "./sync";
export { gmailWatchOnConnect, gmailWatchRenew } from "./gmail-watch";
export { scoreInboxBackfill } from "./triage";
export { searchEmbeddingsBackfill } from "./search";
export { channelMessageReceived, channelCallbackReceived } from "./channels";
export { snoozeWake, scheduledSend, followUpReminders } from "./scheduling";
export {
  styleIngestSent,
  styleBackfill,
  styleProfileRegenerate,
} from "./style";
export { ruleSuggestionsCron } from "./suggestions";
export { clerkOrgSync, clerkMembershipSync } from "./orgs";
export { stripeWebhookReceived, billingSeatsSync } from "./billing";
