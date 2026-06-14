import "server-only";

import { getOrgTenant, getConnectionStatus } from "@/server/corsair";
import { pickIssueTracker, type IssueTracker } from "@/lib/issue-tracker";

/**
 * Provider abstraction over issue trackers (Linear + Jira), mirroring the
 * spirit of `getMailProvider`. The agent tool and UI call one `createIssue`
 * shape; the resolver picks the provider from what the org connected (+ its
 * configured default) and routes to the right Corsair plugin.
 */
export interface CreateIssueInput {
  /** Linear teamId or Jira projectKey. */
  target: string;
  title: string;
  description: string;
  /** Jira issue type (Task/Bug/…); ignored by Linear. */
  issueType?: string;
  /** Linear priority 0–4; ignored by Jira. */
  priority?: number;
  assigneeId?: string;
}

export interface CreatedIssue {
  id: string;
  url: string | null;
  identifier: string | null;
}

export interface IssueTarget {
  id: string;
  name: string;
}

export interface IssueHit {
  id: string;
  title: string;
  url: string | null;
}

export interface IssueTrackerProvider {
  readonly tracker: IssueTracker;
  listTargets(): Promise<IssueTarget[]>;
  searchIssues(query: string): Promise<IssueHit[]>;
  createIssue(input: CreateIssueInput): Promise<CreatedIssue>;
}

// ── Linear ────────────────────────────────────────────────────────────────────
interface LinearTeamNode {
  id?: string;
  name?: string;
}
interface LinearIssueNode {
  id?: string;
  title?: string;
  url?: string;
  identifier?: string;
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const nodes = (value as { nodes?: unknown }).nodes;
    if (Array.isArray(nodes)) return nodes;
  }
  return [];
}

function linearProvider(orgId: string): IssueTrackerProvider {
  const tenant = getOrgTenant(orgId);
  return {
    tracker: "linear",
    async listTargets() {
      const res = await tenant.linear.api.teams.list({ first: 50 });
      return asArray(res).map((t) => {
        const node = t as LinearTeamNode;
        return { id: node.id ?? "", name: node.name ?? "(team)" };
      });
    },
    async searchIssues(query) {
      const res = await tenant.linear.api.issues.list({ first: 25 });
      const q = query.toLowerCase();
      return asArray(res)
        .map((i) => {
          const node = i as LinearIssueNode;
          return {
            id: node.id ?? "",
            title: node.title ?? "",
            url: node.url ?? null,
          };
        })
        .filter((i) => i.title.toLowerCase().includes(q));
    },
    async createIssue(input) {
      const res = (await tenant.linear.api.issues.create({
        teamId: input.target,
        title: input.title,
        description: input.description,
        ...(input.priority !== undefined
          ? { priority: clampPriority(input.priority) }
          : {}),
        ...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
      })) as { issue?: LinearIssueNode } & LinearIssueNode;
      const issue = res.issue ?? res;
      return {
        id: issue.id ?? "",
        url: issue.url ?? null,
        identifier: issue.identifier ?? null,
      };
    },
  };
}

function clampPriority(p: number): 0 | 1 | 2 | 3 | 4 {
  const n = Math.max(0, Math.min(4, Math.round(p)));
  return n as 0 | 1 | 2 | 3 | 4;
}

// ── Jira ────────────────────────────────────────────────────────────────────
interface JiraProjectNode {
  id?: string;
  key?: string;
  name?: string;
}
interface JiraIssueNode {
  id?: string;
  key?: string;
  self?: string;
  fields?: { summary?: string };
}

function jiraProvider(orgId: string): IssueTrackerProvider {
  const tenant = getOrgTenant(orgId);
  return {
    tracker: "jira",
    async listTargets() {
      const res = await tenant.jira.api.projects.list({ max_results: 50 });
      const values =
        (res as { values?: unknown }).values ?? asArray(res);
      return asArray(values).map((p) => {
        const node = p as JiraProjectNode;
        return { id: node.key ?? node.id ?? "", name: node.name ?? "(project)" };
      });
    },
    async searchIssues(query) {
      const res = await tenant.jira.api.issues.search({
        jql: `text ~ "${query.replace(/"/g, "")}" ORDER BY updated DESC`,
        max_results: 25,
      });
      const issues = (res as { issues?: unknown }).issues ?? [];
      return asArray(issues).map((i) => {
        const node = i as JiraIssueNode;
        return {
          id: node.key ?? node.id ?? "",
          title: node.fields?.summary ?? node.key ?? "",
          url: node.self ?? null,
        };
      });
    },
    async createIssue(input) {
      const res = (await tenant.jira.api.issues.create({
        project_key: input.target,
        summary: input.title,
        issue_type: input.issueType ?? "Task",
        description: input.description,
        ...(input.assigneeId ? { assignee: input.assigneeId } : {}),
      })) as JiraIssueNode;
      return {
        id: res.id ?? res.key ?? "",
        url: res.self ?? null,
        identifier: res.key ?? null,
      };
    },
  };
}

export type ResolveResult =
  | { ok: true; provider: IssueTrackerProvider }
  | { ok: false; reason: "none-connected" };

/**
 * Resolve the org's issue-tracker provider from connection status + the org's
 * configured default. Pure selection logic lives in `@/lib/issue-tracker`.
 */
export async function resolveIssueTracker(
  orgId: string,
  preferred?: string | null,
): Promise<ResolveResult> {
  const status = await getConnectionStatus({ kind: "org", orgId });
  const pick = pickIssueTracker(
    {
      linear: status.linear === "connected",
      jira: status.jira === "connected",
    },
    preferred,
  );
  if (!pick.ok) return pick;
  return {
    ok: true,
    provider:
      pick.provider === "linear" ? linearProvider(orgId) : jiraProvider(orgId),
  };
}

/** Direct provider for a known tracker (used by the executor after resolution). */
export function issueProviderFor(
  tracker: IssueTracker,
  orgId: string,
): IssueTrackerProvider {
  return tracker === "linear" ? linearProvider(orgId) : jiraProvider(orgId);
}
