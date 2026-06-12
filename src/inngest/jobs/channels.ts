import { inngest } from "../client";
import { db } from "@/server/db";
import { env } from "@/env";
import { resolveOrLink, runChannelAgent } from "@/server/channels/agent";
import { sendChannelText, sendChannelApproval } from "@/server/channels/dispatch";
import {
  summarizePendingAction,
  executePendingAction,
  confirmationCopy,
} from "@/server/agent/pending";

/**
 * Command channels (Phase 10) — Telegram & WhatsApp. Inbound messages run the
 * agent (drafting PendingActions); callback button taps approve/reject/edit.
 */

export const channelMessageReceived = inngest.createFunction(
  {
    id: "channel-message-received",
    retries: 2,
    triggers: { event: "channel/message.received" },
  },
  async ({ event, step }) => {
    const { channel, externalChatId, text } = event.data as {
      channel: string;
      externalChatId: string;
      text: string;
    };

    const resolved = await step.run("resolve", () =>
      resolveOrLink(channel, externalChatId, text),
    );

    if (!resolved.userId) {
      await step.run("reply-link", () =>
        sendChannelText(
          channel,
          externalChatId,
          "Link this chat first: open Jack Sparrow → Settings → Connect, then send me the code (Telegram: /link CODE).",
        ),
      );
      return { needsLink: true };
    }

    if (resolved.justLinked) {
      await step.run("reply-linked", () =>
        sendChannelText(
          channel,
          externalChatId,
          "✅ Linked! Ask me to triage email, draft replies, or schedule events.",
        ),
      );
      return { linked: true };
    }

    const userId = resolved.userId;
    const agent = await step.run("agent", () =>
      runChannelAgent(userId, channel, text),
    );

    if (agent.text) {
      await step.run("reply-text", () =>
        sendChannelText(channel, externalChatId, agent.text),
      );
    }
    for (const p of agent.pending) {
      await step.run(`approval-${p.id}`, () =>
        sendChannelApproval(
          channel,
          externalChatId,
          summarizePendingAction(p.kind, p.draftPayload),
          p.id,
        ),
      );
    }
    return { replied: true, pending: agent.pending.length };
  },
);

export const channelCallbackReceived = inngest.createFunction(
  {
    id: "channel-callback-received",
    retries: 2,
    triggers: { event: "channel/callback.received" },
  },
  async ({ event, step }) => {
    const { channel, externalChatId, decision, actionId } = event.data as {
      channel: string;
      externalChatId: string;
      decision: "approve" | "reject" | "edit";
      actionId: string;
    };

    const ctx = await step.run("authorize", async () => {
      const action = await db.pendingAction.findUnique({
        where: { id: actionId },
      });
      const link = await db.channelLink.findUnique({
        where: { channel_externalChatId: { channel, externalChatId } },
      });
      if (!action) return { ok: false as const, reason: "missing" };
      if (link?.userId !== action.userId)
        return { ok: false as const, reason: "unauthorized" };
      if (action.status !== "pending")
        return { ok: false as const, reason: "resolved" };
      return {
        ok: true as const,
        userId: action.userId,
        kind: action.kind,
        draftPayload: action.draftPayload,
      };
    });

    if (!ctx.ok) {
      await step.run("reply-invalid", () =>
        sendChannelText(channel, externalChatId, "That action is no longer available."),
      );
      return { skipped: ctx.reason };
    }

    if (decision === "edit") {
      await step.run("reply-edit", () =>
        sendChannelText(
          channel,
          externalChatId,
          `Open the app to edit: ${env.APP_URL}/inbox`,
        ),
      );
      return { edit: true };
    }

    if (decision === "reject") {
      await step.run("reject", async () => {
        await db.pendingAction.update({
          where: { id: actionId },
          data: { status: "rejected", resolvedAt: new Date() },
        });
      });
      await step.run("reply-reject", () =>
        sendChannelText(channel, externalChatId, "Cancelled ❌"),
      );
      return { rejected: true };
    }

    // approve — execute exactly once.
    const exec = await step.run("execute", async () => {
      try {
        const res = await executePendingAction(
          ctx.userId,
          ctx.kind,
          ctx.draftPayload,
        );
        await db.pendingAction.update({
          where: { id: actionId },
          data: { status: "executed", resolvedAt: new Date() },
        });
        return { ok: true as const, summary: res.summary };
      } catch (err) {
        return {
          ok: false as const,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    await step.run("reply-result", () =>
      sendChannelText(
        channel,
        externalChatId,
        exec.ok
          ? `${confirmationCopy(ctx.kind)} ${exec.summary}`
          : `Failed: ${exec.error}`,
      ),
    );
    return { executed: exec.ok };
  },
);
