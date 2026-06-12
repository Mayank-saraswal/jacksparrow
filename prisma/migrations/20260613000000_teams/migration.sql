-- SyncItem: org + shared-inbox scoping (nullable, backfill-safe).
ALTER TABLE "sync_items" ADD COLUMN "org_id" TEXT;
ALTER TABLE "sync_items" ADD COLUMN "shared_inbox_id" TEXT;
CREATE INDEX "sync_items_org_id_timestamp_idx" ON "sync_items"("org_id", "timestamp");
CREATE INDEX "sync_items_shared_inbox_id_timestamp_idx" ON "sync_items"("shared_inbox_id", "timestamp");

-- Organizations + memberships (mirror of Clerk).
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "memberships_org_id_user_id_key" ON "memberships"("org_id", "user_id");
CREATE INDEX "memberships_user_id_idx" ON "memberships"("user_id");

-- Shared inboxes + collaboration.
CREATE TABLE "shared_inboxes" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plugin" TEXT NOT NULL,
    "corsair_account_id" TEXT,
    "connected_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shared_inboxes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "shared_inboxes_org_id_idx" ON "shared_inboxes"("org_id");

CREATE TABLE "thread_assignments" (
    "id" TEXT NOT NULL,
    "shared_inbox_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "assignee_user_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "updated_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "thread_assignments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "thread_assignments_shared_inbox_id_thread_id_key" ON "thread_assignments"("shared_inbox_id", "thread_id");
CREATE INDEX "thread_assignments_shared_inbox_id_status_idx" ON "thread_assignments"("shared_inbox_id", "status");
CREATE INDEX "thread_assignments_assignee_user_id_idx" ON "thread_assignments"("assignee_user_id");

CREATE TABLE "thread_comments" (
    "id" TEXT NOT NULL,
    "shared_inbox_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "author_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "thread_comments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "thread_comments_shared_inbox_id_thread_id_idx" ON "thread_comments"("shared_inbox_id", "thread_id");

CREATE TABLE "assignment_events" (
    "id" TEXT NOT NULL,
    "shared_inbox_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "actor_user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assignment_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "assignment_events_shared_inbox_id_thread_id_idx" ON "assignment_events"("shared_inbox_id", "thread_id");

-- Billing.
CREATE TABLE "billing_customers" (
    "id" TEXT NOT NULL,
    "owner_type" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "billing_customers_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "billing_customers_stripe_customer_id_key" ON "billing_customers"("stripe_customer_id");
CREATE UNIQUE INDEX "billing_customers_owner_type_owner_id_key" ON "billing_customers"("owner_type", "owner_id");

CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "billing_customer_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "current_period_end" TIMESTAMPTZ,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");
CREATE INDEX "subscriptions_billing_customer_id_idx" ON "subscriptions"("billing_customer_id");

CREATE TABLE "usage_records" (
    "id" TEXT NOT NULL,
    "owner_type" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "period_start" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "usage_records_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "usage_records_owner_type_owner_id_user_id_metric_period_start_key" ON "usage_records"("owner_type", "owner_id", "user_id", "metric", "period_start");
CREATE INDEX "usage_records_owner_type_owner_id_idx" ON "usage_records"("owner_type", "owner_id");

CREATE TABLE "stripe_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

-- Foreign keys.
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shared_inboxes" ADD CONSTRAINT "shared_inboxes_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "thread_assignments" ADD CONSTRAINT "thread_assignments_shared_inbox_id_fkey" FOREIGN KEY ("shared_inbox_id") REFERENCES "shared_inboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "thread_comments" ADD CONSTRAINT "thread_comments_shared_inbox_id_fkey" FOREIGN KEY ("shared_inbox_id") REFERENCES "shared_inboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assignment_events" ADD CONSTRAINT "assignment_events_shared_inbox_id_fkey" FOREIGN KEY ("shared_inbox_id") REFERENCES "shared_inboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_billing_customer_id_fkey" FOREIGN KEY ("billing_customer_id") REFERENCES "billing_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
