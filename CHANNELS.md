# Command channels (Phase 10)

Command your inbox from Telegram or WhatsApp. Both reuse the Phase 7 agent +
PendingAction approval flow — the only difference is the transport.

```
Telegram / WhatsApp ─▶ /api/channels/{telegram,whatsapp}
                          │ verify signature → emit Inngest event
                          ▼
        channel/message.received ──▶ run agent → reply + approval cards
        channel/callback.received ─▶ approve/reject/edit → execute + confirm
```

## Account linking

1. In the app: **Settings → Command channels → Generate link code** (6 chars,
   valid 10 minutes; stored in `link_codes`).
2. From the chat:
   - **Telegram**: message the bot `/link CODE`.
   - **WhatsApp**: send the code as a message to your business number.
3. The handler resolves the code → creates a `ChannelLink` (externalChatId →
   userId). After that, every message runs the agent for that user.

Unlink any time from Settings.

## Telegram setup

1. Create a bot with [@BotFather](https://t.me/botfather); copy the token →
   `TELEGRAM_BOT_TOKEN`.
2. Choose a secret string → `TELEGRAM_WEBHOOK_SECRET`.
3. Register the webhook (point at your public URL / ngrok):
   ```
   curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d "url=https://vast-lemur-notable.ngrok-free.app/api/channels/telegram" \
     -d "secret_token=$TELEGRAM_WEBHOOK_SECRET"
   ```
   Telegram sends the secret in the `X-Telegram-Bot-Api-Secret-Token` header,
   which the route verifies.

## WhatsApp setup (Meta Cloud API)

1. In the Meta app dashboard, get the **permanent token** →
   `WHATSAPP_TOKEN`, the **phone number id** → `WHATSAPP_PHONE_NUMBER_ID`, and
   the **app secret** → `WHATSAPP_APP_SECRET`.
2. Choose a verify token → `WHATSAPP_VERIFY_TOKEN`.
3. Set the webhook callback URL to
   `https://<your-domain>/api/channels/whatsapp` and the verify token above.
   Meta calls `GET` once to verify (the route echoes `hub.challenge`), then
   `POST`s messages signed with `X-Hub-Signature-256` (verified via the app
   secret).
4. Subscribe to the **messages** webhook field.

## Env

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...        # a string you choose
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=...          # a string you choose
WHATSAPP_APP_SECRET=...            # signs X-Hub-Signature-256
APP_URL=...                        # used for "Edit in app" deep links
OPENAI_API_KEY=...                 # the agent needs this
```

If a channel's env vars are unset, its routes accept nothing and sends are
no-ops, so the feature is simply inactive.

## Approval cards

When the agent drafts a write action it creates a `PendingAction` (channel =
`telegram`/`whatsapp`) and the handler sends an approval card:
- **Telegram**: inline keyboard — Approve / Edit / Reject (`callback_data`
  = `decision:<pendingActionId>`).
- **WhatsApp**: interactive reply buttons with the same ids (max 3).

Tapping **Approve** executes via the shared `executePendingAction` (identical to
the web tray), **Reject** cancels, and **Edit in app** replies with a deep link
to the web Pending Actions tray.

ZOOM_SECRET_TOKEN="f41gk8dmQeeloG2NtfD5pA"