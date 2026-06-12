import type Stripe from "stripe";

import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";
import { getStripe, planForPriceId } from "@/server/billing/stripe";

/**
 * Billing jobs. The Stripe webhook route verifies + enqueues; these handlers do
 * the idempotent work (dedupe by Stripe event id), and a seat-sync job keeps
 * org subscription quantities aligned with membership.
 */

/** Upserts a Subscription row from a Stripe subscription object. */
async function upsertSubscription(sub: Stripe.Subscription): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const customer = await db.billingCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });
  if (!customer) {
    console.error(`[billing] no BillingCustomer for ${customerId}`);
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price.id ?? "";
  const plan = planForPriceId(priceId);
  const seats = item?.quantity ?? 1;
  const periodEnd = item?.current_period_end ?? null;

  await db.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    create: {
      billingCustomerId: customer.id,
      stripeSubscriptionId: sub.id,
      plan,
      status: sub.status,
      seats,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      plan,
      status: sub.status,
      seats,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });

  // Compliance audit for plan changes (owner resolved from the customer).
  const owner = await db.billingCustomer.findUnique({
    where: { id: customer.id },
    select: { ownerType: true, ownerId: true },
  });
  auditSystem("billing.plan_changed", {
    orgId: owner?.ownerType === "org" ? owner.ownerId : null,
    actorUserId: owner?.ownerType === "user" ? owner.ownerId : null,
    targetType: "subscription",
    targetId: sub.id,
    meta: { plan, status: sub.status, seats },
  });
}

export const stripeWebhookReceived = inngest.createFunction(
  {
    id: "stripe-webhook-received",
    retries: 3,
    triggers: { event: "stripe/webhook.received" },
  },
  async ({ event, step }) => {
    const { id, type, data } = event.data as {
      id: string;
      type: string;
      data: Stripe.Event.Data;
    };

    const isNew = await step.run("dedupe", async () => {
      const existing = await db.stripeEvent.findUnique({ where: { id } });
      return !existing;
    });
    if (!isNew) return { skipped: "duplicate" };

    const stripe = getStripe();
    if (!stripe) return { skipped: "stripe-not-configured" };

    await step.run("handle", async () => {
      switch (type) {
        case "checkout.session.completed": {
          const session = data.object as Stripe.Checkout.Session;
          const meta = session.metadata ?? {};
          const ownerType = meta.ownerType === "org" ? "org" : "user";
          const ownerId = meta.ownerId ?? "";
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id;
          if (ownerId && customerId) {
            await db.billingCustomer.upsert({
              where: { ownerType_ownerId: { ownerType, ownerId } },
              create: { ownerType, ownerId, stripeCustomerId: customerId },
              update: { stripeCustomerId: customerId },
            });
          }
          if (session.subscription) {
            const subId =
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription.id;
            const sub = await stripe.subscriptions.retrieve(subId);
            await upsertSubscription(sub);
          }
          break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = data.object as Stripe.Subscription;
          await upsertSubscription(sub);
          break;
        }
        case "invoice.payment_failed": {
          const invoice = data.object as Stripe.Invoice & {
            subscription?: string | { id: string };
          };
          const subId =
            typeof invoice.subscription === "string"
              ? invoice.subscription
              : invoice.subscription?.id;
          if (subId) {
            await db.subscription.updateMany({
              where: { stripeSubscriptionId: subId },
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
      await db.stripeEvent.upsert({
        where: { id },
        create: { id, type },
        update: {},
      });
    });

    return { processed: type };
  },
);

/**
 * Keeps an org's Stripe subscription quantity in sync with its active member
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
    const stripe = getStripe();
    if (!stripe) return { skipped: "stripe-not-configured" };

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
        select: { stripeSubscriptionId: true, seats: true, status: true },
      });
      return sub;
    });

    if (!subInfo) return { skipped: "no-subscription" };
    if (subInfo.seats === target) return { skipped: "unchanged", seats: target };
    if (subInfo.status === "canceled") return { skipped: "canceled" };

    await step.run("update-stripe-quantity", async () => {
      const sub = await stripe.subscriptions.retrieve(
        subInfo.stripeSubscriptionId,
      );
      const itemId = sub.items.data[0]?.id;
      if (!itemId) return;
      await stripe.subscriptions.update(subInfo.stripeSubscriptionId, {
        items: [{ id: itemId, quantity: target }],
        proration_behavior: "create_prorations",
      });
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: subInfo.stripeSubscriptionId },
        data: { seats: target },
      });
    });

    return { orgId, seats: target };
  },
);
