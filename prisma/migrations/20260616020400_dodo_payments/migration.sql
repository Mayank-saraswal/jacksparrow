/*
  Warnings:

  - You are about to drop the column `actor_type` on the `audit_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "actor_type",
ADD COLUMN     "actorType" TEXT NOT NULL DEFAULT 'user';

-- RenameIndex
ALTER INDEX "usage_records_owner_type_owner_id_user_id_metric_period_start_k" RENAME TO "usage_records_owner_type_owner_id_user_id_metric_period_sta_key";
