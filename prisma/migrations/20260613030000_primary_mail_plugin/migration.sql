-- Phase 0 (Fix 2): provider-agnostic mail. Default mail backend when both
-- Gmail and Outlook are connected for a user.
ALTER TABLE "user_preferences"
  ADD COLUMN "primary_mail_plugin" TEXT NOT NULL DEFAULT 'gmail';
