/**
 * Pure provider-resolution for the generic "create issue" flow. The agent tool
 * and UI speak one shape; this picks Linear vs Jira based on what the org has
 * connected and its configured default. No I/O.
 */
export type IssueTracker = "linear" | "jira";

export interface IssueTrackerConnections {
  linear: boolean;
  jira: boolean;
}

export type PickResult =
  | { ok: true; provider: IssueTracker }
  | { ok: false; reason: "none-connected" };

/**
 * Resolve which tracker to use. Honors `preferred` when that one is connected;
 * if both are connected and no valid preference, defaults to Linear; if only
 * one is connected, uses it; none connected → error.
 */
export function pickIssueTracker(
  connections: IssueTrackerConnections,
  preferred?: string | null,
): PickResult {
  const pref =
    preferred === "linear" || preferred === "jira" ? preferred : null;
  if (pref && connections[pref]) return { ok: true, provider: pref };
  if (connections.linear && connections.jira)
    return { ok: true, provider: "linear" };
  if (connections.linear) return { ok: true, provider: "linear" };
  if (connections.jira) return { ok: true, provider: "jira" };
  return { ok: false, reason: "none-connected" };
}
