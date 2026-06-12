import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { getStripe } from "@/server/billing/stripe";
import { inngest } from "@/inngest/client";

/**
 * Stripe webhook receiver. Verifies the signature, then hands off to Inngest
 * and returns 200 fast (mirrors the Corsair webhook pattern). Idempotency by
 * Stripe event id lives in the Inngest handler.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    await inngest.send({
      name: "stripe/webhook.received",
      data: { id: evt.id, type: evt.type, data: evt.data },
    });
  } catch (err) {
    console.error("[stripe webhook] enqueue failed:", err);
    // 500 so Stripe retries; the Inngest handler dedupes by event id.
    return NextResponse.json({ error: "enqueue failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
