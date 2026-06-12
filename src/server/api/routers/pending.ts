import { z } from "zod";
import { TRPCError } from "@trpc/server";

import type { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { audit } from "@/server/audit";
import {
  executePendingAction,
  summarizePendingAction,
} from "@/server/agent/pending";

export const pendingRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.pendingAction.findMany({
      where: { userId: ctx.userId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      channel: r.channel,
      draftPayload: r.draftPayload,
      summary: summarizePendingAction(r.kind, r.draftPayload),
      createdAt: r.createdAt,
    }));
  }),

  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pendingAction.count({
      where: { userId: ctx.userId, status: "pending" },
    });
  }),

  approve: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const action = await ctx.db.pendingAction.findUnique({
        where: { id: input.id },
      });
      if (!action) throw new TRPCError({ code: "NOT_FOUND" });
      if (action.userId !== ctx.userId) throw new TRPCError({ code: "NOT_FOUND" });
      if (action.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already resolved" });
      }

      const result = await executePendingAction(
        ctx.userId,
        action.kind,
        action.draftPayload,
      );

      await ctx.db.pendingAction.update({
        where: { id: action.id },
        data: { status: "executed", resolvedAt: new Date() },
      });
      audit(ctx, "agent.action_approved", {
        targetType: "pending_action",
        targetId: action.id,
        meta: { kind: action.kind },
      });
      audit(ctx, "agent.action_executed", {
        targetType: "pending_action",
        targetId: action.id,
        meta: { kind: action.kind },
      });
      if (action.kind === "send_email" || action.kind === "shared_reply") {
        audit(ctx, "email.sent", {
          targetType: "email",
          targetId: action.id,
          meta: { kind: action.kind },
        });
      }
      return { ok: true, summary: result.summary };
    }),

  reject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const action = await ctx.db.pendingAction.findUnique({
        where: { id: input.id },
      });
      if (!action) throw new TRPCError({ code: "NOT_FOUND" });
      if (action.userId !== ctx.userId) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.pendingAction.update({
        where: { id: action.id },
        data: { status: "rejected", resolvedAt: new Date() },
      });
      audit(ctx, "agent.action_rejected", {
        targetType: "pending_action",
        targetId: action.id,
        meta: { kind: action.kind },
      });
      return { ok: true };
    }),

  updateDraft: protectedProcedure
    .input(z.object({ id: z.string(), draftPayload: z.record(z.string(), z.unknown()) }))
    .mutation(async ({ ctx, input }) => {
      const action = await ctx.db.pendingAction.findUnique({
        where: { id: input.id },
      });
      if (!action) throw new TRPCError({ code: "NOT_FOUND" });
      if (action.userId !== ctx.userId) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.pendingAction.update({
        where: { id: action.id },
        data: { draftPayload: input.draftPayload as Prisma.InputJsonValue },
      });
      return { ok: true };
    }),
});
