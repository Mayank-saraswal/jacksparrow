-- Unique constraint so embeddings can be upserted per (user, entity).
CREATE UNIQUE INDEX "email_embeddings_user_id_corsair_entity_id_key" ON "email_embeddings"("user_id", "corsair_entity_id");

-- CreateTable
CREATE TABLE "sync_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "corsair_entity_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sync_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sync_items_user_id_corsair_entity_id_key" ON "sync_items"("user_id", "corsair_entity_id");

-- CreateIndex
CREATE INDEX "sync_items_user_id_timestamp_idx" ON "sync_items"("user_id", "timestamp");
