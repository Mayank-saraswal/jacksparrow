/**
 * Pure learned-triage math: behavioral signal weights, exponentially-decayed
 * sender affinity, deterministic priority post-rules, and rule-suggestion
 * thresholds. No I/O so it's fully unit-testable.
 */

import type { PriorityLabel } from "@/server/triage";

// ── Signal weights (tunable in one place) ────────────────────────────────────
export type TriageSignal =
  | "archive_unopened"
  | "archive_after_open"
  | "reply"
  | "reply_within_1h"
  | "open_no_action"
  | "snooze"
  | "manual_override"
  | "star";

export const SIGNAL_WEIGHTS: Record<TriageSignal, number> = {
  archive_unopened: -2,
  archive_after_open: -0.5,
  reply: 3,
  reply_within_1h: 4,
  open_no_action: 0.5,
  snooze: 1,
  manual_override: 5, // magnitude; sign comes from the label (see below)
  star: 3,
};

/** Signed weight for a manual priority override. */
export function manualOverrideWeight(label: PriorityLabel): number {
  switch (label) {
    case "urgent":
    case "important":
      return SIGNAL_WEIGHTS.manual_override;
    case "low":
      return -SIGNAL_WEIGHTS.manual_override;
    case "normal":
    default:
      return 0;
  }
}

// ── Exponential decay (≈30-day half-life) ────────────────────────────────────
// score decays by half every HALF_LIFE_DAYS: factor = 0.5^(days/halfLife)
// = exp(-λ·days) with λ = ln(2)/halfLife. We apply decay lazily — only when a
// row is touched — so a stale row's effective score is always time-correct.
export const HALF_LIFE_DAYS = 30;
export const DECAY_LAMBDA = Math.LN2 / HALF_LIFE_DAYS;

const MS_PER_DAY = 86_400_000;

/** The current effective score of a row last updated at `updatedAt`. */
export function decayedScore(
  score: number,
  updatedAt: Date,
  now: Date = new Date(),
): number {
  const days = Math.max(0, (now.getTime() - updatedAt.getTime()) / MS_PER_DAY);
  return score * Math.exp(-DECAY_LAMBDA * days);
}

/** Decay the stored score to `now`, then add the new signal weight. */
export function applySignal(
  prevScore: number,
  weight: number,
  updatedAt: Date,
  now: Date = new Date(),
): number {
  return decayedScore(prevScore, updatedAt, now) + weight;
}

// ── Deterministic priority post-rules ────────────────────────────────────────
export const AFFINITY_CAP_THRESHOLD = -5; // ≤ this caps the label at "low"
export const AFFINITY_FLOOR_THRESHOLD = 5; // ≥ this floors the label at "important"

const RANK: Record<PriorityLabel, number> = {
  low: 0,
  normal: 1,
  important: 2,
  urgent: 3,
};
const BY_RANK: PriorityLabel[] = ["low", "normal", "important", "urgent"];

export interface PostRuleResult {
  label: PriorityLabel;
  applied: "cap" | "floor" | null;
}

/**
 * Applies the affinity cap/floor to an LLM label. A strongly-negative sender is
 * forced to "low"; a strongly-positive sender is lifted to at least "important".
 * Floor takes precedence is impossible (thresholds are mutually exclusive in
 * sign), so we check cap first then floor.
 */
export function applyPostRules(
  label: PriorityLabel,
  affinity: number,
): PostRuleResult {
  if (affinity <= AFFINITY_CAP_THRESHOLD) {
    return { label: "low", applied: label === "low" ? null : "cap" };
  }
  if (affinity >= AFFINITY_FLOOR_THRESHOLD) {
    const floored = Math.max(RANK[label], RANK.important);
    const next = BY_RANK[floored]!;
    return { label: next, applied: next === label ? null : "floor" };
  }
  return { label, applied: null };
}

// ── Human-readable history buckets for the triage prompt ─────────────────────
/** e.g. "you reply to this sender 80% of the time". Returns null if no signal. */
export function describeAffinity(
  score: number,
  signalCount: number,
): string | null {
  if (signalCount === 0) return null;
  if (score >= AFFINITY_FLOOR_THRESHOLD)
    return "the user consistently engages with this sender (high affinity)";
  if (score <= AFFINITY_CAP_THRESHOLD)
    return "the user consistently ignores or archives this sender (low affinity)";
  if (score > 0) return "the user tends to engage with this sender";
  if (score < 0) return "the user tends to ignore this sender";
  return "neutral engagement so far";
}

// ── Rule-suggestion thresholds ───────────────────────────────────────────────
export const SUGGESTION_MIN_ABS = 8;
export const SUGGESTION_MIN_SIGNALS = 5;

export type SuggestionKind = "mute" | "vip" | "split";

/** Decide whether an affinity row is strong enough to suggest a rule. */
export function suggestionForAffinity(
  score: number,
  signalCount: number,
): SuggestionKind | null {
  if (signalCount < SUGGESTION_MIN_SIGNALS) return null;
  if (Math.abs(score) < SUGGESTION_MIN_ABS) return null;
  return score <= -SUGGESTION_MIN_ABS ? "mute" : "vip";
}

/**
 * Full suggestion gate: no suggestion when the pattern is already handled by an
 * existing rule/suggestion, otherwise apply the threshold logic.
 */
export function ruleSuggestionDecision(opts: {
  score: number;
  signalCount: number;
  alreadyHandled: boolean;
}): SuggestionKind | null {
  if (opts.alreadyHandled) return null;
  return suggestionForAffinity(opts.score, opts.signalCount);
}
