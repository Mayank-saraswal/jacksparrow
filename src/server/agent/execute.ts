import "server-only";

import { z } from "zod";

import { getTenant } from "@/server/corsair";
import { buildRawMessage } from "@/server/gmail";

/**
 * Shared, low-level send execution. The agent's PendingAction executor, the
 * Send-Later scheduler, and Undo-Send all funnel through `sendEmail` so the
 * exact Gmail call (raw MIME build + threadId handling) lives in one place.
 */

export const sendEmailSchema = z.object({
  to: z.array(z.email()).min(1),
  cc: z.array(z.email()).optional(),
  bcc: z.array(z.email()).optional(),
  subject: z.string().default(""),
  body: z.string().default(""),
  html: z.string().optional(),
  threadId: z.string().optional(),
  inReplyTo: z.string().optional(),
  references: z.string().optional(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

export interface SendEmailResult {
  id: string | null;
  threadId: string | null;
  summary: string;
}

/** Sends one email for `userId` via their Corsair Gmail tenant. */
export async function sendEmail(
  userId: string,
  payload: unknown,
): Promise<SendEmailResult> {
  const p = sendEmailSchema.parse(payload);
  const tenant = getTenant(userId);
  const raw = buildRawMessage({
    to: p.to,
    cc: p.cc,
    bcc: p.bcc,
    subject: p.subject,
    body: p.body,
    html: p.html,
    inReplyTo: p.inReplyTo,
    references: p.references,
  });
  const result = await tenant.gmail.api.messages.send({
    raw,
    threadId: p.threadId,
  });
  return {
    id: result.id ?? null,
    threadId: result.threadId ?? null,
    summary: `Sent email to ${p.to.join(", ")}`,
  };
}
