/**
 * Pure email helpers safe to use on both server and client (no server-only deps).
 */

/** Splits an RFC5322 address like `Jane Doe <jane@x.com>` into name + email. */
export function parseAddress(raw: string): { name: string; email: string } {
  const trimmed = raw.trim();
  const angle = /^(.*?)<([^>]+)>$/.exec(trimmed);
  if (angle) {
    const name = angle[1]!.trim().replace(/^"|"$/g, "");
    const email = angle[2]!.trim();
    return { name: name || email, email };
  }
  return { name: trimmed, email: trimmed };
}
