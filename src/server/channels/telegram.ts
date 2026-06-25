import "server-only";

import { env } from "@/env";

const API = "https://api.telegram.org";

export function telegramConfigured(): boolean {
  return Boolean(env.TELEGRAM_BOT_TOKEN);
}

/** Verifies Telegram's X-Telegram-Bot-Api-Secret-Token header. */
export function verifyTelegramSecret(header: string | null): boolean {
  if (!env.TELEGRAM_WEBHOOK_SECRET) return true; // not enforced in dev if unset
  return header === env.TELEGRAM_WEBHOOK_SECRET;
}

async function call(method: string, body: Record<string, unknown>): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  await fetch(`${API}/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function sendTelegramText(
  chatId: string | number,
  text: string,
): Promise<void> {
  await call("sendMessage", { chat_id: chatId, text });
}

export async function sendTelegramTyping(
  chatId: string | number,
): Promise<void> {
  await call("sendChatAction", { chat_id: chatId, action: "typing" });
}

export async function sendTelegramApproval(
  chatId: string | number,
  text: string,
  actionId: string,
): Promise<void> {
  await call("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve:${actionId}` },
          { text: "✏️ Edit", callback_data: `edit:${actionId}` },
          { text: "❌ Reject", callback_data: `reject:${actionId}` },
        ],
      ],
    },
  });
}

export async function answerTelegramCallback(
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  await call("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}
