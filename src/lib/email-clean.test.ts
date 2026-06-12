import { describe, it, expect } from "vitest";

import {
  cleanEmailBody,
  countWords,
  htmlToText,
  stripQuotedAndSignature,
} from "./email-clean";

describe("htmlToText", () => {
  it("drops tags and decodes entities", () => {
    const out = htmlToText("<p>Hi&nbsp;there &amp; welcome</p><br><div>Bye</div>");
    expect(out).toContain("Hi there & welcome");
    expect(out).toContain("Bye");
    expect(out).not.toContain("<");
  });

  it("removes script/style content", () => {
    const out = htmlToText("<style>a{}</style><p>Real</p><script>x()</script>");
    expect(out).toContain("Real");
    expect(out).not.toContain("a{}");
    expect(out).not.toContain("x()");
  });
});

describe("stripQuotedAndSignature", () => {
  it("cuts an 'On … wrote:' quoted chain", () => {
    const body = [
      "Sounds good, let's do Tuesday.",
      "",
      "On Mon, Jun 9, 2025 at 10:00 AM Bob <bob@x.com> wrote:",
      "> Are you free next week?",
      "> Bob",
    ].join("\n");
    expect(stripQuotedAndSignature(body)).toBe("Sounds good, let's do Tuesday.");
  });

  it("cuts a leading >-quoted block", () => {
    const body = ["My reply here.", "> previous message", "> more"].join("\n");
    expect(stripQuotedAndSignature(body)).toBe("My reply here.");
  });

  it("strips a signature delimiter but keeps content", () => {
    const body = ["Thanks for the update.", "--", "Jane Doe", "CEO"].join("\n");
    expect(stripQuotedAndSignature(body)).toBe("Thanks for the update.");
  });

  it("strips 'Sent from my iPhone'", () => {
    const body = ["Will do.", "Sent from my iPhone"].join("\n");
    expect(stripQuotedAndSignature(body)).toBe("Will do.");
  });

  it("keeps a body with no quote or signature", () => {
    expect(stripQuotedAndSignature("Just a normal note.")).toBe(
      "Just a normal note.",
    );
  });
});

describe("countWords", () => {
  it("counts words ignoring extra whitespace", () => {
    expect(countWords("  one   two\nthree ")).toBe(3);
    expect(countWords("")).toBe(0);
  });
});

describe("cleanEmailBody", () => {
  it("prefers plain text and strips history", () => {
    const r = cleanEmailBody({
      text: "Here is my answer.\n\nOn Tue someone wrote:\n> question",
    });
    expect(r.text).toBe("Here is my answer.");
    expect(r.wordCount).toBe(4);
  });

  it("falls back to HTML when no text", () => {
    const r = cleanEmailBody({ html: "<p>Hello <b>world</b></p>" });
    expect(r.text).toContain("Hello");
    expect(r.text).toContain("world");
  });
});
