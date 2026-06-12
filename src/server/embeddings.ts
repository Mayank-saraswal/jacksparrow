import "server-only";

import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

import { env } from "@/env";
import { EMBED_MODEL, EMBED_DIMENSIONS } from "@/server/models";

export const EMBEDDING_MODEL = EMBED_MODEL;
export const EMBEDDING_DIMENSIONS = EMBED_DIMENSIONS;

/**
 * Embeds text with OpenAI via the Vercel AI SDK. Returns null when no
 * OPENAI_API_KEY is configured so callers can degrade gracefully.
 */
export async function embedText(text: string): Promise<number[] | null> {
  if (!env.OPENAI_API_KEY) return null;
  const value = text.trim();
  if (!value) return null;

  const { embedding } = await embed({
    model: openai.textEmbeddingModel(EMBED_MODEL),
    value,
  });
  return embedding;
}

/**
 * Embeds a batch of texts in a single API call (up to ~100 per call upstream).
 * Returns null when unconfigured. Empty strings are replaced with a single
 * space so index alignment with the input array is preserved.
 */
export async function embedBatch(texts: string[]): Promise<number[][] | null> {
  if (!env.OPENAI_API_KEY) return null;
  if (texts.length === 0) return [];
  const values = texts.map((t) => (t.trim().length > 0 ? t : " "));

  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel(EMBED_MODEL),
    values,
  });
  return embeddings;
}

/** pgvector text literal, e.g. [0.1,0.2,0.3]. */
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
