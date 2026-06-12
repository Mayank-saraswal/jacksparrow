-- AlterTable
ALTER TABLE "user_preferences" ADD COLUMN     "follow_up_days" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "undo_send_seconds" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "snoozed_threads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "corsair_entity_id" TEXT NOT NULL,
    "snooze_until" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'snoozed',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "woken_at" TIMESTAMPTZ,

    CONSTRAINT "snoozed_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_emails" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "draft_payload" JSONB NOT NULL,
    "send_at" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "inngest_run_id" TEXT,
    "error" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ,

    CONSTRAINT "scheduled_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_ups" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "last_sent_at" TIMESTAMPTZ NOT NULL,
    "remind_at" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'watching',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "snoozed_threads_user_id_idx" ON "snoozed_threads"("user_id");

-- CreateIndex
CREATE INDEX "snoozed_threads_status_idx" ON "snoozed_threads"("status");

-- CreateIndex
CREATE UNIQUE INDEX "snoozed_threads_user_id_thread_id_key" ON "snoozed_threads"("user_id", "thread_id");

-- CreateIndex
CREATE INDEX "scheduled_emails_user_id_idx" ON "scheduled_emails"("user_id");

-- CreateIndex
CREATE INDEX "scheduled_emails_status_idx" ON "scheduled_emails"("status");

-- CreateIndex
CREATE INDEX "follow_ups_user_id_idx" ON "follow_ups"("user_id");

-- CreateIndex
CREATE INDEX "follow_ups_status_remind_at_idx" ON "follow_ups"("status", "remind_at");

-- CreateIndex
CREATE UNIQUE INDEX "follow_ups_user_id_thread_id_key" ON "follow_ups"("user_id", "thread_id");

-- AddForeignKey
ALTER TABLE "snoozed_threads" ADD CONSTRAINT "snoozed_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_emails" ADD CONSTRAINT "scheduled_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
