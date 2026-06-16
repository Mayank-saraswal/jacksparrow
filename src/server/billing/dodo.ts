import "server-only";

import DodoPayments from "dodopayments";

import { env } from "@/env";
import type { Plan } from "@/lib/entitlements";

/**
 * Lazily-constructed Dodo Payments client. Billing is optional: when
 * DODO_PAYMENTS_API_KEY is unset, `getDodo()` returns null and callers
 * degrade gracefully.
 */
let client: DodoPayments | null = null;

export function getDodo(): DodoPayments | null {
  if (!env.DODO_PAYMENTS_API_KEY) return null;
  client ??= new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    environment: env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode",
    webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY,
  });
  return client;
}

export interface PlanProduct {
  plan: Exclude<Plan, "free">;
  interval: "month" | "year";
  productId: string;
}

/** All configured paid product ids, derived from env (skips any that are unset). */
export function configuredProducts(): PlanProduct[] {
  const out: PlanProduct[] = [];
  const add = (
    plan: PlanProduct["plan"],
    interval: PlanProduct["interval"],
    productId: string | undefined,
  ) => {
    if (productId) out.push({ plan, interval, productId });
  };
  add("pro", "month", env.DODO_PRODUCT_PRO_MONTHLY);
  add("pro", "year", env.DODO_PRODUCT_PRO_YEARLY);
  add("business", "month", env.DODO_PRODUCT_BUSINESS_MONTHLY);
  add("business", "year", env.DODO_PRODUCT_BUSINESS_YEARLY);
  add("enterprise", "month", env.DODO_PRODUCT_ENTERPRISE_MONTHLY);
  add("enterprise", "year", env.DODO_PRODUCT_ENTERPRISE_YEARLY);
  return out;
}

/** Maps a Dodo product id back to our plan (for subscription sync). */
export function planForProductId(productId: string): Plan {
  const match = configuredProducts().find((p) => p.productId === productId);
  return match?.plan ?? "free";
}
