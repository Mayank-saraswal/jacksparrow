/**
 * Pure helpers for turning a raw email body into clean plain text suitable for
 * style sampling: strip HTML, quoted reply chains, and signatures, then collapse
 * whitespace. No dependencies so it's trivially unit-testable.
 */

/** Crude HTML → text: drop scripts/styles, tags, decode a few entities. */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>(?=)/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

// Lines that mark the start of a quoted reply chain.
const QUOTE_HEADER_RE =
  /^\s*(On .+wrote:|-{2,}\s*Original Message\s*-{2,}|De\s*:|From:\s.+|Le .+ a écrit\s*:|On .+,.+<.+@.+>.*:)\s*$/i;

// Common signature delimiters / openers.
const SIGNATURE_RE =
  /^\s*(--\s*$|—\s*$|sent from my (iphone|ipad|android|samsung|mobile)|sent via|get outlook for|best regards,?|kind regards,?|regards,?|cheers,?|thanks,?|thank you,?|sincerely,?|warm regards,?|cordialement)\s*$/i;

/**
 * Strips a quoted reply chain and trailing signature from an already-plain-text
 * body. We cut at the first quote header, the first run of `>`-quoted lines, or
 * a signature delimiter.
 */
export function stripQuotedAndSignature(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const kept: string[] = [];

  let quotedRun = 0;
  for (const line of lines) {
    if (QUOTE_HEADER_RE.test(line)) break;

    // A block of >-quoted lines marks the start of history.
    if (/^\s*>/.test(line)) {
      quotedRun += 1;
      if (quotedRun >= 1) break;
      continue;
    }

    // Signature delimiter: stop, but only if we already have some content.
    if (SIGNATURE_RE.test(line) && kept.some((l) => l.trim().length > 0)) {
      break;
    }

    kept.push(line);
  }

  return kept.join("\n").trim();
}

/** Collapses runs of blank lines and trailing spaces. */
export function normaliseWhitespace(text: string): string {
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Word count of clean text. */
export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export interface CleanedBody {
  text: string;
  wordCount: number;
}

/**
 * Full pipeline: prefer plain text, fall back to HTML; strip quotes/signature;
 * normalise. Returns clean text + word count for sample filtering.
 */
export function cleanEmailBody(input: {
  text?: string | null;
  html?: string | null;
}): CleanedBody {
  const raw =
    input.text && input.text.trim().length > 0
      ? input.text
      : input.html
        ? htmlToText(input.html)
        : "";
  const stripped = stripQuotedAndSignature(raw);
  const text = normaliseWhitespace(stripped);
  return { text, wordCount: countWords(text) };
}
