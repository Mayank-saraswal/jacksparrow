import { NextResponse, type NextRequest } from "next/server";

import { inngest } from "@/inngest/client";
import {
  verifyTelegramSecret,
  answerTelegramCallback,
  sendTelegramTyping,
} from "@/server/channels/telegram";

interface TelegramUpdate {
  message?: { text?: string; chat?: { id?: number | string } };
  callback_query?: {
    id: string;
    data?: string;
    message?: { chat?: { id?: number | string } };
  };
}

export async function POST(req: NextRequest) {
  if (
    !verifyTelegramSecret(req.headers.get("x-telegram-bot-api-secret-token"))
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;

  // Button presses.
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat?.id;
    const [decision, actionId] = (cq.data ?? "").split(":");
    await answerTelegramCallback(cq.id);
    if (chatId && decision && actionId) {
      await inngest.send({
        name: "channel/callback.received",
        data: {
          channel: "telegram",
          externalChatId: String(chatId),
          decision,
          actionId,
        },
      });
    }
    return NextResponse.json({ ok: true });
  }

  // Text messages.
  const text = update.message?.text;
  const chatId = update.message?.chat?.id;
  if (chatId && typeof text === "string") {
    // Instantly show typing indicator to acknowledge receipt while Inngest processes.
    await sendTelegramTyping(chatId).catch(console.error);

    await inngest.send({
      name: "channel/message.received",
      data: { channel: "telegram", externalChatId: String(chatId), text },
    });
  }
  return NextResponse.json({ ok: true });
}
