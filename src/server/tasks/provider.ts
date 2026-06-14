import "server-only";

import { getTenant, getConnectionStatus } from "@/server/corsair";
import { pickProvider } from "@/lib/pick-provider";

/**
 * Task provider abstraction (Todoist + Asana), mirroring `getMailProvider`. The
 * agent's generic `createTask` tool and UI speak one shape; the resolver picks
 * the app from what the user connected (+ their `defaultTaskProvider`).
 */
export type TaskApp = "todoist" | "asana";
const TASK_ORDER: readonly TaskApp[] = ["todoist", "asana"];

export interface CreateTaskInput {
  title: string;
  notes?: string;
  dueDate?: string; // ISO
  projectId?: string;
}

export interface CreatedTask {
  id: string;
  url: string | null;
}

export interface TaskProject {
  id: string;
  name: string;
}

export interface TaskProvider {
  readonly app: TaskApp;
  listProjects(): Promise<TaskProject[]>;
  createTask(input: CreateTaskInput): Promise<CreatedTask>;
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const inner = value as { data?: unknown; results?: unknown };
    if (Array.isArray(inner.data)) return inner.data;
    if (Array.isArray(inner.results)) return inner.results;
  }
  return [];
}

// ── Todoist ───────────────────────────────────────────────────────────────────
interface TodoistProjectNode {
  id?: string;
  name?: string;
}
interface TodoistTaskNode {
  id?: string;
  url?: string;
}

function todoistProvider(userId: string): TaskProvider {
  const tenant = getTenant(userId);
  return {
    app: "todoist",
    async listProjects() {
      const res = await tenant.todoist.api.projects.getMany({});
      return asArray(res).map((p) => {
        const node = p as TodoistProjectNode;
        return { id: node.id ?? "", name: node.name ?? "(project)" };
      });
    },
    async createTask(input) {
      const res = (await tenant.todoist.api.tasks.create({
        content: input.title,
        ...(input.notes ? { description: input.notes } : {}),
        ...(input.projectId ? { project_id: input.projectId } : {}),
        ...(input.dueDate ? { due_datetime: input.dueDate } : {}),
      })) as TodoistTaskNode;
      return { id: res.id ?? "", url: res.url ?? null };
    },
  };
}

// ── Asana ─────────────────────────────────────────────────────────────────────
interface AsanaProjectNode {
  gid?: string;
  id?: string;
  name?: string;
}
interface AsanaTaskNode {
  gid?: string;
  id?: string;
  permalink_url?: string;
}

function asanaProvider(userId: string): TaskProvider {
  const tenant = getTenant(userId);
  return {
    app: "asana",
    async listProjects() {
      const res = await tenant.asana.api.projects.list({});
      return asArray(res).map((p) => {
        const node = p as AsanaProjectNode;
        return { id: node.gid ?? node.id ?? "", name: node.name ?? "(project)" };
      });
    },
    async createTask(input) {
      const res = (await tenant.asana.api.tasks.create({
        data: {
          name: input.title,
          ...(input.notes ? { notes: input.notes } : {}),
          ...(input.dueDate ? { due_at: input.dueDate } : {}),
          ...(input.projectId ? { projects: [input.projectId] } : {}),
        },
      })) as { data?: AsanaTaskNode } & AsanaTaskNode;
      const task = res.data ?? res;
      return { id: task.gid ?? task.id ?? "", url: task.permalink_url ?? null };
    },
  };
}

export type TaskResolve =
  | { ok: true; provider: TaskProvider }
  | { ok: false; reason: "none-connected" };

/** Resolve the user's task provider from connection status + default pref. */
export async function resolveTaskProvider(
  userId: string,
  preferred?: string | null,
): Promise<TaskResolve> {
  const status = await getConnectionStatus({ kind: "user", userId });
  const pick = pickProvider(
    TASK_ORDER,
    {
      todoist: status.todoist === "connected",
      asana: status.asana === "connected",
    },
    preferred,
  );
  if (!pick.ok) return pick;
  return {
    ok: true,
    provider:
      pick.provider === "todoist"
        ? todoistProvider(userId)
        : asanaProvider(userId),
  };
}

export function taskProviderFor(app: TaskApp, userId: string): TaskProvider {
  return app === "todoist" ? todoistProvider(userId) : asanaProvider(userId);
}
