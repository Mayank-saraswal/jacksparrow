import { processWebhook } from "corsair";
import { NextResponse, type NextRequest } from "next/server";

import { corsair } from "@/server/corsair";
import { inngest } from "@/inngest/client";
import { logger } from "@/server/logger";
import { captureException, captureMessage } from "@/server/observability/sentry";

type ProcessWebhookArgs = Parameters<typeof processWebhook>;

/**
 * Single endpoint for all incoming Corsair webhooks (Gmail, Google Calendar,
 * Outlook, Slack).
 *
 * Corsair inspects the headers/payload to route the webhook to the right
 * plugin, verifies the signature, and (in multi-tenant mode) scopes the write
 * to the tenant id passed via the query string. We then hand the result off to
 * Inngest (`corsair/webhook.received`) for cache upsert + embedding + realtime.
 *
 * All failures are captured to Sentry (tagged with tenant/plugin/action) and
 * returned as well-formed JSON so the upstream provider gets a clean response.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const tenantId =
    url.searchParams.get("tenantId") ??
    url.searchParams.get("tenant") ??
    undefined;

  try {
    const headers = Object.fromEntries(
      request.headers,
    ) as ProcessWebhookArgs[1];

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

    // Intercept Slack url_verification immediately to bypass multi-tenant account lookups.
    // Slack sends this globally without a tenantId.
    if (
      typeof body === "object" &&
      body !== null &&
      body.type === "url_verification" &&
      typeof body.challenge === "string"
    ) {
      return new NextResponse(body.challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const result = await processWebhook(corsair, headers, body, { tenantId });

    if (result.plugin) {
      const action = result.action ?? null;
      logger.info("corsair webhook handled", {
        tenantId,
        plugin: result.plugin,
        action,
      });

      // Hand off to Inngest for cache upsert + embedding + realtime push.
      const corsairEntityId = result.response?.corsairEntityId;
      if (tenantId && corsairEntityId) {
        try {
          await inngest.send({
            name: "corsair/webhook.received",
            data: {
              tenantId,
              plugin: result.plugin,
              action,
              corsairEntityId,
            },
          });
        } catch (sendErr) {
          // The webhook was processed but we failed to enqueue downstream work.
          logger.error("corsair webhook inngest send failed", {
            tenantId,
            plugin: result.plugin,
            action,
            corsairEntityId,
          });
          captureException(sendErr, {
            scope: "corsair-webhook.inngest-send",
            tenantId,
            plugin: result.plugin,
            action,
            corsairEntityId,
          });
        }
      }
    } else {
      logger.warn("corsair webhook unmatched", { tenantId });
      captureMessage("corsair webhook unmatched", "warning", { tenantId });
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
  } catch (err) {
    logger.error("corsair webhook processing failed", { tenantId });
    captureException(err, { scope: "corsair-webhook.process", tenantId });
    return NextResponse.json(
      { success: false, error: "webhook_processing_failed" },
      { status: 500 },
    );
  }
}
