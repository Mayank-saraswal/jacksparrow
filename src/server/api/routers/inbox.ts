import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getTenant } from "@/server/corsair";
import {
  buildRawMessage,
  threadDetail,
  threadPreview,
  type GmailThread,
} from "@/server/gmail";

const METADATA_HEADERS = ["Subject", "From", "To", "Date"];

export const inboxRouter = createTRPCRouter({
  /**
   * Lists threads for the current view. Gmail's list endpoint returns only ids,
   * so we hydrate each thread via threads.get (format=metadata) to get
   * subject/from/date — which also warms Corsair's local cache.
   */
  listThreads: protectedProcedure
    .input(
      z.object({
        q: z.string().default("in:inbox"),
        pageToken: z.string().optional(),
        limit: z.number().min(1).max(50).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);

      const list = await tenant.gmail.api.threads.list({
        q: input.q,
        maxResults: input.limit,
        pageToken: input.pageToken,
      });

      const ids = (list.threads ?? [])
        .map((t) => t.id)
        .filter((id): id is string => typeof id === "string");

      const threads = await Promise.all(
        ids.map((id) =>
          tenant.gmail.api.threads.get({
            id,
            format: "metadata",
            metadataHeaders: METADATA_HEADERS,
          }),
        ),
      );

      const previews = threads.map((t) =>
        threadPreview(t as unknown as GmailThread),
      );

      // Attach priority labels (Phase 6) by thread id.
      const scores = await ctx.db.priorityScore.findMany({
        where: {
          userId: ctx.userId,
          threadId: { in: previews.map((p) => p.threadId) },
        },
        select: { threadId: true, label: true, reason: true },
      });
      const scoreByThread = new Map(scores.map((s) => [s.threadId, s]));
      for (const preview of previews) {
        const s = scoreByThread.get(preview.threadId);
        preview.priority = s ? { label: s.label, reason: s.reason ?? "" } : null;
      }

      return {
        threads: previews,
        nextPageToken: list.nextPageToken ?? null,
      };
    }),

  getThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const thread = await tenant.gmail.api.threads.get({
        id: input.threadId,
        format: "full",
      });
      return threadDetail(thread);
    }),

  archiveThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        removeLabelIds: ["INBOX"],
      });
      return { ok: true };
    }),

  markRead: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        removeLabelIds: ["UNREAD"],
      });
      return { ok: true };
    }),

  markUnread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: ["UNREAD"],
      });
      return { ok: true };
    }),

  toggleStar: protectedProcedure
    .input(z.object({ threadId: z.string(), starred: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.modify({
        id: input.threadId,
        addLabelIds: input.starred ? ["STARRED"] : [],
        removeLabelIds: input.starred ? [] : ["STARRED"],
      });
      return { ok: true };
    }),

  trashThread: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.gmail.api.threads.trash({ id: input.threadId });
      return { ok: true };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        to: z.array(z.string().email()).min(1),
        cc: z.array(z.string().email()).optional(),
        bcc: z.array(z.string().email()).optional(),
        subject: z.string().default(""),
        body: z.string().default(""),
        html: z.string().optional(),
        threadId: z.string().optional(),
        inReplyTo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const raw = buildRawMessage({
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        subject: input.subject,
        body: input.body,
        html: input.html,
        inReplyTo: input.inReplyTo,
      });

      const result = await tenant.gmail.api.messages.send({
        raw,
        threadId: input.threadId,
      });
      return { id: result.id ?? null, threadId: result.threadId ?? null };
    }),

  saveDraft: protectedProcedure
    .input(
      z.object({
        to: z.array(z.string().email()).default([]),
        cc: z.array(z.string().email()).optional(),
        subject: z.string().default(""),
        body: z.string().default(""),
        html: z.string().optional(),
        threadId: z.string().optional(),
        draftId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const raw = buildRawMessage({
        to: input.to,
        cc: input.cc,
        subject: input.subject,
        body: input.body,
        html: input.html,
      });

      const message = { raw, threadId: input.threadId };

      if (input.draftId) {
        const updated = await tenant.gmail.api.drafts.update({
          id: input.draftId,
          draft: { message },
        });
        return { draftId: updated.id ?? null };
      }

      const created = await tenant.gmail.api.drafts.create({
        draft: { message },
      });
      return { draftId: created.id ?? null };
    }),
});
