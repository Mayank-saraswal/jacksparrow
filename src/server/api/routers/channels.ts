import crypto from "node:crypto";

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const CHANNELS = ["telegram", "whatsapp"] as const;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function generateCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return out;
}

export const channelsRouter = createTRPCRouter({
  links: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.channelLink.findMany({
      where: { userId: ctx.userId },
      select: { channel: true, externalChatId: true, linkedAt: true },
    });
  }),

  createLinkCode: protectedProcedure
    .input(z.object({ channel: z.enum(CHANNELS) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.upsert({
        where: { id: ctx.userId },
        create: { id: ctx.userId },
        update: {},
      });

      // Clear any previous codes for this channel, then mint a fresh one.
      await ctx.db.linkCode.deleteMany({
        where: { userId: ctx.userId, channel: input.channel },
      });

      let code = generateCode();
      for (let attempt = 0; attempt < 5; attempt++) {
        const clash = await ctx.db.linkCode.findUnique({ where: { code } });
        if (!clash) break;
        code = generateCode();
      }

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await ctx.db.linkCode.create({
        data: { code, userId: ctx.userId, channel: input.channel, expiresAt },
      });
      return { code, expiresAt };
    }),

  unlink: protectedProcedure
    .input(z.object({ channel: z.enum(CHANNELS) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.channelLink.deleteMany({
        where: { userId: ctx.userId, channel: input.channel },
      });
      return { ok: true };
    }),
});
