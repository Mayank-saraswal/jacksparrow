import { inngest } from "../client";
import { db } from "@/server/db";
import { auditSystem } from "@/server/audit";

/**
 * IdP-driven deprovisioning. When Clerk reports a membership deletion (Feature
 * A SCIM-lite), we offboard the user: revoke their Clerk sessions, reassign
 * their open shared-inbox threads to unassigned, and write an audit row. Org
 * scoping is re-verified against our rows (events are never trusted blindly).
 */
export const memberOffboarding = inngest.createFunction(
  {
    id: "member-offboarding",
    retries: 3,
    triggers: { event: "clerk/membership.sync" },
  },
  async ({ event, step }) => {
    const { eventType, orgId, userId } = event.data as {
      eventType: string;
      orgId: string;
      userId: string;
    };
    if (eventType !== "organizationMembership.deleted") {
      return { skipped: "not-a-deletion" };
    }

    // Revoke the user's active Clerk sessions (best-effort).
    await step.run("revoke-sessions", async () => {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = (await clerkClient()) as unknown as {
          sessions: {
            getSessionList: (a: {
              userId: string;
            }) => Promise<{ data: { id: string }[] }>;
            revokeSession: (id: string) => Promise<unknown>;
          };
        };
        const list = await client.sessions.getSessionList({ userId });
        for (const s of list.data ?? []) {
          await client.sessions.revokeSession(s.id).catch(() => undefined);
        }
        return { revoked: list.data?.length ?? 0 };
      } catch (err) {
        console.error("[offboarding] session revoke failed:", err);
        return { revoked: 0 };
      }
    });

    // Reassign this user's open threads in the org's shared inboxes.
    const reassigned = await step.run("reassign-threads", async () => {
      const inboxes = await db.sharedInbox.findMany({
        where: { orgId },
        select: { id: true },
      });
      if (inboxes.length === 0) return 0;
      const result = await db.threadAssignment.updateMany({
        where: {
          sharedInboxId: { in: inboxes.map((i) => i.id) },
          assigneeUserId: userId,
          status: { in: ["open", "assigned"] },
        },
        data: { assigneeUserId: null, status: "open", updatedByUserId: "system" },
      });
      return result.count;
    });

    auditSystem("member.removed", {
      orgId,
      targetType: "membership",
      targetId: userId,
      meta: { reassignedThreads: reassigned, source: "idp_deprovision" },
    });

    return { offboarded: userId, reassigned };
  },
);
