import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { env } from "@/env";
import { getTenant } from "@/server/corsair";
import { threadDetail } from "@/server/gmail";
import { parseAddress } from "@/lib/email";
import { extractDomain } from "@/lib/split-rules";
import { DRAFT_MODEL } from "@/server/models";
import { db } from "@/server/db";
import {
  retrieveStyleSamples,
  buildDraftSystemPrompt,
  buildDraftUserPrompt,
  type StyleProfileSummary,
} from "@/server/style";

export const maxDuration = 30;

const bodySchema = z.object({
  threadId: z.string().min(1),
  instruction: z.string().max(500).optional(),
  mode: z.enum(["reply", "followup"]).default("reply"),
});

/**
 * Streams a voice-matched draft. Thread fetch and style retrieval run in
 * parallel so first tokens arrive quickly, then a single LLM call streams back.
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  if (!env.OPENAI_API_KEY) {
    return new Response("AI is not configured (missing OPENAI_API_KEY).", {
      status: 503,
    });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 });
  }
  const { threadId, instruction, mode } = parsed.data;

  const tenant = getTenant(userId);
  // Fetch the thread (this also verifies tenant ownership).
  const raw = await tenant.gmail.api.threads.get({
    id: threadId,
    format: "full",
  });
  const detail = threadDetail(raw);

  const last = detail.messages[detail.messages.length - 1];
  const counterpart =
    mode === "followup"
      ? last?.to ?? ""
      : last?.fromEmail ?? "";
  const toDomain = extractDomain(parseAddress(counterpart).email);

  const threadText = detail.messages
    .map((m) => `${m.fromName} <${m.fromEmail}>:\n${m.bodyText ?? m.snippet}`)
    .join("\n\n");

  // Retrieval (vector + per-domain) in parallel with the profile load.
  const [profileRow, samples] = await Promise.all([
    db.styleProfile.findUnique({ where: { userId } }),
    retrieveStyleSamples(userId, `${detail.subject}\n${threadText}`, toDomain),
  ]);

  const profile =
    (profileRow?.summary as StyleProfileSummary | undefined) ?? null;

  const result = streamText({
    model: openai(DRAFT_MODEL),
    system: buildDraftSystemPrompt(profile, samples, mode),
    prompt: buildDraftUserPrompt(threadText, instruction, mode),
  });

  return result.toTextStreamResponse();
}
