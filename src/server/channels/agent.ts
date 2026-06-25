import "server-only";

import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

import { env } from "@/env";
import { db } from "@/server/db";
import { buildAgentTools } from "@/server/agent/tools";

export interface ResolveResult {
  userId: string | null;
  justLinked: boolean;
}

/**
 * Maps an inbound chat to a user. If unlinked, tries to interpret the message as
 * a one-time link code (`/link CODE` on Telegram, or just the code on WhatsApp).
 */
export async function resolveOrLink(
  channel: string,
  externalChatId: string,
  text: string,
): Promise<ResolveResult> {
  const link = await db.channelLink.findUnique({
    where: { channel_externalChatId: { channel, externalChatId } },
  });
  if (link) return { userId: link.userId, justLinked: false };

  const code = text.replace(/^\/(link|start)\s+/i, "").trim().toUpperCase();
  if (code.length >= 4 && code.length <= 12) {
    const lc = await db.linkCode.findUnique({ where: { code } });
    if (lc?.channel === channel && lc.expiresAt > new Date()) {
      await db.channelLink.upsert({
        where: { channel_externalChatId: { channel, externalChatId } },
        create: { userId: lc.userId, channel, externalChatId },
        update: { userId: lc.userId },
      });
      await db.linkCode.delete({ where: { id: lc.id } }).catch(() => undefined);
      return { userId: lc.userId, justLinked: true };
    }
  }
  return { userId: null, justLinked: false };
}

const SYSTEM = [
  "You are Hedwigs, an assistant for the user's Gmail and Google Calendar,",
  "reachable over chat. Use read tools to look things up. For any action that",
  "sends email, creates/deletes events, or RSVPs, use the matching draft tool —",
  "these create a pending action the user approves with the buttons. Never claim",
  "an action is done; say it's drafted and awaiting approval. Resolve relative",
  "dates to absolute ISO datetimes before calling tools. Keep replies short.",
].join(" ");

export async function runChannelAgent(
  userId: string,
  channel: string,
  text: string,
) {
  if (!env.OPENAI_API_KEY) {
    return { text: "AI is not configured yet.", pending: [] };
  }
  const start = new Date();
  
  // Find or create conversation thread for this channel
  let conversation = await db.chatConversation.findFirst({
    where: { userId, title: `channel:${channel}` },
  });
  
  conversation ??= await db.chatConversation.create({
    data: { userId, title: `channel:${channel}` },
  });

  // Fetch last 15 messages for context
  const history = await db.chatMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });
  history.reverse(); // put back in chronological order

  const messages: { role: "user" | "assistant"; content: string }[] = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  messages.push({ role: "user", content: text });

  // Save the incoming user message
  await db.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: text,
    },
  });

  let resultText: string;
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: `${SYSTEM} Today is ${new Date().toISOString()}.`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      messages: messages as import("ai").CoreMessage[],
      tools: buildAgentTools(userId, channel),
      stopWhen: stepCountIs(6),
    });
    resultText = result.text;
  } catch (err) {
    resultText = `Sorry, I hit an error: ${
      err instanceof Error ? err.message : String(err)
    }`;
  }

  const pending = await db.pendingAction.findMany({
    where: {
      userId,
      channel,
      status: "pending",
      createdAt: { gte: start },
    },
    orderBy: { createdAt: "asc" },
  });

  // Always say something, even if the model returned only a tool call.
  const fallback =
    pending.length > 0
      ? "I've drafted that — approve it below."
      : "Done.";

  const finalReply = resultText.trim() || fallback;

  // Save the assistant's reply for future context
  await db.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: finalReply,
    },
  });

  return {
    text: finalReply,
    pending: pending.map((p) => ({
      id: p.id,
      kind: p.kind,
      draftPayload: p.draftPayload,
    })),
  };
}
