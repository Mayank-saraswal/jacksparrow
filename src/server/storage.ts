import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

/**
 * Server-side Supabase Storage for exports (audit CSV, GDPR ZIP/JSON). Uses the
 * service-role key. When storage isn't configured we return null so jobs can
 * degrade gracefully (compute + log, skip the signed URL) instead of failing.
 */
const BUCKET = "exports";
const SIGNED_URL_TTL = 24 * 60 * 60; // 24h

function getServiceClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}

/**
 * Uploads an export and returns a 24h signed URL, or null when storage is
 * unconfigured. `path` should be scoped (e.g. `org/{orgId}/audit-{ts}.csv`).
 */
export async function uploadExport(
  path: string,
  body: string | Uint8Array,
  contentType: string,
): Promise<string | null> {
  const client = getServiceClient();
  if (!client) {
    console.warn(`[storage] not configured; skipping upload of ${path}`);
    return null;
  }
  await client.storage
    .createBucket(BUCKET, { public: false })
    .catch(() => undefined); // ignore "already exists"

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, body, { contentType, upsert: true });
  if (error) {
    console.error("[storage] upload failed:", error.message);
    return null;
  }
  const { data } = await client.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
}
