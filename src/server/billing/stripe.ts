import "server-only";

import Stripe from "stripe";

import { env } from "@/env";
import type { Plan } from "@/lib/entitlements";

/**
 * Lazily-constructed Stripe client. Billing is optional: when STRIPE_SECRET_KEY
 * is unset, `getStripe()` returns null and callers degrade gracefully.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  client ??= new Stripe(env.STRIPE_SECRET_KEY);
  return client;
}

export interface PlanPrice {
  plan: Exclude<Plan, "free">;
  interval: "month" | "year";
  priceId: string;
}

/** All configured paid price ids, derived from env (skips any that are unset). */
export function configuredPrices(): PlanPrice[] {
  const out: PlanPrice[] = [];
  const add = (
    plan: PlanPrice["plan"],
    interval: PlanPrice["interval"],
    priceId: string | undefined,
  ) => {
    if (priceId) out.push({ plan, interval, priceId });
  };
  add("pro", "month", env.STRIPE_PRICE_PRO_MONTHLY);
  add("pro", "year", env.STRIPE_PRICE_PRO_YEARLY);
  add("business", "month", env.STRIPE_PRICE_BUSINESS_MONTHLY);
  add("business", "year", env.STRIPE_PRICE_BUSINESS_YEARLY);
  return out;
}

/** Maps a Stripe price id back to our plan (for subscription sync). */
export function planForPriceId(priceId: string): Plan {
  const match = configuredPrices().find((p) => p.priceId === priceId);
  return match?.plan ?? "free";
}
