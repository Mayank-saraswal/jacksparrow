import { inngest } from "../client";
import { db } from "@/server/db";
import {
  decayedScore,
  ruleSuggestionDecision,
  SUGGESTION_MIN_SIGNALS,
} from "@/lib/affinity";

/**
 * Phase 2 — learned-triage rule suggestions. Weekly: turn strong, consistent
 * sender patterns into dismissible rule suggestions (never auto-applied). Skips
 * senders already covered by an open/accepted suggestion.
 */
export const ruleSuggestionsCron = inngest.createFunction(
  { id: "rule-suggestions", triggers: { cron: "0 9 * * 1" } },
  async ({ step }) => {
    const rows = await step.run("load-affinities", async () =>
      db.senderAffinity.findMany({
        where: { signalCount: { gte: SUGGESTION_MIN_SIGNALS } },
        select: {
          userId: true,
          key: true,
          score: true,
          signalCount: true,
          updatedAt: true,
        },
      }),
    );

    let created = 0;
    const now = new Date();

    for (const row of rows) {
      const score = decayedScore(row.score, new Date(row.updatedAt), now);
      const r = await step.run(`suggest-${row.userId}-${row.key}`, async () => {
        const handledKeys = await db.ruleSuggestion.findMany({
          where: {
            userId: row.userId,
            status: { in: ["proposed", "accepted"] },
          },
          select: { payload: true },
        });
        const alreadyHandled = handledKeys.some(
          (s) => (s.payload as { key?: string }).key === row.key,
        );

        const kind = ruleSuggestionDecision({
          score,
          signalCount: row.signalCount,
          alreadyHandled,
        });
        if (!kind) return { created: false };

        const [, identifier] = row.key.split(":");
        await db.ruleSuggestion.create({
          data: {
            userId: row.userId,
            kind,
            status: "proposed",
            payload: {
              key: row.key,
              identifier: identifier ?? "",
              score: Math.round(score * 10) / 10,
              signalCount: row.signalCount,
            },
          },
        });
        return { created: true };
      });
      if (r.created) created += 1;
    }

    return { candidates: rows.length, created };
  },
);
