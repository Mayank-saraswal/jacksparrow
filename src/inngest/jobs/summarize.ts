import { inngest } from "../client";
import { db } from "@/server/db";
import { SUMMARY_MODEL } from "@/server/models";
import {
  generateThreadSummary,
  getThreadEntityVersion,
} from "@/server/summary";
import {
  ownerForContext,
  assertWithinLimit,
  incrementUsage,
} from "@/server/billing/entitlements";
import { getMailProvider, resolveMailPlugin } from "@/server/mail/provider";
import type { TenantRef } from "@/server/corsair";

/** Event emitted by the sync pipeline for every inbound Gmail thread. */
export interface AutoSummarizeThreadData {
  userId: string;
  orgId: string | null;
  threadId: string;
}

/** Event emitted after backfill hydration to summarise the 25 most-recent threads. */
export interface SummarizeBackfillData {
  userId: string;
  threadIds: string[];
}

type SummaryOutcome =
  | { outcome: "generated" }
  | { outcome: "skipped"; reason: string }
  | { outcome: "failed" };

/**
 * Core logic: fetch the full thread, check the quota, generate a TLDR and
 * persist it. Returns a discriminated union so callers know what happened.
 * Respects per-plan "summary" limits (free / pro / business / enterprise).
 */
async function generateAndPersistSummary(
  userId: string,
  orgId: string | null,
  threadId: string,
): Promise<SummaryOutcome> {
  // Skip if a summary was written in the last 5 minutes (idempotency guard).
  const recent = await db.threadSummary.findFirst({
    where: { userId, threadId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < 5 * 60 * 1000) {
    return { outcome: "skipped", reason: "recent-summary-exists" };
  }

  // Enforce per-plan "summary" usage quota.
  const owner = ownerForContext(userId, orgId);
  try {
    await assertWithinLimit(owner, userId, "summary");
  } catch {
    return { outcome: "skipped", reason: "limit-exceeded" };
  }

  // Fetch the full thread from the mail provider for richer context.
  const ref: TenantRef = { kind: "user", userId };
  let detail;
  try {
    const mailPlugin = await resolveMailPlugin(ref);
    const provider = getMailProvider(mailPlugin, ref);
    detail = await provider.getThreadDetail(threadId);
  } catch (err) {
    console.warn("[summarize] failed to fetch thread detail", { userId, threadId, err });
    return { outcome: "failed" };
  }

  const currentVersion = await getThreadEntityVersion(userId, threadId, detail);
  const generated = await generateThreadSummary(detail);
  if (!generated) {
    return { outcome: "failed" };
  }

  void incrementUsage(owner, userId, "summary");

  await db.threadSummary.upsert({
    where: {
      userId_threadId_entityVersion: {
        userId,
        threadId,
        entityVersion: currentVersion,
      },
    },
    create: {
      userId,
      threadId,
      entityVersion: currentVersion,
      summary: generated.tldr,
      keyPoints: generated.keyPoints,
      actionItems: generated.actionItems,
      unansweredQuestions: generated.unansweredQuestions,
      model: SUMMARY_MODEL,
    },
    update: {
      summary: generated.tldr,
      keyPoints: generated.keyPoints,
      actionItems: generated.actionItems,
      unansweredQuestions: generated.unansweredQuestions,
    },
  });

  return { outcome: "generated" };
}

/**
 * Eagerly generate a TLDR for a single thread right after the sync pipeline
 * has embedded and triaged it. Quota-gated by the user's plan.
 */
export const autoSummarizeThread = inngest.createFunction(
  {
    id: "auto-summarize-thread",
    retries: 2,
    triggers: { event: "thread/summarize.requested" },
    // Concurrency cap: max 5 parallel summaries per user to avoid hammering OpenAI.
    concurrency: { key: "event.data.userId", limit: 5 },
  },
  async ({ event, step }) => {
    const { userId, orgId, threadId } = event.data as AutoSummarizeThreadData;

    const result: SummaryOutcome = await step.run("generate-summary", () =>
      generateAndPersistSummary(userId, orgId, threadId),
    );

    console.info("[auto-summarize-thread]", { userId, threadId, outcome: result.outcome });
    return result;
  },
);

/**
 * Bulk-summarises the last 25 threads after a user first connects Gmail so the
 * inbox list shows AI TLDRs immediately without opening each thread.
 * Runs threads sequentially to stay within OpenAI RPM limits.
 */
export const summarizeBackfill = inngest.createFunction(
  {
    id: "summarize-backfill",
    retries: 1,
    triggers: { event: "thread/summarize.backfill" },
    // Only one backfill run per user at a time.
    concurrency: { key: "event.data.userId", limit: 1 },
  },
  async ({ event, step }) => {
    const { userId, threadIds } = event.data as SummarizeBackfillData;
    const results: Array<{ threadId: string; outcome: string }> = [];

    for (const threadId of threadIds) {
      // Each thread is its own named step so Inngest can retry partial failures.
      const result: SummaryOutcome = await step.run(
        `summarize-${threadId}`,
        () => generateAndPersistSummary(userId, null, threadId),
      );
      results.push({ threadId, outcome: result.outcome });
    }

    return { userId, summarized: results.length, results };
  },
);
