import { inngest } from "../client";
import { db } from "@/server/db";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { scoreThread } from "./shared";

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
  payload?: { headers?: { name?: string; value?: string }[] };
}

interface CalendarEntityData {
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
}

interface DerivedMeta {
  type: "email" | "event";
  title: string;
  snippet: string;
  sender: string;
  threadId: string;
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
      threadId: "",
      timestamp: startIso ? safeDate(startIso) : new Date(),
    };
  }

  const m = data as GmailEntityData;
  const header = (name: string) =>
    m.payload?.headers?.find((h) => h.name?.toLowerCase() === name)?.value ?? "";
  const snippet = m.snippet ?? "";
  return {
    type: "email",
    title: header("subject") || (snippet ? snippet.slice(0, 80) : "Email"),
    snippet,
    sender: header("from"),
    threadId: m.threadId ?? (entityType === "threads" ? entityId : ""),
    timestamp: safeDate(m.internalDate),
  };
}

export const corsairWebhookReceived = inngest.createFunction(
  {
    id: "corsair-webhook-received",
    retries: 3,
    triggers: { event: "corsair/webhook.received" },
  },
  async ({ event, step }) => {
    const { tenantId, plugin, corsairEntityId } =
      event.data as WebhookReceivedData;
    // The Corsair tenant id is the Clerk user id in our setup.
    const userId = tenantId;

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
          corsairEntityId,
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          timestamp: meta.timestamp,
        },
        update: {
          type: meta.type,
          title: meta.title,
          snippet: meta.snippet,
          timestamp: meta.timestamp,
        },
      });
    });

    if (meta.type === "email") {
      await step.run("embed-email", async () => {
        const vector = await embedText(`${meta.title}\n${meta.snippet}`);
        if (!vector) return { embedded: false };
        const literal = toVectorLiteral(vector);
        await db.$executeRaw`
          INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, indexed_at)
          VALUES (gen_random_uuid()::text, ${userId}, ${corsairEntityId}, ${meta.threadId}, ${meta.title}, ${literal}::vector, now())
          ON CONFLICT (user_id, corsair_entity_id)
          DO UPDATE SET embedding = EXCLUDED.embedding,
                        subject_snippet = EXCLUDED.subject_snippet,
                        thread_id = EXCLUDED.thread_id,
                        indexed_at = now()
        `;
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
