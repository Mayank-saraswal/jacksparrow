import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { corsair, SUPPORTED_PLUGINS } from "@/server/corsair";

export type PluginConnectionState =
  | "connected"
  | "missing_credentials"
  | "not_connected";

export const integrationsRouter = createTRPCRouter({
  /**
   * Connection status for each supported integration, scoped to the signed-in
   * user (tenant). Uses Corsair's management namespace:
   *   - "connected"           the user has authorized this integration
   *   - "not_connected"       the user has not connected yet
   *   - "missing_credentials" the app's OAuth client_id/secret are not set up
   *                           (run `corsair setup --plugin=...`)
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
});
