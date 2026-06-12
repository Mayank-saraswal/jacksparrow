import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";
import { tenantId } from "@/server/corsair";
import {
  cutoffDate,
  isPurgeActive,
  isHeld,
  type LegalHoldScope,
} from "@/lib/retention";

/**
 * Retention purge engine. A nightly cron fans out one event per org that has a
 * policy; each org purge runs with per-org concurrency 1, deletes in batches of
 * 500 with step boundaries (retry-safe, no long transactions), cascades derived
 * rows when configured, and never touches rows under an active legal hold.
 */

const BATCH = 500;

export const retentionPurgeCron = inngest.createFunction(
  { id: "retention-purge-cron", triggers: { cron: "0 3 * * *" } },
  async ({ step }) => {
    const policies = await step.run("list-policies", async () =>
      db.retentionPolicy.findMany({ select: { orgId: true } }),
    );
    for (const p of policies) {
      await step.sendEvent(`purge-${p.orgId}`, {
        name: "retention/purge.requested",
        data: { orgId: p.orgId },
      });
    }
    return { orgs: policies.length };
  },
);

export const retentionPurge = inngest.createFunction(
  {
    id: "retention-purge",
    retries: 2,
    concurrency: { key: "event.data.orgId", limit: 1 },
    triggers: { event: "retention/purge.requested" },
  },
  async ({ event, step }) => {
    const { orgId } = event.data as { orgId: string };

    const policy = await step.run("load-policy", async () => {
      const p = await db.retentionPolicy.findUnique({ where: { orgId } });
      if (!p) return null;
      return {
        emailDays: p.emailDays,
        auditDays: p.auditDays,
        derivedFollowsSource: p.derivedFollowsSource,
        effectiveAt: p.effectiveAt?.toISOString() ?? null,
      };
    });
    if (!policy) return { skipped: "no-policy" };

    // Respect the 72h grace window after a tightening.
    if (!isPurgeActive(policy.effectiveAt ? new Date(policy.effectiveAt) : null)) {
      return { skipped: "in-grace" };
    }

    const holds = await step.run("load-holds", async () => {
      const rows = await db.legalHold.findMany({
        where: { orgId, active: true },
        select: { scope: true },
      });
      return rows.map((r) => ({ scope: r.scope as LegalHoldScope }));
    });

    const orgTenant = tenantId({ kind: "org", orgId });
    const emailCutoff = cutoffDate(policy.emailDays);

    let purgedEntities = 0;
    let purgedDerived = 0;

    // 1) Purge email entities older than the cutoff, batch by batch.
    if (emailCutoff) {
      for (let i = 0; i < 1000; i++) {
        const removed = await step.run(`purge-entities-${i}`, async () => {
          const batch = await db.corsairEntity.findMany({
            where: {
              account: { tenantId: orgTenant },
              entityType: "threads",
              updatedAt: { lt: emailCutoff },
            },
            take: BATCH,
            select: { id: true, entityId: true, updatedAt: true },
          });
          if (batch.length === 0) return { entities: 0, derived: 0 };

          // Skip rows protected by an active legal hold.
          const purgeable = batch.filter(
            (e) =>
              !isHeld(holds, {
                userId: orgTenant,
                sharedInboxId: null,
                timestamp: e.updatedAt,
              }),
          );
          const ids = purgeable.map((e) => e.id);
          const entityIds = purgeable.map((e) => e.entityId);
          if (ids.length === 0) return { entities: 0, derived: 0, done: true };

          let derived = 0;
          if (policy.derivedFollowsSource && entityIds.length > 0) {
            // No FK cascade to corsair tables — cascade explicitly per batch.
            const [emb, sum, sync] = await db.$transaction([
              db.emailEmbedding.deleteMany({
                where: { corsairEntityId: { in: ids } },
              }),
              db.threadSummary.deleteMany({
                where: { userId: orgTenant, threadId: { in: entityIds } },
              }),
              db.syncItem.deleteMany({
                where: { corsairEntityId: { in: ids } },
              }),
            ]);
            derived = emb.count + sum.count + sync.count;
          }
          const del = await db.corsairEntity.deleteMany({
            where: { id: { in: ids } },
          });
          return { entities: del.count, derived };
        });
        purgedEntities += removed.entities;
        purgedDerived += removed.derived;
        if (removed.entities < BATCH) break;
      }
    }

    // 3) Purge audit logs older than auditDays (>= 90 enforced upstream).
    const auditCutoff = cutoffDate(policy.auditDays);
    const purgedAudit = await step.run("purge-audit", async () => {
      if (!auditCutoff) return 0;
      // The append-only trigger allows DELETE only with this session GUC.
      const result = await db.$transaction(async (tx) => {
        await tx.$executeRawUnsafe("SET LOCAL app.allow_audit_purge = 'on'");
        return tx.auditLog.deleteMany({
          where: { orgId, createdAt: { lt: auditCutoff } },
        });
      });
      return result.count;
    });

    auditSystem("retention.purge_executed", {
      orgId,
      targetType: "organization",
      targetId: orgId,
      meta: {
        entities: purgedEntities,
        derived: purgedDerived,
        auditRows: purgedAudit,
      },
    });

    return { orgId, purgedEntities, purgedDerived, purgedAudit };
  },
);
