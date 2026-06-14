import { inngest } from "../client";
import { db } from "@/server/db";
import { getTenant, parseTenantId } from "@/server/corsair";
import { summarizeDocument } from "@/server/summary";
import {
  ownerForContext,
  assertWithinLimit,
  incrementUsage,
} from "@/server/billing/entitlements";
import { logger } from "@/server/logger";
import { captureException } from "@/server/observability/sentry";
import { pageOnCall } from "@/server/observability/pagerduty";

/**
 * Fireflies "transcript ready" pipeline (Phase 3). Emitted from the Corsair
 * webhook route via `corsairWebhookReceived` when a Fireflies transcript syncs.
 *
 * Idempotent (keyed on `(userId, meetingId)`), per-tenant rate-limited, and it
 * REUSES the shared summarizer (`summarizeDocument`) and the FollowUp model +
 * `followUpReminders` job — no parallel summarizer or reminder system. The
 * resulting MeetingSummary also lands in `sync_items` (type "meeting") so it
 * appears in the unified feed/list views (SyncItem-only reads).
 */
interface FirefliesSentence {
  speaker_name?: string;
  text?: string;
}
interface FirefliesTranscript {
  title?: string;
  date?: string | number;
  sentences?: FirefliesSentence[];
  attendees?: { displayName?: string; email?: string; name?: string }[];
  summary?: { overview?: string } | null;
}

function transcriptText(t: FirefliesTranscript): string {
  const lines = (t.sentences ?? [])
    .map((s) => `${s.speaker_name ?? "?"}: ${s.text ?? ""}`)
    .filter((l) => l.trim().length > 2);
  const body = lines.join("\n").slice(0, 16_000);
  return body.length > 0 ? body : (t.summary?.overview ?? "");
}

function attendeeList(t: FirefliesTranscript): string[] {
  return (t.attendees ?? [])
    .map((a) => a.email ?? a.displayName ?? a.name ?? "")
    .filter((s) => s.length > 0);
}

function occurredAt(t: FirefliesTranscript): Date {
  if (t.date == null) return new Date();
  const d = typeof t.date === "number" ? new Date(t.date) : new Date(t.date);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export const firefliesTranscriptReady = inngest.createFunction(
  {
    id: "fireflies-transcript-ready",
    retries: 3,
    concurrency: { key: "event.data.tenantId", limit: 2 },
    throttle: { key: "event.data.tenantId", limit: 30, period: "1m" },
    triggers: { event: "fireflies/transcript.ready" },
    onFailure: async ({ error }) => {
      captureException(error, { fn: "fireflies-transcript-ready" });
      await pageOnCall(
        `fireflies-transcript-ready exhausted retries: ${error.message}`,
        "error",
      );
    },
  },
  async ({ event, step }) => {
    const { tenantId, transcriptId, corsairEntityId } = event.data as {
      tenantId: string;
      transcriptId: string;
      corsairEntityId: string;
    };
    const ref = parseTenantId(tenantId);
    if (ref.kind !== "user") return { skipped: "not-user" };
    const userId = ref.userId;

    // Idempotency: a re-delivered webhook must not create duplicates.
    const already = await step.run("check-existing", async () => {
      const row = await db.meetingSummary.findUnique({
        where: { userId_meetingId: { userId, meetingId: transcriptId } },
        select: { id: true },
      });
      return row?.id ?? null;
    });
    if (already) return { skipped: "duplicate" };

    const transcript = await step.run("load-transcript", async () => {
      const tenant = getTenant(userId);
      const res = await tenant.fireflies.api.transcripts.get({ transcriptId });
      return res as unknown as FirefliesTranscript;
    });
    if (!transcript) return { skipped: "not-found" };

    const summary = await step.run("summarize", async () => {
      const owner = ownerForContext(userId, null);
      try {
        await assertWithinLimit(owner, userId, "summary");
      } catch {
        return null;
      }
      const result = await summarizeDocument({
        title: transcript.title ?? "Meeting",
        text: transcriptText(transcript),
        kind: "meeting transcript",
      });
      if (result) void incrementUsage(owner, userId, "summary");
      return result;
    });
    if (!summary) {
      logger.info("fireflies: no summary produced", { tenantId, plugin: "fireflies" });
      return { skipped: "no-summary" };
    }

    const occurred = occurredAt(transcript);
    const title = transcript.title ?? "Meeting";
    const attendees = attendeeList(transcript);

    await step.run("persist-summary", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      await db.meetingSummary.upsert({
        where: { userId_meetingId: { userId, meetingId: transcriptId } },
        create: {
          userId,
          meetingId: transcriptId,
          source: "fireflies",
          title,
          tldr: summary.tldr,
          keyPoints: summary.keyPoints,
          actionItems: summary.actionItems,
          attendees,
          occurredAt: occurred,
          model: "gpt-4o-mini",
        },
        update: {
          title,
          tldr: summary.tldr,
          keyPoints: summary.keyPoints,
          actionItems: summary.actionItems,
          attendees,
          occurredAt: occurred,
        },
      });
    });

    // Action items owned by "me" become a follow-up via the SAME mechanism as
    // email follow-ups (one watch per meeting; the reminder job handles it).
    const meetingThreadId = `meeting:${transcriptId}`;
    await step.run("create-followups", async () => {
      const hasMine = summary.actionItems.some((a) => a.owner === "me");
      if (!hasMine) return { followUp: false };
      const pref = await db.userPreference.findUnique({
        where: { userId },
        select: { followUpDays: true },
      });
      const days = pref?.followUpDays ?? 3;
      await db.followUp.upsert({
        where: { userId_threadId: { userId, threadId: meetingThreadId } },
        create: {
          userId,
          threadId: meetingThreadId,
          lastSentAt: occurred,
          remindAt: new Date(Date.now() + days * 86_400_000),
          status: "watching",
        },
        update: {},
      });
      return { followUp: true };
    });

    // Surface in the unified feed/list views (SyncItem-only reads).
    await step.run("upsert-sync-item", async () => {
      await db.syncItem.upsert({
        where: { userId_corsairEntityId: { userId, corsairEntityId } },
        create: {
          userId,
          corsairEntityId,
          type: "meeting",
          title,
          snippet: summary.tldr,
          threadId: meetingThreadId,
          timestamp: occurred,
        },
        update: {
          type: "meeting",
          title,
          snippet: summary.tldr,
          threadId: meetingThreadId,
          timestamp: occurred,
        },
      });
    });

    return { ok: true, meetingId: transcriptId };
  },
);
