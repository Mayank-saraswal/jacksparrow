/**
 * Retry helper for flaky/throttled upstream calls (Corsair provider APIs, LLM
 * endpoints). Exponential backoff that honours HTTP 429 `Retry-After`.
 *
 * The decision helpers (`parseRetryAfter`, `computeBackoff`,
 * `retryAfterFromError`, `isRateLimitError`) are pure and unit-tested; the
 * `sleep` used by `withRetry` is injectable so tests stay instant.
 */

/** Exponential backoff for a 1-indexed attempt, capped at `maxMs`. */
export function computeBackoff(
  attempt: number,
  baseMs = 500,
  maxMs = 30_000,
): number {
  if (attempt < 1) return 0;
  const exp = baseMs * 2 ** (attempt - 1);
  return Math.min(exp, maxMs);
}

/**
 * Parse a `Retry-After` value (delta-seconds or an HTTP date) into milliseconds.
 * Returns null when the value is absent or unparseable.
 */
export function parseRetryAfter(
  value: string | number | null | undefined,
  now: number = Date.now(),
): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value > 0 ? value * 1000 : 0;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000;
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return Math.max(0, date.getTime() - now);
  return null;
}

interface ErrorLike {
  status?: unknown;
  statusCode?: unknown;
  code?: unknown;
  headers?: unknown;
  response?: { status?: unknown; headers?: unknown };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function statusOf(err: ErrorLike): number | null {
  const direct = err.status ?? err.statusCode ?? err.response?.status;
  if (typeof direct === "number") return direct;
  if (typeof direct === "string" && /^\d+$/.test(direct)) return Number(direct);
  return null;
}

/** True when an error looks like an HTTP 429 / rate-limit response. */
export function isRateLimitError(err: unknown): boolean {
  const e = asRecord(err) as ErrorLike | null;
  if (!e) return false;
  if (statusOf(e) === 429) return true;
  return typeof e.code === "string" && e.code.toLowerCase().includes("rate");
}

/** Pull the `Retry-After` delay (ms) out of an error's headers, if present. */
export function retryAfterFromError(
  err: unknown,
  now: number = Date.now(),
): number | null {
  const e = asRecord(err) as ErrorLike | null;
  if (!e) return null;
  const headerBags = [asRecord(e.headers), asRecord(e.response?.headers)];
  for (const bag of headerBags) {
    if (!bag) continue;
    const raw =
      (bag["retry-after"] as string | number | undefined) ??
      (bag["Retry-After"] as string | number | undefined);
    const parsed = parseRetryAfter(raw, now);
    if (parsed != null) return parsed;
  }
  return null;
}

export interface RetryInfo {
  attempt: number;
  delayMs: number;
  error: unknown;
}

export interface RetryOptions {
  /** Max retries after the first attempt (default 3). */
  retries?: number;
  baseMs?: number;
  maxMs?: number;
  onRetry?: (info: RetryInfo) => void;
  /** Injectable for tests; defaults to a real timer. */
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number): Promise<void> =>
  ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

/**
 * Run `fn`, retrying with exponential backoff. A 429 `Retry-After` overrides the
 * computed backoff. Re-throws the last error once retries are exhausted.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const retries = opts.retries ?? 3;
  const baseMs = opts.baseMs ?? 500;
  const maxMs = opts.maxMs ?? 30_000;
  const sleep = opts.sleep ?? defaultSleep;

  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries) throw err;
      const retryAfter = retryAfterFromError(err);
      const delayMs = retryAfter ?? computeBackoff(attempt, baseMs, maxMs);
      opts.onRetry?.({ attempt, delayMs, error: err });
      await sleep(delayMs);
    }
  }
}
