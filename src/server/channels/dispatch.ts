import "server-only";

import { sendTelegramText, sendTelegramApproval } from "./telegram";
import { sendWhatsappText, sendWhatsappApproval } from "./whatsapp";

export async function sendChannelText(
  channel: string,
  externalChatId: string,
  text: string,
): Promise<void> {
  if (channel === "telegram") return sendTelegramText(externalChatId, text);
  if (channel === "whatsapp") return sendWhatsappText(externalChatId, text);
}

export async function sendChannelApproval(
  channel: string,
  externalChatId: string,
  text: string,
  actionId: string,
): Promise<void> {
  if (channel === "telegram")
    return sendTelegramApproval(externalChatId, text, actionId);
  if (channel === "whatsapp")
    return sendWhatsappApproval(externalChatId, text, actionId);
}
