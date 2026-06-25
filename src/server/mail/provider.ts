import "server-only";

import { db } from "@/server/db";
import {
  getTenantFor,
  tenantId,
  type TenantRef,
} from "@/server/corsair";
import {
  buildRawMessage,
  threadDetail,
  threadPreview,
  type MessageDetail,
  type ThreadDetail,
} from "@/server/gmail";
import {
  normalizeGmailThread,
  type CanonicalThread,
  type CanonicalMessage,
} from "@/lib/mail";

/**
 * Provider abstraction over a mail backend (Gmail + Outlook). The inbox router,
 * agent tools and shared inboxes consume mail through this interface rather
 * than importing provider-specific helpers — keeping every `.gmail.` / `.outlook.`
 * reference confined to this file.
 */
export interface ThreadListItem {
  threadId: string;
  subject: string;
  from: string;
  fromName: string;
  date: string | null;
  snippet: string;
  unread: boolean;
  starred: boolean;
}

export interface SendMessage {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  html?: string;
  threadId?: string;
  inReplyTo?: string;
}

export interface MailProvider {
  readonly plugin: "gmail" | "outlook";
  listThreads(query: string, limit: number): Promise<ThreadListItem[]>;
  getThread(threadId: string): Promise<CanonicalThread>;
  /** Full thread detail in the inbox UI's shape (bodies + invite parsing). */
  getThreadDetail(threadId: string): Promise<ThreadDetail>;
  send(msg: SendMessage): Promise<{ id: string | null }>;
  saveDraft(
    msg: SendMessage,
    draftId?: string,
  ): Promise<{ draftId: string | null }>;
  archive(threadId: string): Promise<void>;
  unarchive(threadId: string): Promise<void>;
  trash(threadId: string): Promise<void>;
  untrash(threadId: string): Promise<void>;
  setRead(threadId: string, read: boolean): Promise<void>;
  setStar(threadId: string, starred: boolean): Promise<void>;
  /** Add/remove labels (Gmail labelIds) or categories (Outlook) on a thread. */
  modifyLabels(
    threadId: string,
    addLabels: string[],
    removeLabels: string[],
  ): Promise<void>;
}

/** CanonicalMessage → the inbox UI's MessageDetail shape. */
function canonicalToMessageDetail(m: CanonicalMessage): MessageDetail {
  return {
    id: m.id,
    messageId: m.id,
    fromName: m.from.name,
    fromEmail: m.from.email,
    to: m.to.map((t) => t.email).filter(Boolean).join(", "),
    date: m.date,
    subject: m.subject,
    snippet: m.snippet,
    bodyHtml: m.bodyHtml,
    bodyText: m.bodyText,
    unread: m.labels.includes("UNREAD"),
  };
}

// ── Gmail ────────────────────────────────────────────────────────────────────
function gmailProvider(ref: TenantRef): MailProvider {
  const tenant = getTenantFor(ref);
  return {
    plugin: "gmail",
    async listThreads(query, limit) {
      // 1. Local PostgreSQL sync layer (Corsair DB)
      const options = {
        limit,
        ...(query ? { data: { snippet: { contains: query } } } : {}),
      };
      
      const dbThreads = await tenant.gmail.db.threads.search(options).catch(() => []);
      
      if (dbThreads && dbThreads.length > 0) {
        return dbThreads.map((t) => {
          // Corsair stores the raw Gmail thread object in `t.data`
          const p = threadPreview(t.data);
          return {
            threadId: p.threadId,
            subject: p.subject,
            from: p.fromEmail,
            fromName: p.fromName,
            date: p.date,
            snippet: p.snippet,
            unread: p.unread,
            starred: p.starred,
          };
        });
      }

      // 2. Fallback to network-dependent API if DB hasn't backfilled yet
      const list = await tenant.gmail.api.threads.list({
        q: query,
        maxResults: limit,
      });
      const ids = (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");
      // Hydrate with format=full so message headers (Subject/From) are present;
      // metadata format does not reliably return parseable headers here.
      const threads = await Promise.all(
        ids.map((id) =>
          tenant.gmail.api.threads.get({ id, format: "full" }),
        ),
      );
      return threads.map((t) => {
        const p = threadPreview(t);
        return {
          threadId: p.threadId,
          subject: p.subject,
          from: p.fromEmail,
          fromName: p.fromName,
          date: p.date,
          snippet: p.snippet,
          unread: p.unread,
          starred: p.starred,
        };
      });
    },
    async getThread(threadId) {
      const raw = await tenant.gmail.api.threads.get({
        id: threadId,
        format: "full",
      });
      return normalizeGmailThread(raw);
    },
    async getThreadDetail(threadId) {
      const raw = await tenant.gmail.api.threads.get({
        id: threadId,
        format: "full",
      });
      return threadDetail(raw);
    },
    async send(msg) {
      const raw = buildRawMessage({
        to: msg.to,
        cc: msg.cc,
        bcc: msg.bcc,
        subject: msg.subject,
        body: msg.body,
        html: msg.html,
        inReplyTo: msg.inReplyTo,
      });
      const res = await tenant.gmail.api.messages.send({
        raw,
        threadId: msg.threadId,
      });
      return { id: res.id ?? null };
    },
    async saveDraft(msg, draftId) {
      const raw = buildRawMessage({
        to: msg.to,
        cc: msg.cc,
        bcc: msg.bcc,
        subject: msg.subject,
        body: msg.body,
        html: msg.html,
        inReplyTo: msg.inReplyTo,
      });
      const message = { raw, threadId: msg.threadId };
      if (draftId) {
        const updated = await tenant.gmail.api.drafts.update({
          id: draftId,
          draft: { message },
        });
        return { draftId: updated.id ?? null };
      }
      const created = await tenant.gmail.api.drafts.create({
        draft: { message },
      });
      return { draftId: created.id ?? null };
    },
    async archive(threadId) {
      await tenant.gmail.api.threads.modify({
        id: threadId,
        removeLabelIds: ["INBOX"],
      });
    },
    async unarchive(threadId) {
      await tenant.gmail.api.threads.modify({
        id: threadId,
        addLabelIds: ["INBOX"],
      });
    },
    async trash(threadId) {
      await tenant.gmail.api.threads.trash({ id: threadId });
    },
    async untrash(threadId) {
      await tenant.gmail.api.threads.untrash({ id: threadId });
    },
    async setRead(threadId, read) {
      await tenant.gmail.api.threads.modify({
        id: threadId,
        addLabelIds: read ? [] : ["UNREAD"],
        removeLabelIds: read ? ["UNREAD"] : [],
      });
    },
    async setStar(threadId, starred) {
      await tenant.gmail.api.threads.modify({
        id: threadId,
        addLabelIds: starred ? ["STARRED"] : [],
        removeLabelIds: starred ? [] : ["STARRED"],
      });
    },
    async modifyLabels(threadId, addLabels, removeLabels) {
      await tenant.gmail.api.threads.modify({
        id: threadId,
        addLabelIds: addLabels,
        removeLabelIds: removeLabels,
      });
    },
  };
}

// ── Outlook (Microsoft Graph via Corsair) ─────────────────────────────────────
interface OutlookApiMessage {
  id?: string;
  subject?: string;
  bodyPreview?: string;
  body?: { contentType?: string; content?: string };
  from?: { name?: string; address?: string };
  toRecipients?: { name?: string; address?: string }[];
  receivedDateTime?: string;
  conversationId?: string;
  categories?: string[];
  isRead?: boolean;
}

function outlookMsgToCanonical(m: OutlookApiMessage): CanonicalMessage {
  const isHtml = m.body?.contentType?.toLowerCase() === "html";
  const content = m.body?.content ?? null;
  return {
    id: m.id ?? "",
    from: { name: m.from?.name ?? "", email: (m.from?.address ?? "").toLowerCase() },
    to: (m.toRecipients ?? []).map((r) => ({
      name: r.name ?? "",
      email: (r.address ?? "").toLowerCase(),
    })),
    date: m.receivedDateTime ? new Date(m.receivedDateTime).toISOString() : null,
    subject: m.subject ?? "(no subject)",
    snippet: m.bodyPreview ?? "",
    bodyText: isHtml ? null : content,
    bodyHtml: isHtml ? content : null,
    labels: [...(m.categories ?? []), ...(m.isRead === false ? ["UNREAD"] : [])],
  };
}

function outlookProvider(ref: TenantRef): MailProvider {
  const tenant = getTenantFor(ref);

  // Outlook groups by conversationId; collect the conversation's message rows.
  const conversationMessages = async (
    conversationId: string,
  ): Promise<OutlookApiMessage[]> => {
    const out = await tenant.outlook.api.messages.list({
      conversationId,
      top: 50,
      orderby: ["receivedDateTime asc"],
    });
    return (out as { value?: OutlookApiMessage[] }).value ?? [];
  };

  const conversationIds = async (conversationId: string): Promise<string[]> => {
    const items = await conversationMessages(conversationId);
    return items.map((m) => m.id).filter((id): id is string => Boolean(id));
  };

  const moveConversation = async (
    conversationId: string,
    destinationId: string,
  ): Promise<void> => {
    const ids = await conversationIds(conversationId);
    if (ids.length === 0) return;
    await tenant.outlook.api.messages.batchMove({
      message_ids: ids,
      destination_id: destinationId,
    });
  };

  const patchConversation = async (
    conversationId: string,
    patch: Record<string, unknown>,
  ): Promise<void> => {
    const ids = await conversationIds(conversationId);
    if (ids.length === 0) return;
    await tenant.outlook.api.messages.batchUpdate({
      updates: ids.map((message_id) => ({ message_id, patch })),
    });
  };

  return {
    plugin: "outlook",
    async listThreads(query, limit) {
      // 1. Local PostgreSQL sync layer (Corsair DB)
      const options = {
        limit,
        ...(query ? { data: { bodyPreview: { contains: query } } } : {}),
      };
      
      const dbMessages = await tenant.outlook.db.messages.search(options).catch(() => []);
      
      if (dbMessages && dbMessages.length > 0) {
        return dbMessages.map((t) => {
          const m = t.data as unknown as OutlookApiMessage;
          return {
            threadId: m.conversationId ?? m.id ?? "",
            subject: m.subject ?? "(no subject)",
            from: (m.from?.address ?? "").toLowerCase(),
            fromName: m.from?.name ?? "",
            date: m.receivedDateTime
              ? new Date(m.receivedDateTime).toISOString()
              : null,
            snippet: m.bodyPreview ?? "",
            unread: m.isRead === false,
            starred: false,
          };
        });
      }

      // 2. Fallback to network-dependent API
      const out = await tenant.outlook.api.messages.list({
        top: limit,
        orderby: ["receivedDateTime desc"],
        ...(query ? { subject_contains: query } : {}),
      });
      const items = (out as { value?: OutlookApiMessage[] }).value ?? [];
      return items.map((m: OutlookApiMessage) => ({
        threadId: m.conversationId ?? m.id ?? "",
        subject: m.subject ?? "(no subject)",
        from: (m.from?.address ?? "").toLowerCase(),
        fromName: m.from?.name ?? "",
        date: m.receivedDateTime
          ? new Date(m.receivedDateTime).toISOString()
          : null,
        snippet: m.bodyPreview ?? "",
        unread: m.isRead === false,
        starred: false,
      }));
    },
    async getThread(threadId) {
      const items = await conversationMessages(threadId);
      return {
        id: threadId,
        subject: items[0]?.subject ?? "(no subject)",
        messages: items.map(outlookMsgToCanonical),
      };
    },
    async getThreadDetail(threadId) {
      const items = await conversationMessages(threadId);
      return {
        threadId,
        subject: items[0]?.subject ?? "(no subject)",
        invite: null,
        messages: items.map(outlookMsgToCanonical).map(canonicalToMessageDetail),
      };
    },
    async send(msg) {
      const res = await tenant.outlook.api.messages.send({
        to: msg.to[0] ?? "",
        cc_emails: msg.to.slice(1).concat(msg.cc ?? []),
        bcc_emails: msg.bcc,
        subject: msg.subject,
        body: msg.html ?? msg.body,
        is_html: typeof msg.html === "string" && msg.html.length > 0,
      });
      const body = res?.body as { id?: string } | undefined;
      return { id: body?.id ?? null };
    },
    async saveDraft(msg, draftId) {
      const isHtml = typeof msg.html === "string" && msg.html.length > 0;
      if (draftId) {
        await tenant.outlook.api.messages.update({
          message_id: draftId,
          subject: msg.subject,
        });
        return { draftId };
      }
      const res = await tenant.outlook.api.messages.createDraft({
        subject: msg.subject,
        body: isHtml ? msg.html! : msg.body,
        is_html: isHtml,
        to_recipients: msg.to,
        cc_recipients: msg.cc,
        bcc_recipients: msg.bcc,
      });
      const body = res?.body as { id?: string } | undefined;
      return { draftId: body?.id ?? null };
    },
    async archive(threadId) {
      await moveConversation(threadId, "archive");
    },
    async unarchive(threadId) {
      await moveConversation(threadId, "inbox");
    },
    async trash(threadId) {
      await moveConversation(threadId, "deleteditems");
    },
    async untrash(threadId) {
      await moveConversation(threadId, "inbox");
    },
    async setRead(threadId, read) {
      await patchConversation(threadId, { isRead: read });
    },
    async setStar(threadId, starred) {
      await patchConversation(threadId, {
        flag: { flagStatus: starred ? "flagged" : "notFlagged" },
      });
    },
    async modifyLabels(threadId, addLabels, removeLabels) {
      // Outlook has no labels — map to message categories, merged per message.
      const items = await conversationMessages(threadId);
      const removeSet = new Set(removeLabels);
      const updates: { message_id: string; patch: Record<string, unknown> }[] =
        [];
      for (const m of items) {
        if (!m.id) continue;
        const next = new Set(m.categories ?? []);
        for (const r of removeSet) next.delete(r);
        for (const a of addLabels) next.add(a);
        updates.push({ message_id: m.id, patch: { categories: [...next] } });
      }
      if (updates.length > 0) {
        await tenant.outlook.api.messages.batchUpdate({ updates });
      }
    },
  };
}

/** Resolves the provider for a plugin under a tenant. */
export function getMailProvider(
  plugin: "gmail" | "outlook",
  ref: TenantRef,
): MailProvider {
  return plugin === "outlook" ? outlookProvider(ref) : gmailProvider(ref);
}

/**
 * Picks the mail backend for a tenant from its connected accounts. When both
 * Gmail and Outlook are connected, the user's `primaryMailPlugin` preference
 * decides (default "gmail").
 */
export async function resolveMailPlugin(
  ref: TenantRef,
): Promise<"gmail" | "outlook"> {
  const accounts = await db.corsairAccount.findMany({
    where: {
      tenantId: tenantId(ref),
      integration: { name: { in: ["gmail", "outlook"] } },
    },
    select: { integration: { select: { name: true } } },
  });
  const names = new Set(accounts.map((a) => a.integration.name));
  const hasGmail = names.has("gmail");
  const hasOutlook = names.has("outlook");

  if (hasGmail && hasOutlook) {
    if (ref.kind === "user") {
      const pref = await db.userPreference.findUnique({
        where: { userId: ref.userId },
        select: { primaryMailPlugin: true },
      });
      return pref?.primaryMailPlugin === "outlook" ? "outlook" : "gmail";
    }
    return "gmail";
  }
  if (hasOutlook) return "outlook";
  return "gmail";
}
