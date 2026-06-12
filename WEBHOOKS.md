# Realtime sync (Phase 5)

How new emails / calendar changes flow into the UI within a couple of seconds:

```
Google ──push──▶ Corsair single webhook endpoint
                 /api/webhooks/corsair?tenantId=<clerkUserId>
                      │ processWebhook() verifies + upserts corsair_entities
                      ▼
            Inngest: corsair/webhook.received
                      │ upsert sync_items  +  embed email → email_embeddings
                      ▼
        Supabase Realtime (sync_items) ──▶ browser merges into inbox/calendar
```

## 1. Local dev: expose the webhook with ngrok

A reserved ngrok domain is already wired in `package.json`:

```
bun run ngrok:dev      # ngrok http --url=vast-lemur-notable.ngrok-free.app 3000
```

Then set, for local webhook testing:

```
APP_URL="https://vast-lemur-notable.ngrok-free.app"
```

(Re-register the Google OAuth redirect URIs for that https domain too, and
re-run the OAuth connect so Corsair stores the public callback.)

## 2. Provider push subscriptions

Corsair consolidates all providers onto the single endpoint above and routes by
inspecting headers/payload; the tenant is taken from `?tenantId=<clerkUserId>`.
Google still requires a provider-side "watch" to start pushing:

- **Gmail** uses Cloud Pub/Sub. Create a topic, grant
  `gmail-api-push@system.gserviceaccount.com` the Pub/Sub Publisher role, add a
  push subscription pointing at `/api/webhooks/corsair?tenantId=<clerkUserId>`,
  and store the topic on the Gmail integration (the plugin exposes a `topic_id`
  integration field). Gmail `users.watch` must be (re)called ~daily.
- **Google Calendar** uses the events `watch` channel pointing at the same
  endpoint.

Until push is configured, the **Refresh** button in the inbox/calendar performs
a live `.api.*` list call (a small slice of the backfill) so data stays current.

## 3. Supabase Realtime + Clerk (RLS)

`sync_items` is published to `supabase_realtime` and protected by RLS:

```sql
create policy "sync_items_select_own" on public.sync_items
  for select to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);
```

For the browser client to pass this policy it sends the **Clerk** session token.
That requires Clerk to be registered as a **third-party auth provider** in
Supabase:

1. Supabase Dashboard → Authentication → Third-party Auth → add Clerk (use your
   Clerk domain / issuer).
2. The browser client (`src/lib/supabase.ts`) already passes the Clerk token via
   the `accessToken` option.

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, the
app silently falls back to manual **Refresh** (no realtime).

## 4. Required env

```
APP_URL=...                       # public https URL when testing webhooks
OPENAI_API_KEY=...                # embeddings (optional; skipped if unset)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=... # publishable / anon key
```
