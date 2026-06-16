import "server-only";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/server/db";
import { SUMMARY_MODEL } from "@/server/models";
import { embedText, embedBatch, toVectorLiteral } from "@/server/embeddings";

/**
 * Voice-matching: derive a structured writing-style profile from the user's own
 * sent mail and retrieve the most relevant samples as few-shot references for
 * draft generation. All reads are tenant-scoped by userId.
 */

export const styleProfileSchema = z.object({
  greeting: z.string().max(120).describe("how they typically open a message"),
  signOff: z.string().max(120).describe("how they typically close"),
  averageWords: z.number().int().min(0),
  formality: z.number().int().min(1).max(5).describe("1 casual … 5 formal"),
  emojiUsage: z.enum(["none", "rare", "frequent"]),
  sentenceRhythm: z.string().max(240).describe("short/punchy vs long/flowing"),
  commonPhrases: z.array(z.string()).max(12),
  languages: z.array(z.string()).max(5),
});

export type StyleProfileSummary = z.infer<typeof styleProfileSchema>;

// Regenerate the profile as the corpus grows: at 20/50/100, then every +100.
export function shouldRegenerateProfile(
  prevCount: number,
  newCount: number,
): boolean {
  const crossed = (t: number) => prevCount < t && newCount >= t;
  if (crossed(20) || crossed(50) || crossed(100)) return true;
  if (newCount > 100 && Math.floor(newCount / 100) > Math.floor(prevCount / 100))
    return true;
  return false;
}

interface SampleRow {
  bodyText: string;
  wordCount: number;
}

/** Picks a spread of short/medium/long samples so the profile isn't skewed. */
export function stratifiedSample<T extends SampleRow>(
  samples: T[],
  perBucket = 8,
): T[] {
  const sorted = [...samples].sort((a, b) => a.wordCount - b.wordCount);
  const third = Math.ceil(sorted.length / 3) || 1;
  const short = sorted.slice(0, third);
  const medium = sorted.slice(third, third * 2);
  const long = sorted.slice(third * 2);
  const take = (arr: T[]) => arr.slice(0, perBucket);
  return [...take(short), ...take(medium), ...take(long)];
}

/** One LLM call → a validated StyleProfile summary. Null if AI unconfigured. */
export async function generateStyleProfile(
  samples: SampleRow[],
): Promise<StyleProfileSummary | null> {
  if (!env.OPENAI_API_KEY) return null;
  if (samples.length === 0) return null;

  const chosen = stratifiedSample(samples);
  const corpus = chosen
    .map((s, i) => `--- Sample ${i + 1} (${s.wordCount} words) ---\n${s.bodyText}`)
    .join("\n\n")
    .slice(0, 12_000);

  const { object } = await generateObject({
    model: openai(SUMMARY_MODEL),
    schema: styleProfileSchema,
    prompt: [
      "Analyse the following emails written BY one person and describe their",
      "writing style as structured data. Focus on reusable habits, not the",
      "content of any single message. Be concise.",
      "",
      corpus,
    ].join("\n"),
  });

  return object;
}

export interface RetrievedSample {
  bodyText: string;
  toDomain: string;
  wordCount: number;
}

/**
 * Retrieves up to `k` nearest samples to the thread text PLUS up to `domainK`
 * samples sent to the same recipient domain (per-relationship register). The
 * two queries run in parallel; results are de-duplicated.
 */
export async function retrieveStyleSamples(
  userId: string,
  threadText: string,
  toDomain: string,
  k = 5,
  domainK = 3,
): Promise<RetrievedSample[]> {
  const vector = await embedText(threadText.slice(0, 4000));

  const nearestP: Promise<RetrievedSample[]> = vector
    ? db.$queryRaw`
        SELECT body_text AS "bodyText", to_domain AS "toDomain", word_count AS "wordCount"
        FROM sent_message_samples
        WHERE user_id = ${userId} AND embedding IS NOT NULL
        ORDER BY embedding <=> ${toVectorLiteral(vector)}::public.vector
        LIMIT ${k}`
    : Promise.resolve([]);

  const domainP: Promise<RetrievedSample[]> = toDomain
    ? db.$queryRaw`
        SELECT body_text AS "bodyText", to_domain AS "toDomain", word_count AS "wordCount"
        FROM sent_message_samples
        WHERE user_id = ${userId} AND to_domain = ${toDomain}
        ORDER BY created_at DESC
        LIMIT ${domainK}`
    : Promise.resolve([]);

  const [nearest, domain] = await Promise.all([nearestP, domainP]);

  const seen = new Set<string>();
  const out: RetrievedSample[] = [];
  for (const s of [...domain, ...nearest]) {
    const key = s.bodyText.slice(0, 64);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

export interface RawSample {
  messageId: string;
  threadId: string;
  toDomain: string;
  bodyText: string;
  wordCount: number;
}

/**
 * De-duplicates against already-stored samples, batch-embeds the new ones, and
 * inserts them (with embeddings via raw SQL so pgvector accepts the literal).
 * Returns the number of new samples persisted.
 */
export async function persistSamples(
  userId: string,
  samples: RawSample[],
): Promise<number> {
  const withId = samples.filter((s) => s.messageId);
  if (withId.length === 0) return 0;

  const existing = await db.sentMessageSample.findMany({
    where: { userId, corsairEntityId: { in: withId.map((s) => s.messageId) } },
    select: { corsairEntityId: true },
  });
  const have = new Set(existing.map((e) => e.corsairEntityId));
  const fresh = withId.filter((s) => !have.has(s.messageId));
  if (fresh.length === 0) return 0;

  const vectors = await embedBatch(fresh.map((s) => s.bodyText));

  for (let i = 0; i < fresh.length; i++) {
    const s = fresh[i]!;
    const vec = vectors?.[i];
    if (vec) {
      const literal = toVectorLiteral(vec);
      await db.$executeRaw`
        INSERT INTO sent_message_samples
          (id, user_id, corsair_entity_id, thread_id, to_domain, body_text, word_count, embedding, created_at)
        VALUES (gen_random_uuid()::text, ${userId}, ${s.messageId}, ${s.threadId}, ${s.toDomain}, ${s.bodyText}, ${s.wordCount}, ${literal}::public.vector, now())
        ON CONFLICT (user_id, corsair_entity_id) DO NOTHING`;
    } else {
      await db.sentMessageSample
        .create({
          data: {
            userId,
            corsairEntityId: s.messageId,
            threadId: s.threadId,
            toDomain: s.toDomain,
            bodyText: s.bodyText,
            wordCount: s.wordCount,
          },
        })
        .catch(() => undefined);
    }
  }
  return fresh.length;
}

/** System prompt: voice rules + few-shot style references. */
export function buildDraftSystemPrompt(
  profile: StyleProfileSummary | null,
  samples: RetrievedSample[],
  mode: "reply" | "followup",
): string {
  const lines: string[] = [
    "You are drafting an email AS the user, in their own voice.",
    "Rules:",
    "- Match the user's tone, length, greeting and sign-off habits.",
    "- Write in the same language as the thread.",
    "- NEVER invent facts, commitments, dates, or numbers not present in the",
    "  thread or the user's instruction. If something is unknown, stay vague or",
    "  leave a clearly-marked placeholder like [detail].",
    "- Output the email BODY ONLY. No subject line, no quoted history, no",
    "  meta-commentary.",
    mode === "followup"
      ? "- This is a polite follow-up nudge on a thread with no reply."
      : "- This is a reply to the latest message in the thread.",
  ];

  if (profile) {
    lines.push(
      "",
      "The user's writing style (derived from their sent mail):",
      JSON.stringify(profile),
    );
  }

  if (samples.length > 0) {
    lines.push(
      "",
      "Reference samples of how the user actually writes (mimic tone/format,",
      "not content):",
    );
    samples.forEach((s, i) => {
      lines.push(`--- Example ${i + 1} ---`, s.bodyText.slice(0, 1200));
    });
  }

  return lines.join("\n");
}

/** User prompt: the thread context + optional instruction. */
export function buildDraftUserPrompt(
  threadContext: string,
  instruction: string | undefined,
  mode: "reply" | "followup",
): string {
  return [
    "Thread context (most recent message last):",
    threadContext.slice(0, 8000),
    "",
    instruction
      ? `User instruction for this draft: ${instruction}`
      : mode === "followup"
        ? "Write a short, friendly follow-up."
        : "Write an appropriate reply.",
  ].join("\n");
}
