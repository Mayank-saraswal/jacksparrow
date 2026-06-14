/**
 * Pure, unit-testable helpers for serving the inbox list from `sync_items`
 * (Phase 0, Fix 1). Keyset pagination cursor + row→preview mapping live here so
 * the server router stays thin and the logic is testable without a DB.
 *
 * Cursor format: `${timestamp.toISOString()}|${id}` — keyset pagination orders
 * by `(timestamp DESC, id DESC)`, so the "next page" condition is
 * `timestamp < ts OR (timestamp == ts AND id < id)`.
 */

export interface SyncItemRow {
  id: string;
  corsairEntityId: string;
  threadId: string | null;
  title: string;
  snippet: string;
  fromName: string | null;
  fromEmail: string | null;
  unread: boolean;
  starred: boolean;
  timestamp: Date;
}

export interface PreviewPriority {
  label: string;
  reason: string | null;
}

/** Matches the gmail.ts `ThreadPreview` shape (kept in sync structurally). */
export interface SyncItemPreview {
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

export interface DecodedCursor {
  timestamp: Date;
  id: string;
}

/** Encode a keyset cursor from the last row of a page. */
export function encodeCursor(timestamp: Date, id: string): string {
  return `${timestamp.toISOString()}|${id}`;
}

/** Decode a keyset cursor; returns null when malformed. */
export function decodeCursor(token: string): DecodedCursor | null {
  const sep = token.indexOf("|");
  if (sep === -1) return null;
  const isoPart = token.slice(0, sep);
  const id = token.slice(sep + 1);
  if (!id) return null;
  const timestamp = new Date(isoPart);
  if (Number.isNaN(timestamp.getTime())) return null;
  return { timestamp, id };
}

/** Map a sync_items row (+ optional priority) to a thread preview. */
export function syncItemToPreview(
  row: SyncItemRow,
  priority: PreviewPriority | null,
): SyncItemPreview {
  return {
    threadId: row.threadId ?? row.corsairEntityId,
    subject: row.title || "(no subject)",
    snippet: row.snippet,
    fromName: row.fromName ?? "",
    fromEmail: row.fromEmail ?? "",
    date: row.timestamp.toISOString(),
    unread: row.unread,
    starred: row.starred,
    labelIds: [
      ...(row.unread ? ["UNREAD"] : []),
      ...(row.starred ? ["STARRED"] : []),
    ],
    messageCount: 1,
    priority: priority
      ? { label: priority.label, reason: priority.reason ?? "" }
      : null,
  };
}
