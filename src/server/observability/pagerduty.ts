import "server-only";

import { env } from "@/env";
import { logger } from "@/server/logger";

/**
 * PagerDuty Events API v2 integration. Reserved for pipeline-fatal failures
 * (e.g. an Inngest function exhausting its retries / dead-lettering) — NOT
 * per-event errors. No-op when `PAGERDUTY_ROUTING_KEY` is absent.
 */
export type PagerSeverity = "critical" | "error" | "warning" | "info";

const EVENTS_URL = "https://events.pagerduty.com/v2/enqueue";

export async function pageOnCall(
  summary: string,
  severity: PagerSeverity = "error",
): Promise<void> {
  if (!env.PAGERDUTY_ROUTING_KEY) return;
  try {
    const res = await fetch(EVENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routing_key: env.PAGERDUTY_ROUTING_KEY,
        event_action: "trigger",
        payload: {
          summary: summary.slice(0, 1024),
          source: "hedwigs",
          severity,
        },
      }),
    });
    if (!res.ok) {
      logger.error("pagerduty enqueue rejected", { status: String(res.status) });
    }
  } catch (err) {
    logger.error("pagerduty enqueue failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
