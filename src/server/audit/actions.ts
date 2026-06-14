/**
 * The complete audit action taxonomy. Every security-relevant action in the app
 * maps to one of these literals — keep this list authoritative and never reuse
 * a string for a different meaning.
 */
export const AUDIT_ACTIONS = [
  "auth.sso_login",
  "auth.breakglass_used",
  "member.invited",
  "member.removed",
  "member.role_changed",
  "integration.connected",
  "integration.disconnected",
  "integration.crm_logged",
  "integration.issue_created",
  "integration.task_created",
  "integration.meeting_created",
  "integration.ticket_created",
  "integration.ticket_updated",
  "shared_inbox.created",
  "shared_inbox.deleted",
  "thread.assigned",
  "thread.closed",
  "email.sent",
  "email.scheduled",
  "email.canceled",
  "agent.action_approved",
  "agent.action_rejected",
  "agent.action_executed",
  "billing.plan_changed",
  "retention.policy_changed",
  "retention.purge_executed",
  "export.requested",
  "export.downloaded",
  "sso.connection_created",
  "sso.enforced",
  "settings.security_changed",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Coarse category for grouping/filtering in the UI. */
export function auditCategory(action: AuditAction): string {
  return action.split(".")[0] ?? "other";
}
