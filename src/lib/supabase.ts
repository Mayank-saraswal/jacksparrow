"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/env";

let cached: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase browser client used only for Realtime, or null
 * when Supabase env vars aren't configured (realtime then degrades to manual
 * refresh). `getToken` should return the Clerk session token so RLS can scope
 * `sync_items` to the user (requires Clerk configured as a Supabase third-party
 * auth provider — see WEBHOOKS.md).
 */
export function getSupabaseBrowser(
  getToken: () => Promise<string | null>,
): SupabaseClient | null {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  cached ??= createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // accessToken: async () => (await getToken()) ?? null,
      realtime: { params: { eventsPerSecond: 5 } },
    },
  );
  return cached;
}
