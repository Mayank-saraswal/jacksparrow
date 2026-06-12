import type { Prisma } from "../../../generated/prisma";
import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";
import { uploadExport } from "@/server/storage";

/**
 * Streams matching audit rows to a CSV in storage with a 24h signed URL — large
 * exports never run in a request handler. Records export.downloaded when ready.
 */

interface ExportFilters {
  from?: string;
  to?: string;
  actorUserId?: string;
  action?: string;
  targetType?: string;
}

function csvCell(v: unknown): string {
  let s: string;
  if (v == null) s = "";
  else if (typeof v === "string") s = v;
  else if (typeof v === "number" || typeof v === "boolean") s = String(v);
  else s = JSON.stringify(v) ?? "";
  return `"${s.replace(/"/g, '""')}"`;
}

export const auditExport = inngest.createFunction(
  { id: "audit-export", retries: 2, triggers: { event: "audit/export.requested" } },
  async ({ event, step }) => {
    const { orgId, userId, filters } = event.data as {
      orgId: string;
      userId: string;
      filters: ExportFilters;
    };

    const where: Prisma.AuditLogWhereInput = {
      orgId,
      ...(filters.actorUserId ? { actorUserId: filters.actorUserId } : {}),
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.targetType ? { targetType: filters.targetType } : {}),
      ...(filters.from || filters.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
    };

    // Page through in chunks so large exports don't load everything at once.
    const header = "created_at,actor_user_id,actor_type,action,target_type,target_id,ip,meta\n";
    const lines: string[] = [header];
    let cursor: string | undefined;
    for (let i = 0; i < 200; i++) {
      const batch = await step.run(`page-${i}`, async () =>
        db.auditLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: 1000,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        }),
      );
      if (batch.length === 0) break;
      for (const r of batch) {
        lines.push(
          [
            csvCell(r.createdAt),
            csvCell(r.actorUserId),
            csvCell(r.actorType),
            csvCell(r.action),
            csvCell(r.targetType),
            csvCell(r.targetId),
            csvCell(r.ip),
            csvCell(r.meta),
          ].join(",") + "\n",
        );
      }
      cursor = batch[batch.length - 1]?.id;
      if (batch.length < 1000) break;
    }

    const url = await step.run("upload", () =>
      uploadExport(
        `org/${orgId}/audit-${Date.now()}.csv`,
        lines.join(""),
        "text/csv",
      ),
    );

    auditSystem("export.downloaded", {
      orgId,
      actorUserId: userId,
      targetType: "audit_log",
      targetId: orgId,
      meta: { rows: lines.length - 1, delivered: Boolean(url) },
    });
    return { ok: true, rows: lines.length - 1, delivered: Boolean(url) };
  },
);
