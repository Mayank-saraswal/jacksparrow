import "server-only";

import { parseInvite, type ParsedInvite } from "@/server/calendar";
import { parseAddress } from "@/lib/email";

/**
 * Lightweight Gmail helpers: parse the message shapes Corsair returns from the
 * Gmail API into the preview/detail shapes our inbox UI needs, and build RFC822
 * raw messages for sending/drafting.
 *
 * We model the Gmail payload locally (the SDK's inferred zod types are deeply
 * nested) and cast Corsair's responses to these shapes at the call sites.
 */

export interface GmailHeader {
  name?: string;
  value?: string;
}

export interface GmailPayload {
  mimeType?: string;
  filename?: string;
  headers?: GmailHeader[];
  body?: { data?: string; size?: number; attachmentId?: string };
  parts?: GmailPayload[];
}

export interface GmailMessage {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: Date | string | number | null;
  payload?: GmailPayload;
}

export interface GmailThread {
  id?: string;
  snippet?: string;
  historyId?: string;
  messages?: GmailMessage[];
}

export interface ThreadPreview {
  threadId: string;
  subject: string;
  snippet: string;
  fromName: string;
  fromEmail: string;
  date: string | null;
  unread: boolean;
  starred: boolean;
  labelIds: string[];
  messageCount: number;
  priority: { label: string; reason: string } | null;
}

export interface MessageDetail {
  id: string;
  messageId: string;
  fromName: string;
  fromEmail: string;
  to: string;
  date: string | null;
  subject: string;
  snippet: string;
  bodyHtml: string | null;
  bodyText: string | null;
  unread: boolean;
}

export interface ThreadDetail {
  threadId: string;
  subject: string;
  messages: MessageDetail[];
  invite: ParsedInvite | null;
}

function headerValue(headers: GmailHeader[] | undefined, name: string): string {
  const match = headers?.find(
    (h) => h.name?.toLowerCase() === name.toLowerCase(),
  );
  return match?.value ?? "";
}

function toIso(value: GmailMessage["internalDate"]): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isNaN(n) && n > 0) return new Date(n).toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function decodeBase64Url(data: string | undefined): string {
  if (!data) return "";
  try {
    return Buffer.from(data, "base64url").toString("utf8");
  } catch {
    return "";
  }
}

/** Recursively pulls the text/plain and text/html bodies out of a payload. */
function extractBodies(payload: GmailPayload | undefined): {
  text: string | null;
  html: string | null;
} {
  let text: string | null = null;
  let html: string | null = null;

  const walk = (part: GmailPayload | undefined) => {
    if (!part) return;
    const mime = part.mimeType ?? "";
    if (mime === "text/plain" && part.body?.data && text == null) {
      text = decodeBase64Url(part.body.data);
    } else if (mime === "text/html" && part.body?.data && html == null) {
      html = decodeBase64Url(part.body.data);
    }
    part.parts?.forEach(walk);
  };

  walk(payload);
  return { text, html };
}

export function threadPreview(thread: GmailThread): ThreadPreview {
  const messages = thread.messages ?? [];
  const last = messages[messages.length - 1];
  const headers = last?.payload?.headers;
  const from = parseAddress(headerValue(headers, "From"));
  const dateHeader = headerValue(headers, "Date");
  const labelIds = Array.from(
    new Set(messages.flatMap((m) => m.labelIds ?? [])),
  );

  return {
    threadId: thread.id ?? "",
    subject: headerValue(headers, "Subject") || "(no subject)",
    snippet: thread.snippet ?? last?.snippet ?? "",
    fromName: from.name,
    fromEmail: from.email,
    date: toIso(last?.internalDate) ?? (dateHeader.length > 0 ? dateHeader : null),
    unread: labelIds.includes("UNREAD"),
    starred: labelIds.includes("STARRED"),
    labelIds,
    messageCount: messages.length,
    priority: null,
  };
}

/** Finds and decodes a text/calendar part anywhere in the payload. */
function findCalendarBody(payload: GmailPayload | undefined): string | null {
  if (!payload) return null;
  const mime = payload.mimeType ?? "";
  if (mime.startsWith("text/calendar") && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  for (const part of payload.parts ?? []) {
    const found = findCalendarBody(part);
    if (found) return found;
  }
  return null;
}

export function threadDetail(thread: GmailThread): ThreadDetail {
  const messages = thread.messages ?? [];
  const subject =
    headerValue(messages[0]?.payload?.headers, "Subject") || "(no subject)";

  // Detect an invite from the most recent message that carries a VEVENT.
  let invite: ParsedInvite | null = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const ics = findCalendarBody(messages[i]?.payload);
    if (ics) {
      invite = parseInvite(ics);
      if (invite) break;
    }
  }

  return {
    threadId: thread.id ?? "",
    subject,
    invite,
    messages: messages.map((m): MessageDetail => {
      const headers = m.payload?.headers;
      const from = parseAddress(headerValue(headers, "From"));
      const { text, html } = extractBodies(m.payload);
      const dateHeader = headerValue(headers, "Date");
      return {
        id: m.id ?? "",
        messageId: headerValue(headers, "Message-ID"),
        fromName: from.name,
        fromEmail: from.email,
        to: headerValue(headers, "To"),
        date: toIso(m.internalDate) ?? (dateHeader.length > 0 ? dateHeader : null),
        subject: headerValue(headers, "Subject") || subject,
        snippet: m.snippet ?? "",
        bodyHtml: html,
        bodyText: text,
        unread: (m.labelIds ?? []).includes("UNREAD"),
      };
    }),
  };
}

export interface BuildRawMessageOptions {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body?: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
}

/** Builds a base64url-encoded RFC822 message for gmail.api.messages.send. */
export function buildRawMessage(opts: BuildRawMessageOptions): string {
  const isHtml = typeof opts.html === "string" && opts.html.length > 0;
  const lines: string[] = [];
  lines.push(`To: ${opts.to.join(", ")}`);
  if (opts.cc?.length) lines.push(`Cc: ${opts.cc.join(", ")}`);
  if (opts.bcc?.length) lines.push(`Bcc: ${opts.bcc.join(", ")}`);
  lines.push(`Subject: ${opts.subject}`);
  if (opts.inReplyTo) {
    lines.push(`In-Reply-To: ${opts.inReplyTo}`);
    lines.push(`References: ${opts.references ?? opts.inReplyTo}`);
  }
  lines.push("MIME-Version: 1.0");
  lines.push(`Content-Type: ${isHtml ? "text/html" : "text/plain"}; charset="UTF-8"`);
  lines.push("");
  lines.push(isHtml ? opts.html! : (opts.body ?? ""));

  return Buffer.from(lines.join("\r\n"), "utf8").toString("base64url");
}
