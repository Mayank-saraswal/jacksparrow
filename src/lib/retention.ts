/**
 * Pure data-retention logic: minimum floors, the 72h grace period when a policy
 * is tightened, cutoff-date math, and legal-hold scope matching. No I/O so the
 * purge engine's decisions are fully unit-testable.
 */

export const RETENTION_MIN = { email: 30, slack: 30, audit: 90 } as const;
export const DEFAULT_AUDIT_DAYS = 365;
export const GRACE_HOURS = 72;
const MS_PER_DAY = 86_400_000;

export interface RetentionDays {
  emailDays: number | null;
  slackDays: number | null;
  auditDays: number;
}

/** Clamp a configured value to its minimum floor (null = keep forever). */
export function clampDays(
  kind: keyof typeof RETENTION_MIN,
  days: number | null,
): number | null {
  if (days == null) return null;
  return Math.max(days, RETENTION_MIN[kind]);
}

/** A retention is "tighter" when it shortens how long data is kept. */
function isTighter(prev: number | null, next: number | null): boolean {
  if (next == null) return false; // null = forever → never tighter
  if (prev == null) return true; // forever → finite = tighter
  return next < prev;
}

/** True if ANY dimension of the policy got tighter. */
export function policyTightened(
  prev: RetentionDays,
  next: RetentionDays,
): boolean {
  return (
    isTighter(prev.emailDays, next.emailDays) ||
    isTighter(prev.slackDays, next.slackDays) ||
    isTighter(prev.auditDays, next.auditDays)
  );
}

/**
 * When a policy is tightened, purging waits 72h (grace) from `updatedAt`;
 * otherwise it takes effect immediately.
 */
export function computeEffectiveAt(
  prev: RetentionDays,
  next: RetentionDays,
  updatedAt: Date,
): Date {
  return policyTightened(prev, next)
    ? new Date(updatedAt.getTime() + GRACE_HOURS * 60 * 60 * 1000)
    : updatedAt;
}

/** The instant before which rows are eligible for purge (null = keep forever). */
export function cutoffDate(
  days: number | null,
  now: Date = new Date(),
): Date | null {
  if (days == null) return null;
  return new Date(now.getTime() - days * MS_PER_DAY);
}

/** Whether the grace period has elapsed and purging may run. */
export function isPurgeActive(
  effectiveAt: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!effectiveAt) return true;
  return now.getTime() >= effectiveAt.getTime();
}

export interface LegalHoldScope {
  userIds?: string[];
  sharedInboxIds?: string[];
  before?: string; // ISO — hold rows BEFORE this instant
  after?: string; // ISO — hold rows AFTER this instant
}

export interface HoldableRow {
  userId?: string | null;
  sharedInboxId?: string | null;
  timestamp: Date;
}

/**
 * Whether a row is protected by a hold's scope. Every *specified* constraint
 * must match (AND). An empty scope holds everything. A held row is never purged.
 */
export function matchesHold(scope: LegalHoldScope, row: HoldableRow): boolean {
  if (scope.userIds && scope.userIds.length > 0) {
    if (!row.userId || !scope.userIds.includes(row.userId)) return false;
  }
  if (scope.sharedInboxIds && scope.sharedInboxIds.length > 0) {
    if (!row.sharedInboxId || !scope.sharedInboxIds.includes(row.sharedInboxId))
      return false;
  }
  if (scope.after) {
    if (row.timestamp.getTime() < new Date(scope.after).getTime()) return false;
  }
  if (scope.before) {
    if (row.timestamp.getTime() > new Date(scope.before).getTime()) return false;
  }
  return true;
}

/** A row is protected if ANY active hold matches it. */
export function isHeld(
  holds: { scope: LegalHoldScope }[],
  row: HoldableRow,
): boolean {
  return holds.some((h) => matchesHold(h.scope, row));
}
