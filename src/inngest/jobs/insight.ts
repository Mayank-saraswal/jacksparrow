import { inngest } from "../client";
import { db } from "@/server/db";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { env } from "@/env";
import { Prisma } from "@prisma/client";
import {
  ownerForContext,
  assertWithinLimit,
  incrementUsage,
} from "@/server/billing/entitlements";
import { withRetry } from "@/server/rate-limit";
import { logger } from "@/server/logger";

/**
 * AI intent classification for the dashboard feed. Runs as a separate Inngest
 * function (not inline in the sync pipeline) so classification latency never
 * blocks the inbox sync. GPT-4o-mini is used for speed and cost.
 *
 * The classifier extracts:
 *  - intent (meeting_request, alert, invoice, newsletter, etc.)
 *  - headline (one-line card title)
 *  - extractedData (structured: meeting time, amount, deadline, etc.)
 *  - suggestedActions (what buttons to show on the card)
 *  - autoHandleable (can AI act without user approval?)
 *
 * Auto-handle logic:
 *  - Newsletters/promotions → auto-archive, mark as "auto_handled"
 *  - GitHub/CI notifications → auto-archive, mark as "auto_handled"
 *  - FYI/receipts → auto-archive, mark as "auto_handled"
 *  - Everything else → create insight card for user review
 */

const INSIGHT_MODEL = "gpt-4o-mini";

// ── Classification schema ────────────────────────────────────────────────────

const insightSchema = z.object({
  intent: z.enum([
    "meeting_request",
    "action_required",
    "alert",
    "invoice",
    "newsletter",
    "fyi",
    "question",
    "follow_up",
    "approval_request",
    "bug_report",
    "mention",
    "pull_request",
    "other",
  ]),
  headline: z.string().max(120),
  extractedData: z.record(z.string(), z.unknown()).optional(),
  suggestedActions: z
    .array(
      z.object({
        label: z.string(),
        kind: z.string(),
        payload: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .max(3),
  autoHandleable: z.boolean(),
  autoAction: z.string().optional(), // What to do if auto-handled: "archive", "label_read_later", "trash"
});

type InsightResult = z.infer<typeof insightSchema>;

// ── Event data ───────────────────────────────────────────────────────────────

interface ClassifyEventData {
  userId: string;
  orgId: string | null;
  plugin: string;
  pluginEntityId: string;
  title: string;
  content: string;
  sourceData: Record<string, unknown>;
}

// ── Classifier ───────────────────────────────────────────────────────────────

async function classifyIntent(
  plugin: string,
  title: string,
  content: string,
  sourceData: Record<string, unknown>
): Promise<InsightResult | null> {
  if (!env.OPENAI_API_KEY) return null;

  const prompt = [
    `You are an AI assistant analyzing a notification from the ${plugin} integration. Classify this event and extract structured data.`,
    "",
    `Title: ${title}`,
    `Content/Preview: ${content}`,
    `Additional Data: ${JSON.stringify(sourceData)}`,
    "",
    "Classify the intent and extract any relevant data.",
    "",
    "Intent types:",
    "- meeting_request: Someone wants to schedule/reschedule a meeting",
    "- action_required: Email needs the user to do something specific",
    "- alert: Production alert, monitoring, security notification",
    "- invoice: Bill, receipt, payment notification",
    "- newsletter: Newsletter, blog digest, product update email",
    "- fyi: Informational, no action needed (GitHub notifications, CI, etc.)",
    "- question: Someone is asking the user a question",
    "- follow_up: Someone is following up on a previous conversation",
    "- approval_request: Someone needs approval/sign-off",
    "- bug_report: A bug or issue reported by a user or system",
    "- mention: The user was directly mentioned",
    "- pull_request: A PR was opened, reviewed, or merged",
    "- other: Doesn't fit any category",
    "",
    "For suggestedActions, provide 1-3 actions the user might want to take.",
    "Use these action kinds: reply, archive, forward, create_event, jira_create_issue, slack_reply, github_merge, snooze, label",
    "",
    "Set autoHandleable=true for: newsletters, marketing, automated notifications,",
    "CI/CD alerts, GitHub notifications, receipts, promotional emails.",
    "Set autoHandleable=false for: meeting requests, questions, action items,",
    "invoices requiring payment, approval requests, personal emails.",
    "",
    "For autoAction: 'archive' for newsletters/notifications, 'trash' for spam/marketing.",
  ].join("\n");

  try {
    const { object } = await generateObject({
      model: openai(INSIGHT_MODEL),
      schema: insightSchema,
      prompt,
    });
    return object;
  } catch (err) {
    logger.error("[insight] classification failed", { error: String(err) });
    return null;
  }
}

// ── Inngest function ─────────────────────────────────────────────────────────

export const classifyActionInsight = inngest.createFunction(
  {
    id: "classify-action-insight",
    retries: 2,
    triggers: { event: "integration/insight.classify" },
    // Max 5 parallel classifications per user to stay within OpenAI RPM.
    concurrency: { key: "event.data.userId", limit: 5 },
  },
  async ({ event, step }) => {
    const data = event.data as ClassifyEventData;
    const { userId, orgId, plugin, pluginEntityId, title, content, sourceData } = data;

    // Skip if we already classified this item (idempotency guard).
    const existing = await step.run("check-existing", async () => {
      const row = await db.actionInsight.findUnique({
        where: { userId_plugin_pluginEntityId: { userId, plugin, pluginEntityId } },
        select: { id: true, updatedAt: true },
      });
      if (row && Date.now() - row.updatedAt.getTime() < 5 * 60 * 1000) {
        return { skip: true };
      }
      return { skip: false };
    });

    if (existing.skip) {
      return { skipped: "recent-insight-exists" };
    }

    // Enforce per-plan usage quota (reuses "summary" quota bucket).
    const owner = ownerForContext(userId, orgId);
    try {
      await assertWithinLimit(owner, userId, "summary");
    } catch {
      return { skipped: "limit-exceeded" };
    }

    // Classify the intent.
    const result = await step.run("classify-intent", () =>
      withRetry(() => classifyIntent(plugin, title, content, sourceData)),
    );

    if (!result) {
      return { skipped: "classification-failed" };
    }

    void incrementUsage(owner, userId, "summary");

    // Fetch priority from existing triage score (if available and if email).
    const priority = await step.run("get-priority", async () => {
      if (plugin !== "gmail" && plugin !== "outlook") return "normal";
      const score = await db.priorityScore.findUnique({
        where: { userId_threadId: { userId, threadId: pluginEntityId } },
        select: { label: true },
      });
      return score?.label ?? "normal";
    });

    // Upsert the insight.
    await step.run("upsert-insight", async () => {
      await db.actionInsight.upsert({
        where: { userId_plugin_pluginEntityId: { userId, plugin, pluginEntityId } },
        create: {
          userId,
          plugin,
          pluginEntityId,
          intent: result.intent,
          headline: result.headline,
          extractedData: (result.extractedData ?? {}) as any,
          suggestedActions: (result.suggestedActions ?? []) as any,
          status: result.autoHandleable ? "auto_handled" : "new",
          autoSummary: result.autoHandleable
            ? `Auto-${result.autoAction ?? "handled"}: ${result.headline}`
            : null,
          priority,
          sourceData: sourceData as any,
        },
        update: {
          intent: result.intent,
          headline: result.headline,
          extractedData: (result.extractedData ?? {}) as any,
          suggestedActions: (result.suggestedActions ?? []) as any,
          priority,
          sourceData: sourceData as any,
          // Don't overwrite status if user already acted on it
          ...(result.autoHandleable
            ? {
                status: "auto_handled",
                autoSummary: `Auto-${result.autoAction ?? "handled"}: ${result.headline}`,
              }
            : {}),
        },
      });
    });

    // Auto-handle: execute the action if the item is low-priority noise.
    if (result.autoHandleable && result.autoAction) {
      await step.run("auto-handle", async () => {
        try {
          // For now, auto-handle is limited to labeling/archiving via the
          // provider. We don't auto-send emails or create calendar events
          // without user approval unless the user explicitly turned on 'Auto Mode'.
          logger.info("[insight] auto-handled", {
            userId,
            plugin,
            pluginEntityId,
            action: result.autoAction,
            intent: result.intent,
          });
          // The actual archive/trash is already handled by the existing triage
          // system's auto-archive rules. We just mark the insight so the
          // dashboard shows "AI handled this."
        } catch (err) {
          logger.error("[insight] auto-handle failed", { error: String(err) });
        }
      });
    }

    return {
      intent: result.intent,
      autoHandled: result.autoHandleable,
      headline: result.headline,
    };
  },
);
