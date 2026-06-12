-- AlterTable: manual overrides vs llm-scored priorities.
ALTER TABLE "priority_scores" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'llm';

-- CreateTable
CREATE TABLE "sent_message_samples" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "corsair_entity_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "to_domain" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "word_count" INTEGER NOT NULL,
    "embedding" vector(1536),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sent_message_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "style_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "summary" JSONB NOT NULL DEFAULT '{}',
    "sample_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "style_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread_summaries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "entity_version" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "key_points" JSONB NOT NULL DEFAULT '[]',
    "action_items" JSONB NOT NULL DEFAULT '[]',
    "unanswered_questions" JSONB NOT NULL DEFAULT '[]',
    "model" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "thread_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triage_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "from_domain" TEXT NOT NULL,
    "signal" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "triage_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sender_affinities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "signal_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sender_affinities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_suggestions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sent_message_samples_user_id_corsair_entity_id_key" ON "sent_message_samples"("user_id", "corsair_entity_id");
CREATE INDEX "sent_message_samples_user_id_idx" ON "sent_message_samples"("user_id");
CREATE INDEX "sent_message_samples_user_id_to_domain_idx" ON "sent_message_samples"("user_id", "to_domain");

CREATE UNIQUE INDEX "style_profiles_user_id_key" ON "style_profiles"("user_id");

CREATE UNIQUE INDEX "thread_summaries_user_id_thread_id_entity_version_key" ON "thread_summaries"("user_id", "thread_id", "entity_version");
CREATE INDEX "thread_summaries_user_id_thread_id_idx" ON "thread_summaries"("user_id", "thread_id");

CREATE INDEX "triage_feedback_user_id_from_domain_idx" ON "triage_feedback"("user_id", "from_domain");
CREATE INDEX "triage_feedback_user_id_from_email_idx" ON "triage_feedback"("user_id", "from_email");

CREATE UNIQUE INDEX "sender_affinities_user_id_key_key" ON "sender_affinities"("user_id", "key");
CREATE INDEX "sender_affinities_user_id_idx" ON "sender_affinities"("user_id");

CREATE INDEX "rule_suggestions_user_id_status_idx" ON "rule_suggestions"("user_id", "status");

-- AddForeignKey
ALTER TABLE "sent_message_samples" ADD CONSTRAINT "sent_message_samples_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "style_profiles" ADD CONSTRAINT "style_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "thread_summaries" ADD CONSTRAINT "thread_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "triage_feedback" ADD CONSTRAINT "triage_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sender_affinities" ADD CONSTRAINT "sender_affinities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rule_suggestions" ADD CONSTRAINT "rule_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
