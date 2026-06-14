import "server-only";

import { env } from "@/env";
import { logger } from "@/server/logger";

/**
 * Thin wrapper over the mem0 platform REST API (https://docs.mem0.ai).
 *
 * Used to give the assistant chat long-term, per-user memory: relevant facts
 * are recalled before a turn and the exchange is stored after it. Everything is
 * a graceful no-op when `MEM0_API_KEY` is absent, so the chat keeps working
 * without memory configured.
 */

const MEM0_BASE = "https://api.mem0.ai/v1";

type Mem0Message = { role: "user" | "assistant"; content: string };

function authHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Token ${key}`,
    "Content-Type": "application/json",
  };
}

/** Returns recalled memory snippets relevant to `query`, newest-first. */
export async function searchMemories(
  userId: string,
  query: string,
  limit = 5,
): Promise<string[]> {
  const key = env.MEM0_API_KEY;
  if (!key || !query.trim()) return [];

  try {
    const res = await fetch(`${MEM0_BASE}/memories/search/`, {
      method: "POST",
      headers: authHeaders(key),
      body: JSON.stringify({ query, user_id: userId, limit }),
    });
    if (!res.ok) {
      logger.warn("mem0.search failed", { status: res.status });
      return [];
    }
    const data = (await res.json()) as
      | { memory?: string }[]
      | { results?: { memory?: string }[] };
    const rows = Array.isArray(data) ? data : (data.results ?? []);
    return rows
      .map((r) => r.memory)
      .filter((m): m is string => typeof m === "string" && m.length > 0)
      .slice(0, limit);
  } catch (err) {
    logger.warn("mem0.search error", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return [];
  }
}

/** Persists a chat exchange so future turns can recall it. Fire-and-forget. */
export async function addMemories(
  userId: string,
  messages: Mem0Message[],
): Promise<void> {
  const key = env.MEM0_API_KEY;
  if (!key || messages.length === 0) return;

  try {
    const res = await fetch(`${MEM0_BASE}/memories/`, {
      method: "POST",
      headers: authHeaders(key),
      body: JSON.stringify({ messages, user_id: userId }),
    });
    if (!res.ok) {
      logger.warn("mem0.add failed", { status: res.status });
    }
  } catch (err) {
    logger.warn("mem0.add error", {
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

/** Whether long-term chat memory is configured. */
export function memoryEnabled(): boolean {
  return Boolean(env.MEM0_API_KEY);
}
