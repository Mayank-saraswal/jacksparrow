import { processWebhook } from "corsair";
import { NextResponse, type NextRequest } from "next/server";

import { corsair } from "@/server/corsair";
import { inngest } from "@/inngest/client";

type ProcessWebhookArgs = Parameters<typeof processWebhook>;

/**
 * Single endpoint for all incoming Corsair webhooks (Gmail, Google Calendar).
 *
 * Corsair inspects the headers/payload to route the webhook to the right
 * plugin, verifies the signature, and (in multi-tenant mode) scopes the write
 * to the tenant id passed via the query string. We then hand the result off to
 * Inngest (`corsair/webhook.received`) for cache upsert + embedding + realtime.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const tenantId =
    url.searchParams.get("tenantId") ??
    url.searchParams.get("tenant") ??
    undefined;

  const headers = Object.fromEntries(request.headers) as ProcessWebhookArgs[1];

  const raw = await request.text();
  let body: Record<string, unknown> | string = {};
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      body =
        typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>)
          : raw;
    } catch {
      body = raw;
    }
  }

  const result = await processWebhook(corsair, headers, body, { tenantId });

  if (result.plugin) {
    console.log(
      `[corsair webhook] handled by ${result.plugin}.${result.action ?? "?"} (tenant=${tenantId ?? "n/a"})`,
    );

    // Hand off to Inngest for cache upsert + embedding + realtime push.
    const corsairEntityId = result.response?.corsairEntityId;
    if (tenantId && corsairEntityId) {
      await inngest.send({
        name: "corsair/webhook.received",
        data: {
          tenantId,
          plugin: result.plugin,
          action: result.action ?? null,
          corsairEntityId,
        },
      });
    }
  } else {
    console.log(
      `[corsair webhook] received unmatched webhook (tenant=${tenantId ?? "n/a"})`,
    );
  }

  const response = result.response;
  const status = response?.statusCode ?? 200;
  const payload =
    response?.returnToSender ??
    response?.data ??
    { success: response?.success ?? true };

  return NextResponse.json(payload, {
    status,
    headers: response?.responseHeaders,
  });
}
