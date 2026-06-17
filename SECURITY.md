# Security & Authorization Model

This document describes how Phoenix isolates tenants and authorizes
requests after the Phase 3 (Teams) work.

## Identity

- **Clerk** is the identity provider. `auth()` yields a verified `userId`,
  and — when an organization is active — `orgId` and `orgRole`.
- We never trust org/role claims from client input. The active `orgId` comes
  from the verified Clerk session; the authoritative role is read from our
  locally-mirrored `Membership` table (synced from Clerk webhooks).

## Tenancy

Corsair data is partitioned by tenant id:

- **Personal** accounts (a user's own Gmail/Calendar/Outlook) use tenant id
  `= userId`.
- **Org-shared** accounts (shared inboxes, Slack) use tenant id
  `= org:{orgId}`.

`TenantRef` (`src/server/corsair.ts`) is the discriminated union
(`{ kind: "user" } | { kind: "org" }`); `getTenant(userId)` and
`getOrgTenant(orgId)` are the only ways to obtain a Corsair client. User-tenant
and org-tenant data must never be mixed in a query, prompt, or embedding
retrieval.

**Per-user privacy inside shared inboxes:** Phase 2 style profiles and sender
affinity are strictly per-user. A draft composed in a shared inbox uses the
*acting user's* style profile, never another member's.

## Procedures (`src/server/api/trpc.ts`)

- `publicProcedure` — unauthenticated.
- `protectedProcedure` — requires a signed-in user; narrows `userId`.
- `orgProcedure` — requires an active org **and** verifies membership against
  our `Membership` table; adds the authoritative `role` to context.
- `orgAdminProcedure` — `orgProcedure` + requires `role === "admin"`.

## Authorization helpers (`src/server/authz.ts`)

Every org-scoped query passes through one of:

- `assertMember(orgId, userId)` — throws `FORBIDDEN` if not a member.
- `assertAdmin(orgId, userId)` — throws `FORBIDDEN` if not an admin.
- `assertSharedInboxAccess(sharedInboxId, userId)` — resolves the inbox's org
  and asserts membership; the single choke point for shared-inbox access.

No org-scoped query may read org data without one of these checks.

## Webhooks

All inbound webhooks verify signatures and are idempotent:

- **Clerk** (`/api/webhooks/clerk`) — verified with Clerk's `verifyWebhook`
  (Svix). Dispatches to Inngest; org/membership upserts are keyed by Clerk ids.
- **Stripe** (`/api/webhooks/stripe`) — verified with
  `stripe.webhooks.constructEvent`. Dispatches to Inngest; handlers dedupe by
  Stripe event id via the `StripeEvent` table.
- **Corsair** (`/api/webhooks/corsair`) — verified by the Corsair SDK; scoped
  to the tenant id from the query string.

## Billing enforcement (`src/server/billing/entitlements.ts`)

`assertWithinLimit(owner, userId, metric)` runs at the START of every paid AI
mutation (draft, summary, agent message; triage is exempt/free) and the connect
flow. Decision rules:

- **Fail OPEN** on transient billing-db errors — never hard-block on infra
  flake (logged loudly).
- **Fail CLOSED** on a definitively expired/canceled subscription — resolved to
  the Free plan by `effectivePlan`, whose limits are then enforced.
- `past_due` keeps paid entitlements through a 7-day grace window (banner
  shown), then downgrades to Free without deleting data.

Over-limit raises `TRPCError("FORBIDDEN", "limit_exceeded")`, which the UI maps
to an upgrade dialog.

## Phase 4 — Enterprise

### Plan gating
Enterprise features (SSO, audit logs, retention, analytics) are gated by
`assertFeature(owner, feature)` / `hasFeature` in `entitlements.ts`. Every
Feature A–D entry point calls it; over-plan access raises
`TRPCError("FORBIDDEN", "limit_exceeded")` which the UI maps to an upgrade
state.

### Audit log guarantees
- `AuditLog` is **append-only**. A Postgres trigger (`audit_logs_no_mutate`,
  shipped in the same migration as the table) raises on any UPDATE/DELETE.
  Retention purge is the only exception: it sets the `app.allow_audit_purge`
  session GUC inside a transaction so it may delete rows past `auditDays`.
- The writer (`src/server/audit/index.ts`) is fire-and-forget: it never blocks
  or fails the parent mutation; on write failure it buffers in-process and logs
  the payload to stderr.
- **Meta hygiene**: `sanitizeMeta` strips content-bearing keys (body, snippet,
  content…) and truncates every string to 80 chars before storage. Never store
  message content — only ids, truncated subjects, and counts.
- `ip`/`userAgent` are extracted once in the tRPC context, not per call site.

### SSO enforcement & break-glass
- When an org has an active `SsoConnection` with `enforceSso`, `orgProcedure` /
  `orgAdminProcedure` reject non-SSO sessions with `TRPCError("FORBIDDEN",
  "sso_required")` (decision: `decideSsoAccess`). Sign-in strategy comes from a
  Clerk custom session claim `strategy`; absent ⇒ treated as non-SSO
  (fail-closed).
- **Break-glass**: up to 2 admin user ids may bypass enforcement. Every
  break-glass use writes an `auth.breakglass_used` audit row. Keep the list as
  small as possible and review it regularly.
- IdP-driven deprovisioning: Clerk membership-deletion webhooks trigger
  `memberOffboarding` — revoke the user's Clerk sessions, reassign their open
  shared-inbox threads to unassigned, and write `member.removed`.

### Retention semantics
- Org-only. Personal users keep data forever (non-configurable).
- Minimum floors: email/slack ≥ 30 days, audit ≥ 90 days (default 365).
  null = keep forever.
- **Grace**: tightening a policy sets `effectiveAt = updatedAt + 72h`; the purge
  cron skips orgs still in grace.
- Purge runs ONLY inside Inngest, per-org concurrency 1, in batches of 500 with
  step boundaries (no long transactions). It cascades derived rows explicitly
  (no FK cascade to corsair tables) when `derivedFollowsSource`, and **never**
  deletes rows matched by an active `LegalHold` scope.
- Destructive ops (purge, account deletion) require a typed confirmation in the
  UI, an audit entry, and execution inside Inngest only. Account deletion has a
  7-day soft-delete window (`User.deletionScheduledAt`) the user can cancel.

### Analytics privacy
Analytics are pre-aggregated counts/timings only (`DailyOrgStat`) — never
content. Per-member rows respect the org `memberLevelAnalytics` toggle; when
off, only org totals are returned.
