import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { getDodo } from "@/server/billing/dodo";
import { inngest } from "@/inngest/client";

/**
 * Dodo Payments webhook receiver. Verifies the signature using the SDK's
 * built-in `webhooks.unwrap()`, then hands off to Inngest and returns 200 fast
 * (mirrors the Corsair webhook pattern). Idempotency by webhook id lives in
 * the Inngest handler.
 */
export async function POST(req: NextRequest) {
  const dodo = getDodo();
  if (!dodo || !env.DODO_PAYMENTS_WEBHOOK_KEY) {
    return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  }

  const raw = await req.text();
  let payload: unknown;
  try {
    payload = dodo.webhooks.unwrap(raw, {
      headers: {
        "webhook-id": req.headers.get("webhook-id") ?? "",
        "webhook-signature": req.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      },
    });
  } catch (err) {
    console.error("[dodo webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // Extract the webhook-id header for idempotency deduplication.
  const webhookId = req.headers.get("webhook-id") ?? "";

  try {
    await inngest.send({
      name: "dodo/webhook.received",
      data: { webhookId, payload },
    });
  } catch (err) {
    console.error("[dodo webhook] enqueue failed:", err);
    // 500 so Dodo retries; the Inngest handler dedupes by webhook id.
    return NextResponse.json({ error: "enqueue failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
