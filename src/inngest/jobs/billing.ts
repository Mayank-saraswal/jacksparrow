import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";
import { getDodo, planForProductId } from "@/server/billing/dodo";

/**
 * Billing jobs. The Dodo webhook route verifies + enqueues; these handlers do
 * the idempotent work (dedupe by webhook id), and a seat-sync job keeps
 * org subscription quantities aligned with membership.
 */

/** Payload shape from Dodo Payments subscription webhooks. */
interface DodoSubscriptionPayload {
  payload_type: "Subscription";
  subscription_id: string;
  customer: { customer_id: string };
  product_id: string;
  status: string;
  next_billing_date?: string | null;
  metadata?: Record<string, string>;
  recurring_pre_tax_amount?: number;
  quantity?: number;
  cancel_at_next_billing_date?: boolean;
}

/** Upserts a Subscription row from a Dodo subscription webhook payload. */
async function upsertSubscription(
  sub: DodoSubscriptionPayload,
  ownerType: string,
  ownerId: string,
): Promise<void> {
  const customerId = sub.customer.customer_id;

  // Ensure we have a BillingCustomer for this Dodo customer.
  const customer = await db.billingCustomer.upsert({
    where: { ownerType_ownerId: { ownerType, ownerId } },
    create: { ownerType, ownerId, dodoCustomerId: customerId },
    update: { dodoCustomerId: customerId },
    select: { id: true },
  });

  const plan = planForProductId(sub.product_id);
  const seats = sub.quantity ?? 1;

  // Map Dodo statuses to our internal statuses.
  const status = mapDodoStatus(sub.status);

  const periodEnd = sub.next_billing_date ? new Date(sub.next_billing_date) : null;

  await db.subscription.upsert({
    where: { dodoSubscriptionId: sub.subscription_id },
    create: {
      billingCustomerId: customer.id,
      dodoSubscriptionId: sub.subscription_id,
      plan,
      status,
      seats,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_next_billing_date ?? false,
    },
    update: {
      plan,
      status,
      seats,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_next_billing_date ?? false,
    },
  });

  // Compliance audit for plan changes.
  auditSystem("billing.plan_changed", {
    orgId: ownerType === "org" ? ownerId : null,
    actorUserId: ownerType === "user" ? ownerId : null,
    targetType: "subscription",
    targetId: sub.subscription_id,
    meta: { plan, status, seats },
  });
}

/**
 * Maps Dodo Payments subscription statuses to our internal status vocabulary
 * used by `effectivePlan()` in `@/lib/entitlements.ts`.
 */
function mapDodoStatus(dodoStatus: string): string {
  switch (dodoStatus) {
    case "active":
    case "renewed":
      return "active";
    case "on_hold":
      return "past_due";
    case "cancelled":
      return "canceled";
    case "expired":
    case "failed":
      return "canceled";
    default:
      return dodoStatus;
  }
}

export const dodoWebhookReceived = inngest.createFunction(
  {
    id: "dodo-webhook-received",
    retries: 3,
    triggers: { event: "dodo/webhook.received" },
  },
  async ({ event, step }) => {
    const { webhookId, payload } = event.data as {
      webhookId: string;
      payload: {
        type: string;
        business_id?: string;
        timestamp?: string;
        data: Record<string, unknown>;
      };
    };

    const { type, data } = payload;

    // Deduplicate by webhook id.
    const isNew = await step.run("dedupe", async () => {
      const existing = await db.webhookEvent.findUnique({ where: { id: webhookId } });
      return !existing;
    });
    if (!isNew) return { skipped: "duplicate" };

    await step.run("handle", async () => {
      // Extract owner info from subscription metadata (set during checkout).
      const subData = data as unknown as DodoSubscriptionPayload;
      const meta = subData.metadata ?? {};
      const ownerType = meta.ownerType === "org" ? "org" : "user";
      const ownerId = meta.ownerId ?? "";

      switch (type) {
        case "subscription.active":
        case "subscription.updated":
        case "subscription.renewed":
        case "subscription.plan_changed": {
          if (ownerId) {
            await upsertSubscription(subData, ownerType, ownerId);
          }
          break;
        }
        case "subscription.on_hold": {
          // Payment failed, subscription on hold — map to past_due for grace window.
          if (ownerId) {
            await upsertSubscription(subData, ownerType, ownerId);
          }
          break;
        }
        case "subscription.cancelled":
        case "subscription.expired":
        case "subscription.failed": {
          if (subData.subscription_id) {
            await db.subscription.updateMany({
              where: { dodoSubscriptionId: subData.subscription_id },
              data: { status: mapDodoStatus(subData.status) },
            });
          }
          break;
        }
        case "payment.failed": {
          // Mark the associated subscription as past_due if we can find it.
          const paymentData = data as { subscription_id?: string };
          if (paymentData.subscription_id) {
            await db.subscription.updateMany({
              where: { dodoSubscriptionId: paymentData.subscription_id },
              data: { status: "past_due" },
            });
          }
          break;
        }
        default:
          break;
      }
    });

    await step.run("record-event", async () => {
      await db.webhookEvent.upsert({
        where: { id: webhookId },
        create: { id: webhookId, type },
        update: {},
      });
    });

    return { processed: type };
  },
);

/**
 * Keeps an org's Dodo subscription quantity in sync with its active member
 * count. Debounced per-org via a concurrency key so a burst of membership
 * changes collapses into one update.
 */
export const billingSeatsSync = inngest.createFunction(
  {
    id: "billing-seats-sync",
    retries: 2,
    concurrency: { key: "event.data.orgId", limit: 1 },
    triggers: { event: "billing/seats.sync" },
  },
  async ({ event, step }) => {
    const { orgId } = event.data as { orgId: string };
    const dodo = getDodo();
    if (!dodo) return { skipped: "dodo-not-configured" };

    const target = await step.run("count-members", async () => {
      const members = await db.membership.count({ where: { orgId } });
      return Math.max(1, members);
    });

    const subInfo = await step.run("load-subscription", async () => {
      const customer = await db.billingCustomer.findUnique({
        where: { ownerType_ownerId: { ownerType: "org", ownerId: orgId } },
        select: { id: true },
      });
      if (!customer) return null;
      const sub = await db.subscription.findFirst({
        where: { billingCustomerId: customer.id },
        orderBy: { updatedAt: "desc" },
        select: { dodoSubscriptionId: true, seats: true, status: true },
      });
      return sub;
    });

    if (!subInfo) return { skipped: "no-subscription" };
    if (subInfo.seats === target) return { skipped: "unchanged", seats: target };
    if (subInfo.status === "canceled") return { skipped: "canceled" };

    await step.run("update-dodo-quantity", async () => {
      // Retrieve the current subscription to get the product_id for changePlan.
      const currentSub = await db.subscription.findFirst({
        where: { dodoSubscriptionId: subInfo.dodoSubscriptionId },
        select: { plan: true },
      });

      // Look up the product ID for this plan from configured products.
      const { configuredProducts } = await import("@/server/billing/dodo");
      const products = configuredProducts();
      const product = products.find((p) => p.plan === currentSub?.plan);

      if (product) {
        // Use changePlan to update the quantity on the Dodo subscription.
        await dodo.subscriptions.changePlan(subInfo.dodoSubscriptionId, {
          product_id: product.productId,
          quantity: target,
          proration_billing_mode: "prorated_immediately",
        });
      }

      // Always update local DB to track seats.
      await db.subscription.updateMany({
        where: { dodoSubscriptionId: subInfo.dodoSubscriptionId },
        data: { seats: target },
      });
    });

    return { orgId, seats: target };
  },
);
