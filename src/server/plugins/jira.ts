import { jira as baseJira } from "@corsair-dev/jira";
import type { 
  ExternalJiraPlugin, 
  JiraPluginOptions,
  JiraContext,
  JiraKeyBuilderContext,
  ProjectsListInput,
  ProjectsListResponse,
  IssuesSearchInput,
  IssuesSearchResponse,
  IssuesCreateInput,
  IssuesCreateResponse
} from "@corsair-dev/jira";
import { request, type OpenAPIConfig } from "corsair/http";
import { logEventFromContext } from "corsair/core";

export type CustomJiraPluginOptions = Omit<JiraPluginOptions, "authType"> & {
  authType?: "api_key" | "oauth_2";
};

interface KeysWithCloudUrl {
  get_access_token(): Promise<string | undefined>;
  get_cloud_url(): Promise<string | undefined>;
  set_cloud_url(url: string): Promise<void>;
}

interface FetchJiraApiOptions {
  method?: "GET" | "PUT" | "POST" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export function jira<const T extends CustomJiraPluginOptions>(options?: CustomJiraPluginOptions & T): ExternalJiraPlugin<JiraPluginOptions> {
  const plugin = baseJira(options as unknown as JiraPluginOptions);

  (plugin as unknown as { authConfig: Record<string, unknown> }).authConfig = {
    ...plugin.authConfig,
    oauth_2: { account: ["cloud_url"] },
  };

  // Override keyBuilder to support oauth_2
  const origKeyBuilder = plugin.keyBuilder;
  const newKeyBuilder = async (i: JiraKeyBuilderContext, t: string): Promise<string> => {
    const authType = i.authType as string;
    if (t === "endpoint" && authType === "oauth_2") {
      const keys = i.keys as unknown as KeysWithCloudUrl;
      const accessToken = await keys.get_access_token();
      if (!accessToken) throw new Error("Missing access_token for Jira OAuth2");

      let cloudUrl = await keys.get_cloud_url();
      if (!cloudUrl) {
        // Fetch cloudId
        const res = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch Jira accessible resources");
        const resources = (await res.json()) as Array<{ id: string }>;
        const resource = resources[0];
        if (!resource) throw new Error("No accessible resources found for Jira");
        
        const cloudId = resource.id;
        cloudUrl = `https://api.atlassian.com/ex/jira/${cloudId}`;
        
        await keys.set_cloud_url(cloudUrl);
      }

      return `Bearer ${accessToken}`;
    }
    if (origKeyBuilder) {
      return origKeyBuilder(i as unknown as Parameters<typeof origKeyBuilder>[0], t as "endpoint" | "webhook");
    }
    return "";
  };

  plugin.keyBuilder = newKeyBuilder as unknown as typeof plugin.keyBuilder;

  // Custom API wrapper that does not use Basic Auth
  async function fetchJiraApi<TResponse>(url: string, key: string, cloudUrl: string, opts: FetchJiraApiOptions = {}): Promise<TResponse> {
    const { method = "GET", body, query } = opts;
    const config: OpenAPIConfig = {
      BASE: `${cloudUrl}/rest/api/3`,
      VERSION: "3",
      WITH_CREDENTIALS: false,
      CREDENTIALS: "omit",
      HEADERS: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: key, // key is already "Bearer <token>"
      },
    };
    return await request<TResponse>(config, {
      method,
      url,
      body: method === "POST" || method === "PUT" || method === "PATCH" ? body : undefined,
      mediaType: "application/json; charset=utf-8",
      query: method === "GET" || method === "DELETE" ? query : undefined,
    }, {
      rateLimitConfig: { enabled: true, maxRetries: 3, initialRetryDelay: 1000, backoffMultiplier: 2, headerNames: { retryAfter: "Retry-After" } }
    });
  }

  const baseEndpoints = plugin.endpoints;
  if (!baseEndpoints) {
    throw new Error("Jira plugin endpoints are undefined");
  }

  const projects = {
    ...baseEndpoints.projects,
    list: async (o: JiraContext, s: ProjectsListInput): Promise<ProjectsListResponse> => {
      const keys = o.keys as unknown as KeysWithCloudUrl;
      const cloudUrl = (await keys.get_cloud_url()) ?? "";
      const data = await fetchJiraApi<ProjectsListResponse>("project/search", o.key, cloudUrl, {
        method: "GET",
        query: {
          ...(s.query && { query: s.query }),
          ...(s.order_by && { orderBy: s.order_by }),
          ...(s.start_at !== undefined && { startAt: s.start_at }),
          ...(s.max_results !== undefined && { maxResults: s.max_results }),
          ...(s.expand && { expand: s.expand }),
        },
      });
      // The original plugin syncs to DB here. Let's replicate for safety.
      if (data.values && o.db.projects) {
        for (const r of data.values) {
          if (r.id && r.key) {
            try {
              await o.db.projects.upsertByEntityId(r.id, {
                id: r.id,
                key: r.key,
                ...(r.name && { name: r.name }),
                ...(r.description && { description: r.description }),
                ...(r.projectTypeKey && { projectTypeKey: r.projectTypeKey }),
                ...(r.lead?.accountId && { leadAccountId: r.lead.accountId }),
                ...(r.lead?.displayName && { leadDisplayName: r.lead.displayName }),
                createdAt: new Date(),
              });
            } catch (e) {
              console.warn("Failed to save project to db:", e);
            }
          }
        }
      }
      await logEventFromContext(o, "jira.projects.list", { ...s } as Record<string, unknown>, "completed");
      return data;
    }
  };

  const issues = {
    ...baseEndpoints.issues,
    search: async (o: JiraContext, s: IssuesSearchInput): Promise<IssuesSearchResponse> => {
      const keys = o.keys as unknown as KeysWithCloudUrl;
      const cloudUrl = (await keys.get_cloud_url()) ?? "";
      const data = await fetchJiraApi<IssuesSearchResponse>("search/jql", o.key, cloudUrl, {
        method: "GET",
        query: {
          jql: s.jql,
          startAt: s.start_at,
          maxResults: s.max_results,
          fields: s.fields,
          expand: s.expand,
        },
      });
      if (data.issues && o.db.issues) {
        for (const r of data.issues) {
          if (r.id && r.key) {
            try {
              await o.db.issues.upsertByEntityId(r.id, {
                id: r.id,
                key: r.key,
                summary: r.fields?.summary,
                status: r.fields?.status?.name,
                assigneeAccountId: r.fields?.assignee?.accountId,
                assigneeDisplayName: r.fields?.assignee?.displayName,
                priority: r.fields?.priority?.name ?? undefined,
                issueType: r.fields?.issuetype?.name,
                projectKey: r.fields?.project?.key,
                createdAt: new Date(),
              });
            } catch (e) {
              console.warn("Failed to save issue to db:", e);
            }
          }
        }
      }
      await logEventFromContext(o, "jira.issues.search", { ...s } as Record<string, unknown>, "completed");
      return data;
    },

    create: async (o: JiraContext, s: IssuesCreateInput): Promise<IssuesCreateResponse> => {
      const keys = o.keys as unknown as KeysWithCloudUrl;
      const cloudUrl = (await keys.get_cloud_url()) ?? "";
      const formatAdf = (text: string) => ({ version: 1, type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
      
      const data = await fetchJiraApi<IssuesCreateResponse>("issue", o.key, cloudUrl, {
        method: "POST",
        body: {
          fields: {
            project: { key: s.project_key },
            summary: s.summary,
            issuetype: { name: s.issue_type ?? "Task" },
            ...(s.description && { description: formatAdf(s.description) }),
            ...(s.assignee && { assignee: { accountId: s.assignee } }),
            ...(s.priority && { priority: { name: s.priority } }),
            ...(s.labels && { labels: s.labels }),
            ...(s.due_date && { duedate: s.due_date }),
            ...(s.parent && { parent: { key: s.parent } }),
          },
        },
      });
      
      if (data.id && data.key && o.db.issues) {
        try {
          await o.db.issues.upsertByEntityId(data.id, {
            id: data.id,
            key: data.key,
            summary: s.summary,
            issueType: s.issue_type ?? "Task",
            projectKey: s.project_key,
            createdAt: new Date(),
          });
        } catch (e) {
          console.warn("Failed to save issue to db:", e);
        }
      }
      await logEventFromContext(o, "jira.issues.create", { ...s } as Record<string, unknown>, "completed");
      return data;
    }
  };

  const endpoints = {
    ...baseEndpoints,
    projects,
    issues
  };

  return {
    ...plugin,
    keyBuilder: newKeyBuilder,
    endpoints
  } as unknown as ExternalJiraPlugin<JiraPluginOptions>;
}
