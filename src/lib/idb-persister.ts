/**
 * IndexedDB-backed persister for React Query.
 *
 * Stores the entire dehydrated query cache as a single key in IndexedDB via
 * `idb-keyval`. This allows the inbox (and all other queries) to survive full
 * page refreshes, tab closes, and even browser restarts — giving users an
 * "instant load" experience on return visits while background refetches update
 * stale data silently.
 *
 * Edge cases handled:
 *  - SSR: The module is only imported on the client; the persister factory
 *    returns `undefined` when called during SSR (checked by the caller).
 *  - Quota exceeded: `set` is wrapped in a try/catch so a full IndexedDB
 *    doesn't crash the app — we just lose persistence until space is freed.
 *  - Corrupted cache: If `restoreClient` throws (e.g. schema mismatch after
 *    a deploy), we catch and return `undefined` so React Query starts fresh.
 *  - Build busting: The caller passes `buster` (a build hash) to
 *    `PersistQueryClientProvider` so deploys auto-clear stale caches.
 */

import { get, set, del } from "idb-keyval";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

const IDB_KEY = "hedwigs-rq-cache-v1";

/**
 * Throttle persistence writes to IndexedDB. Without this, every single cache
 * mutation (each of the 20 prefetch responses, each optimistic update) would
 * trigger a separate IDB write. We batch them to at most one write per second.
 */
let pendingWrite: PersistedClient | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;
const THROTTLE_MS = 1_000;

function schedulePersist() {
  if (writeTimer) return; // already scheduled
  writeTimer = setTimeout(() => {
    writeTimer = null;
    if (pendingWrite) {
      const client = pendingWrite;
      pendingWrite = null;
      set(IDB_KEY, client).catch((err) => {
        // Quota exceeded or other IDB write failure — log and move on.
        // The app still works fine; we just lose persistence until the
        // next successful write.
        console.warn("[idb-persister] Failed to persist cache:", err);
      });
    }
  }, THROTTLE_MS);
}

export function createIDBPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      // Don't await — batch writes via the throttle
      pendingWrite = client;
      schedulePersist();
    },

    restoreClient: async (): Promise<PersistedClient | undefined> => {
      try {
        const cached = await get<PersistedClient>(IDB_KEY);
        return cached ?? undefined;
      } catch (err) {
        // Corrupted or incompatible cache — wipe and start fresh.
        console.warn("[idb-persister] Failed to restore cache, clearing:", err);
        await del(IDB_KEY).catch(() => {});
        return undefined;
      }
    },

    removeClient: async () => {
      // Cancel any pending write so we don't accidentally re-persist
      if (writeTimer) {
        clearTimeout(writeTimer);
        writeTimer = null;
      }
      pendingWrite = null;
      await del(IDB_KEY).catch(() => {});
    },
  };
}
