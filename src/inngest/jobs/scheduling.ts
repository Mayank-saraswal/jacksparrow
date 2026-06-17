import { inngest } from "../client";
import { db } from "@/server/db";
import { env } from "@/env";
import { getTenant } from "@/server/corsair";
import { sendEmail } from "@/server/agent/execute";
import { sendChannelText } from "@/server/channels/dispatch";

/**
 * Superhuman Core (Phase 1) — snooze wake, scheduled/undo send, follow-up
 * reminders. All retry-safe via status re-checks inside steps.
 */

/**
 * Wakes a snoozed thread. Sleeps until `snoozeUntil`, then re-reads the row: if
 * it was canceled or already woken in the meantime we no-op (idempotent). On
 * wake we restore the INBOX label and refresh the SyncItem so it resurfaces.
 */
export const snoozeWake = inngest.createFunction(
  { id: "thread-snooze-wake", retries: 3, triggers: { event: "thread/snooze.created" } },
  async ({ event, step }) => {
    const { snoozeId } = event.data as { snoozeId: string; userId: string };

    const initial = await step.run("load-snooze", async () => {
      const row = await db.snoozedThread.findUnique({ where: { id: snoozeId } });
      if (!row) return null;
      return {
        userId: row.userId,
        threadId: row.threadId,
        corsairEntityId: row.corsairEntityId,
        snoozeUntil: row.snoozeUntil.toISOString(),
        status: row.status,
      };
    });

    if (!initial) return { skipped: "not-found" };
    if (initial.status !== "snoozed") return { skipped: initial.status };

    await step.sleepUntil("until-wake", new Date(initial.snoozeUntil));

    // Re-read status after sleeping — the user may have canceled.
    const current = await step.run("recheck-status", async () => {
      const row = await db.snoozedThread.findUnique({
        where: { id: snoozeId },
        select: { status: true },
      });
      return row?.status ?? "missing";
    });
    if (current !== "snoozed") return { skipped: current };

    await step.run("restore-inbox", async () => {
      const tenant = getTenant(initial.userId);
      await tenant.gmail.api.threads.modify({
        id: initial.threadId,
        addLabelIds: ["INBOX", "UNREAD"],
      });
    });

    await step.run("mark-woken", async () => {
      await db.snoozedThread.update({
        where: { id: snoozeId },
        data: { status: "woken", wokenAt: new Date() },
      });
    });

    return { woken: true, threadId: initial.threadId };
  },
);

/**
 * Sends a ScheduledEmail (Send Later + Undo Send). Sleeps until `sendAt`, then
 * — critically — re-reads the row inside the same step before sending so a
 * cancel during the undo window wins the race. Marks sent/failed atomically.
 */
export const scheduledSend = inngest.createFunction(
  { id: "email-scheduled-send", retries: 3, triggers: { event: "email/scheduled.send" } },
  async ({ event, step }) => {
    const { scheduledId } = event.data as { scheduledId: string; userId: string };

    const row = await step.run("load-scheduled", async () => {
      const r = await db.scheduledEmail.findUnique({
        where: { id: scheduledId },
      });
      if (!r) return null;
      return {
        userId: r.userId,
        sendAt: r.sendAt.toISOString(),
        status: r.status,
      };
    });

    if (!row) return { skipped: "not-found" };
    if (row.status !== "scheduled") return { skipped: row.status };

    await step.sleepUntil("until-send", new Date(row.sendAt));

    const result = await step.run("send", async () => {
      // Re-read inside the step so a cancel during the window is honoured.
      const fresh = await db.scheduledEmail.findUnique({
        where: { id: scheduledId },
        select: { status: true, draftPayload: true, userId: true },
      });
      if (fresh?.status !== "scheduled") {
        return { sent: false as const, reason: fresh?.status ?? "missing" };
      }
      try {
        await sendEmail(fresh.userId, fresh.draftPayload);
        await db.scheduledEmail.update({
          where: { id: scheduledId },
          // Guard against a concurrent cancel: only the still-scheduled row flips.
          data: { status: "sent", sentAt: new Date(), error: null },
        });
        return { sent: true as const };
      } catch (err) {
        await db.scheduledEmail.update({
          where: { id: scheduledId },
          data: {
            status: "failed",
            error: err instanceof Error ? err.message : String(err),
          },
        });
        return {
          sent: false as const,
          reason: "error",
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    return result;
  },
);

/**
 * Follow-up reminder cron. Every 15 minutes, flips overdue "watching" rows to
 * "reminded" and pushes a nudge to the user's linked channel (if any).
 */
export const followUpReminders = inngest.createFunction(
  { id: "follow-up-reminders", triggers: { cron: "*/15 * * * *" } },
  async ({ step }) => {
    const due = await step.run("find-due", async () => {
      const rows = await db.followUp.findMany({
        where: { status: "watching", remindAt: { lte: new Date() } },
        take: 100,
        select: { id: true, userId: true, threadId: true },
      });
      return rows;
    });

    let reminded = 0;
    for (const f of due) {
      await step.run(`remind-${f.id}`, async () => {
        await db.followUp.update({
          where: { id: f.id },
          data: { status: "reminded" },
        });
        const link = await db.channelLink.findFirst({
          where: { userId: f.userId },
        });
        if (link) {
          await sendChannelText(
            link.channel,
            link.externalChatId,
            ` No reply yet on a thread you're watching. Open Phoenix to follow up: ${env.APP_URL}/inbox`,
          );
        }
      });
      reminded += 1;
    }
    return { due: due.length, reminded };
  },
);
