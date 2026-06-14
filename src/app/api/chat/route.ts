import { streamText, stepCountIs, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";

import { env } from "@/env";
import { buildAgentTools } from "@/server/agent/tools";
import { searchMemories, addMemories } from "@/server/memory/mem0";
import {
  assertWithinLimit,
  incrementUsage,
  ownerForContext,
} from "@/server/billing/entitlements";

export const maxDuration = 30;

/** Extracts plain text from a model message's content (string or parts). */
function messageText(msg: ModelMessage | undefined): string {
  if (!msg) return "";
  const content = msg.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "object" && part && "text" in part) {
          const t = (part as { text?: unknown }).text;
          return typeof t === "string" ? t : "";
        }
        return "";
      })
      .join(" ")
      .trim();
  }
  return "";
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  if (!env.OPENAI_API_KEY) {
    return new Response("AI is not configured (missing OPENAI_API_KEY).", {
      status: 503,
    });
  }

  // Each agent message is a paid AI action.
  const owner = ownerForContext(userId, orgId ?? null);
  try {
    await assertWithinLimit(owner, userId, "ai_action");
  } catch {
    return new Response("limit_exceeded", { status: 403 });
  }

  const body = (await req.json()) as { messages?: ModelMessage[] };
  const messages = body.messages ?? [];

  // Recall relevant long-term memories for the latest user turn (mem0).
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = messageText(lastUser);
  const recalled = await searchMemories(userId, lastUserText);
  const memoryBlock =
    recalled.length > 0
      ? ` Relevant things you remember about this user:\n${recalled
          .map((m) => `- ${m}`)
          .join("\n")}`
      : "";

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: [
      "You are Jack Sparrow, an assistant for the user's Gmail and Google Calendar.",
      `Today is ${new Date().toISOString()}.`,
      "Use the read tools to look things up. For any action that sends email,",
      "creates/deletes events, or RSVPs, use the corresponding draft tool — these",
      "create a pending action the user must approve. NEVER claim an action was",
      "completed; say it's drafted and awaiting approval in the Pending Actions tray.",
      "Resolve relative dates to absolute ISO datetimes before calling tools.",
      memoryBlock,
    ].join(" "),
    messages,
    tools: buildAgentTools(userId, "web", orgId ?? null),
    stopWhen: stepCountIs(6),
    onFinish: ({ text }) => {
      // Persist the exchange for future recall (no-op without MEM0_API_KEY).
      void addMemories(userId, [
        ...(lastUserText
          ? [{ role: "user" as const, content: lastUserText }]
          : []),
        ...(text ? [{ role: "assistant" as const, content: text }] : []),
      ]);
    },
  });

  void incrementUsage(owner, userId, "ai_action");

  return result.toTextStreamResponse();
}
