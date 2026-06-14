-- Phase 0 (Fix 1): serve inbox lists from sync_items instead of a live
-- provider round-trip. Add the fields the list view needs to render.
ALTER TABLE "sync_items"
  ADD COLUMN "thread_id" TEXT,
  ADD COLUMN "from_name" TEXT,
  ADD COLUMN "from_email" TEXT,
  ADD COLUMN "unread" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "starred" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "sync_items_user_id_type_timestamp_idx"
  ON "sync_items" ("user_id", "type", "timestamp");
