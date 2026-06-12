import { inngest } from "../client";
import { getTenant } from "@/server/corsair";
import { threadPreview } from "@/server/gmail";
import { scoreThread } from "./shared";

/**
 * One-time "Score my inbox": classify the last ~30 days of threads. Triggered
 * from /integrations for users who connected before triage shipped.
 */
export const scoreInboxBackfill = inngest.createFunction(
  {
    id: "score-inbox-backfill",
    retries: 2,
    triggers: { event: "triage/backfill.requested" },
  },
  async ({ event, step }) => {
    const { clerkUserId } = event.data as { clerkUserId: string };
    const tenant = getTenant(clerkUserId);

    const threadIds = await step.run("list-recent-threads", async () => {
      const list = await tenant.gmail.api.threads.list({
        q: "newer_than:30d",
        maxResults: 50,
      });
      return (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");
    });

    let scored = 0;
    for (const threadId of threadIds) {
      const r = await step.run(`score-${threadId}`, async () => {
        const thread = await tenant.gmail.api.threads.get({
          id: threadId,
          format: "metadata",
          metadataHeaders: ["Subject", "From"],
        });
        const preview = threadPreview(thread);
        return scoreThread({
          userId: clerkUserId,
          threadId,
          corsairEntityId: threadId,
          subject: preview.subject,
          sender: `${preview.fromName} <${preview.fromEmail}>`,
          snippet: preview.snippet,
        });
      });
      if ("label" in r) scored += 1;
    }

    return { threads: threadIds.length, scored };
  },
);
