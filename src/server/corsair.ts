import "server-only";

import { Pool } from "pg";
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { outlook } from "@corsair-dev/outlook";
import { slack } from "@corsair-dev/slack";

import { env } from "@/env";

/**
 * Corsair shares the same Postgres connection as our app. We reuse a single
 * pg.Pool across hot reloads in development to avoid exhausting connections.
 */
const globalForCorsair = globalThis as unknown as {
  corsairPool: Pool | undefined;
  corsair: ReturnType<typeof createCorsairInstance> | undefined;
};

const pool =
  globalForCorsair.corsairPool ??
  new Pool({ connectionString: env.DATABASE_URL });

function createCorsairInstance() {
  return createCorsair({
    plugins: [gmail(), googlecalendar(), outlook(), slack()],
    database: pool,
    kek: env.CORSAIR_KEK,
    multiTenancy: true,
  });
}

export const corsair = globalForCorsair.corsair ?? createCorsairInstance();

if (env.NODE_ENV !== "production") {
  globalForCorsair.corsairPool = pool;
  globalForCorsair.corsair = corsair;
}

/**
 * Plugins registered in the Corsair instance (have OAuth + entity sync wired).
 * Connect/callback routes validate against this set.
 */
export const SUPPORTED_PLUGINS = [
  "gmail",
  "googlecalendar",
  "outlook",
  "slack",
] as const;
export type RegisteredPlugin = (typeof SUPPORTED_PLUGINS)[number];

/** Alias kept for the broader product type. */
export const ALL_PLUGINS = SUPPORTED_PLUGINS;
export type SupportedPlugin = RegisteredPlugin;

export function isSupportedPlugin(value: string): value is RegisteredPlugin {
  return (SUPPORTED_PLUGINS as readonly string[]).includes(value);
}

/** Plugins that connect at the personal (per-user) level. */
export const USER_PLUGINS = ["gmail", "googlecalendar", "outlook"] as const;
/** Plugins that connect at the org level (tenant `org:{orgId}`). */
export const ORG_PLUGINS = ["gmail", "outlook", "slack"] as const;

/**
 * A tenant reference. Personal Gmail/Calendar accounts stay per-user
 * (`{ kind: "user" }`); org-shared accounts (shared inboxes, Slack) use
 * `{ kind: "org" }`, which maps to the Corsair tenant id `org:{orgId}`.
 */
export type TenantRef =
  | { kind: "user"; userId: string }
  | { kind: "org"; orgId: string };

/** The stable Corsair tenant id string for a TenantRef. */
export function tenantId(ref: TenantRef): string {
  return ref.kind === "user" ? ref.userId : `org:${ref.orgId}`;
}

/** Parse a Corsair tenant id string back into a TenantRef. */
export function parseTenantId(id: string): TenantRef {
  return id.startsWith("org:")
    ? { kind: "org", orgId: id.slice("org:".length) }
    : { kind: "user", userId: id };
}

/**
 * Scope every Corsair operation to a tenant.
 *
 * Multi-tenancy needs no separate "create tenant" call — `withTenant` tags all
 * reads/writes with the tenant id automatically. Personal data uses the Clerk
 * user id; org-shared data uses `org:{orgId}`.
 */
export function getTenantFor(ref: TenantRef) {
  return corsair.withTenant(tenantId(ref));
}

/** Per-user Corsair tenant (Clerk user id). */
export function getTenant(clerkUserId: string) {
  return getTenantFor({ kind: "user", userId: clerkUserId });
}

/** Org-shared Corsair tenant (`org:{orgId}`). */
export function getOrgTenant(orgId: string) {
  return getTenantFor({ kind: "org", orgId });
}
