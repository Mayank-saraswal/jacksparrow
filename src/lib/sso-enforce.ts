/**
 * Pure SSO enforcement decision. When an org enforces SSO, members must sign in
 * through the enterprise connection; non-SSO sessions are rejected unless the
 * member is on the break-glass allowlist (which is itself audited). Kept pure so
 * the decision table is unit-testable and reused by the tRPC context.
 */

export interface SsoEnforcementInput {
  /** Is SSO enforcement turned on for the user's org? */
  enforceSso: boolean;
  /** The Clerk session's sign-in strategy (e.g. "saml", "oauth_google", "password"). */
  strategy: string | null | undefined;
  /** Break-glass allowlist (max 2 user ids). */
  breakGlassUserIds: string[];
  userId: string;
}

export type SsoDecision =
  | { allowed: true; reason: "not_enforced" | "sso_session" | "break_glass" }
  | { allowed: false; reason: "sso_required" };

/** Strategies that count as a federated SSO login. */
export function isSsoStrategy(strategy: string | null | undefined): boolean {
  if (!strategy) return false;
  const s = strategy.toLowerCase();
  return s.includes("saml") || s.includes("oidc") || s.startsWith("enterprise");
}

export function decideSsoAccess(input: SsoEnforcementInput): SsoDecision {
  if (!input.enforceSso) return { allowed: true, reason: "not_enforced" };
  if (isSsoStrategy(input.strategy))
    return { allowed: true, reason: "sso_session" };
  if (input.breakGlassUserIds.includes(input.userId))
    return { allowed: true, reason: "break_glass" };
  return { allowed: false, reason: "sso_required" };
}

export const MAX_BREAK_GLASS = 2;

/** Validates a proposed break-glass allowlist (deduped, capped). */
export function normalizeBreakGlass(userIds: string[]): string[] {
  return Array.from(new Set(userIds)).slice(0, MAX_BREAK_GLASS);
}
