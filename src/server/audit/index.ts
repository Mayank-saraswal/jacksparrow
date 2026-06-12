import "server-only";

import type { Prisma } from "../../../generated/prisma";
import { db } from "@/server/db";
import { sanitizeMeta } from "@/lib/audit-meta";
import type { AuditAction } from "./actions";

/**
 * Append-only audit writer. AuditLog SUPERSEDES ad-hoc logging: security-
 * relevant actions call `audit(...)`. Writes are fire-and-forget — they never
 * block or fail the parent mutation. On write failure we buffer to an
 * in-process queue, retry on the next call, and log the full payload to stderr.
 *
 * Meta is sanitized (no message content; subjects truncated) before storage.
 */

export type AuditActorType = "user" | "system" | "agent";

/** Minimal context an audit call needs; satisfied by the tRPC ctx. */
export interface AuditContext {
  userId?: string | null;
  orgId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  actorType?: AuditActorType;
}

export interface AuditOptions {
  targetType: string;
  targetId?: string;
  meta?: Record<string, unknown>;
  /** Override the org/actor for system/agent writes. */
  orgId?: string | null;
  actorUserId?: string | null;
  actorType?: AuditActorType;
}

type PendingRow = Prisma.AuditLogCreateManyInput;

const fallbackQueue: PendingRow[] = [];
const MAX_QUEUE = 500;

function buildRow(
  ctx: AuditContext,
  action: AuditAction,
  opts: AuditOptions,
): PendingRow {
  return {
    action,
    targetType: opts.targetType,
    targetId: opts.targetId ?? null,
    orgId: opts.orgId ?? ctx.orgId ?? null,
    actorUserId:
      opts.actorUserId !== undefined
        ? opts.actorUserId
        : (ctx.userId ?? null),
    actorType: opts.actorType ?? ctx.actorType ?? "user",
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null,
    meta: sanitizeMeta(opts.meta ?? {}),
  };
}

async function flushQueue(): Promise<void> {
  if (fallbackQueue.length === 0) return;
  const batch = fallbackQueue.splice(0, fallbackQueue.length);
  try {
    await db.auditLog.createMany({ data: batch });
  } catch (err) {
    // Re-buffer (bounded) and keep going.
    for (const row of batch) {
      if (fallbackQueue.length < MAX_QUEUE) fallbackQueue.push(row);
    }
    console.error("[audit] flush failed; re-buffered", err);
  }
}

/**
 * Record an audit event. Fire-and-forget: returns immediately, never throws.
 */
export function audit(
  ctx: AuditContext,
  action: AuditAction,
  opts: AuditOptions,
): void {
  const row = buildRow(ctx, action, opts);
  void (async () => {
    try {
      await flushQueue();
      await db.auditLog.create({ data: row });
    } catch (err) {
      if (fallbackQueue.length < MAX_QUEUE) fallbackQueue.push(row);
      console.error(
        "[audit] write failed; buffered. payload:",
        JSON.stringify(row),
        err,
      );
    }
  })();
}

/** System-actor convenience for Inngest jobs (no request context). */
export function auditSystem(
  action: AuditAction,
  opts: AuditOptions & { orgId?: string | null },
): void {
  audit({ actorType: "system" }, action, { ...opts, actorType: "system" });
}
