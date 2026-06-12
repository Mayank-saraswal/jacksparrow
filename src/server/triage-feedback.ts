import "server-only";

import { db } from "@/server/db";
import { parseAddress } from "@/lib/email";
import { extractDomain } from "@/lib/split-rules";
import {
  SIGNAL_WEIGHTS,
  applySignal,
  decayedScore,
  describeAffinity,
  type TriageSignal,
} from "@/lib/affinity";

/**
 * Learned-triage signal capture. Records raw TriageFeedback and folds it into
 * decayed SenderAffinity scores (per email and per domain). Capture is
 * fire-and-forget so it never blocks UX.
 */

/** Decay the stored score to now, add `weight`, and upsert the affinity row. */
async function bumpAffinity(
  userId: string,
  key: string,
  weight: number,
  now: Date,
): Promise<void> {
  const existing = await db.senderAffinity.findUnique({
    where: { userId_key: { userId, key } },
    select: { score: true, signalCount: true, updatedAt: true },
  });

  const nextScore = existing
    ? applySignal(existing.score, weight, existing.updatedAt, now)
    : weight;

  await db.senderAffinity.upsert({
    where: { userId_key: { userId, key } },
    create: {
      userId,
      key,
      score: nextScore,
      signalCount: 1,
      updatedAt: now,
    },
    update: {
      score: nextScore,
      signalCount: (existing?.signalCount ?? 0) + 1,
      updatedAt: now,
    },
  });
}

export interface RecordFeedbackArgs {
  userId: string;
  threadId: string;
  fromEmail: string;
  signal: TriageSignal;
  /** Override the default weight (used by manual overrides which carry a sign). */
  weight?: number;
}

/** Records one behavioral signal + updates sender/domain affinity. Throws on error. */
export async function recordFeedback(args: RecordFeedbackArgs): Promise<void> {
  const { email } = parseAddress(args.fromEmail);
  const fromEmail = (email || args.fromEmail).toLowerCase();
  const fromDomain = extractDomain(fromEmail);
  if (!fromEmail) return;

  const weight = args.weight ?? SIGNAL_WEIGHTS[args.signal];
  const now = new Date();

  await db.user.upsert({
    where: { id: args.userId },
    create: { id: args.userId },
    update: {},
  });

  await db.triageFeedback.create({
    data: {
      userId: args.userId,
      threadId: args.threadId,
      fromEmail,
      fromDomain,
      signal: args.signal,
      weight,
    },
  });

  await bumpAffinity(args.userId, `email:${fromEmail}`, weight, now);
  if (fromDomain) {
    await bumpAffinity(args.userId, `domain:${fromDomain}`, weight, now);
  }
}

/** Fire-and-forget wrapper: never rejects, never blocks the caller. */
export function recordFeedbackSafe(args: RecordFeedbackArgs): void {
  void recordFeedback(args).catch(() => {
    /* swallow — feedback is best-effort */
  });
}

export interface AffinityContext {
  /** Single effective score for deterministic post-rules. */
  effectiveScore: number;
  /** Human-readable lines for the triage prompt. */
  notes: string[];
}

/**
 * Builds the learned-triage context for a sender: decayed email + domain
 * affinity, a plain-language description, and recent manual-override count.
 */
export async function getAffinityContext(
  userId: string,
  sender: string,
): Promise<AffinityContext> {
  const { email } = parseAddress(sender);
  const fromEmail = (email || sender).toLowerCase();
  const fromDomain = extractDomain(fromEmail);
  if (!fromEmail) return { effectiveScore: 0, notes: [] };

  const keys = [`email:${fromEmail}`];
  if (fromDomain) keys.push(`domain:${fromDomain}`);

  const rows = await db.senderAffinity.findMany({
    where: { userId, key: { in: keys } },
    select: { key: true, score: true, signalCount: true, updatedAt: true },
  });

  const now = new Date();
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const emailRow = byKey.get(`email:${fromEmail}`);
  const domainRow = fromDomain ? byKey.get(`domain:${fromDomain}`) : undefined;

  const emailScore = emailRow
    ? decayedScore(emailRow.score, emailRow.updatedAt, now)
    : 0;
  const domainScore = domainRow
    ? decayedScore(domainRow.score, domainRow.updatedAt, now)
    : 0;

  // Prefer the sender-specific signal; fall back to the domain.
  const effectiveScore =
    emailRow && emailRow.signalCount > 0 ? emailScore : domainScore;

  const notes: string[] = [];
  const emailDesc = emailRow
    ? describeAffinity(emailScore, emailRow.signalCount)
    : null;
  if (emailDesc) notes.push(`This sender: ${emailDesc}.`);
  const domainDesc = domainRow
    ? describeAffinity(domainScore, domainRow.signalCount)
    : null;
  if (domainDesc && !emailDesc) notes.push(`This domain: ${domainDesc}.`);

  const manualOverrides = await db.triageFeedback.count({
    where: { userId, fromDomain, signal: "manual_override" },
  });
  if (manualOverrides > 0) {
    notes.push(
      `The user has manually re-prioritised ${manualOverrides} message(s) from this domain.`,
    );
  }

  return { effectiveScore, notes };
}
