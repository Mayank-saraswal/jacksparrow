import { streamText, stepCountIs, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";

import { env } from "@/env";
import { buildAgentTools } from "@/server/agent/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  if (!env.OPENAI_API_KEY) {
    return new Response("AI is not configured (missing OPENAI_API_KEY).", {
      status: 503,
    });
  }

  const body = (await req.json()) as { messages?: ModelMessage[] };
  const messages = body.messages ?? [];

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
    ].join(" "),
    messages,
    tools: buildAgentTools(userId),
    stopWhen: stepCountIs(6),
  });

  return result.toTextStreamResponse();
}
