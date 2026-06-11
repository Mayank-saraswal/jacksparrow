-- Enable pgvector (required by the email_embeddings.embedding column below).
-- Added manually: Prisma does not manage extensions here so it won't treat
-- Supabase's pre-installed extensions as drift.
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "gmail_backfilled_at" TIMESTAMPTZ,
    "calendar_backfilled_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_links" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "external_chat_id" TEXT NOT NULL,
    "linked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_embeddings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "corsair_entity_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "subject_snippet" TEXT NOT NULL,
    "embedding" vector(1536),
    "indexed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "priority_scores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "corsair_entity_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "reason" TEXT,
    "model" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "priority_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_actions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "draft_payload" JSONB NOT NULL DEFAULT '{}',
    "corsair_operation_path" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,

    CONSTRAINT "pending_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "split_inbox_rules" JSONB NOT NULL DEFAULT '{}',
    "shortcut_overrides" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "channel_links_user_id_idx" ON "channel_links"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_links_channel_external_chat_id_key" ON "channel_links"("channel", "external_chat_id");

-- CreateIndex
CREATE INDEX "email_embeddings_user_id_idx" ON "email_embeddings"("user_id");

-- CreateIndex
CREATE INDEX "email_embeddings_corsair_entity_id_idx" ON "email_embeddings"("corsair_entity_id");

-- CreateIndex
CREATE INDEX "email_embeddings_thread_id_idx" ON "email_embeddings"("thread_id");

-- CreateIndex
CREATE INDEX "priority_scores_user_id_idx" ON "priority_scores"("user_id");

-- CreateIndex
CREATE INDEX "priority_scores_corsair_entity_id_idx" ON "priority_scores"("corsair_entity_id");

-- CreateIndex
CREATE INDEX "pending_actions_user_id_idx" ON "pending_actions"("user_id");

-- CreateIndex
CREATE INDEX "pending_actions_status_idx" ON "pending_actions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "channel_links" ADD CONSTRAINT "channel_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_embeddings" ADD CONSTRAINT "email_embeddings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "priority_scores" ADD CONSTRAINT "priority_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
