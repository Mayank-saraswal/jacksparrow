import "server-only";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/server/db";
import { SUMMARY_MODEL } from "@/server/models";
import { summaryCacheDecision } from "@/lib/summary-cache";
import {
  assertWithinLimit,
  incrementUsage,
  type OwnerRef,
} from "@/server/billing/entitlements";
import type { ThreadDetail } from "@/server/gmail";

/**
 * Lazy, cached thread summaries. Summaries are keyed by the thread's corsair
 * entity version; the router only generates when there's no fresh cache hit.
 */

export const summarySchema = z.object({
  tldr: z.string().max(240),
  keyPoints: z.array(z.string()).max(5),
  actionItems: z
    .array(
      z.object({
        text: z.string(),
        owner: z.enum(["me", "them", "unclear"]),
      }),
    )
    .max(10),
  unansweredQuestions: z.array(z.string()).max(10),
});

export type ThreadSummaryResult = z.infer<typeof summarySchema>;

/** Auto-render threshold: long or multi-message threads get a summary card. */
export function shouldAutoSummarize(
  messageCount: number,
  wordCount: number,
): boolean {
  return messageCount >= 3 || wordCount > 600;
}

/**
 * The current corsair entity version for a gmail thread (tenant-scoped). Falls
 * back to a content-derived version when the entity isn't cached yet.
 */
export async function getThreadEntityVersion(
  userId: string,
  threadId: string,
  detail: ThreadDetail,
): Promise<string> {
  const entity = await db.corsairEntity.findFirst({
    where: {
      entityId: threadId,
      entityType: "threads",
      account: { tenantId: userId },
    },
    select: { version: true },
  });
  if (entity?.version) return entity.version;
  const last = detail.messages[detail.messages.length - 1];
  return `${detail.messages.length}:${last?.id ?? ""}`;
}

function threadToText(detail: ThreadDetail): string {
  return detail.messages
    .map(
      (m) =>
        `From: ${m.fromName} <${m.fromEmail}> (${m.date ?? ""})\n${(
          m.bodyText ??
          m.snippet ??
          ""
        ).slice(0, 4000)}`,
    )
    .join("\n\n---\n\n")
    .slice(0, 16_000);
}

/**
 * Generates a structured summary from arbitrary document text (email thread,
 * meeting transcript, …). Retries once with the validation error appended if
 * the model returns schema-invalid output, then returns null. This is the ONE
 * summarizer — email threads and Fireflies transcripts both flow through it.
 */
export async function summarizeDocument(input: {
  title: string;
  text: string;
  kind?: string;
}): Promise<ThreadSummaryResult | null> {
  if (!env.OPENAI_API_KEY) return null;

  const base = [
    `Summarize this ${input.kind ?? "email thread"} for the recipient (the user is "me").`,
    "Be terse and factual. Do not invent information.",
    "",
    `Subject: ${input.title}`,
    "",
    input.text,
  ].join("\n");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { object } = await generateObject({
        model: openai(SUMMARY_MODEL),
        schema: summarySchema,
        prompt:
          attempt === 0
            ? base
            : `${base}\n\nYour previous output failed validation. Return STRICTLY valid JSON matching the schema (tldr ≤ 240 chars, ≤ 5 key points).`,
      });
      return object;
    } catch (err) {
      if (attempt === 1) {
        console.error("[summary] generation failed", err);
        return null;
      }
    }
  }
  return null;
}

/**
 * Generates a structured summary for a Gmail/Outlook thread. Thin wrapper over
 * `summarizeDocument` so the email path is unchanged.
 */
export async function generateThreadSummary(
  detail: ThreadDetail,
): Promise<ThreadSummaryResult | null> {
  return summarizeDocument({
    title: detail.subject,
    text: threadToText(detail),
    kind: "email thread",
  });
}

export interface ResolvedThreadSummary {
  result: ThreadSummaryResult;
  stale: boolean;
  generatedAt: string;
}

/**
 * Single source of truth for the lazy/cached summary flow, shared by the inbox
 * `summary` procedure and the agent `summarizeThread` tool. Returns the cached
 * summary when fresh (or stale without `refresh`), otherwise enforces the AI
 * budget, generates, increments usage, and persists. Returns null when no
 * summary is available (no OpenAI key and no cache).
 */
export async function resolveThreadSummary(args: {
  userId: string;
  threadId: string;
  detail: ThreadDetail;
  owner: OwnerRef;
  refresh?: boolean;
}): Promise<ResolvedThreadSummary | null> {
  const { userId, threadId, detail, owner } = args;
  const refresh = args.refresh ?? false;

  const currentVersion = await getThreadEntityVersion(userId, threadId, detail);
  const cached = await db.threadSummary.findFirst({
    where: { userId, threadId },
    orderBy: { createdAt: "desc" },
  });
  const state = summaryCacheDecision(currentVersion, cached?.entityVersion);

  const toResolved = (
    row: NonNullable<typeof cached>,
    stale: boolean,
  ): ResolvedThreadSummary => ({
    result: {
      tldr: row.summary,
      keyPoints: row.keyPoints as string[],
      actionItems: row.actionItems as ThreadSummaryResult["actionItems"],
      unansweredQuestions: row.unansweredQuestions as string[],
    },
    stale,
    generatedAt: row.createdAt.toISOString(),
  });

  if (state === "fresh" && cached) return toResolved(cached, false);
  if (state === "stale" && cached && !refresh) return toResolved(cached, true);

  // Generating a fresh summary is a paid AI action — enforce the budget.
  await assertWithinLimit(owner, userId, "summary");

  const generated = await generateThreadSummary(detail);
  if (!generated) {
    if (cached) return toResolved(cached, state === "stale");
    return null;
  }
  void incrementUsage(owner, userId, "summary");

  const saved = await db.threadSummary.upsert({
    where: {
      userId_threadId_entityVersion: {
        userId,
        threadId,
        entityVersion: currentVersion,
      },
    },
    create: {
      userId,
      threadId,
      entityVersion: currentVersion,
      summary: generated.tldr,
      keyPoints: generated.keyPoints,
      actionItems: generated.actionItems,
      unansweredQuestions: generated.unansweredQuestions,
      model: SUMMARY_MODEL,
    },
    update: {
      summary: generated.tldr,
      keyPoints: generated.keyPoints,
      actionItems: generated.actionItems,
      unansweredQuestions: generated.unansweredQuestions,
    },
  });
  return toResolved(saved, false);
}
