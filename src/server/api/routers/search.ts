import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getTenant } from "@/server/corsair";
import { embedText, toVectorLiteral } from "@/server/embeddings";
import { inngest } from "@/inngest/client";

export interface SearchHit {
  type: "email" | "event";
  refId: string; // gmail threadId or calendar eventId
  title: string;
  snippet: string;
}

const RRF_K = 60;

type DbEntity = { entity_id: string; data: Record<string, unknown> };

export const searchRouter = createTRPCRouter({
  query: protectedProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const tenant = getTenant(userId);

      // 1. Local semantic search over pgvector embeddings (emails).
      const vector = await embedText(input.q);
      const semanticP: Promise<
        { thread_id: string; subject_snippet: string }[]
      > = vector
        ? ctx.db.$queryRaw`
            SELECT thread_id, subject_snippet
            FROM email_embeddings
            WHERE user_id = ${userId} AND embedding IS NOT NULL
            ORDER BY embedding <=> ${toVectorLiteral(vector)}::public.vector
            LIMIT 20`
        : Promise.resolve([]);

      // 2. Keyword search over Corsair's cached entities.
      const gmailP = tenant.gmail.db.threads
        .search({ data: { snippet: { contains: input.q } }, limit: 20 })
        .catch(() => [] as unknown[]);
      const eventsP = tenant.googlecalendar.db.events
        .search({ data: { summary: { contains: input.q } }, limit: 20 })
        .catch(() => [] as unknown[]);

      const [semantic, gmailHits, eventHits] = await Promise.all([
        semanticP,
        gmailP,
        eventsP,
      ]);

      // 3. Reciprocal rank fusion.
      const fused = new Map<string, { hit: SearchHit; score: number }>();
      const add = (key: string, rank: number, hit: SearchHit) => {
        const score = 1 / (RRF_K + rank + 1);
        const cur = fused.get(key);
        if (cur) cur.score += score;
        else fused.set(key, { hit, score });
      };

      semantic.forEach((row, i) =>
        add(`email:${row.thread_id}`, i, {
          type: "email",
          refId: row.thread_id,
          title: row.subject_snippet,
          snippet: row.subject_snippet,
        }),
      );
      (gmailHits as DbEntity[]).forEach((e, i) => {
        const snippet = (e.data.snippet as string) ?? "";
        add(`email:${e.entity_id}`, i, {
          type: "email",
          refId: e.entity_id,
          title: snippet.slice(0, 80) || "Email",
          snippet,
        });
      });
      (eventHits as DbEntity[]).forEach((e, i) => {
        add(`event:${e.entity_id}`, i, {
          type: "event",
          refId: e.entity_id,
          title: (e.data.summary as string) ?? "(event)",
          snippet: (e.data.location as string) ?? "",
        });
      });

      const results = Array.from(fused.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
        .map((r) => r.hit);

      return { results };
    }),

  /** Triggers the historical embedding backfill (for mail indexed before search shipped). */
  reindex: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "search/embeddings.requested",
      data: { clerkUserId: ctx.userId },
    });
    return { ok: true };
  }),
});
