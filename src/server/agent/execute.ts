import "server-only";

import { getTenant } from "@/server/corsair";
import { buildRawMessage } from "@/server/gmail";
import { sendEmailSchema, type SendEmailInput } from "@/lib/pending-kinds";

/**
 * Shared, low-level send execution. The agent's PendingAction executor, the
 * Send-Later scheduler, and Undo-Send all funnel through `sendEmail` so the
 * exact Gmail call (raw MIME build + threadId handling) lives in one place.
 */

export { sendEmailSchema, type SendEmailInput };

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
