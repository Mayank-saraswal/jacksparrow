/**
 * Pure audit-meta hygiene. Audit `meta` must NEVER contain message bodies or
 * other content — only ids, counts, and subjects truncated to 80 chars. This
 * module enforces that defensively so a careless call site can't leak content.
 */

export const SUBJECT_MAX = 80;

/** Keys whose values are dropped entirely (likely to carry content). */
const BLOCKED_KEYS = new Set([
  "body",
  "bodyText",
  "bodyHtml",
  "content",
  "text",
  "message",
  "html",
  "snippet",
  "preview",
]);

/** Keys treated as subjects → truncated to SUBJECT_MAX with an ellipsis. */
const SUBJECT_KEYS = new Set(["subject", "title", "name"]);

export function truncateSubject(value: string): string {
  if (value.length <= SUBJECT_MAX) return value;
  return value.slice(0, SUBJECT_MAX - 1) + "…";
}

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [k: string]: Json };

/**
 * Recursively sanitizes a meta object: drops content-bearing keys, truncates
 * subjects, and caps depth/size so meta stays compact and content-free.
 */
export function sanitizeMeta(
  input: unknown,
  depth = 0,
): Record<string, Json> {
  if (depth > 4 || input == null || typeof input !== "object") return {};
  const out: Record<string, Json> = {};
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    if (BLOCKED_KEYS.has(key)) continue;
    out[key] = sanitizeValue(key, raw, depth);
  }
  return out;
}

function sanitizeValue(key: string, raw: unknown, depth: number): Json {
  if (typeof raw === "string") {
    return SUBJECT_KEYS.has(key) ? truncateSubject(raw) : truncateSubject(raw);
  }
  if (typeof raw === "number" || typeof raw === "boolean" || raw === null) {
    return raw;
  }
  if (Array.isArray(raw)) {
    return raw
      .slice(0, 50)
      .map((v) => sanitizeValue(key, v, depth + 1));
  }
  if (typeof raw === "object") {
    return sanitizeMeta(raw, depth + 1);
  }
  return null;
}
