import "server-only";

import crypto from "node:crypto";

import { env } from "@/env";

const GRAPH = "https://graph.facebook.com/v21.0";

export function whatsappConfigured(): boolean {
  return Boolean(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Verifies the X-Hub-Signature-256 HMAC over the raw request body. */
export function verifyWhatsappSignature(
  raw: string,
  signature: string | null,
): boolean {
  if (!env.WHATSAPP_APP_SECRET) return true; // not enforced in dev if unset
  if (!signature) return false;
  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", env.WHATSAPP_APP_SECRET)
      .update(raw)
      .digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function send(payload: Record<string, unknown>): Promise<void> {
  if (!whatsappConfigured()) return;
  await fetch(`${GRAPH}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
  });
}

export async function sendWhatsappText(to: string, body: string): Promise<void> {
  await send({ to, type: "text", text: { body: body.slice(0, 4096) } });
}

export async function sendWhatsappApproval(
  to: string,
  body: string,
  actionId: string,
): Promise<void> {
  await send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body.slice(0, 1024) },
      action: {
        buttons: [
          { type: "reply", reply: { id: `approve:${actionId}`, title: "Approve" } },
          { type: "reply", reply: { id: `edit:${actionId}`, title: "Edit in app" } },
          { type: "reply", reply: { id: `reject:${actionId}`, title: "Reject" } },
        ],
      },
    },
  });
}
