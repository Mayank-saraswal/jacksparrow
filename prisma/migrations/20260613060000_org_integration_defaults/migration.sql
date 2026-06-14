-- Phase 2: per-org default provider when multiple integrations of the same
-- kind are connected (issue trackers: linear/jira; meeting providers: zoom/teams).
ALTER TABLE "organizations"
  ADD COLUMN "default_issue_tracker" TEXT,
  ADD COLUMN "default_meeting_provider" TEXT;
