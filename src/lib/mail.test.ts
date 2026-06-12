import { describe, it, expect } from "vitest";

import {
  normalizeGmailThread,
  normalizeOutlookThread,
  parseCanonicalAddress,
  type CanonicalThread,
  type GmailRawThread,
  type OutlookRawThread,
} from "./mail";

const b64url = (s: string) => Buffer.from(s, "utf8").toString("base64url");

describe("parseCanonicalAddress", () => {
  it("parses name + email", () => {
    expect(parseCanonicalAddress("Jane Doe <Jane@X.com>")).toEqual({
      name: "Jane Doe",
      email: "jane@x.com",
    });
  });
  it("parses a bare email", () => {
    expect(parseCanonicalAddress("bob@y.com")).toEqual({
      name: "",
      email: "bob@y.com",
    });
  });
});

// The same logical thread expressed in each provider's raw shape should
// normalize to an identical canonical Thread (modulo provider ids).
const gmailRaw: GmailRawThread = {
  id: "t1",
  messages: [
    {
      id: "m1",
      snippet: "Hi there",
      labelIds: ["INBOX", "UNREAD"],
      internalDate: String(Date.parse("2025-06-15T10:00:00Z")),
      payload: {
        mimeType: "multipart/alternative",
        headers: [
          { name: "Subject", value: "Project update" },
          { name: "From", value: "Jane Doe <jane@acme.com>" },
          { name: "To", value: "me@team.com" },
        ],
        parts: [
          { mimeType: "text/plain", body: { data: b64url("Hi there, status?") } },
        ],
      },
    },
  ],
};

const outlookRaw: OutlookRawThread = {
  id: "t1",
  messages: [
    {
      id: "m1",
      subject: "Project update",
      bodyPreview: "Hi there",
      body: { contentType: "text", content: "Hi there, status?" },
      from: { emailAddress: { name: "Jane Doe", address: "jane@acme.com" } },
      toRecipients: [{ emailAddress: { name: "", address: "me@team.com" } }],
      receivedDateTime: "2025-06-15T10:00:00Z",
      isRead: false,
    },
  ],
};

describe("normalization parity", () => {
  it("gmail + outlook normalize to the same canonical core", () => {
    const g = normalizeGmailThread(gmailRaw);
    const o = normalizeOutlookThread(outlookRaw);

    const core = (t: CanonicalThread) => ({
      subject: t.subject,
      messages: t.messages.map((m) => ({
        from: m.from,
        to: m.to,
        subject: m.subject,
        bodyText: m.bodyText,
        date: m.date,
      })),
    });

    expect(core(g)).toEqual(core(o));
  });

  it("maps unread state into the canonical labels", () => {
    expect(normalizeGmailThread(gmailRaw).messages[0]!.labels).toContain("UNREAD");
    expect(normalizeOutlookThread(outlookRaw).messages[0]!.labels).toContain("UNREAD");
  });

  it("normalizes addresses and dates to ISO", () => {
    const g = normalizeGmailThread(gmailRaw).messages[0]!;
    expect(g.from).toEqual({ name: "Jane Doe", email: "jane@acme.com" });
    expect(g.date).toBe("2025-06-15T10:00:00.000Z");
  });
});
