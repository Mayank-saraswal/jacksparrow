import "server-only";

import * as Sentry from "@sentry/nextjs";

import { env } from "@/env";

/**
 * Lightweight Sentry runtime wrapper. We deliberately avoid the full Next.js
 * Sentry build wizard (no instrumentation/config files) — instead we lazily
 * `init` the SDK behind `SENTRY_DSN` the first time something is captured. When
 * the DSN is absent every call is a no-op, so the app runs unchanged locally.
 */
export type CaptureLevel = "info" | "warning" | "error";

let initialized = false;

function ensureInit(): boolean {
  if (!env.SENTRY_DSN) return false;
  if (!initialized) {
    Sentry.init({ dsn: env.SENTRY_DSN, tracesSampleRate: 0 });
    initialized = true;
  }
  return true;
}

/** Drop undefined tag values and coerce the rest to strings. */
function cleanTags(
  tags?: Record<string, string | null | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!tags) return out;
  for (const [key, value] of Object.entries(tags)) {
    if (value != null) out[key] = value;
  }
  return out;
}

export function captureException(
  error: unknown,
  tags?: Record<string, string | null | undefined>,
): void {
  if (!ensureInit()) return;
  Sentry.captureException(error, { tags: cleanTags(tags) });
}

export function captureMessage(
  message: string,
  level: CaptureLevel = "info",
  tags?: Record<string, string | null | undefined>,
): void {
  if (!ensureInit()) return;
  Sentry.captureMessage(message, { level, tags: cleanTags(tags) });
}
