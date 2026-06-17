-- AlterTable
ALTER TABLE "organizations" ADD COLUMN "gmail_backfilled_at" TIMESTAMPTZ;
ALTER TABLE "organizations" ADD COLUMN "outlook_backfilled_at" TIMESTAMPTZ;
