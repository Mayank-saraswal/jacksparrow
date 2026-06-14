import { inngest } from "../client";
import { db } from "@/server/db";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { parseTenantId } from "@/server/corsair";
import { parseAddress } from "@/lib/email";
import { embeddingContentHash } from "@/lib/content-hash";
import { logger } from "@/server/logger";
import {
  ownerForContext,
  assertWithinLimit,
  incrementUsage,
} from "@/server/billing/entitlements";
import { captureException } from "@/server/observability/sentry";
import { pageOnCall } from "@/server/observability/pagerduty";
import { scoreThread } from "./shared";

/** Plugins whose webhooks feed the in-app sync_items feed (inbox/calendar). */
const SYNCED_PLUGINS = new Set([
  "gmail",
  "outlook",
  "googlecalendar",
  "slack",
]);

/**
 * Realtime sync pipeline (Phase 5). Emitted from the Corsair webhook route when
 * an entity changes. We upsert a lightweight sync_items row (which Supabase
 * Realtime streams to the client) and, for emails, embed for semantic search,
 * triage priority, resolve follow-ups, and mine sent messages for voice samples.
 */

interface WebhookReceivedData {
  tenantId: string;
  plugin: string;
  action: string | null;
  corsairEntityId: string;
}

interface GmailEntityData {
  snippet?: string;
  threadId?: string;
  internalDate?: string | number;
  labelIds?: string[];
  payload?: { headers?: { name?: string; value?: string }[] };
}

interface OutlookEntityData {
  subject?: string;
  bodyPreview?: string;
  conversationId?: string;
  receivedDateTime?: string;
  isRead?: boolean;
  flag?: { flagStatus?: string };
  from?: { name?: string; address?: string };
}

interface CalendarEntityData {
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
}

interface SlackEntityData {
  text?: string;
  user?: string;
  channel?: string;
  ts?: string;
}

interface DerivedMeta {
  type: "email" | "event" | "slack";
  title: string;
  snippet: string;
  sender: string;
  fromName: string;
  fromEmail: string;
  threadId: string;
  unread: boolean;
  starred: boolean;
  timestamp: Date;
}

function safeDate(value: string | number | undefined): Date {
  if (value == null) return new Date();
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (!Number.isNaN(d.getTime())) return d;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? new Date() : new Date(numeric);
}

function deriveMeta(
  plugin: string,
  entityType: string,
  entityId: string,
  data: Record<string, unknown>,
): DerivedMeta {
  if (plugin === "googlecalendar") {
    const ev = data as CalendarEntityData;
    const startIso = ev.start?.dateTime ?? ev.start?.date;
    return {
      type: "event",
      title: ev.summary ?? "(event)",
      snippet: ev.location ?? "",
      sender: "",
      fromName: "",
      fromEmail: "",
      threadId: "",
      unread: false,
      starred: false,
      timestamp: startIso ? safeDate(startIso) : new Date(),
    };
  }

  if (plugin === "slack") {
    const msg = data as SlackEntityData;
    const text = msg.text ?? "";
    return {
      type: "slack",
      title: msg.channel ? `#${msg.channel}` : "Slack message",
      snippet: text.slice(0, 200),
      sender: msg.user ?? "",
      fromName: "",
      fromEmail: msg.user ?? "",
      threadId: msg.ts ?? entityId,
      unread: false,
      starred: false,
      timestamp: msg.ts ? safeDate(Number(msg.ts) * 1000) : new Date(),
    };
  }

  if (plugin === "outlook") {
    const m = data as OutlookEntityData;
    const fromName = m.from?.name ?? "";
    const fromEmail = (m.from?.address ?? "").toLowerCase();
    const snippet = m.bodyPreview ?? "";
    const subject = m.subject ?? "";
    return {
      type: "email",
      title: subject || (snippet ? snippet.slice(0, 80) : "Email"),
      snippet,
      sender: fromEmail,
      fromName,
      fromEmail,
      threadId: m.conversationId ?? entityId,
      unread: m.isRead === false,
      starred: m.flag?.flagStatus === "flagged",
      timestamp: m.receivedDateTime ? safeDate(m.receivedDateTime) : new Date(),
    };
  }

  const m = data as GmailEntityData;
  const header = (name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  const snippet = m.snippet ?? "";
  const fromHeader = header("from");
  const parsed = parseAddress(fromHeader);
  const labelIds = m.labelIds ?? [];
  return {
    type: "email",
    title: header("subject") || (snippet ? snippet.slice(0, 80) : "Email"),
    snippet,
    sender: fromHeader,
    fromName: parsed.name,
    fromEmail: parsed.email.toLowerCase(),
    threadId: m.threadId ?? (entityType === "threads" ? entityId : ""),
    unread: labelIds.includes("UNREAD"),
    starred: labelIds.includes("STARRED"),
    timestamp: safeDate(m.internalDate),
  };
}

export const corsairWebhookReceived = inngest.createFunction(
  {
    id: "corsair-webhook-received",
    retries: 3,
    triggers: { event: "corsair/webhook.received" },
    onFailure: async ({ error }) => {
      // Dead-lettered sync event: alert on-call + record in Sentry.
      captureException(error, { fn: "corsair-webhook-received" });
      await pageOnCall(
        `corsair-webhook-received exhausted retries: ${error.message}`,
        "error",
      );
    },
  },
  async ({ event, step }) => {
    const { tenantId, plugin, corsairEntityId } =
      event.data as WebhookReceivedData;
    // The Corsair tenant id is either the Clerk user id or `org:{orgId}`.
    const ref = parseTenantId(tenantId);
    const userId = tenantId;
    const orgId = ref.kind === "org" ? ref.orgId : null;

    const entity = await step.run("load-entity", async () => {
      const row = await db.corsairEntity.findUnique({
        where: { id: corsairEntityId },
      });
      if (!row) return null;
      return {
        entityType: row.entityType,
        entityId: row.entityId,
        data: row.data as Record<string, unknown>,
      };
    });

    if (!entity) return { skipped: "entity-not-found" };

    // Phase 2: integration webhooks (HubSpot/Notion/Linear/Jira/Zoom/Teams) are
    // not part of the inbox/calendar feed. Don't silently coerce them into the
    // gmail branch — log and skip so we never write bogus sync_items.
    if (!SYNCED_PLUGINS.has(plugin)) {
      logger.info("sync: skipping non-feed integration webhook", {
        tenantId,
        plugin,
        corsairEntityId,
      });
      return { skipped: "unsynced-plugin", plugin };
    }

    const meta = deriveMeta(
      plugin,
      entity.entityType,
      entity.entityId,
      entity.data,
    );

    await step.run("upsert-sync-item", async () => {
      await db.user.upsert({
        where: { id: userId },
        create: { id: userId },
        update: {},
      });
      await db.syncItem.upsert({
        where: { userId_corsairEntityId: { userId, corsairEntityId } },
        create: {
          userId,
          orgId,
          corsairEntityId,
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          threadId: meta.threadId || null,
          fromName: meta.fromName || null,
          fromEmail: meta.fromEmail || null,
          unread: meta.unread,
          starred: meta.starred,
          timestamp: meta.timestamp,
        },
        update: {
          orgId,
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          threadId: meta.threadId || null,
          fromName: meta.fromName || null,
          fromEmail: meta.fromEmail || null,
          unread: meta.unread,
          starred: meta.starred,
          timestamp: meta.timestamp,
        },
      });
    });

    if (meta.type === "email") {
      await step.run("embed-email", async () => {
        const contentHash = embeddingContentHash(meta.title, meta.snippet);

        // Skip the OpenAI call entirely when content is unchanged.
        const existing = await db.emailEmbedding.findUnique({
          where: { userId_corsairEntityId: { userId, corsairEntityId } },
          select: { contentHash: true },
        });
        if (existing?.contentHash === contentHash) {
          return { skipped: "unchanged" };
        }

        // Embedding is a paid AI action — enforce the budget, skip if over.
        const owner = ownerForContext(userId, orgId);
        try {
          await assertWithinLimit(owner, userId, "embedding");
        } catch {
          return { skipped: "limit" };
        }

        const vector = await embedText(`${meta.title}\n${meta.snippet}`);
        if (!vector) return { embedded: false };
        const literal = toVectorLiteral(vector);
        await db.$executeRaw`
          INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, content_hash, indexed_at)
          VALUES (gen_random_uuid()::text, ${userId}, ${corsairEntityId}, ${meta.threadId}, ${meta.title}, ${literal}::vector, ${contentHash}, now())
          ON CONFLICT (user_id, corsair_entity_id)
          DO UPDATE SET embedding = EXCLUDED.embedding,
                        subject_snippet = EXCLUDED.subject_snippet,
                        thread_id = EXCLUDED.thread_id,
                        content_hash = EXCLUDED.content_hash,
                        indexed_at = now()
        `;
        void incrementUsage(owner, userId, "embedding");
        return { embedded: true };
      });

      if (meta.threadId) {
        await step.run("triage-email", () =>
          scoreThread({
            userId,
            threadId: meta.threadId,
            corsairEntityId,
            subject: meta.title,
            sender: meta.sender,
            snippet: meta.snippet,
          }),
        );

        // If this thread has an active follow-up watch, a new inbound message
        // after we sent counts as a reply — stop reminding.
        await step.run("resolve-follow-up", async () => {
          const watch = await db.followUp.findUnique({
            where: { userId_threadId: { userId, threadId: meta.threadId } },
            select: { id: true, status: true, lastSentAt: true },
          });
          if (!watch) return { skipped: "no-watch" };
          if (watch.status === "replied" || watch.status === "dismissed") {
            return { skipped: watch.status };
          }
          if (meta.timestamp.getTime() <= watch.lastSentAt.getTime()) {
            return { skipped: "not-newer" };
          }
          await db.followUp.update({
            where: { id: watch.id },
            data: { status: "replied" },
          });
          return { replied: true };
        });

        // Mine this thread for the user's own sent messages (voice samples).
        await step.sendEvent("ingest-sent-style", {
          name: "style/ingest.sent",
          data: { userId, threadId: meta.threadId },
        });
      }
    }

    return { plugin, type: meta.type, corsairEntityId };
  },
);
