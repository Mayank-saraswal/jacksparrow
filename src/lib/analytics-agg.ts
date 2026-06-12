/**
 * Pure analytics aggregation helpers. The nightly cron reads raw rows from the
 * DB and feeds them here to produce DailyOrgStat values. Counts/timings only —
 * never content. Kept pure for unit-testing the tricky cases (e.g. first
 * response computed before assignment, or never).
 */

export const ANALYTICS_METRICS = [
  "emails_received",
  "emails_sent",
  "ai_drafts_generated",
  "summaries_generated",
  "agent_actions_executed",
  "threads_assigned",
  "threads_closed",
  "avg_first_response_minutes",
  "active_members",
  "connected_accounts",
] as const;

export type AnalyticsMetric = (typeof ANALYTICS_METRICS)[number];

/** UTC day key (YYYY-MM-DD) for a timestamp. */
export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface AssignmentSample {
  threadId: string;
  /** When the thread was assigned to a member. */
  assignedAt: Date;
  /** When the first outbound reply was sent (null if none yet). */
  firstReplyAt: Date | null;
}

/**
 * Average minutes from assignment to first reply across threads. Threads with
 * no reply are excluded; a reply timestamped before assignment counts as 0
 * (clamped, not negative). Returns 0 when there are no qualifying threads.
 */
export function avgFirstResponseMinutes(samples: AssignmentSample[]): number {
  const durations: number[] = [];
  for (const s of samples) {
    if (!s.firstReplyAt) continue; // no response yet → excluded
    const ms = s.firstReplyAt.getTime() - s.assignedAt.getTime();
    durations.push(Math.max(0, ms) / 60000); // clamp negatives to 0
  }
  if (durations.length === 0) return 0;
  const total = durations.reduce((a, b) => a + b, 0);
  return Math.round(total / durations.length);
}

export interface StatRow {
  metric: AnalyticsMetric;
  value: number;
  dims: Record<string, string>;
}

/** Tally a per-user counter into org-total + per-member rows. */
export function tallyPerUser(
  metric: AnalyticsMetric,
  byUser: Record<string, number>,
): StatRow[] {
  const rows: StatRow[] = [];
  let total = 0;
  for (const [userId, count] of Object.entries(byUser)) {
    total += count;
    rows.push({ metric, value: count, dims: { userId } });
  }
  rows.push({ metric, value: total, dims: {} });
  return rows;
}

/** Delta vs previous period as a signed percentage (0 when previous is 0). */
export function deltaPct(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}
