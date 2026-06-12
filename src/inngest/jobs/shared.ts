import { db } from "@/server/db";
import { getTenant } from "@/server/corsair";
import { classifyEmail, TRIAGE_MODEL } from "@/server/triage";
import { getAffinityContext } from "@/server/triage-feedback";
import { parseAddress } from "@/lib/email";

/**
 * Helpers shared across Inngest jobs. Kept dependency-light so both the realtime
 * sync pipeline and the one-off triage backfill can reuse the scoring path.
 */

/** Best-effort: has the user previously emailed this sender? */
export async function isKnownSender(
  userId: string,
  fromHeader: string,
): Promise<boolean> {
  const { email } = parseAddress(fromHeader);
  if (!email) return false;
  try {
    const tenant = getTenant(userId);
    const res = await tenant.gmail.api.messages.list({
      q: `to:${email}`,
      maxResults: 1,
    });
    return (res.messages?.length ?? 0) > 0;
  } catch {
    return false;
  }
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
  const result = await classifyEmail({
    subject: args.subject,
    sender: args.sender,
    snippet: args.snippet,
    knownSender,
    affinity: { score: affinity.effectiveScore, notes: affinity.notes },
  });
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
