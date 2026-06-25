/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { processWebhook } from "corsair";
import { NextResponse, type NextRequest } from "next/server";

import { corsair } from "@/server/corsair";
import { inngest } from "@/inngest/client";
import { logger } from "@/server/logger";
import { captureException, captureMessage } from "@/server/observability/sentry";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/server/db";

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

  logger.info("DEBUG: Webhook entry", {
    url: request.url,
    tenantIdParam: tenantId,
  });

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

    // [Fallback for Gmail Webhooks]
    // Google Pub/Sub sends Gmail webhooks to the global endpoint without a tenantId query param.
    // We must extract the emailAddress from the base64-encoded payload and query Clerk to find
    // the associated user.
    let resolvedTenantId = tenantId === "default" ? undefined : tenantId;
    if (!resolvedTenantId && typeof body === "object" && body !== null) {
      logger.info("DEBUG: Gmail webhook body received", { body });
      const b = body as any;
      if (b.message?.data) {
        try {
          const decoded = Buffer.from(b.message.data, "base64").toString("utf8");
          const parsed = JSON.parse(decoded);
          if (parsed.emailAddress) {
            const { createClerkClient } = await import("@clerk/nextjs/server");
            const customClerk = createClerkClient({
              secretKey: process.env.CLERK_SECRET_KEY?.trim(),
              publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
            });
            
            const users = await customClerk.users.getUserList({ emailAddress: [parsed.emailAddress] });
            const firstUser = users.data[0];
            if (firstUser) {
              resolvedTenantId = firstUser.id;
              logger.info("corsair webhook resolved tenant via Clerk", {
                tenantId: resolvedTenantId,
                emailAddress: parsed.emailAddress,
              });
            }
          }
        } catch (e: any) {
          logger.warn("Failed to parse Gmail webhook payload for tenant resolution", {
            error: e.message,
            stack: e.stack,
            data: b.message.data,
          });
        }
      }
    }

    const options = resolvedTenantId ? { tenantId: resolvedTenantId } : undefined;
    const result = await processWebhook(corsair, headers, body, options);

    if (result.plugin) {
      const action = result.action ?? null;
      logger.info("corsair webhook handled", {
        tenantId,
        plugin: result.plugin,
        action,
        resultResponse: JSON.stringify(result.response),
      });

      // Hand off to Inngest for cache upsert + embedding + realtime push.
      let entityIds: string[] = [];
      if (result.response?.corsairEntityId) {
        entityIds.push(result.response.corsairEntityId);
      } else if (resolvedTenantId && result.plugin === "gmail") {
        try {
          const entities = await db.corsairEntity.findMany({
            where: { 
              account: { tenantId: resolvedTenantId },
              updatedAt: { gte: new Date(Date.now() - 15000) }
            },
            orderBy: { updatedAt: "desc" },
            take: 20,
            select: { id: true },
          });
          entityIds = entities.map((e) => e.id);
        } catch (e) {
          logger.error("Failed to fetch recent entities for gmail webhook", { error: e });
        }
      }

      for (const corsairEntityId of entityIds) {
        logger.info("DEBUG: Sending to Inngest", { resolvedTenantId, corsairEntityId, plugin: result.plugin });
        try {
          await inngest.send({
            name: "corsair/webhook.received",
            data: {
              tenantId: resolvedTenantId,
              plugin: result.plugin,
              action,
              corsairEntityId,
            },
          });
        } catch (sendErr) {
          // The webhook was processed but we failed to enqueue downstream work.
          logger.error("corsair webhook inngest send failed", {
            tenantId: resolvedTenantId,
            plugin: result.plugin,
            action,
            corsairEntityId,
          });
          captureException(sendErr, {
            scope: "corsair-webhook.inngest-send",
            tenantId: resolvedTenantId,
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
