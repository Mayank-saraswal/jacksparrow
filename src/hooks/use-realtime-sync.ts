"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";

import { getSupabaseBrowser } from "@/lib/supabase";

export interface SyncItemRow {
  id: string;
  user_id: string;
  corsair_entity_id: string;
  type: "email" | "event";
  title: string;
  snippet: string;
  timestamp: string;
}

/**
 * Subscribes to the current user's `sync_items` changes via Supabase Realtime
 * and invokes `onChange` for each insert/update. No-op when Supabase isn't
 * configured. Use the callback to invalidate/merge the relevant list query.
 */
export function useRealtimeSync(
  userId: string | null | undefined,
  onChange: (row: SyncItemRow) => void,
) {
  const { getToken } = useAuth();
  const callbackRef = React.useRef(onChange);
  React.useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (!userId) return;
    const supabase = getSupabaseBrowser(() => getToken());
    if (!supabase) return;

    const channel = supabase
      .channel(`sync_items:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sync_items",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as SyncItemRow | undefined;
          if (row?.id) callbackRef.current(row);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, getToken]);
}
