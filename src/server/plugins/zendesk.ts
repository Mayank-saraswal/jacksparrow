/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { zendesk as baseZendesk } from "@corsair-dev/zendesk";
import type {
  ExternalZendeskPlugin,
  ZendeskPluginOptions,
  ZendeskContext,
  ZendeskKeyBuilderContext,
} from "@corsair-dev/zendesk";

import { request, type OpenAPIConfig } from "corsair/http";
import { logEventFromContext } from "corsair/core";

// ── Custom options: allow oauth_2 in addition to api_key ──────────────────────
export type CustomZendeskPluginOptions = Omit<ZendeskPluginOptions, "authType"> & {
  authType?: "api_key" | "oauth_2";
};

// ── Key manager with subdomain for OAuth mode ─────────────────────────────────
interface OAuthZendeskKeys {
  get_access_token(): Promise<string | undefined>;
  get_subdomain(): Promise<string | undefined>;
  set_subdomain(url: string): Promise<void>;
}

// ── Typed fetch helper for Bearer-based Zendesk API calls ─────────────────────
interface FetchZendeskApiOptions {
  method?: "GET" | "PUT" | "POST" | "DELETE" | "PATCH";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

async function fetchZendeskApi<TResponse>(
  url: string,
  token: string,
  subdomain: string,
  opts: FetchZendeskApiOptions = {},
): Promise<TResponse> {
  const { method = "GET", body, query } = opts;
  const config: OpenAPIConfig = {
    BASE: `https://${subdomain}.zendesk.com/api/v2`,
    VERSION: "2.0.0",
    WITH_CREDENTIALS: false,
    CREDENTIALS: "omit",
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return await request<TResponse>(
    config,
    {
      method,
      url,
      body: method === "POST" || method === "PUT" || method === "PATCH" ? body : undefined,
      mediaType: "application/json; charset=utf-8",
      query: method === "GET" || method === "DELETE" ? query : undefined,
    },
    {
      rateLimitConfig: {
        enabled: true,
        maxRetries: 3,
        initialRetryDelay: 1000,
        backoffMultiplier: 2,
        headerNames: { retryAfter: "Retry-After" },
      },
    },
  );
}

// ── Custom Zendesk plugin factory ─────────────────────────────────────────────
export function zendesk<const T extends CustomZendeskPluginOptions>(
  options?: CustomZendeskPluginOptions & T,
): ExternalZendeskPlugin<ZendeskPluginOptions> {
  const plugin = baseZendesk(options as unknown as ZendeskPluginOptions);

  // Patch authConfig to include oauth_2 with account-level subdomain field
  const patchedPlugin = plugin as unknown as {
    authConfig: Record<string, unknown>;
  };
  patchedPlugin.authConfig = {
    ...plugin.authConfig,
    oauth_2: { account: ["subdomain"] },
  };

  // Add oauthConfig so Corsair's generateOAuthUrl() recognizes zendesk as OAuth-capable.
  // The authUrl / tokenUrl are placeholder templates — they get overridden
  // dynamically in the connect route because Zendesk OAuth URLs are subdomain-scoped.
  const pluginWithOAuth = plugin as unknown as {
    oauthConfig: {
      providerName: string;
      authUrl: string;
      tokenUrl: string;
      scopes: string[];
      tokenAuthMethod: "body" | "basic";
      requiresRegisteredRedirect: boolean;
    };
  };
  pluginWithOAuth.oauthConfig = {
    providerName: "Zendesk",
    // These are subdomain-scoped URLs. The connect route builds the real URL
    // dynamically using the subdomain from the query parameter. These placeholders
    // ensure Corsair recognizes the plugin has OAuth config and won't reject it.
    authUrl: "https://SUBDOMAIN.zendesk.com/oauth/authorizations/new",
    tokenUrl: "https://SUBDOMAIN.zendesk.com/oauth/tokens",
    scopes: ["read", "write"],
    tokenAuthMethod: "body",
    requiresRegisteredRedirect: true,
  };

  // Override keyBuilder to support oauth_2 (Bearer token)
  const origKeyBuilder = plugin.keyBuilder;
  const newKeyBuilder = async (
    ctx: ZendeskKeyBuilderContext,
    source: string,
  ): Promise<string> => {
    const authType = (ctx as unknown as { authType: string }).authType;

    if (source === "endpoint" && authType === "oauth_2") {
      const keys = ctx.keys as unknown as OAuthZendeskKeys;
      const accessToken = await keys.get_access_token();
      if (!accessToken) {
        throw new Error("Missing access_token for Zendesk OAuth2");
      }
      return `Bearer ${accessToken}`;
    }

    // Fall back to base plugin key builder for api_key auth
    if (origKeyBuilder) {
      return origKeyBuilder(
        ctx as unknown as Parameters<typeof origKeyBuilder>[0],
        source as "endpoint" | "webhook",
      );
    }
    return "";
  };

  plugin.keyBuilder = newKeyBuilder as unknown as typeof plugin.keyBuilder;

  // ── Override endpoints to use Bearer token instead of Basic Auth ──────────
  const baseEndpoints = plugin.endpoints;
  if (!baseEndpoints) {
    throw new Error("Zendesk plugin endpoints are undefined");
  }

  /** Resolves the subdomain from keys or options */
  async function getSubdomain(ctx: ZendeskContext): Promise<string> {
    const keys = ctx.keys as unknown as OAuthZendeskKeys;
    // Try getting from stored account-level keys first (OAuth flow stores it)
    const stored = await keys.get_subdomain();
    if (stored) return stored;
    // Fall back to options (api_key mode)
    const fromOptions = (ctx as unknown as { options?: { subdomain?: string } }).options?.subdomain;
    if (fromOptions) return fromOptions;
    throw new Error("Zendesk subdomain is required but not configured");
  }

  /** Determine if we're using OAuth (Bearer) */
  function isOAuth(ctx: ZendeskContext): boolean {
    return ctx.key.startsWith("Bearer ");
  }

  const tickets = {
    ...baseEndpoints.tickets,
    create: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.tickets.create(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>("tickets.json", ctx.key, subdomain, {
        method: "POST",
        body: {
          ticket: {
            ...(input.subject && { subject: input.subject }),
            ...(input.description && { description: input.description }),
            ...(input.comment && { comment: input.comment }),
            ...(input.status && { status: input.status }),
            ...(input.priority && { priority: input.priority }),
            ...(input.requester_id !== undefined && { requester_id: input.requester_id }),
            ...(input.assignee_id !== undefined && { assignee_id: input.assignee_id }),
            ...(input.group_id !== undefined && { group_id: input.group_id }),
            ...(input.organization_id !== undefined && { organization_id: input.organization_id }),
            ...(input.tags && { tags: input.tags }),
          },
        },
      });
      const ticket = data.ticket;
      if (ticket && ctx.db.tickets) {
        try {
          await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
            id: ticket.id,
            subject: ticket.subject ?? null,
            description: ticket.description ?? null,
            status: ticket.status ?? null,
            priority: ticket.priority ?? null,
            requesterId: ticket.requester_id ?? null,
            assigneeId: ticket.assignee_id ?? null,
            organizationId: ticket.organization_id ?? null,
            groupId: ticket.group_id ?? null,
            createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
            updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
          });
        } catch (e) { console.warn("Failed to save ticket to db:", e); }
      }
      await logEventFromContext(ctx, "zendesk.tickets.create", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    get: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.tickets.get(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>(`tickets/${input.id}.json`, ctx.key, subdomain);
      const ticket = data.ticket;
      if (ticket && ctx.db.tickets) {
        try {
          await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
            id: ticket.id, subject: ticket.subject ?? null, description: ticket.description ?? null,
            status: ticket.status ?? null, priority: ticket.priority ?? null,
            requesterId: ticket.requester_id ?? null, assigneeId: ticket.assignee_id ?? null,
            organizationId: ticket.organization_id ?? null, groupId: ticket.group_id ?? null,
            createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
            updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
          });
        } catch (e) { console.warn("Failed to save ticket to db:", e); }
      }
      await logEventFromContext(ctx, "zendesk.tickets.get", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    update: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.tickets.update(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>(`tickets/${input.id}.json`, ctx.key, subdomain, {
        method: "PUT",
        body: {
          ticket: {
            ...(input.subject && { subject: input.subject }),
            ...(input.status && { status: input.status }),
            ...(input.priority && { priority: input.priority }),
            ...(input.requester_id !== undefined && { requester_id: input.requester_id }),
            ...(input.assignee_id !== undefined && { assignee_id: input.assignee_id }),
            ...(input.comment && { comment: input.comment }),
            ...(input.tags && { tags: input.tags }),
          },
        },
      });
      const ticket = data.ticket;
      if (ticket && ctx.db.tickets) {
        try {
          await ctx.db.tickets.upsertByEntityId(String(ticket.id), {
            id: ticket.id, subject: ticket.subject ?? null, description: ticket.description ?? null,
            status: ticket.status ?? null, priority: ticket.priority ?? null,
            requesterId: ticket.requester_id ?? null, assigneeId: ticket.assignee_id ?? null,
            organizationId: ticket.organization_id ?? null, groupId: ticket.group_id ?? null,
            createdAt: ticket.created_at ? new Date(ticket.created_at) : null,
            updatedAt: ticket.updated_at ? new Date(ticket.updated_at) : null,
          });
        } catch (e) { console.warn("Failed to save ticket to db:", e); }
      }
      await logEventFromContext(ctx, "zendesk.tickets.update", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    delete: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.tickets.delete(ctx, input);
      const subdomain = await getSubdomain(ctx);
      await fetchZendeskApi(`tickets/${input.id}.json`, ctx.key, subdomain, { method: "DELETE" });
      if (ctx.db.tickets) {
        try { await ctx.db.tickets.deleteByEntityId(String(input.id)); }
        catch (e) { console.warn("Failed to delete ticket from db:", e); }
      }
      await logEventFromContext(ctx, "zendesk.tickets.delete", { ...input } as Record<string, unknown>, "completed");
      return { id: input.id };
    },
    list: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.tickets.list(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>("tickets.json", ctx.key, subdomain, {
        method: "GET",
        query: {
          ...(input.page !== undefined && { page: input.page }),
          ...(input.per_page !== undefined && { per_page: input.per_page }),
          ...(input.sort_by && { sort_by: input.sort_by }),
          ...(input.sort_order && { sort_order: input.sort_order }),
        },
      });
      const tickets = data.tickets ?? [];
      if (ctx.db.tickets) {
        for (const t of tickets) {
          try {
            await ctx.db.tickets.upsertByEntityId(String(t.id), {
              id: t.id, subject: t.subject ?? null, description: t.description ?? null,
              status: t.status ?? null, priority: t.priority ?? null,
              requesterId: t.requester_id ?? null, assigneeId: t.assignee_id ?? null,
              organizationId: t.organization_id ?? null, groupId: t.group_id ?? null,
              createdAt: t.created_at ? new Date(t.created_at) : null,
              updatedAt: t.updated_at ? new Date(t.updated_at) : null,
            });
          } catch (e) { console.warn("Failed to save ticket to db:", e); }
        }
      }
      await logEventFromContext(ctx, "zendesk.tickets.list", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
  };

  const users = {
    ...baseEndpoints.users,
    create: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.users.create(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>("users.json", ctx.key, subdomain, {
        method: "POST",
        body: { user: { name: input.name, email: input.email, ...(input.role && { role: input.role }), ...(input.external_id && { external_id: input.external_id }), ...(input.active !== undefined && { active: input.active }) } },
      });
      await logEventFromContext(ctx, "zendesk.users.create", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    get: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.users.get(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>(`users/${input.id}.json`, ctx.key, subdomain);
      await logEventFromContext(ctx, "zendesk.users.get", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    update: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.users.update(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>(`users/${input.id}.json`, ctx.key, subdomain, {
        method: "PUT",
        body: { user: { ...(input.name && { name: input.name }), ...(input.email && { email: input.email }), ...(input.role && { role: input.role }), ...(input.external_id && { external_id: input.external_id }), ...(input.active !== undefined && { active: input.active }) } },
      });
      await logEventFromContext(ctx, "zendesk.users.update", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
    delete: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.users.delete(ctx, input);
      const subdomain = await getSubdomain(ctx);
      await fetchZendeskApi(`users/${input.id}.json`, ctx.key, subdomain, { method: "DELETE" });
      await logEventFromContext(ctx, "zendesk.users.delete", { ...input } as Record<string, unknown>, "completed");
      return { id: input.id };
    },
    list: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.users.list(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>("users.json", ctx.key, subdomain, {
        method: "GET",
        query: { ...(input.page !== undefined && { page: input.page }), ...(input.per_page !== undefined && { per_page: input.per_page }), ...(input.role && { role: input.role }) },
      });
      await logEventFromContext(ctx, "zendesk.users.list", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
  };

  const comments = {
    ...baseEndpoints.comments,
    list: async (ctx: ZendeskContext, input: any): Promise<any> => {
      if (!isOAuth(ctx)) return baseEndpoints.comments.list(ctx, input);
      const subdomain = await getSubdomain(ctx);
      const data = await fetchZendeskApi<any>(`tickets/${input.ticket_id}/comments.json`, ctx.key, subdomain, {
        method: "GET",
        query: { ...(input.page !== undefined && { page: input.page }), ...(input.per_page !== undefined && { per_page: input.per_page }) },
      });
      await logEventFromContext(ctx, "zendesk.comments.list", { ...input } as Record<string, unknown>, "completed");
      return data;
    },
  };

  const endpoints = { ...baseEndpoints, tickets, users, comments };

  return {
    ...plugin,
    keyBuilder: newKeyBuilder,
    endpoints,
  } as unknown as ExternalZendeskPlugin<ZendeskPluginOptions>;
}

/** Re-export types that consumers need. */
export type { ZendeskContext, ZendeskKeyBuilderContext } from "@corsair-dev/zendesk";
export type { ExternalZendeskPlugin } from "@corsair-dev/zendesk";

/** The Zendesk subdomain env var name (used by UI). */
export const ZENDESK_SUBDOMAIN_PLUGINS = ["zendesk"] as const;
