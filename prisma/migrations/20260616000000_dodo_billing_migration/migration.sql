-- Migrate billing from Stripe to Dodo Payments
-- Rename columns and tables to reflect the new payment gateway.

-- 1. BillingCustomer: rename stripe_customer_id → dodo_customer_id
ALTER TABLE "billing_customers" RENAME COLUMN "stripe_customer_id" TO "dodo_customer_id";

-- Rename the unique index
ALTER INDEX "billing_customers_stripe_customer_id_key" RENAME TO "billing_customers_dodo_customer_id_key";

-- 2. Subscription: rename stripe_subscription_id → dodo_subscription_id
ALTER TABLE "subscriptions" RENAME COLUMN "stripe_subscription_id" TO "dodo_subscription_id";

-- Rename the unique index
ALTER INDEX "subscriptions_stripe_subscription_id_key" RENAME TO "subscriptions_dodo_subscription_id_key";

-- 3. StripeEvent → WebhookEvent: rename the table
ALTER TABLE "stripe_events" RENAME TO "webhook_events";

-- Rename the primary key constraint
ALTER INDEX "stripe_events_pkey" RENAME TO "webhook_events_pkey";
