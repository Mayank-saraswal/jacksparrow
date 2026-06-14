import { describe, it, expect } from "vitest";

import { markdownToBlocks, parseRichText } from "./notion-markdown";

describe("parseRichText", () => {
  it("splits inline links into runs", () => {
    const runs = parseRichText("see [docs](https://x.com/d) now");
    expect(runs).toEqual([
      { type: "text", text: { content: "see ", link: null } },
      { type: "text", text: { content: "docs", link: { url: "https://x.com/d" } } },
      { type: "text", text: { content: " now", link: null } },
    ]);
  });

  it("returns a single empty run for empty input", () => {
    expect(parseRichText("")).toEqual([
      { type: "text", text: { content: "", link: null } },
    ]);
  });
});

describe("markdownToBlocks", () => {
  it("converts headings to heading_n blocks", () => {
    const blocks = markdownToBlocks("# H1\n## H2\n### H3");
    expect(blocks.map((b) => b.type)).toEqual([
      "heading_1",
      "heading_2",
      "heading_3",
    ]);
  });

  it("converts bulleted and numbered lists", () => {
    const blocks = markdownToBlocks("- a\n* b\n1. c\n2. d");
    expect(blocks.map((b) => b.type)).toEqual([
      "bulleted_list_item",
      "bulleted_list_item",
      "numbered_list_item",
      "numbered_list_item",
    ]);
  });

  it("captures fenced code blocks with language", () => {
    const blocks = markdownToBlocks("```ts\nconst x = 1;\nconst y = 2;\n```");
    expect(blocks).toHaveLength(1);
    const code = blocks[0]!;
    expect(code.type).toBe("code");
    const payload = code.code as { language: string; rich_text: unknown[] };
    expect(payload.language).toBe("ts");
    const run = (payload.rich_text as { text: { content: string } }[])[0]!;
    expect(run.text.content).toBe("const x = 1;\nconst y = 2;");
  });

  it("treats plain lines as paragraphs and keeps links", () => {
    const blocks = markdownToBlocks("hello [world](https://w.io)");
    expect(blocks[0]!.type).toBe("paragraph");
    const rt = (blocks[0]!.paragraph as { rich_text: { text: { content: string; link: { url: string } | null } }[] }).rich_text;
    expect(rt[1]!.text.link).toEqual({ url: "https://w.io" });
  });

  it("skips blank lines", () => {
    const blocks = markdownToBlocks("a\n\n\nb");
    expect(blocks).toHaveLength(2);
  });
});
