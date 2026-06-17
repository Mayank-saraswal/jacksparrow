import "server-only";

import { Pool } from "pg";
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { outlook } from "@corsair-dev/outlook";
import { slack } from "@corsair-dev/slack";
import { hubspot } from "@corsair-dev/hubspot";
import { notion } from "@corsair-dev/notion";
import { linear } from "@corsair-dev/linear";
import { jira } from "@corsair-dev/jira";
import { zoom } from "@corsair-dev/zoom";
import { teams } from "@corsair-dev/teams";
import { cal } from "@corsair-dev/cal";
import { calendly } from "@corsair-dev/calendly";
import { fireflies } from "@corsair-dev/fireflies";
import { zendesk } from "@corsair-dev/zendesk";
import { intercom } from "@corsair-dev/intercom";
import { todoist } from "@corsair-dev/todoist";
import { asana } from "@corsair-dev/asana";
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
    plugins: [
      gmail(),
      googlecalendar(),
      outlook(),
      slack({
        authType: "oauth_2",
        signingSecret: env.SLACK_SIGNING_SECRET,
      }),
      hubspot(),
      notion({ authType: "oauth_2" }),
      linear(),
      jira(),
      zoom(),
      teams(),
      cal(),
      calendly(),
      fireflies(),
      zendesk(),
      intercom(),
      todoist(),
      asana(),
    ],
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
  "hubspot",
  "notion",
  "linear",
  "jira",
  "zoom",
  "teams",
  "cal",
  "calendly",
  "fireflies",
  "zendesk",
  "intercom",
  "todoist",
  "asana",
] as const;
export type RegisteredPlugin = (typeof SUPPORTED_PLUGINS)[number];

/** Alias kept for the broader product type. */
export const ALL_PLUGINS = SUPPORTED_PLUGINS;
export type SupportedPlugin = RegisteredPlugin;

export function isSupportedPlugin(value: string): value is RegisteredPlugin {
  return (SUPPORTED_PLUGINS as readonly string[]).includes(value);
}

/** Plugins that connect at the personal (per-user) level. */
export const USER_PLUGINS = [
  "gmail",
  "googlecalendar",
  "outlook",
  "notion",
  "zoom",
  "cal",
  "calendly",
  "fireflies",
  "todoist",
  "asana",
] as const;
/** Plugins that connect at the org level (tenant `org:{orgId}`). */
export const ORG_PLUGINS = [
  "gmail",
  "outlook",
  "slack",
  "hubspot",
  "linear",
  "jira",
  "teams",
  "zendesk",
  "intercom",
] as const;

/**
 * Plan capability flag required to connect/use a plugin. Plugins not listed
 * here need no plan gate beyond a connection (mail/calendar/slack, the
 * user-level Notion/Zoom/Cal/Calendly/Todoist/Asana).
 */
export const PLUGIN_FEATURE: Partial<
  Record<
    RegisteredPlugin,
    "crm" | "issueTracker" | "meetings" | "support" | "meetingIntelligence"
  >
> = {
  hubspot: "crm",
  linear: "issueTracker",
  jira: "issueTracker",
  teams: "meetings",
  fireflies: "meetingIntelligence",
  zendesk: "support",
  intercom: "support",
};

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

/**
 * Per-plugin connection state for a tenant (e.g. `{ hubspot: "connected" }`).
 * Used by agent tools to return a structured `not-connected` error instead of
 * throwing when an integration isn't set up.
 */
export async function getConnectionStatus(
  ref: TenantRef,
): Promise<Record<string, string>> {
  const status = await corsair.manage.connectionStatus.get({
    tenantId: tenantId(ref),
  });
  return status;
}

/** True when `plugin` is connected for the tenant. */
export async function isConnected(
  ref: TenantRef,
  plugin: RegisteredPlugin,
): Promise<boolean> {
  const status = await getConnectionStatus(ref);
  return status[plugin] === "connected";
}
