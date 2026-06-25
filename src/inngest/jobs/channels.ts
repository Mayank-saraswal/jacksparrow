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
  async ({ event }) => {
    const { channel, externalChatId, text } = event.data as {
      channel: string;
      externalChatId: string;
      text: string;
    };

    const resolved = await resolveOrLink(channel, externalChatId, text);

    if (!resolved.userId) {
      await sendChannelText(
        channel,
        externalChatId,
        "Link this chat first: open Hedwigs → Settings → Connect, then send me the code (Telegram: /link CODE).",
      );
      return { needsLink: true };
    }

    if (resolved.justLinked) {
      await sendChannelText(
        channel,
        externalChatId,
        "✅ Connected! Ask me to triage email, draft replies, or schedule events.",
      );
      return { linked: true };
    }

    const userId = resolved.userId;
    const agent = await runChannelAgent(userId, channel, text);

    if (agent.text) {
      await sendChannelText(channel, externalChatId, agent.text);
    }
    for (const p of agent.pending) {
      await sendChannelApproval(
        channel,
        externalChatId,
        summarizePendingAction(p.kind, p.draftPayload),
        p.id,
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
  async ({ event }) => {
    const { channel, externalChatId, decision, actionId } = event.data as {
      channel: string;
      externalChatId: string;
      decision: "approve" | "reject" | "edit";
      actionId: string;
    };

    const action = await db.pendingAction.findUnique({
      where: { id: actionId },
    });
    const link = await db.channelLink.findUnique({
      where: { channel_externalChatId: { channel, externalChatId } },
    });
    
    let ctx;
    if (!action) ctx = { ok: false as const, reason: "missing" };
    else if (link?.userId !== action.userId) ctx = { ok: false as const, reason: "unauthorized" };
    else if (action.status !== "pending") ctx = { ok: false as const, reason: "resolved" };
    else ctx = {
      ok: true as const,
      userId: action.userId,
      kind: action.kind,
      draftPayload: action.draftPayload,
    };

    if (!ctx.ok) {
      await sendChannelText(channel, externalChatId, "That action is no longer available.");
      return { skipped: ctx.reason };
    }

    if (decision === "edit") {
      await sendChannelText(
        channel,
        externalChatId,
        `Open the app to edit: ${env.APP_URL}/inbox`,
      );
      return { edit: true };
    }

    if (decision === "reject") {
      await db.pendingAction.update({
        where: { id: actionId },
        data: { status: "rejected", resolvedAt: new Date() },
      });
      await sendChannelText(channel, externalChatId, "Cancelled ❌");
      return { rejected: true };
    }

    // approve — execute exactly once.
    let exec;
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
      exec = { ok: true as const, summary: res.summary };
    } catch (err) {
      exec = {
        ok: false as const,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    await sendChannelText(
      channel,
      externalChatId,
      exec.ok
        ? `${confirmationCopy(ctx.kind)} ${exec.summary}`
        : `Failed: ${exec.error}`,
    );
    return { executed: exec.ok };
  },
);
