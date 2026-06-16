import { inngest } from "../client";
import { db } from "@/server/db";
import { embedText, toVectorLiteral } from "@/server/embeddings";

/**
 * Historical embedding backfill (Phase 9) — indexes cached gmail entities for
 * users who connected before the incremental embedding pipeline shipped.
 */
export const searchEmbeddingsBackfill = inngest.createFunction(
  {
    id: "search-embeddings-backfill",
    retries: 2,
    triggers: { event: "search/embeddings.requested" },
  },
  async ({ event, step }) => {
    const { clerkUserId, limit = 50 } = event.data as {
      clerkUserId: string;
      limit?: number;
    };

    await step.run("ensure-user", async () => {
      await db.user.upsert({
        where: { id: clerkUserId },
        create: { id: clerkUserId },
        update: {},
      });
    });

    const entities = await step.run("load-gmail-entities", async () => {
      const accounts = await db.corsairAccount.findMany({
        where: { tenantId: clerkUserId, integration: { name: "gmail" } },
        select: { id: true },
      });
      const accountIds = accounts.map((a) => a.id);
      if (accountIds.length === 0) return [];
      const rows = await db.corsairEntity.findMany({
        where: { accountId: { in: accountIds }, entityType: "threads" },
        orderBy: { updatedAt: "desc" },
        take: limit,
        select: { id: true, entityId: true, data: true },
      });
      return rows.map((r) => ({
        id: r.id,
        entityId: r.entityId,
        snippet: (r.data as { snippet?: string }).snippet ?? "",
      }));
    });

    let indexed = 0;
    for (const e of entities) {
      const r = await step.run(`embed-${e.id}`, async () => {
        const vector = await embedText(e.snippet);
        if (!vector) return { embedded: false };
        const literal = toVectorLiteral(vector);
        await db.$executeRaw`
          INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, indexed_at)
          VALUES (gen_random_uuid()::text, ${clerkUserId}, ${e.id}, ${e.entityId}, ${e.snippet.slice(0, 200)}, ${literal}::public.vector, now())
          ON CONFLICT (user_id, corsair_entity_id)
          DO UPDATE SET embedding = EXCLUDED.embedding, indexed_at = now()
        `;
        return { embedded: true };
      });
      if (r.embedded) indexed += 1;
    }

    return { total: entities.length, indexed };
  },
);
