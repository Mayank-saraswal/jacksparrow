-- Phase 1 (Fix D): content-hash dedupe for embeddings. Lets the realtime sync
-- pipeline skip the OpenAI embed call when an entity's content is unchanged.
ALTER TABLE "email_embeddings"
  ADD COLUMN "content_hash" TEXT;
