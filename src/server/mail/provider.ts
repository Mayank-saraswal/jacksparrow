import "server-only";

import { getTenantFor, type TenantRef } from "@/server/corsair";
import { buildRawMessage } from "@/server/gmail";
import {
  normalizeGmailThread,
  type CanonicalThread,
  type CanonicalMessage,
} from "@/lib/mail";

/**
 * Minimal provider abstraction over a mail backend (Gmail + Outlook). Shared
 * inboxes and (incrementally) the rest of the app consume the canonical
 * Thread/Message shape through this interface rather than importing
 * provider-specific helpers.
 */
export interface ThreadListItem {
  threadId: string;
  subject: string;
  from: string;
  date: string | null;
  snippet: string;
}

export interface SendMessage {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  threadId?: string;
  inReplyTo?: string;
}

export interface MailProvider {
  readonly plugin: "gmail" | "outlook";
  listThreads(query: string, limit: number): Promise<ThreadListItem[]>;
  getThread(threadId: string): Promise<CanonicalThread>;
  send(msg: SendMessage): Promise<{ id: string | null }>;
}

const METADATA_HEADERS = ["Subject", "From", "To", "Date"];

// ── Gmail ────────────────────────────────────────────────────────────────────
function gmailProvider(ref: TenantRef): MailProvider {
  const tenant = getTenantFor(ref);
  return {
    plugin: "gmail",
    async listThreads(query, limit) {
      const list = await tenant.gmail.api.threads.list({
        q: query,
        maxResults: limit,
      });
      const ids = (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");
      const threads = await Promise.all(
        ids.map((id) =>
          tenant.gmail.api.threads.get({
            id,
            format: "metadata",
            metadataHeaders: METADATA_HEADERS,
          }),
        ),
      );
      return threads.map((t) => {
        const c = normalizeGmailThread(t);
        const last = c.messages[c.messages.length - 1];
        return {
          threadId: c.id,
          subject: c.subject,
          from: last?.from.email ?? "",
          date: last?.date ?? null,
          snippet: last?.snippet ?? "",
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
    async send(msg) {
      const raw = buildRawMessage({
        to: msg.to,
        cc: msg.cc,
        subject: msg.subject,
        body: msg.body,
        inReplyTo: msg.inReplyTo,
      });
      const res = await tenant.gmail.api.messages.send({
        raw,
        threadId: msg.threadId,
      });
      return { id: res.id ?? null };
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
  return {
    plugin: "outlook",
    async listThreads(query, limit) {
      const out = await tenant.outlook.api.messages.list({
        top: limit,
        orderby: ["receivedDateTime desc"],
        ...(query ? { subject_contains: query } : {}),
      });
      const items = ((out as { value?: OutlookApiMessage[] }).value ?? []);
      return items.map((m) => ({
        threadId: m.conversationId ?? m.id ?? "",
        subject: m.subject ?? "(no subject)",
        from: (m.from?.address ?? "").toLowerCase(),
        date: m.receivedDateTime
          ? new Date(m.receivedDateTime).toISOString()
          : null,
        snippet: m.bodyPreview ?? "",
      }));
    },
    async getThread(threadId) {
      // Outlook groups by conversationId; collect the conversation's messages.
      const out = await tenant.outlook.api.messages.list({
        conversationId: threadId,
        top: 50,
        orderby: ["receivedDateTime asc"],
      });
      const items = ((out as { value?: OutlookApiMessage[] }).value ?? []);
      return {
        id: threadId,
        subject: items[0]?.subject ?? "(no subject)",
        messages: items.map(outlookMsgToCanonical),
      };
    },
    async send(msg) {
      const res = await tenant.outlook.api.messages.send({
        to: msg.to[0] ?? "",
        cc_emails: msg.to.slice(1).concat(msg.cc ?? []),
        subject: msg.subject,
        body: msg.body,
        is_html: false,
      });
      const body = res?.body as { id?: string } | undefined;
      return { id: body?.id ?? null };
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
