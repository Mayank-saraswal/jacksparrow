import { createHash } from "node:crypto";

/**
 * Stable content hash for embedding dedupe. The realtime sync pipeline embeds
 * `title + "\n" + snippet`; hashing the normalized form lets us skip the
 * OpenAI call entirely when the underlying content hasn't changed.
 */

/** Collapse runs of whitespace and trim, so cosmetic-only diffs hash equal. */
export function normalizeForHash(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** sha256 hex of `normalize(title) + "\n" + normalize(snippet)`. */
export function embeddingContentHash(title: string, snippet: string): string {
  const normalized = `${normalizeForHash(title)}\n${normalizeForHash(snippet)}`;
  return createHash("sha256").update(normalized).digest("hex");
}
