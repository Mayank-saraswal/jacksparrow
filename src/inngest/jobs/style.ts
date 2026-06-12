import { inngest } from "../client";
import { db } from "@/server/db";
import { getTenant } from "@/server/corsair";
import { threadDetail, type GmailThread } from "@/server/gmail";
import { parseAddress } from "@/lib/email";
import { cleanEmailBody } from "@/lib/email-clean";
import { extractDomain } from "@/lib/split-rules";
import {
  persistSamples,
  generateStyleProfile,
  shouldRegenerateProfile,
  type RawSample,
} from "@/server/style";

/**
 * Phase 2 — voice samples & style profile. Mines the user's OWN sent mail to
 * back voice-matched drafts, and regenerates a structured style profile as the
 * sample count crosses thresholds.
 */

/** Word-count bounds for a usable style sample. */
const STYLE_MIN_WORDS = 10;
const STYLE_MAX_WORDS = 2000;

/**
 * Mines a synced thread for the user's OWN sent messages and stores them as
 * voice samples. Idempotent: dedup by gmail message id (unique per user).
 */
export const styleIngestSent = inngest.createFunction(
  { id: "style-ingest-sent", retries: 2, triggers: { event: "style/ingest.sent" } },
  async ({ event, step }) => {
    const { userId, threadId } = event.data as {
      userId: string;
      threadId: string;
    };

    const samples = await step.run("extract-sent", async () => {
      const tenant = getTenant(userId);
      const raw = await tenant.gmail.api.threads.get({
        id: threadId,
        format: "full",
      });
      const t = raw as unknown as GmailThread;
      const detail = threadDetail(t);
      const labelById = new Map(
        (t.messages ?? []).map((m) => [m.id ?? "", m.labelIds ?? []]),
      );

      const out: RawSample[] = [];
      for (const m of detail.messages) {
        const labels = labelById.get(m.id) ?? [];
        if (!labels.includes("SENT")) continue;
        const cleaned = cleanEmailBody({ text: m.bodyText, html: m.bodyHtml });
        if (
          cleaned.wordCount < STYLE_MIN_WORDS ||
          cleaned.wordCount > STYLE_MAX_WORDS
        )
          continue;
        out.push({
          messageId: m.id,
          threadId,
          toDomain: extractDomain(parseAddress(m.to).email),
          bodyText: cleaned.text,
          wordCount: cleaned.wordCount,
        });
      }
      return out;
    });

    if (samples.length === 0) return { ingested: 0 };

    const result = await step.run("persist", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      const inserted = await persistSamples(userId, samples);
      const total = await db.sentMessageSample.count({ where: { userId } });
      return { inserted, total };
    });

    if (
      result.inserted > 0 &&
      shouldRegenerateProfile(result.total - result.inserted, result.total)
    ) {
      await step.sendEvent("regen-profile", {
        name: "style/profile.regenerate",
        data: { userId },
      });
    }

    return { ingested: result.inserted, total: result.total };
  },
);

/**
 * One-time backfill of the user's sent mail (last 180d, capped at 500), batched
 * embeddings. Triggered from Settings > Writing style.
 */
export const styleBackfill = inngest.createFunction(
  { id: "style-backfill", retries: 2, triggers: { event: "style/backfill" } },
  async ({ event, step }) => {
    const { userId } = event.data as { userId: string };
    const tenant = getTenant(userId);

    await step.run("ensure-user", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
    });

    const ids: string[] = [];
    let pageToken: string | undefined;
    let page = 0;
    do {
      const cursor: string | undefined = pageToken;
      const res = await step.run(`list-sent-${page}`, async () => {
        const out = await tenant.gmail.api.messages.list({
          q: "in:sent newer_than:180d",
          maxResults: 100,
          pageToken: cursor,
        });
        return {
          ids: (out.messages ?? [])
            .map((m) => m.id)
            .filter((id): id is string => typeof id === "string"),
          next: out.nextPageToken ?? null,
        };
      });
      ids.push(...res.ids);
      pageToken = res.next ?? undefined;
      page += 1;
    } while (pageToken && ids.length < 500 && page < 10);

    const capped = ids.slice(0, 500);
    let ingested = 0;

    for (let b = 0; b < capped.length; b += 100) {
      const batchIds = capped.slice(b, b + 100);
      const r = await step.run(`ingest-batch-${b}`, async () => {
        const msgs = await Promise.all(
          batchIds.map((id) =>
            tenant.gmail.api.messages
              .get({ id, format: "full" })
              .catch(() => null),
          ),
        );
        const cleaned: RawSample[] = [];
        for (const msg of msgs) {
          if (!msg) continue;
          const detail = threadDetail({
            messages: [msg],
          });
          const dm = detail.messages[0];
          if (!dm) continue;
          const c = cleanEmailBody({ text: dm.bodyText, html: dm.bodyHtml });
          if (c.wordCount < STYLE_MIN_WORDS || c.wordCount > STYLE_MAX_WORDS)
            continue;
          const messageId = (msg as { id?: string }).id ?? "";
          const threadId = (msg as { threadId?: string }).threadId ?? "";
          cleaned.push({
            messageId,
            threadId,
            toDomain: extractDomain(parseAddress(dm.to).email),
            bodyText: c.text,
            wordCount: c.wordCount,
          });
        }
        return { inserted: await persistSamples(userId, cleaned) };
      });
      ingested += r.inserted;
    }

    await step.sendEvent("regen-profile", {
      name: "style/profile.regenerate",
      data: { userId },
    });

    return { sampled: capped.length, ingested };
  },
);

/** Regenerates the structured StyleProfile from the user's stored samples. */
export const styleProfileRegenerate = inngest.createFunction(
  {
    id: "style-profile-regenerate",
    retries: 2,
    triggers: { event: "style/profile.regenerate" },
  },
  async ({ event, step }) => {
    const { userId } = event.data as { userId: string };

    const samples = await step.run("load-samples", async () =>
      db.sentMessageSample.findMany({
        where: { userId },
        select: { bodyText: true, wordCount: true },
        orderBy: { createdAt: "desc" },
        take: 300,
      }),
    );
    if (samples.length === 0) return { skipped: "no-samples" };

    const profile = await step.run("generate", () =>
      generateStyleProfile(samples),
    );
    if (!profile) return { skipped: "no-llm" };

    await step.run("save", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      await db.styleProfile.upsert({
        where: { userId },
        create: {
          userId,
          summary: profile,
          sampleCount: samples.length,
        },
        update: {
          summary: profile,
          sampleCount: samples.length,
        },
      });
    });

    return { ok: true, sampleCount: samples.length };
  },
);
