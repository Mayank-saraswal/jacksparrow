import { db } from "@/server/db";
import { classifyEmail, TRIAGE_MODEL } from "@/server/triage";
import { getAffinityContext } from "@/server/triage-feedback";
import { parseAddress } from "@/lib/email";
import { extractDomain } from "@/lib/split-rules";
import { knownSenderDecision } from "@/lib/known-sender";
import { withRetry } from "@/server/rate-limit";

/**
 * Helpers shared across Inngest jobs. Kept dependency-light so both the realtime
 * sync pipeline and the one-off triage backfill can reuse the scoring path.
 */

/**
 * Has the user interacted with this sender before? Derived from local tables
 * only (sent-message samples by domain, or an existing synced item from the
 * exact address) — no provider round-trip.
 */
export async function isKnownSender(
  userId: string,
  fromHeader: string,
): Promise<boolean> {
  const { email } = parseAddress(fromHeader);
  const sender = email.toLowerCase();
  if (!sender) return false;
  const domain = extractDomain(sender);

  const [sample, item] = await Promise.all([
    domain
      ? db.sentMessageSample.findFirst({
          where: { userId, toDomain: domain },
          select: { id: true },
        })
      : Promise.resolve(null),
    db.syncItem.findFirst({
      where: { userId, fromEmail: sender },
      select: { id: true },
    }),
  ]);

  return knownSenderDecision({
    hasSampleForDomain: sample !== null,
    hasSyncItemFromSender: item !== null,
  });
}

/** Scores one email thread and upserts a PriorityScore (skips manual overrides). */
export async function scoreThread(args: {
  userId: string;
  threadId: string;
  corsairEntityId: string;
  subject: string;
  sender: string;
  snippet: string;
}): Promise<{ label: string } | { skipped: string }> {
  const existing = await db.priorityScore.findUnique({
    where: { userId_threadId: { userId: args.userId, threadId: args.threadId } },
    select: { model: true, source: true },
  });
  // Manual overrides are ground truth — never let the LLM overwrite them.
  if (existing?.source === "manual" || existing?.model === "user")
    return { skipped: "user-override" };

  const knownSender = await isKnownSender(args.userId, args.sender);
  const affinity = await getAffinityContext(args.userId, args.sender);
  const result = await withRetry(() =>
    classifyEmail({
      subject: args.subject,
      sender: args.sender,
      snippet: args.snippet,
      knownSender,
      affinity: { score: affinity.effectiveScore, notes: affinity.notes },
    }),
  );
  if (!result) return { skipped: "no-llm" };

  await db.priorityScore.upsert({
    where: { userId_threadId: { userId: args.userId, threadId: args.threadId } },
    create: {
      userId: args.userId,
      threadId: args.threadId,
      corsairEntityId: args.corsairEntityId,
      label: result.label,
      reason: result.reason,
      model: TRIAGE_MODEL,
      source: "llm",
    },
    update: {
      corsairEntityId: args.corsairEntityId,
      label: result.label,
      reason: result.reason,
      model: TRIAGE_MODEL,
      source: "llm",
    },
  });
  return { label: result.label };
}
