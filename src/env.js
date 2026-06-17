import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    // Direct (non-pooled) connection used by Prisma for migrations.
    DIRECT_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Corsair: Key Encryption Key used to encrypt stored credentials.
    CORSAIR_KEK: z.string().min(1),
    // Public base URL of this app, used to build OAuth redirect URIs.
    APP_URL: z.string().url(),
    // Google OAuth app credentials (shared by Gmail + Calendar).
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Microsoft (Outlook) OAuth credentials. Optional: Outlook connect is
    // disabled when absent.
    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    // Supabase Realtime (browser). Project URL + a publishable/anon key.
    // (client section below) and the service-role key for server-side Storage.
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    // Slack OAuth credentials (org-level). Optional.
    SLACK_CLIENT_ID: z.string().optional(),
    SLACK_CLIENT_SECRET: z.string().optional(),
    SLACK_SIGNING_SECRET: z.string().optional(),
    // Phase 2 integrations — all optional; connect is disabled when absent.
    HUBSPOT_CLIENT_ID: z.string().optional(),
    HUBSPOT_CLIENT_SECRET: z.string().optional(),
    NOTION_CLIENT_ID: z.string().optional(),
    NOTION_CLIENT_SECRET: z.string().optional(),
    LINEAR_CLIENT_ID: z.string().optional(),
    LINEAR_CLIENT_SECRET: z.string().optional(),
    JIRA_CLIENT_ID: z.string().optional(),
    JIRA_CLIENT_SECRET: z.string().optional(),
    ZOOM_CLIENT_ID: z.string().optional(),
    ZOOM_CLIENT_SECRET: z.string().optional(),
    TEAMS_CLIENT_ID: z.string().optional(),
    TEAMS_CLIENT_SECRET: z.string().optional(),
    // Phase 3 integrations — all optional; connect disabled when absent.
    CAL_CLIENT_ID: z.string().optional(),
    CAL_CLIENT_SECRET: z.string().optional(),
    CALENDLY_CLIENT_ID: z.string().optional(),
    CALENDLY_CLIENT_SECRET: z.string().optional(),
    FIREFLIES_CLIENT_ID: z.string().optional(),
    FIREFLIES_CLIENT_SECRET: z.string().optional(),
    ZENDESK_CLIENT_ID: z.string().optional(),
    ZENDESK_CLIENT_SECRET: z.string().optional(),
    INTERCOM_CLIENT_ID: z.string().optional(),
    INTERCOM_CLIENT_SECRET: z.string().optional(),
    TODOIST_CLIENT_ID: z.string().optional(),
    TODOIST_CLIENT_SECRET: z.string().optional(),
    ASANA_CLIENT_ID: z.string().optional(),
    ASANA_CLIENT_SECRET: z.string().optional(),
    // Clerk server key.
    CLERK_SECRET_KEY: z.string().min(1),
    // Clerk webhook signing secret (org + membership sync). Optional so the app
    // boots without team features configured.
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
    // Dodo Payments billing (Phase 3). Optional: billing is disabled when absent.
    DODO_PAYMENTS_API_KEY: z.string().optional(),
    DODO_PAYMENTS_WEBHOOK_KEY: z.string().optional(),
    DODO_PAYMENTS_ENVIRONMENT: z.enum(["test_mode", "live_mode"]).default("test_mode"),
    DODO_PRODUCT_PRO_MONTHLY: z.string().optional(),
    DODO_PRODUCT_PRO_YEARLY: z.string().optional(),
    DODO_PRODUCT_BUSINESS_MONTHLY: z.string().optional(),
    DODO_PRODUCT_BUSINESS_YEARLY: z.string().optional(),
    DODO_PRODUCT_ENTERPRISE_MONTHLY: z.string().optional(),
    DODO_PRODUCT_ENTERPRISE_YEARLY: z.string().optional(),
    // OpenAI (Vercel AI SDK provider) — embeddings/LLM. Optional: features that
    // need it are skipped when absent.
    OPENAI_API_KEY: z.string().optional(),
    // mem0 (https://mem0.ai) — long-term memory for the assistant chat.
    // Optional: chat memory is skipped (no-op) when absent.
    MEM0_API_KEY: z.string().optional(),
    // Observability (Phase 0, Fix 4). All optional — features no-op when absent.
    SENTRY_DSN: z.string().optional(),
    PAGERDUTY_ROUTING_KEY: z.string().optional(),
    // Backfill rate limiting (Phase 0, Fix 3). Override the defaults (2 / 60).
    BACKFILL_CONCURRENCY: z.coerce.number().optional(),
    BACKFILL_THROTTLE_PER_MIN: z.coerce.number().optional(),
    // Telegram + WhatsApp command channels (Phase 10). All optional.
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
    WHATSAPP_TOKEN: z.string().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    WHATSAPP_VERIFY_TOKEN: z.string().optional(),
    WHATSAPP_APP_SECRET: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // Supabase Realtime (browser). Optional: realtime is disabled when absent.
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    CORSAIR_KEK: process.env.CORSAIR_KEK,
    APP_URL: process.env.APP_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    HUBSPOT_CLIENT_ID: process.env.HUBSPOT_CLIENT_ID,
    HUBSPOT_CLIENT_SECRET: process.env.HUBSPOT_CLIENT_SECRET,
    NOTION_CLIENT_ID: process.env.NOTION_CLIENT_ID,
    NOTION_CLIENT_SECRET: process.env.NOTION_CLIENT_SECRET,
    LINEAR_CLIENT_ID: process.env.LINEAR_CLIENT_ID,
    LINEAR_CLIENT_SECRET: process.env.LINEAR_CLIENT_SECRET,
    JIRA_CLIENT_ID: process.env.JIRA_CLIENT_ID,
    JIRA_CLIENT_SECRET: process.env.JIRA_CLIENT_SECRET,
    ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID,
    ZOOM_CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET,
    TEAMS_CLIENT_ID: process.env.TEAMS_CLIENT_ID,
    TEAMS_CLIENT_SECRET: process.env.TEAMS_CLIENT_SECRET,
    CAL_CLIENT_ID: process.env.CAL_CLIENT_ID,
    CAL_CLIENT_SECRET: process.env.CAL_CLIENT_SECRET,
    CALENDLY_CLIENT_ID: process.env.CALENDLY_CLIENT_ID,
    CALENDLY_CLIENT_SECRET: process.env.CALENDLY_CLIENT_SECRET,
    FIREFLIES_CLIENT_ID: process.env.FIREFLIES_CLIENT_ID,
    FIREFLIES_CLIENT_SECRET: process.env.FIREFLIES_CLIENT_SECRET,
    ZENDESK_CLIENT_ID: process.env.ZENDESK_CLIENT_ID,
    ZENDESK_CLIENT_SECRET: process.env.ZENDESK_CLIENT_SECRET,
    INTERCOM_CLIENT_ID: process.env.INTERCOM_CLIENT_ID,
    INTERCOM_CLIENT_SECRET: process.env.INTERCOM_CLIENT_SECRET,
    TODOIST_CLIENT_ID: process.env.TODOIST_CLIENT_ID,
    TODOIST_CLIENT_SECRET: process.env.TODOIST_CLIENT_SECRET,
    ASANA_CLIENT_ID: process.env.ASANA_CLIENT_ID,
    ASANA_CLIENT_SECRET: process.env.ASANA_CLIENT_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    DODO_PAYMENTS_API_KEY: process.env.DODO_PAYMENTS_API_KEY,
    DODO_PAYMENTS_WEBHOOK_KEY: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    DODO_PAYMENTS_ENVIRONMENT: process.env.DODO_PAYMENTS_ENVIRONMENT,
    DODO_PRODUCT_PRO_MONTHLY: process.env.DODO_PRODUCT_PRO_MONTHLY,
    DODO_PRODUCT_PRO_YEARLY: process.env.DODO_PRODUCT_PRO_YEARLY,
    DODO_PRODUCT_BUSINESS_MONTHLY: process.env.DODO_PRODUCT_BUSINESS_MONTHLY,
    DODO_PRODUCT_BUSINESS_YEARLY: process.env.DODO_PRODUCT_BUSINESS_YEARLY,
    DODO_PRODUCT_ENTERPRISE_MONTHLY: process.env.DODO_PRODUCT_ENTERPRISE_MONTHLY,
    DODO_PRODUCT_ENTERPRISE_YEARLY: process.env.DODO_PRODUCT_ENTERPRISE_YEARLY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MEM0_API_KEY: process.env.MEM0_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    PAGERDUTY_ROUTING_KEY: process.env.PAGERDUTY_ROUTING_KEY,
    BACKFILL_CONCURRENCY: process.env.BACKFILL_CONCURRENCY,
    BACKFILL_THROTTLE_PER_MIN: process.env.BACKFILL_THROTTLE_PER_MIN,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET,
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
