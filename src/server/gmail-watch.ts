import "server-only";

import { corsair, getTenant } from "@/server/corsair";

const GMAIL_WATCH_URL = "https://gmail.googleapis.com/gmail/v1/users/me/watch";

export interface GmailWatchResult {
  ok: boolean;
  historyId?: string;
  expiration?: string;
  error?: string;
}

/**
 * Starts (or refreshes) a Gmail push watch for a tenant. Corsair receives the
 * resulting Pub/Sub notifications, but it has no `watch` operation — so we call
 * Gmail's REST `users.watch` directly.
 *
 * Gmail watches expire after 7 days, so this is also run on a renewal cron.
 */
export async function startGmailWatch(
  clerkUserId: string,
): Promise<GmailWatchResult> {
  const topicName = await corsair.keys.gmail.get_topic_id();
  if (!topicName) return { ok: false, error: "no_topic_id" };

  const tenant = getTenant(clerkUserId);

  // A cheap API call forces Corsair to refresh the access token if it's stale,
  // so the token we read next is valid.
  try {
    await tenant.gmail.api.labels.list({});
  } catch (err) {
    return {
      ok: false,
      error: `token_refresh_failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const accessToken = await tenant.gmail.keys.get_access_token();
  if (!accessToken) return { ok: false, error: "no_access_token" };

  const res = await fetch(GMAIL_WATCH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topicName }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `watch_failed_${res.status}: ${text.slice(0, 200)}` };
  }

  const data = (await res.json()) as { historyId?: string; expiration?: string };
  return { ok: true, historyId: data.historyId, expiration: data.expiration };
}
