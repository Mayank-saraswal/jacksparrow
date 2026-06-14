import { describe, it, expect, vi } from "vitest";

import {
  computeBackoff,
  parseRetryAfter,
  isRateLimitError,
  retryAfterFromError,
  withRetry,
} from "./rate-limit";

describe("computeBackoff", () => {
  it("grows exponentially from the base", () => {
    expect(computeBackoff(1, 500)).toBe(500);
    expect(computeBackoff(2, 500)).toBe(1000);
    expect(computeBackoff(3, 500)).toBe(2000);
  });

  it("caps at maxMs", () => {
    expect(computeBackoff(20, 500, 30_000)).toBe(30_000);
  });

  it("returns 0 for invalid attempts", () => {
    expect(computeBackoff(0)).toBe(0);
    expect(computeBackoff(-3)).toBe(0);
  });
});

describe("parseRetryAfter", () => {
  it("parses delta-seconds", () => {
    expect(parseRetryAfter("5")).toBe(5000);
    expect(parseRetryAfter(3)).toBe(3000);
  });

  it("parses an HTTP date relative to now", () => {
    const now = Date.parse("2026-06-13T10:00:00.000Z");
    expect(parseRetryAfter("Sat, 13 Jun 2026 10:00:10 GMT", now)).toBe(10_000);
  });

  it("returns null for missing or garbage values", () => {
    expect(parseRetryAfter(null)).toBeNull();
    expect(parseRetryAfter(undefined)).toBeNull();
    expect(parseRetryAfter("")).toBeNull();
    expect(parseRetryAfter("soon")).toBeNull();
  });
});

describe("isRateLimitError", () => {
  it("detects 429 from various shapes", () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
    expect(isRateLimitError({ statusCode: 429 })).toBe(true);
    expect(isRateLimitError({ response: { status: 429 } })).toBe(true);
    expect(isRateLimitError({ code: "rate_limited" })).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isRateLimitError({ status: 500 })).toBe(false);
    expect(isRateLimitError(new Error("nope"))).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
  });
});

describe("retryAfterFromError", () => {
  it("reads retry-after from headers", () => {
    expect(retryAfterFromError({ headers: { "retry-after": "2" } })).toBe(2000);
    expect(
      retryAfterFromError({ response: { headers: { "Retry-After": "4" } } }),
    ).toBe(4000);
  });

  it("returns null when absent", () => {
    expect(retryAfterFromError({ status: 429 })).toBeNull();
    expect(retryAfterFromError("oops")).toBeNull();
  });
});

describe("withRetry", () => {
  it("returns on first success without sleeping", async () => {
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await withRetry(() => Promise.resolve("ok"), { sleep });
    expect(result).toBe("ok");
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries then succeeds", async () => {
    const sleep = vi.fn().mockResolvedValue(undefined);
    let calls = 0;
    const result = await withRetry(
      () => {
        calls += 1;
        if (calls < 3) return Promise.reject(new Error("flaky"));
        return Promise.resolve(calls);
      },
      { sleep, baseMs: 10 },
    );
    expect(result).toBe(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries", async () => {
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(
      withRetry(() => Promise.reject(new Error("always")), {
        sleep,
        retries: 2,
      }),
    ).rejects.toThrow("always");
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("honours a 429 Retry-After over computed backoff", async () => {
    const delays: number[] = [];
    const sleep = vi.fn((ms: number) => {
      delays.push(ms);
      return Promise.resolve();
    });
    const rateLimited = Object.assign(new Error("rate limited"), {
      status: 429,
      headers: { "retry-after": "7" },
    });
    let calls = 0;
    await withRetry(
      () => {
        calls += 1;
        if (calls === 1) return Promise.reject(rateLimited);
        return Promise.resolve("done");
      },
      { sleep, baseMs: 500 },
    );
    expect(delays[0]).toBe(7000);
  });
});
