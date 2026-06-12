-- Add thread_id to priority_scores and key uniqueness per (user, thread).
ALTER TABLE "priority_scores" ADD COLUMN "thread_id" TEXT NOT NULL DEFAULT '';
ALTER TABLE "priority_scores" ALTER COLUMN "thread_id" DROP DEFAULT;

CREATE UNIQUE INDEX "priority_scores_user_id_thread_id_key" ON "priority_scores"("user_id", "thread_id");
