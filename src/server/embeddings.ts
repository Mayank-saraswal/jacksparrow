import "server-only";

import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

import { env } from "@/env";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;

/**
 * Embeds text with OpenAI via the Vercel AI SDK. Returns null when no
 * OPENAI_API_KEY is configured so callers can degrade gracefully.
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!env.OPENAI_API_KEY) return null;
  const value = text.trim();
  if (!value) return null;

  const { embedding } = await embed({
    model: openai.textEmbeddingModel(EMBEDDING_MODEL),
    value,
  });
  return embedding;
}

/** pgvector text literal, e.g. [0.1,0.2,0.3]. */
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
