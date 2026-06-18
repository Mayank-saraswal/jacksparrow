# Hedwigs Platform Architecture Documentation

This document outlines the core architecture, data models, and system flows of the Hedwigs platform. It serves as a technical reference for engineers working on the backend, integration engine, and AI systems.

## 1. Core Technology Stack

- **Framework**: Next.js (App Router)
- **API Layer**: tRPC for type-safe client/server communication
- **Database**: PostgreSQL (hosted on Supabase) via Prisma ORM
- **Authentication**: Clerk (handles user identities, B2B multi-tenancy, and SSO)
- **Background Jobs**: Inngest (handles reliable cron jobs, webhook ingestion, and AI pipelines)
- **Realtime**: Supabase Realtime (WebSockets pushing DB changes to the browser)
- **AI/LLM**: Vercel AI SDK (OpenAI) for embeddings, summaries, and conversational AI.

---

## 2. System Modules

### 2.1 The Corsair Integration Engine
Corsair is the internal integration engine responsible for connecting to third-party APIs (Gmail, Slack, Jira, Zendesk, etc.).

*   **Models**: 
    *   `CorsairIntegration`: Global definition of a supported app.
    *   `CorsairAccount`: A user's or organization's connected OAuth credential. Includes an encrypted Data Encryption Key (`dek`).
    *   `CorsairEntity`: A generic cache of an external object (e.g., an email thread, a Slack message).
    *   `CorsairEvent`: An audit log of incoming webhooks.
*   **Webhook Flow**:
    1. Provider sends a webhook to `/api/webhooks/corsair`.
    2. Corsair validates the signature and determines the `tenantId`.
    3. Corsair emits an Inngest event: `corsair/webhook.received`.
    4. Inngest upserts the `CorsairEntity` and processes AI embeddings/summaries.

### 2.2 Real-time Sync Engine
To avoid constantly querying external APIs (like Gmail) on every page load, the platform uses an asynchronous sync engine.

*   **Model**: `SyncItem`
*   **Flow**:
    1. When an Inngest job finishes processing an external event, it writes a `SyncItem` row.
    2. `SyncItem` contains list-rendering data (`title`, `snippet`, `fromEmail`, `unread`).
    3. The browser client subscribes to the `sync_items` table via Supabase Realtime.
    4. New items are pushed to the UI instantly without manual polling.

### 2.3 The AI Moat (Intelligence Layer)
The platform derives intelligence from user behavior and incoming data.

*   **`ThreadSummary`**: Caches LLM-generated summaries, key points, and action items for email threads. Keyed by `entityVersion` to auto-invalidate when new replies arrive.
*   **`EmailEmbedding`**: `pgvector` embeddings of email content used for semantic search and Retrieval-Augmented Generation (RAG).
*   **`PriorityScore`**: LLM-assigned triage labels (urgent, important, normal, low) based on thread content and user context.
*   **`SentMessageSample` & `StyleProfile`**: Extracts samples of emails written by the user to build a persistent "Style Profile". This allows the LLM to draft new emails matching the user's personal voice.
*   **`SenderAffinity` & `TriageFeedback`**: Tracks which senders the user interacts with (replies, reads, ignores) to dynamically adjust inbox routing.

### 2.4 Multi-tenant Collaboration (Organizations)
Hedwigs supports B2B SaaS structures natively, mirroring Clerk's organization model.

*   **`Organization` & `Membership`**: Defines a company workspace and its members.
*   **`SharedInbox`**: A team-accessible inbox connected via a single Corsair account (e.g., `support@company.com`).
*   **`ThreadAssignment` & `ThreadComment`**: Allows team members to assign threads to specific users and leave internal, non-emailed notes on customer inquiries.
*   **`AssignmentEvent`**: Provides an audit trail of who assigned/closed a thread in a shared inbox.

### 2.5 Enterprise Security & Governance
Designed for strict compliance and enterprise security.

*   **`AuditLog`**: Append-only ledger of security-relevant actions. Protected by Postgres triggers that prevent `UPDATE` or `DELETE` operations.
*   **`SsoConnection`**: SAML/OIDC configuration mapped to verified domains.
*   **`RetentionPolicy`**: Automated data lifecycle management. Purges synced data after $N$ days.
*   **`LegalHold`**: Prevents data deletion for specific users or inboxes during legal discovery.

### 2.6 Automation & Execution
*   **`PendingAction`**: Actions initiated by the user (or AI) that require execution. Can be pending, approved, or rejected.
*   **`ScheduledEmail`**: Emails drafted to be sent at a future date. Powered by Inngest's `step.sleepUntil` capabilities.
*   **`FollowUp`**: Tracks threads waiting on replies. Wakes up after `remindAt` and transitions to a `reminded` state.

---

## 3. Webhook Handling Architecture (Inngest)

Because API limits and network timeouts are unpredictable, the platform heavily relies on background processing.

1.  **Ingestion**: `POST /api/webhooks/corsair`
    *   Fast acknowledgement (returns 200 OK to the provider immediately).
    *   Emits `corsair/webhook.received` via Inngest client.
2.  **Processing** (Inngest Function):
    *   Fetches the full payload.
    *   Upserts `CorsairEntity`.
    *   Fires off parallel steps:
        *   `step.run("generate-summary", ...)`
        *   `step.run("generate-embedding", ...)`
        *   `step.run("calculate-priority", ...)`
3.  **Completion**:
    *   Writes to `SyncItem`, triggering Supabase Realtime push.

## 4. Key Developer Considerations

- **Tenant Isolation**: When querying `CorsairAccount` or `SyncItem`, ALWAYS ensure the `userId` or `tenantId` is included in the `where` clause. 
- **Timezones**: All `DateTime` fields must be stored as UTC (`@db.Timestamptz` in Prisma).
- **Rate Limits**: Third-party API calls must happen inside Inngest functions, utilizing Inngest's built-in concurrency controls to avoid hitting 429 Too Many Requests errors.
