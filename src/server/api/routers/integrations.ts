import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { corsair, SUPPORTED_PLUGINS } from "@/server/corsair";
import { inngest } from "@/inngest/client";

export type PluginConnectionState =
  | "connected"
  | "missing_credentials"
  | "not_connected";

const pluginInput = z.object({
  plugin: z.enum(["gmail", "googlecalendar"]),
});

export const integrationsRouter = createTRPCRouter({
  /**
   * Connection status for each supported integration, scoped to the signed-in
   * user (tenant). Uses Corsair's management namespace:
   *   - "connected"           the user has authorized this integration
   *   - "not_connected"       the user has not connected yet
   *   - "missing_credentials" the app's OAuth client_id/secret are not set up
   *                           (run `bun run corsair:setup`)
   */
  status: protectedProcedure.query(async ({ ctx }) => {
    const status = await corsair.manage.connectionStatus.get({
      tenantId: ctx.userId,
    });

    return SUPPORTED_PLUGINS.map((plugin) => ({
      plugin,
      state: status[plugin] ?? "not_connected",
    }));
  }),

  /**
   * Backfill state per plugin for the current user, derived from the timestamps
   * the Inngest backfill job writes. `backfilledAt === null` while a connected
   * integration is still syncing.
   */
  getSyncStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.userId },
      select: { gmailBackfilledAt: true, calendarBackfilledAt: true },
    });

    return {
      gmail: { backfilledAt: user?.gmailBackfilledAt ?? null },
      googlecalendar: { backfilledAt: user?.calendarBackfilledAt ?? null },
    };
  }),

  /**
   * Manually re-run the backfill for a plugin. Clears the timestamp (so the UI
   * shows a syncing state again) and re-emits the Inngest event.
   */
  resync: protectedProcedure
    .input(pluginInput)
    .mutation(async ({ ctx, input }) => {
      const data =
        input.plugin === "gmail"
          ? { gmailBackfilledAt: null }
          : { calendarBackfilledAt: null };

      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId, ...data },
        update: data,
      });

      await inngest.send({
        name: "integration/connected",
        data: { clerkUserId: ctx.userId, plugin: input.plugin },
      });

      return { ok: true };
    }),
});
