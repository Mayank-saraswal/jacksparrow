/**
 * Canonical mail shapes shared across providers (Gmail, Outlook). Pure
 * normalizers turn each provider's raw payload into the SAME Thread/Message
 * shape so downstream features (triage, embeddings, summaries, drafts, snooze,
 * follow-ups) never depend on provider-specific helpers.
 */

export interface CanonicalAddress {
  name: string;
  email: string;
}

export interface CanonicalMessage {
  id: string;
  from: CanonicalAddress;
  to: CanonicalAddress[];
  date: string | null; // ISO
  subject: string;
  snippet: string;
  bodyText: string | null;
  bodyHtml: string | null;
  labels: string[];
}

export interface CanonicalThread {
  id: string;
  subject: string;
  messages: CanonicalMessage[];
}

/** Parse a raw address header ("Jane Doe <jane@x.com>") into name + email. */
export function parseCanonicalAddress(raw: string): CanonicalAddress {
  const s = (raw ?? "").trim();
  const angle = /^(.*)<([^>]+)>$/.exec(s);
  if (angle) {
    const name = angle[1]!.trim().replace(/^"|"$/g, "");
    return { name, email: angle[2]!.trim().toLowerCase() };
  }
  return { name: "", email: s.toLowerCase() };
}

function splitAddresses(raw: string): CanonicalAddress[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((p) => parseCanonicalAddress(p))
    .filter((a) => a.email.length > 0);
}

function decodeBase64Url(data: string | undefined): string {
  if (!data) return "";
  try {
    return Buffer.from(data, "base64url").toString("utf8");
  } catch {
    return "";
  }
}

// ── Gmail ────────────────────────────────────────────────────────────────────
export interface GmailHeader {
  name?: string;
  value?: string;
}
export interface GmailPayload {
  mimeType?: string;
  headers?: GmailHeader[];
  body?: { data?: string };
  parts?: GmailPayload[];
}
export interface GmailRawMessage {
  id?: string;
  snippet?: string;
  labelIds?: string[];
  internalDate?: string | number;
  payload?: GmailPayload;
}
export interface GmailRawThread {
  id?: string;
  messages?: GmailRawMessage[];
}

function gmailHeader(headers: GmailHeader[] | undefined, name: string): string {
  return (
    headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ??
    ""
  );
}

function gmailBodies(payload: GmailPayload | undefined): {
  text: string | null;
  html: string | null;
} {
  let text: string | null = null;
  let html: string | null = null;
  const walk = (part: GmailPayload | undefined) => {
    if (!part) return;
    const mime = part.mimeType ?? "";
    if (mime === "text/plain" && part.body?.data && text == null)
      text = decodeBase64Url(part.body.data);
    else if (mime === "text/html" && part.body?.data && html == null)
      html = decodeBase64Url(part.body.data);
    part.parts?.forEach(walk);
  };
  walk(payload);
  return { text, html };
}

function gmailDate(value: GmailRawMessage["internalDate"]): string | null {
  if (value == null) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isNaN(n) && n > 0) return new Date(n).toISOString();
  return null;
}

export function normalizeGmailThread(thread: GmailRawThread): CanonicalThread {
  const messages = thread.messages ?? [];
  const subject =
    gmailHeader(messages[0]?.payload?.headers, "Subject") || "(no subject)";
  return {
    id: thread.id ?? "",
    subject,
    messages: messages.map((m): CanonicalMessage => {
      const headers = m.payload?.headers;
      const { text, html } = gmailBodies(m.payload);
      return {
        id: m.id ?? "",
        from: parseCanonicalAddress(gmailHeader(headers, "From")),
        to: splitAddresses(gmailHeader(headers, "To")),
        date: gmailDate(m.internalDate),
        subject: gmailHeader(headers, "Subject") || subject,
        snippet: m.snippet ?? "",
        bodyText: text,
        bodyHtml: html,
        labels: m.labelIds ?? [],
      };
    }),
  };
}

// ── Outlook (Microsoft Graph) ─────────────────────────────────────────────────
export interface OutlookRawMessage {
  id?: string;
  subject?: string;
  bodyPreview?: string;
  body?: { contentType?: "text" | "html"; content?: string };
  from?: { emailAddress?: { name?: string; address?: string } };
  toRecipients?: { emailAddress?: { name?: string; address?: string } }[];
  receivedDateTime?: string;
  categories?: string[];
  isRead?: boolean;
}
export interface OutlookRawThread {
  id?: string;
  // Graph groups messages by conversationId; we pass the collected messages.
  messages?: OutlookRawMessage[];
}

function outlookAddress(a?: {
  name?: string;
  address?: string;
}): CanonicalAddress {
  return { name: a?.name ?? "", email: (a?.address ?? "").toLowerCase() };
}

export function normalizeOutlookThread(
  thread: OutlookRawThread,
): CanonicalThread {
  const messages = thread.messages ?? [];
  const subject = messages[0]?.subject ?? "(no subject)";
  return {
    id: thread.id ?? "",
    subject,
    messages: messages.map((m): CanonicalMessage => {
      const isHtml = m.body?.contentType === "html";
      const content = m.body?.content ?? null;
      // Outlook maps read state + categories onto our label vocabulary.
      const labels = [
        ...(m.categories ?? []),
        ...(m.isRead === false ? ["UNREAD"] : []),
      ];
      return {
        id: m.id ?? "",
        from: outlookAddress(m.from?.emailAddress),
        to: (m.toRecipients ?? []).map((r) => outlookAddress(r.emailAddress)),
        date: m.receivedDateTime
          ? new Date(m.receivedDateTime).toISOString()
          : null,
        subject: m.subject ?? subject,
        snippet: m.bodyPreview ?? "",
        bodyText: isHtml ? null : content,
        bodyHtml: isHtml ? content : null,
        labels,
      };
    }),
  };
}
