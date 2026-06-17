import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { corsair, USER_PLUGINS, ORG_PLUGINS } from "@/server/corsair";
import { inngest } from "@/inngest/client";

export type PluginConnectionState =
  | "connected"
  | "missing_credentials"
  | "not_connected";

const pluginInput = z.object({
  plugin: z.enum(["gmail", "googlecalendar", "outlook"]),
});

export const integrationsRouter = createTRPCRouter({
  /**
   * Connection status for each personal (user-level) integration, scoped to the
   * signed-in user. Slack is org-level and surfaced on the org settings page.
   */
  status: protectedProcedure.query(async ({ ctx }) => {
    const status = await corsair.manage.connectionStatus.get({
      tenantId: ctx.userId,
    });

    return USER_PLUGINS.map((plugin) => ({
      plugin,
      state: status[plugin] ?? "not_connected",
    }));
  }),

  /**
   * Connection status for organization-level integrations.
   */
  orgStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      return ORG_PLUGINS.map((plugin) => ({
        plugin,
        state: "not_connected" as const,
      }));
    }

    const status = await corsair.manage.connectionStatus.get({
      tenantId: `org:${ctx.orgId}`,
    });

    return ORG_PLUGINS.map((plugin) => ({
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
      select: {
        gmailBackfilledAt: true,
        calendarBackfilledAt: true,
        outlookBackfilledAt: true,
      },
    });

    return {
      gmail: { backfilledAt: user?.gmailBackfilledAt ?? null },
      googlecalendar: { backfilledAt: user?.calendarBackfilledAt ?? null },
      outlook: { backfilledAt: user?.outlookBackfilledAt ?? null },
    };
  }),

  /**
   * Backfill state per org-level plugin (gmail / outlook). Mirrors getSyncStatus
   * but reads from the Organization row so the org-integrations UI can poll for
   * resync progress.
   */
  getOrgSyncStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      return {
        gmail: { backfilledAt: null },
        outlook: { backfilledAt: null },
      };
    }

    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.orgId },
      select: {
        gmailBackfilledAt: true,
        outlookBackfilledAt: true,
      },
    });

    return {
      gmail: { backfilledAt: org?.gmailBackfilledAt ?? null },
      outlook: { backfilledAt: org?.outlookBackfilledAt ?? null },
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
          : input.plugin === "outlook"
            ? { outlookBackfilledAt: null }
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

  /**
   * Manually re-run the backfill for an org-level plugin. Clears the org-level
   * backfilledAt timestamp (so the UI shows a syncing state) then re-emits the
   * Inngest event.
   */
  orgResync: protectedProcedure
    .input(z.object({ plugin: z.enum(["gmail", "outlook"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.orgId) {
        throw new Error("No active organization");
      }

      // Clear the backfilledAt timestamp so polling picks up the syncing state.
      const data =
        input.plugin === "gmail"
          ? { gmailBackfilledAt: null }
          : { outlookBackfilledAt: null };

      await ctx.db.organization.upsert({
        where: { id: ctx.orgId },
        create: { id: ctx.orgId, name: "Organization", ...data },
        update: data,
      });

      await inngest.send({
        name: "integration/connected",
        data: {
          clerkUserId: ctx.userId,
          plugin: input.plugin,
          tenantKind: "org",
          orgId: ctx.orgId,
        },
      });

      return { ok: true };
    }),
});
