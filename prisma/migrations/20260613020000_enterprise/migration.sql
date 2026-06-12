-- User soft-delete window.
ALTER TABLE "users" ADD COLUMN "deletion_scheduled_at" TIMESTAMPTZ;

-- Org analytics privacy toggle.
ALTER TABLE "organizations" ADD COLUMN "member_level_analytics" BOOLEAN NOT NULL DEFAULT true;

-- Append-only audit trail.
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "org_id" TEXT,
    "actor_user_id" TEXT,
    "actor_type" TEXT NOT NULL DEFAULT 'user',
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_logs_org_id_created_at_idx" ON "audit_logs"("org_id", "created_at");
CREATE INDEX "audit_logs_actor_user_id_created_at_idx" ON "audit_logs"("actor_user_id", "created_at");
CREATE INDEX "audit_logs_org_id_action_created_at_idx" ON "audit_logs"("org_id", "action", "created_at");

-- Defense in depth: the audit trail is append-only at the database level.
-- (Retention purges run with role bypass via a session GUC set in-tx.)
CREATE OR REPLACE FUNCTION "audit_logs_no_mutate"() RETURNS trigger AS $$
BEGIN
  IF current_setting('app.allow_audit_purge', true) = 'on' AND TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'audit_logs is append-only (% blocked)', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "audit_logs_no_update"
  BEFORE UPDATE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION "audit_logs_no_mutate"();

CREATE TRIGGER "audit_logs_no_delete"
  BEFORE DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION "audit_logs_no_mutate"();

-- SSO connections.
CREATE TABLE "sso_connections" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "clerk_connection_id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "enforce_sso" BOOLEAN NOT NULL DEFAULT false,
    "break_glass_user_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "sso_connections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sso_connections_domain_key" ON "sso_connections"("domain");
CREATE INDEX "sso_connections_org_id_idx" ON "sso_connections"("org_id");

-- Retention policies.
CREATE TABLE "retention_policies" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "email_days" INTEGER,
    "slack_days" INTEGER,
    "audit_days" INTEGER NOT NULL DEFAULT 365,
    "derived_follows_source" BOOLEAN NOT NULL DEFAULT true,
    "effective_at" TIMESTAMPTZ,
    "updated_by_user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "retention_policies_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "retention_policies_org_id_key" ON "retention_policies"("org_id");

-- Legal holds.
CREATE TABLE "legal_holds" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "scope" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "legal_holds_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "legal_holds_org_id_active_idx" ON "legal_holds"("org_id", "active");

-- Pre-aggregated analytics.
CREATE TABLE "daily_org_stats" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "metric" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "dims" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "daily_org_stats_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "daily_org_stats_org_id_date_metric_dims_key" ON "daily_org_stats"("org_id", "date", "metric", "dims");
CREATE INDEX "daily_org_stats_org_id_metric_date_idx" ON "daily_org_stats"("org_id", "metric", "date");

-- Foreign keys.
ALTER TABLE "sso_connections" ADD CONSTRAINT "sso_connections_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "retention_policies" ADD CONSTRAINT "retention_policies_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "legal_holds" ADD CONSTRAINT "legal_holds_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_org_stats" ADD CONSTRAINT "daily_org_stats_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
