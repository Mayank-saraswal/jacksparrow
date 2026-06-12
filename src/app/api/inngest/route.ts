// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  backfillIntegration,
  channelCallbackReceived,
  channelMessageReceived,
  corsairWebhookReceived,
  followUpReminders,
  gmailWatchOnConnect,
  gmailWatchRenew,
  processTask,
  ruleSuggestionsCron,
  scheduledSend,
  scoreInboxBackfill,
  searchEmbeddingsBackfill,
  snoozeWake,
  styleBackfill,
  styleIngestSent,
  styleProfileRegenerate,
} from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processTask,
    backfillIntegration,
    corsairWebhookReceived,
    gmailWatchOnConnect,
    gmailWatchRenew,
    scoreInboxBackfill,
    searchEmbeddingsBackfill,
    channelMessageReceived,
    channelCallbackReceived,
    snoozeWake,
    scheduledSend,
    followUpReminders,
    styleIngestSent,
    styleBackfill,
    styleProfileRegenerate,
    ruleSuggestionsCron,
  ],
});
