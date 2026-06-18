import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
  // Fetch a list of recent conversations for the sidebar
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.chatConversation.findMany({
      where: { userId: ctx.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
      take: 50,
    });
  }),

  // Fetch a specific conversation and its messages
  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conv = await ctx.db.chatConversation.findUnique({
        where: { id: input.conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (conv?.userId !== ctx.userId) {
        throw new Error("Conversation not found or unauthorized");
      }

      return conv;
    }),

  // Optional endpoint to delete a conversation
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const conv = await ctx.db.chatConversation.findUnique({
        where: { id: input.conversationId },
      });

      if (conv?.userId !== ctx.userId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.chatConversation.delete({
        where: { id: input.conversationId },
      });

      return { success: true };
    }),

  // Endpoint to rename a conversation
  renameConversation: protectedProcedure
    .input(z.object({ conversationId: z.string(), title: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const conv = await ctx.db.chatConversation.findUnique({
        where: { id: input.conversationId },
      });

      if (conv?.userId !== ctx.userId) {
        throw new Error("Unauthorized");
      }

      await ctx.db.chatConversation.update({
        where: { id: input.conversationId },
        data: { title: input.title },
      });

      return { success: true };
    }),
});
