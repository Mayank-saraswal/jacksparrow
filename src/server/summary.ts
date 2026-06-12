import "server-only";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/server/db";
import { SUMMARY_MODEL } from "@/server/models";
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
 * Generates a structured summary. Retries once with the validation error
 * appended if the model returns schema-invalid output, then returns null.
 */
export async function generateThreadSummary(
  detail: ThreadDetail,
): Promise<ThreadSummaryResult | null> {
  if (!env.OPENAI_API_KEY) return null;

  const base = [
    "Summarize this email thread for the recipient (the user is \"me\").",
    "Be terse and factual. Do not invent information.",
    "",
    `Subject: ${detail.subject}`,
    "",
    threadToText(detail),
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
