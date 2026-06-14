-- Phase 3: provider defaults, support-ticket link, and meeting summaries.
ALTER TABLE "user_preferences"
  ADD COLUMN "default_task_provider" TEXT,
  ADD COLUMN "default_scheduling_provider" TEXT;

ALTER TABLE "organizations"
  ADD COLUMN "default_support_provider" TEXT;

ALTER TABLE "thread_assignments"
  ADD COLUMN "support_provider" TEXT,
  ADD COLUMN "support_ticket_id" TEXT;

CREATE TABLE "meeting_summaries" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "meeting_id" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'fireflies',
  "title" TEXT NOT NULL DEFAULT '',
  "tldr" TEXT NOT NULL,
  "key_points" JSONB NOT NULL DEFAULT '[]',
  "action_items" JSONB NOT NULL DEFAULT '[]',
  "attendees" JSONB NOT NULL DEFAULT '[]',
  "occurred_at" TIMESTAMPTZ NOT NULL,
  "model" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "meeting_summaries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "meeting_summaries_user_id_meeting_id_key"
  ON "meeting_summaries" ("user_id", "meeting_id");
CREATE INDEX "meeting_summaries_user_id_occurred_at_idx"
  ON "meeting_summaries" ("user_id", "occurred_at");

ALTER TABLE "meeting_summaries"
  ADD CONSTRAINT "meeting_summaries_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
