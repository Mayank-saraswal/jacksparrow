/**
 * Minimal, pure Markdown → Notion block converter for the "email → doc" flow.
 * Supports headings (#/##/###), bulleted (-,*) and numbered (1.) lists, fenced
 * code blocks (```lang), and inline links [text](url). Everything else becomes a
 * paragraph. No network, fully unit-testable.
 */

export interface NotionRichText {
  type: "text";
  text: { content: string; link: { url: string } | null };
}

export interface NotionBlock {
  object: "block";
  type: string;
  [key: string]: unknown;
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Parse inline `[text](url)` links into Notion rich_text runs. */
export function parseRichText(text: string): NotionRichText[] {
  const runs: NotionRichText[] = [];
  let lastIndex = 0;
  // Reset stateful regex between calls.
  LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(textRun(text.slice(lastIndex, match.index)));
    }
    runs.push({
      type: "text",
      text: { content: match[1] ?? "", link: { url: match[2] ?? "" } },
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) runs.push(textRun(text.slice(lastIndex)));
  return runs.length > 0 ? runs : [textRun("")];
}

function textRun(content: string): NotionRichText {
  return { type: "text", text: { content, link: null } };
}

function block(type: string, payload: Record<string, unknown>): NotionBlock {
  return { object: "block", type, [type]: payload };
}

/** Convert a Markdown string into an array of Notion block objects. */
export function markdownToBlocks(markdown: string): NotionBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: NotionBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Fenced code block.
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1] ?? "";
      const language = lang.length > 0 ? lang : "plain text";
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i] ?? "")) {
        buf.push(lines[i] ?? "");
        i += 1;
      }
      i += 1; // skip closing fence
      blocks.push(
        block("code", {
          language,
          rich_text: [textRun(buf.join("\n"))],
        }),
      );
      continue;
    }

    const trimmed = line.trim();
    if (trimmed === "") {
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      blocks.push(
        block(`heading_${level}`, {
          rich_text: parseRichText(heading[2] ?? ""),
        }),
      );
      i += 1;
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      blocks.push(
        block("bulleted_list_item", {
          rich_text: parseRichText(bullet[1] ?? ""),
        }),
      );
      i += 1;
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (numbered) {
      blocks.push(
        block("numbered_list_item", {
          rich_text: parseRichText(numbered[1] ?? ""),
        }),
      );
      i += 1;
      continue;
    }

    blocks.push(block("paragraph", { rich_text: parseRichText(trimmed) }));
    i += 1;
  }

  return blocks;
}
