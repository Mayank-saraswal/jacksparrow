import "server-only";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { env } from "@/env";

export const PRIORITY_LABELS = [
  "urgent",
  "important",
  "normal",
  "low",
] as const;
export type PriorityLabel = (typeof PRIORITY_LABELS)[number];

export const TRIAGE_MODEL = "gpt-4o-mini";

const triageSchema = z.object({
  label: z.enum(PRIORITY_LABELS),
  reason: z.string().max(280),
});

export interface ClassifyInput {
  subject: string;
  sender: string;
  snippet: string;
  knownSender: boolean;
}

/**
 * Classifies an email's priority with a cheap LLM. Returns null when no
 * OPENAI_API_KEY is set so callers can skip scoring.
 */
export async function classifyEmail(
  input: ClassifyInput,
): Promise<{ label: PriorityLabel; reason: string } | null> {
  if (!env.OPENAI_API_KEY) return null;

  const { object } = await generateObject({
    model: openai(TRIAGE_MODEL),
    schema: triageSchema,
    prompt: [
      "Classify the priority of this email for the recipient.",
      "",
      `Sender: ${input.sender}${input.knownSender ? " (known correspondent)" : ""}`,
      `Subject: ${input.subject}`,
      `Preview: ${input.snippet}`,
      "",
      "Labels:",
      '- "urgent": time-sensitive and needs action soon, from a real person.',
      '- "important": relevant to the user or from a known contact.',
      '- "normal": routine personal/work mail.',
      '- "low": newsletters, promotions, receipts, automated noise.',
      "Respond with the label and a one-sentence reason.",
    ].join("\n"),
  });

  return object;
}
