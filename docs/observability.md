# Observability

Phase 0 (Fix 4) adds lightweight, opt-in observability. Everything is a no-op
until the relevant environment variable is set, so local development and CI run
unchanged.

## Components

| Concern            | Module                                  | Env var                 |
| ------------------ | --------------------------------------- | ----------------------- |
| Error tracking     | `src/server/observability/sentry.ts`    | `SENTRY_DSN`            |
| On-call paging     | `src/server/observability/pagerduty.ts` | `PAGERDUTY_ROUTING_KEY` |
| Structured logging | `src/server/logger.ts`                  | (always on)             |

### Sentry

`captureException(error, tags)` and `captureMessage(message, level, tags)` lazily
`init` the Sentry SDK the first time they are called, behind `SENTRY_DSN`. We do
**not** run the Next.js Sentry build wizard — there are no
`instrumentation.ts`/`sentry.*.config.ts` files and no webpack plugin. This keeps
the build simple; the trade-off is no automatic request tracing (we only capture
what we explicitly send).

### PagerDuty

`pageOnCall(summary, severity)` posts a `trigger` event to the PagerDuty Events
API v2. It is reserved for **pipeline-fatal** failures only — specifically, an
Inngest function that has exhausted its retries (dead-letter). It is wired via
the `onFailure` handler on:

- `backfill-integration`
- `corsair-webhook-received`

Per-event errors (a single bad webhook, one failed Inngest enqueue) are sent to
Sentry but do **not** page.

### Structured logging

`logger.{debug,info,warn,error}(msg, fields)` emits one JSON line per call:

```json
{ "level": "info", "msg": "corsair webhook handled", "ts": "…", "tenantId": "…", "plugin": "gmail", "action": "message.created" }
```

Domain fields (`tenantId`, `plugin`, `action`, `corsairEntityId`) are first-class
so pipeline events can be traced end-to-end in any log aggregator.

## Alert wiring (Sentry → PagerDuty)

The `onFailure` handlers already page directly via the Events API, which is the
fast path. To additionally route Sentry **issues** to PagerDuty (recommended, so
spikes in non-fatal errors are visible):

1. In PagerDuty, create a service (e.g. "Hedwigs Pipeline") and add a
   **Sentry** integration to it. Copy the generated routing key.
2. In Sentry, open **Settings → Integrations → PagerDuty**, install it, and paste
   the service + routing key.
3. Create a Sentry **Alert Rule**:
   - When: `An event is captured`
   - If: `tags[fn] equals corsair-webhook-received` OR `tags[fn] equals
     backfill-integration`
   - Then: `Send a notification to PagerDuty` (the service above).
4. Optionally add a second rule on `level:warning` + `tags[scope]` =
   `corsair-webhook.*` to surface unmatched webhooks without paging.

## Environment variables

All optional. See `.env.example`.

| Variable                    | Default | Purpose                                  |
| --------------------------- | ------- | ---------------------------------------- |
| `SENTRY_DSN`                | unset   | Enables Sentry capture.                  |
| `PAGERDUTY_ROUTING_KEY`     | unset   | Enables on-call paging for fatal events. |
| `BACKFILL_CONCURRENCY`      | `2`     | Max concurrent backfills per user.       |
| `BACKFILL_THROTTLE_PER_MIN` | `60`    | Max backfill starts/min per user.        |
