# Security & Authorization Model

This document describes how Jack Sparrow isolates tenants and authorizes
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
