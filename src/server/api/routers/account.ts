import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { inngest } from "@/inngest/client";
import { audit } from "@/server/audit";

/**
 * GDPR self-service (works for personal AND org members). Export assembles the
 * user's data into a signed-URL ZIP via Inngest; deletion uses a typed
 * confirmation (type-your-email) and a 7-day soft-delete window during which
 * login shows a cancel screen.
 */
const SOFT_DELETE_DAYS = 7;

export const accountRouter = createTRPCRouter({
  deletionStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.userId },
      select: { deletionScheduledAt: true },
    });
    return {
      deletionScheduledAt: user?.deletionScheduledAt?.toISOString() ?? null,
    };
  }),

  /** Kick off a data export (JSON/ZIP to Supabase Storage, signed URL). */
  exportData: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.upsert({
      where: { id: ctx.userId },
      create: { id: ctx.userId },
      update: {},
    });
    await inngest.send({
      name: "account/export.requested",
      data: { userId: ctx.userId },
    });
    audit(ctx, "export.requested", {
      targetType: "account",
      targetId: ctx.userId,
      meta: { kind: "gdpr_export" },
    });
    return { ok: true };
  }),

  /** Schedule full account deletion after a 7-day grace window. */
  requestDeletion: protectedProcedure
    .input(z.object({ confirmEmail: z.email() }))
    .mutation(async ({ ctx, input }) => {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const user = await client.users.getUser(ctx.userId);
      const primary = user.emailAddresses
        .find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress?.toLowerCase();
      if (!primary || primary !== input.confirmEmail.toLowerCase()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email does not match your account.",
        });
      }

      const scheduledAt = new Date(
        Date.now() + SOFT_DELETE_DAYS * 86_400_000,
      );
      await ctx.db.user.update({
        where: { id: ctx.userId },
        data: { deletionScheduledAt: scheduledAt },
      });
      audit(ctx, "settings.security_changed", {
        targetType: "account",
        targetId: ctx.userId,
        meta: { action: "deletion_scheduled", scheduledAt: scheduledAt.toISOString() },
      });
      return { scheduledAt: scheduledAt.toISOString() };
    }),

  cancelDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.userId },
      data: { deletionScheduledAt: null },
    });
    audit(ctx, "settings.security_changed", {
      targetType: "account",
      targetId: ctx.userId,
      meta: { action: "deletion_canceled" },
    });
    return { ok: true };
  }),
});
