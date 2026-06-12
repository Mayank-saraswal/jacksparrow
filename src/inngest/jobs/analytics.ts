import { inngest } from "../client";
import { db } from "@/server/db";
import {
  avgFirstResponseMinutes,
  tallyPerUser,
  type AssignmentSample,
  type StatRow,
} from "@/lib/analytics-agg";

/**
 * Pre-aggregated analytics. A nightly cron fans out per-org compute for
 * yesterday; a backfill computes the last 90 days. Both are idempotent: each
 * (org, day) recompute replaces that day's rows. Counts/timings only.
 */

function dayBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const end = new Date(start.getTime() + 86_400_000);
  return { start, end };
}

/** Compute + persist one org-day. Replaces existing rows for that day. */
async function computeOrgDay(orgId: string, date: Date): Promise<number> {
  const { start, end } = dayBounds(date);
  const inRange = { gte: start, lt: end };

  const inboxes = await db.sharedInbox.findMany({
    where: { orgId },
    select: { id: true },
  });
  const inboxIds = inboxes.map((i) => i.id);

  const [auditRows, assignEvents] = await Promise.all([
    db.auditLog.findMany({
      where: { orgId, createdAt: inRange },
      select: { action: true, actorUserId: true },
    }),
    inboxIds.length > 0
      ? db.assignmentEvent.findMany({
          where: { sharedInboxId: { in: inboxIds }, createdAt: inRange },
          select: { kind: true, threadId: true, createdAt: true, actorUserId: true },
        })
      : Promise.resolve([]),
  ]);

  // Per-user tallies from the audit trail.
  const sentByUser: Record<string, number> = {};
  const agentByUser: Record<string, number> = {};
  const activeMembers = new Set<string>();
  for (const a of auditRows) {
    if (a.actorUserId) activeMembers.add(a.actorUserId);
    if (a.action === "email.sent" && a.actorUserId) {
      sentByUser[a.actorUserId] = (sentByUser[a.actorUserId] ?? 0) + 1;
    }
    if (a.action === "agent.action_executed" && a.actorUserId) {
      agentByUser[a.actorUserId] = (agentByUser[a.actorUserId] ?? 0) + 1;
    }
  }

  // Assignment-derived metrics.
  const closedByUser: Record<string, number> = {};
  let assigned = 0;
  const firstReplyByThread = new Map<string, Date>();
  const assignedAtByThread = new Map<string, Date>();
  for (const e of assignEvents) {
    if (e.kind === "assigned") {
      assigned += 1;
      if (!assignedAtByThread.has(e.threadId))
        assignedAtByThread.set(e.threadId, e.createdAt);
    }
    if (e.kind === "closed" && e.actorUserId) {
      closedByUser[e.actorUserId] = (closedByUser[e.actorUserId] ?? 0) + 1;
    }
    if (e.kind === "replied" && !firstReplyByThread.has(e.threadId)) {
      firstReplyByThread.set(e.threadId, e.createdAt);
    }
  }
  const samples: AssignmentSample[] = [...assignedAtByThread.entries()].map(
    ([threadId, assignedAt]) => ({
      threadId,
      assignedAt,
      firstReplyAt: firstReplyByThread.get(threadId) ?? null,
    }),
  );

  const rows: StatRow[] = [
    ...tallyPerUser("emails_sent", sentByUser),
    ...tallyPerUser("agent_actions_executed", agentByUser),
    ...tallyPerUser("threads_closed", closedByUser),
    { metric: "threads_assigned", value: assigned, dims: {} },
    { metric: "active_members", value: activeMembers.size, dims: {} },
    { metric: "connected_accounts", value: inboxIds.length, dims: {} },
    {
      metric: "avg_first_response_minutes",
      value: avgFirstResponseMinutes(samples),
      dims: {},
    },
  ];

  const dateOnly = new Date(start);
  const metrics = [...new Set(rows.map((r) => r.metric))];
  await db.$transaction([
    db.dailyOrgStat.deleteMany({
      where: { orgId, date: dateOnly, metric: { in: metrics } },
    }),
    db.dailyOrgStat.createMany({
      data: rows.map((r) => ({
        orgId,
        date: dateOnly,
        metric: r.metric,
        value: r.value,
        dims: r.dims,
      })),
    }),
  ]);

  return rows.length;
}

export const analyticsCron = inngest.createFunction(
  { id: "analytics-cron", triggers: { cron: "30 3 * * *" } },
  async ({ step }) => {
    const orgs = await step.run("list-orgs", async () =>
      db.organization.findMany({ select: { id: true } }),
    );
    const yesterday = new Date(Date.now() - 86_400_000);
    for (const o of orgs) {
      await step.run(`compute-${o.id}`, () => computeOrgDay(o.id, yesterday));
    }
    return { orgs: orgs.length };
  },
);

export const analyticsBackfill = inngest.createFunction(
  {
    id: "analytics-backfill",
    retries: 2,
    concurrency: { key: "event.data.orgId", limit: 1 },
    triggers: { event: "analytics/backfill.requested" },
  },
  async ({ event, step }) => {
    const { orgId } = event.data as { orgId: string };
    for (let d = 1; d <= 90; d++) {
      const day = new Date(Date.now() - d * 86_400_000);
      await step.run(`backfill-${d}`, () => computeOrgDay(orgId, day));
    }
    return { orgId, days: 90 };
  },
);
