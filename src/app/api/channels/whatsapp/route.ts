import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { inngest } from "@/inngest/client";
import { verifyWhatsappSignature } from "@/server/channels/whatsapp";

interface WhatsappMessage {
  from?: string;
  type?: string;
  text?: { body?: string };
  interactive?: { button_reply?: { id?: string } };
}
interface WhatsappPayload {
  entry?: {
    changes?: { value?: { messages?: WhatsappMessage[] } }[];
  }[];
}

// Meta webhook verification handshake.
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  if (mode === "subscribe" && token && token === env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyWhatsappSignature(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: WhatsappPayload;
  try {
    payload = JSON.parse(raw) as WhatsappPayload;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const messages =
    payload.entry?.flatMap(
      (e) => e.changes?.flatMap((c) => c.value?.messages ?? []) ?? [],
    ) ?? [];

  for (const m of messages) {
    const from = m.from;
    if (!from) continue;

    if (m.type === "interactive" && m.interactive?.button_reply?.id) {
      const [decision, actionId] = m.interactive.button_reply.id.split(":");
      if (decision && actionId) {
        await inngest.send({
          name: "channel/callback.received",
          data: { channel: "whatsapp", externalChatId: from, decision, actionId },
        });
      }
    } else if (m.type === "text" && m.text?.body) {
      await inngest.send({
        name: "channel/message.received",
        data: { channel: "whatsapp", externalChatId: from, text: m.text.body },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
