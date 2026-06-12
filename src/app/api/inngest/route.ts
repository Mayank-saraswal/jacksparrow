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
  scheduledSend,
  scoreInboxBackfill,
  searchEmbeddingsBackfill,
  snoozeWake,
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
  ],
});
