import "server-only";

import { getOrgTenant, getConnectionStatus } from "@/server/corsair";
import { pickProvider } from "@/lib/pick-provider";

/**
 * Support-desk provider abstraction (Zendesk + Intercom), mirroring
 * `getMailProvider`. The shared-inbox UI and agent speak one shape; the resolver
 * routes to whichever the org connected (+ `defaultSupportProvider`).
 *
 * Both are fully functional. Intercom create resolves/creates the contact via
 * the Intercom REST API and the admin id via `admins.identify`, so
 * create/reply/close/assign all work end-to-end.
 */
const INTERCOM_API = "https://api.intercom.io";
const INTERCOM_VERSION = "2.11";
export type SupportDesk = "zendesk" | "intercom";
const SUPPORT_ORDER: readonly SupportDesk[] = ["zendesk", "intercom"];

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string | null;
  assignee: string | null;
  updatedAt: string | null;
  url: string | null;
}

export interface CreateTicketInput {
  requesterEmail: string;
  subject: string;
  body: string;
  priority?: string;
}
export interface ReplyTicketInput {
  ticketId: string;
  body: string;
  public: boolean;
}
export interface UpdateTicketInput {
  ticketId: string;
  status?: string;
  assigneeId?: string;
  priority?: string;
}

export type CreateTicketResult =
  | { ok: true; id: string }
  | { ok: false; reason: "unsupported" };

export interface SupportProvider {
  readonly desk: SupportDesk;
  getTicket(ticketId: string): Promise<SupportTicket | null>;
  findTicketByEmail(email: string): Promise<SupportTicket[]>;
  createTicket(input: CreateTicketInput): Promise<CreateTicketResult>;
  replyTicket(input: ReplyTicketInput): Promise<void>;
  updateTicket(input: UpdateTicketInput): Promise<void>;
}

// ── Zendesk ───────────────────────────────────────────────────────────────────
interface ZendeskTicketNode {
  id?: number;
  subject?: string;
  status?: string;
  priority?: string;
  assignee_id?: number;
  updated_at?: string;
  url?: string;
}

function zendeskTicket(node: ZendeskTicketNode): SupportTicket {
  return {
    id: node.id != null ? String(node.id) : "",
    subject: node.subject ?? "(no subject)",
    status: node.status ?? "new",
    priority: node.priority ?? null,
    assignee: node.assignee_id != null ? String(node.assignee_id) : null,
    updatedAt: node.updated_at ?? null,
    url: node.url ?? null,
  };
}

function zendeskProvider(orgId: string): SupportProvider {
  const tenant = getOrgTenant(orgId);
  return {
    desk: "zendesk",
    async getTicket(ticketId) {
      const id = Number(ticketId);
      if (Number.isNaN(id)) return null;
      const res = (await tenant.zendesk.api.tickets.get({ id })) as {
        ticket?: ZendeskTicketNode;
      } & ZendeskTicketNode;
      const node = res.ticket ?? res;
      return node.id != null ? zendeskTicket(node) : null;
    },
    async findTicketByEmail(email) {
      // Zendesk plugin (v0.1.1) has no requester-email search; return recent
      // open tickets as context. (Documented limitation.)
      void email;
      const res = (await tenant.zendesk.api.tickets.list({ per_page: 25 })) as {
        tickets?: ZendeskTicketNode[];
      };
      return (res.tickets ?? []).map(zendeskTicket);
    },
    async createTicket(input) {
      // Best-effort requester: create the user, ignore conflicts.
      let requesterId: number | undefined;
      try {
        const u = (await tenant.zendesk.api.users.create({
          name: input.requesterEmail,
          email: input.requesterEmail,
        })) as { user?: { id?: number } };
        requesterId = u.user?.id;
      } catch {
        requesterId = undefined;
      }
      const res = (await tenant.zendesk.api.tickets.create({
        subject: input.subject,
        comment: { body: input.body, public: true },
        ...(input.priority ? { priority: input.priority } : {}),
        ...(requesterId ? { requester_id: requesterId } : {}),
      })) as { ticket?: { id?: number } };
      return { ok: true, id: res.ticket?.id != null ? String(res.ticket.id) : "" };
    },
    async replyTicket(input) {
      await tenant.zendesk.api.tickets.update({
        id: Number(input.ticketId),
        comment: { body: input.body, public: input.public },
      });
    },
    async updateTicket(input) {
      const assigneeId = input.assigneeId ? Number(input.assigneeId) : undefined;
      await tenant.zendesk.api.tickets.update({
        id: Number(input.ticketId),
        ...(input.status ? { status: input.status } : {}),
        ...(input.priority ? { priority: input.priority } : {}),
        ...(assigneeId != null && !Number.isNaN(assigneeId)
          ? { assignee_id: assigneeId }
          : {}),
      });
    },
  };
}

// ── Intercom ──────────────────────────────────────────────────────────────────
interface IntercomConversationNode {
  id?: string;
  title?: string;
  state?: string;
  priority?: string;
  updated_at?: number;
}

function intercomTicket(node: IntercomConversationNode): SupportTicket {
  return {
    id: node.id ?? "",
    subject: node.title ?? "Conversation",
    status: node.state ?? "open",
    priority: node.priority ?? null,
    assignee: null,
    updatedAt:
      node.updated_at != null
        ? new Date(node.updated_at * 1000).toISOString()
        : null,
    url: node.id ? `https://app.intercom.com/a/inbox/_/conversation/${node.id}` : null,
  };
}

function intercomProvider(orgId: string): SupportProvider {
  const tenant = getOrgTenant(orgId);

  const apiKey = () => tenant.intercom.keys.get_api_key();

  const currentAdminId = async (): Promise<string> => {
    const me = (await tenant.intercom.api.admins.identify({})) as {
      id?: string;
      type?: string;
    };
    if (!me.id) throw new Error("Could not resolve an Intercom admin");
    return me.id;
  };

  const resolveContactId = async (email: string): Promise<string> => {
    const key = await apiKey();
    if (!key) throw new Error("Intercom is not connected");
    const headers = {
      Authorization: `Bearer ${key}`,
      "Intercom-Version": INTERCOM_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const searchRes = await fetch(`${INTERCOM_API}/contacts/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: { field: "email", operator: "=", value: email },
      }),
    });
    if (searchRes.ok) {
      const found = (await searchRes.json()) as { data?: { id?: string }[] };
      const existing = found.data?.[0]?.id;
      if (existing) return existing;
    }
    const createRes = await fetch(`${INTERCOM_API}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ role: "user", email }),
    });
    if (!createRes.ok) {
      throw new Error(`intercom contact create failed (${createRes.status})`);
    }
    const created = (await createRes.json()) as { id?: string };
    if (!created.id) throw new Error("Could not resolve an Intercom contact");
    return created.id;
  };

  return {
    desk: "intercom",
    async getTicket(ticketId) {
      const res = (await tenant.intercom.api.conversations.get({
        id: ticketId,
      })) as IntercomConversationNode;
      return res.id ? intercomTicket(res) : null;
    },
    async findTicketByEmail(email) {
      const res = (await tenant.intercom.api.conversations.search({
        query: { field: "source.author.email", operator: "=", value: email },
      })) as { conversations?: IntercomConversationNode[] };
      return (res.conversations ?? []).map(intercomTicket);
    },
    async createTicket(input) {
      const contactId = await resolveContactId(input.requesterEmail);
      const res = (await tenant.intercom.api.conversations.create({
        from: { type: "contact", id: contactId },
        body: input.subject
          ? `${input.subject}\n\n${input.body}`
          : input.body,
      })) as { conversation_id?: string; id?: string };
      const id = res.conversation_id ?? res.id ?? "";
      return { ok: true, id };
    },
    async replyTicket(input) {
      const adminId = await currentAdminId();
      await tenant.intercom.api.conversations.reply({
        id: input.ticketId,
        type: "admin",
        admin_id: adminId,
        message_type: input.public ? "comment" : "note",
        body: input.body,
      });
    },
    async updateTicket(input) {
      const adminId = await currentAdminId();
      if (input.assigneeId) {
        await tenant.intercom.api.conversations.assign({
          id: input.ticketId,
          admin_id: adminId,
          assignee_id: input.assigneeId,
          type: "admin",
        });
      }
      if (input.status === "closed") {
        await tenant.intercom.api.conversations.close({
          id: input.ticketId,
          admin_id: adminId,
        });
      }
    },
  };
}

export type SupportResolve =
  | { ok: true; provider: SupportProvider }
  | { ok: false; reason: "none-connected" };

export async function resolveSupportProvider(
  orgId: string,
  preferred?: string | null,
): Promise<SupportResolve> {
  const status = await getConnectionStatus({ kind: "org", orgId });
  const pick = pickProvider(
    SUPPORT_ORDER,
    {
      zendesk: status.zendesk === "connected",
      intercom: status.intercom === "connected",
    },
    preferred,
  );
  if (!pick.ok) return pick;
  return {
    ok: true,
    provider:
      pick.provider === "zendesk"
        ? zendeskProvider(orgId)
        : intercomProvider(orgId),
  };
}
