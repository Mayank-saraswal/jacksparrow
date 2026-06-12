import "server-only";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { env } from "@/env";
import { TRIAGE_MODEL } from "@/server/models";
import { applyPostRules } from "@/lib/affinity";

export const PRIORITY_LABELS = [
  "urgent",
  "important",
  "normal",
  "low",
] as const;
export type PriorityLabel = (typeof PRIORITY_LABELS)[number];

export { TRIAGE_MODEL };

const triageSchema = z.object({
  label: z.enum(PRIORITY_LABELS),
  reason: z.string().max(280),
});

export interface ClassifyInput {
  subject: string;
  sender: string;
  snippet: string;
  knownSender: boolean;
  /** Learned-triage signal: effective sender affinity + plain-language notes. */
  affinity?: { score: number; notes: string[] };
}

/**
 * Classifies an email's priority with a cheap LLM, then applies deterministic
 * affinity post-rules (cap at "low" for strongly-ignored senders, floor at
 * "important" for strongly-engaged ones). Returns null when no OPENAI_API_KEY
 * is set so callers can skip scoring.
 */
export async function classifyEmail(
  input: ClassifyInput,
): Promise<{ label: PriorityLabel; reason: string } | null> {
  if (!env.OPENAI_API_KEY) return null;

  const affinityBlock =
    input.affinity && input.affinity.notes.length > 0
      ? ["", "Learned signals about this sender:", ...input.affinity.notes]
      : [];

  const { object } = await generateObject({
    model: openai(TRIAGE_MODEL),
    schema: triageSchema,
    prompt: [
      "Classify the priority of this email for the recipient.",
      "",
      `Sender: ${input.sender}${input.knownSender ? " (known correspondent)" : ""}`,
      `Subject: ${input.subject}`,
      `Preview: ${input.snippet}`,
      ...affinityBlock,
      "",
      "Labels:",
      '- "urgent": time-sensitive and needs action soon, from a real person.',
      '- "important": relevant to the user or from a known contact.',
      '- "normal": routine personal/work mail.',
      '- "low": newsletters, promotions, receipts, automated noise.',
      "Weigh the learned signals: senders the user engages with skew higher;",
      "senders they consistently ignore skew lower.",
      "Respond with the label and a one-sentence reason.",
    ].join("\n"),
  });

  // Deterministic guardrail on top of the LLM's choice.
  const affinityScore = input.affinity?.score ?? 0;
  const post = applyPostRules(object.label, affinityScore);
  if (post.applied) {
    const why =
      post.applied === "cap"
        ? `auto-capped to low (sender affinity ${affinityScore.toFixed(1)})`
        : `auto-raised to important (sender affinity ${affinityScore.toFixed(1)})`;
    return { label: post.label, reason: `${object.reason} [${why}]` };
  }
  return object;
}
