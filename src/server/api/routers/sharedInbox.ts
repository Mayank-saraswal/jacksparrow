import { z } from "zod";
import { TRPCError } from "@trpc/server";

import type { Prisma } from "../../../../generated/prisma";
import { createTRPCRouter, orgProcedure } from "@/server/api/trpc";
import { assertSharedInboxAccess } from "@/server/authz";
import { audit } from "@/server/audit";
import { getMailProvider } from "@/server/mail/provider";
import { OPERATION_PATH } from "@/server/agent/pending";
import { sendChannelText } from "@/server/channels/dispatch";
import {
  applyAssignmentAction,
  assignmentEventKind,
  isStaleUpdate,
  type AssignmentAction,
  type AssignmentState,
} from "@/lib/assignment";

/**
 * Shared inbox collaboration. Every procedure is org-scoped (orgProcedure) and
 * additionally verifies the inbox belongs to the caller's org via
 * `assertSharedInboxAccess`. Reads come from the org Corsair tenant; writes
 * (assignments/comments) live in our DB with an AssignmentEvent audit trail.
 */

const inboxRef = z.object({ sharedInboxId: z.string().min(1) });
const threadRef = inboxRef.extend({ threadId: z.string().min(1) });

/** Notify a member through any linked channel (best-effort, fire-and-forget). */
function notifyMember(userId: string, text: string): void {
  void (async () => {
    try {
      const { db } = await import("@/server/db");
      const link = await db.channelLink.findFirst({ where: { userId } });
      if (link) await sendChannelText(link.channel, link.externalChatId, text);
    } catch {
      /* best-effort */
    }
  })();
}

export const sharedInboxRouter = createTRPCRouter({
  /** Shared inboxes for the active org. */
  list: orgProcedure.query(async ({ ctx }) => {
    const inboxes = await ctx.db.sharedInbox.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, plugin: true, corsairAccountId: true },
    });
    // Open-count per inbox for the sidebar.
    const counts = await ctx.db.threadAssignment.groupBy({
      by: ["sharedInboxId"],
      where: {
        sharedInboxId: { in: inboxes.map((i) => i.id) },
        status: { in: ["open", "assigned"] },
      },
      _count: { _all: true },
    });
    const openByInbox = new Map(
      counts.map((c) => [c.sharedInboxId, c._count._all]),
    );
    return inboxes.map((i) => ({
      ...i,
      openCount: openByInbox.get(i.id) ?? 0,
    }));
  }),

  /** Open / mine / unassigned counts for a single inbox. */
  counts: orgProcedure.input(inboxRef).query(async ({ ctx, input }) => {
    await assertSharedInboxAccess(input.sharedInboxId, ctx.userId);
    const [open, mine, unassigned] = await Promise.all([
      ctx.db.threadAssignment.count({
        where: {
          sharedInboxId: input.sharedInboxId,
          status: { in: ["open", "assigned"] },
        },
      }),
      ctx.db.threadAssignment.count({
        where: {
          sharedInboxId: input.sharedInboxId,
          status: "assigned",
          assigneeUserId: ctx.userId,
        },
      }),
      ctx.db.threadAssignment.count({
        where: { sharedInboxId: input.sharedInboxId, status: "open" },
      }),
    ]);
    return { open, mine, unassigned };
  }),

  /**
   * Thread list for an inbox: reads the org tenant's mail via the provider and
   * left-joins our ThreadAssignment rows. Cursor pagination mirrors Phase 1.
   */
  threads: orgProcedure
    .input(
      inboxRef.extend({
        q: z.string().default(""),
        limit: z.number().min(1).max(50).default(25),
      }),
    )
    .query(async ({ ctx, input }) => {
      const access = await assertSharedInboxAccess(
        input.sharedInboxId,
        ctx.userId,
      );
      const inbox = await ctx.db.sharedInbox.findUniqueOrThrow({
        where: { id: input.sharedInboxId },
        select: { plugin: true },
      });

      const provider = getMailProvider(
        inbox.plugin === "outlook" ? "outlook" : "gmail",
        { kind: "org", orgId: access.orgId },
      );
      const threads = await provider.listThreads(input.q || "in:inbox", input.limit);

      const assignments = await ctx.db.threadAssignment.findMany({
        where: {
          sharedInboxId: input.sharedInboxId,
          threadId: { in: threads.map((t) => t.threadId) },
        },
      });
      const byThread = new Map(assignments.map((a) => [a.threadId, a]));

      return threads.map((t) => {
        const a = byThread.get(t.threadId);
        return {
          ...t,
          status: a?.status ?? "open",
          assigneeUserId: a?.assigneeUserId ?? null,
          updatedAt: a?.updatedAt.toISOString() ?? null,
        };
      });
    }),

  /** Full thread (org tenant) + assignment + comments + audit trail. */
  thread: orgProcedure.input(threadRef).query(async ({ ctx, input }) => {
    const access = await assertSharedInboxAccess(
      input.sharedInboxId,
      ctx.userId,
    );
    const inbox = await ctx.db.sharedInbox.findUniqueOrThrow({
      where: { id: input.sharedInboxId },
      select: { plugin: true },
    });
    const provider = getMailProvider(
      inbox.plugin === "outlook" ? "outlook" : "gmail",
      { kind: "org", orgId: access.orgId },
    );

    const [detail, assignment, comments, events] = await Promise.all([
      provider.getThread(input.threadId),
      ctx.db.threadAssignment.findUnique({
        where: {
          sharedInboxId_threadId: {
            sharedInboxId: input.sharedInboxId,
            threadId: input.threadId,
          },
        },
      }),
      ctx.db.threadComment.findMany({
        where: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
        },
        orderBy: { createdAt: "asc" },
      }),
      ctx.db.assignmentEvent.findMany({
        where: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      detail,
      assignment: assignment
        ? {
            status: assignment.status,
            assigneeUserId: assignment.assigneeUserId,
            updatedAt: assignment.updatedAt.toISOString(),
          }
        : { status: "open", assigneeUserId: null, updatedAt: null },
      comments: comments.map((c) => ({
        id: c.id,
        authorUserId: c.authorUserId,
        body: c.body,
        createdAt: c.createdAt.toISOString(),
      })),
      events: events.map((e) => ({
        id: e.id,
        actorUserId: e.actorUserId,
        kind: e.kind,
        createdAt: e.createdAt.toISOString(),
      })),
    };
  }),

  /** Assign / unassign / take / close / reopen with optimistic concurrency. */
  act: orgProcedure
    .input(
      threadRef.extend({
        action: z.enum(["assign", "unassign", "take", "close", "reopen"]),
        assigneeUserId: z.string().optional(),
        expectedUpdatedAt: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertSharedInboxAccess(input.sharedInboxId, ctx.userId);

      const existing = await ctx.db.threadAssignment.findUnique({
        where: {
          sharedInboxId_threadId: {
            sharedInboxId: input.sharedInboxId,
            threadId: input.threadId,
          },
        },
      });

      // Optimistic concurrency: reject stale writes so the UI can refetch.
      if (
        existing &&
        isStaleUpdate(
          existing.updatedAt,
          input.expectedUpdatedAt
            ? new Date(input.expectedUpdatedAt)
            : undefined,
        )
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "stale_assignment",
        });
      }

      const current: AssignmentState = existing
        ? {
            status: existing.status as AssignmentState["status"],
            assigneeUserId: existing.assigneeUserId,
          }
        : { status: "open", assigneeUserId: null };

      const action: AssignmentAction =
        input.action === "take"
          ? { type: "assign", assigneeUserId: ctx.userId }
          : input.action === "assign"
            ? { type: "assign", assigneeUserId: input.assigneeUserId ?? ctx.userId }
            : input.action === "unassign"
              ? { type: "unassign" }
              : input.action === "close"
                ? { type: "close" }
                : { type: "reopen" };

      const result = applyAssignmentAction(current, action);
      if (!result.ok) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "invalid_transition" });
      }

      const saved = await ctx.db.threadAssignment.upsert({
        where: {
          sharedInboxId_threadId: {
            sharedInboxId: input.sharedInboxId,
            threadId: input.threadId,
          },
        },
        create: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
          status: result.next.status,
          assigneeUserId: result.next.assigneeUserId,
          updatedByUserId: ctx.userId,
        },
        update: {
          status: result.next.status,
          assigneeUserId: result.next.assigneeUserId,
          updatedByUserId: ctx.userId,
        },
      });

      await ctx.db.assignmentEvent.create({
        data: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
          actorUserId: ctx.userId,
          kind: assignmentEventKind(action),
          meta: { assigneeUserId: result.next.assigneeUserId },
        },
      });

      // Compliance audit (alongside the AssignmentEvent feature row).
      if (action.type === "assign") {
        audit(ctx, "thread.assigned", {
          targetType: "thread",
          targetId: input.threadId,
          meta: { sharedInboxId: input.sharedInboxId, assignee: result.next.assigneeUserId },
        });
      } else if (action.type === "close") {
        audit(ctx, "thread.closed", {
          targetType: "thread",
          targetId: input.threadId,
          meta: { sharedInboxId: input.sharedInboxId },
        });
      }

      // Notify a newly-assigned member (unless they assigned themselves).
      if (
        action.type === "assign" &&
        result.next.assigneeUserId &&
        result.next.assigneeUserId !== ctx.userId
      ) {
        notifyMember(
          result.next.assigneeUserId,
          " A shared-inbox thread was assigned to you in Hedwigs.",
        );
      }

      return {
        status: saved.status,
        assigneeUserId: saved.assigneeUserId,
        updatedAt: saved.updatedAt.toISOString(),
      };
    }),

  /** Internal note on a thread (never emailed). @mentions notify members. */
  addComment: orgProcedure
    .input(threadRef.extend({ body: z.string().min(1).max(4000) }))
    .mutation(async ({ ctx, input }) => {
      await assertSharedInboxAccess(input.sharedInboxId, ctx.userId);
      const comment = await ctx.db.threadComment.create({
        data: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
          authorUserId: ctx.userId,
          body: input.body,
        },
      });
      await ctx.db.assignmentEvent.create({
        data: {
          sharedInboxId: input.sharedInboxId,
          threadId: input.threadId,
          actorUserId: ctx.userId,
          kind: "commented",
          meta: {},
        },
      });

      // Notify @mentioned members (tokens that match an org member id).
      const mentioned = [...input.body.matchAll(/@(user_[A-Za-z0-9]+)/g)].map(
        (m) => m[1]!,
      );
      if (mentioned.length > 0) {
        const members = await ctx.db.membership.findMany({
          where: { orgId: ctx.orgId, userId: { in: mentioned } },
          select: { userId: true },
        });
        for (const m of members) {
          if (m.userId !== ctx.userId) {
            notifyMember(m.userId, "💬 You were mentioned in a shared-inbox note.");
          }
        }
      }

      return { id: comment.id, createdAt: comment.createdAt.toISOString() };
    }),

  /** Stage a reply from the shared inbox as a PendingAction (org tenant). */
  reply: orgProcedure
    .input(
      threadRef.extend({
        to: z.array(z.email()).min(1),
        cc: z.array(z.email()).optional(),
        subject: z.string().default(""),
        body: z.string().default(""),
        inReplyTo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertSharedInboxAccess(input.sharedInboxId, ctx.userId);
      const action = await ctx.db.pendingAction.create({
        data: {
          userId: ctx.userId,
          channel: "web",
          kind: "shared_reply",
          draftPayload: {
            sharedInboxId: input.sharedInboxId,
            threadId: input.threadId,
            to: input.to,
            cc: input.cc,
            subject: input.subject,
            body: input.body,
            inReplyTo: input.inReplyTo,
          } satisfies Prisma.InputJsonValue,
          corsairOperationPath: OPERATION_PATH.shared_reply,
          status: "pending",
        },
      });
      return { pendingActionId: action.id };
    }),
});
