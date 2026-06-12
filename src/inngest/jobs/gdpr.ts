import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";
import { getTenant } from "@/server/corsair";
import { uploadExport } from "@/server/storage";

/**
 * GDPR jobs: export assembles the user's data into a JSON file in storage with
 * a signed URL; a daily sweep finds users past their 7-day soft-delete window
 * and runs the full cascade delete (app rows + Corsair tenant + Clerk user).
 * All destructive work happens here, never in a request handler.
 */

export const accountExport = inngest.createFunction(
  { id: "account-export", retries: 2, triggers: { event: "account/export.requested" } },
  async ({ event, step }) => {
    const { userId } = event.data as { userId: string };

    const bundle = await step.run("assemble", async () => {
      const [user, preference, summaries, style, auditRows] = await Promise.all([
        db.user.findUnique({ where: { id: userId } }),
        db.userPreference.findUnique({ where: { userId } }),
        db.threadSummary.findMany({
          where: { userId },
          select: { threadId: true, summary: true, createdAt: true },
          take: 5000,
        }),
        db.styleProfile.findUnique({ where: { userId } }),
        db.auditLog.findMany({
          where: { actorUserId: userId },
          select: { action: true, targetType: true, createdAt: true },
          take: 10000,
        }),
      ]);
      return { user, preference, summaries, style, auditRows };
    });

    const url = await step.run("upload", () => {
      const json = JSON.stringify(
        { exportedAt: new Date().toISOString(), ...bundle },
        null,
        2,
      );
      return uploadExport(
        `user/${userId}/export-${Date.now()}.json`,
        json,
        "application/json",
      );
    });

    auditSystem("export.downloaded", {
      actorUserId: userId,
      targetType: "account",
      targetId: userId,
      meta: { kind: "gdpr_export", delivered: Boolean(url) },
    });
    return { ok: true, delivered: Boolean(url) };
  },
);

export const accountDeletionSweep = inngest.createFunction(
  { id: "account-deletion-sweep", triggers: { cron: "0 4 * * *" } },
  async ({ step }) => {
    const due = await step.run("find-due", async () =>
      db.user.findMany({
        where: { deletionScheduledAt: { lte: new Date() } },
        select: { id: true },
      }),
    );
    for (const u of due) {
      await step.sendEvent(`del-${u.id}`, {
        name: "account/delete.execute",
        data: { userId: u.id },
      });
    }
    return { due: due.length };
  },
);

export const accountDelete = inngest.createFunction(
  { id: "account-delete", retries: 2, triggers: { event: "account/delete.execute" } },
  async ({ event, step }) => {
    const { userId } = event.data as { userId: string };

    // Re-check the soft-delete window is still active (user may have canceled).
    const stillScheduled = await step.run("recheck", async () => {
      const u = await db.user.findUnique({
        where: { id: userId },
        select: { deletionScheduledAt: true },
      });
      return Boolean(u?.deletionScheduledAt && u.deletionScheduledAt <= new Date());
    });
    if (!stillScheduled) return { skipped: "canceled-or-missing" };

    // Purge the user's Corsair tenant entities (their accounts → entities).
    await step.run("purge-corsair", async () => {
      const accounts = await db.corsairAccount.findMany({
        where: { tenantId: userId },
        select: { id: true },
      });
      const accountIds = accounts.map((a) => a.id);
      if (accountIds.length > 0) {
        await db.corsairEntity.deleteMany({
          where: { accountId: { in: accountIds } },
        });
        await db.corsairEvent.deleteMany({
          where: { accountId: { in: accountIds } },
        });
        await db.corsairAccount.deleteMany({
          where: { id: { in: accountIds } },
        });
      }
      void getTenant; // tenant scoping handled by tenantId filter above
    });

    // App rows cascade from User via FK; delete the User row last.
    await step.run("delete-app-rows", async () => {
      await db.user.delete({ where: { id: userId } }).catch(() => undefined);
    });

    // Delete the Clerk user (best-effort).
    await step.run("delete-clerk", async () => {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        await client.users.deleteUser(userId);
      } catch (err) {
        console.error("[gdpr] clerk delete failed:", err);
      }
    });

    auditSystem("settings.security_changed", {
      actorUserId: userId,
      targetType: "account",
      targetId: userId,
      meta: { action: "account_deleted" },
    });
    return { deleted: userId };
  },
);
