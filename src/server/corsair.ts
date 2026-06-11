import "server-only";

import { Pool } from "pg";
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

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
    plugins: [gmail(), googlecalendar()],
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

/** The set of integrations this app exposes to users. */
export const SUPPORTED_PLUGINS = ["gmail", "googlecalendar"] as const;
export type SupportedPlugin = (typeof SUPPORTED_PLUGINS)[number];

export function isSupportedPlugin(value: string): value is SupportedPlugin {
  return (SUPPORTED_PLUGINS as readonly string[]).includes(value);
}

/**
 * Scope every Corsair operation to a single user.
 *
 * Multi-tenancy needs no separate "create tenant" call — `withTenant` tags all
 * reads/writes with the tenant id automatically (see the multi-tenancy docs).
 * We use the Clerk user id as the stable tenant identifier.
 */
export function getTenant(clerkUserId: string) {
  return corsair.withTenant(clerkUserId);
}
