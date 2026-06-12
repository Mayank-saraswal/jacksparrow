import { inngest } from "../client";
import { db } from "@/server/db";

/**
 * Mirrors Clerk Organizations + memberships into our local tables so we can do
 * fast joins and authoritative authorization checks. All upserts are
 * idempotent (keyed by Clerk ids), so webhook replays are safe.
 */

interface OrgSyncData {
  eventType: string; // organization.created | .updated | .deleted
  id: string;
  name?: string;
}

interface MembershipSyncData {
  eventType: string; // organizationMembership.created | .updated | .deleted
  orgId: string;
  userId: string;
  role: "admin" | "member";
}

export const clerkOrgSync = inngest.createFunction(
  { id: "clerk-org-sync", retries: 3, triggers: { event: "clerk/org.sync" } },
  async ({ event, step }) => {
    const data = event.data as OrgSyncData;

    if (data.eventType === "organization.deleted") {
      await step.run("delete-org", async () => {
        await db.organization.deleteMany({ where: { id: data.id } });
      });
      return { deleted: data.id };
    }

    await step.run("upsert-org", async () => {
      const name = data.name ?? "Organization";
      await db.organization.upsert({
        where: { id: data.id },
        create: { id: data.id, name },
        update: { name },
      });
    });
    return { upserted: data.id };
  },
);

export const clerkMembershipSync = inngest.createFunction(
  {
    id: "clerk-membership-sync",
    retries: 3,
    triggers: { event: "clerk/membership.sync" },
  },
  async ({ event, step }) => {
    const data = event.data as MembershipSyncData;

    if (data.eventType === "organizationMembership.deleted") {
      await step.run("delete-membership", async () => {
        await db.membership.deleteMany({
          where: { orgId: data.orgId, userId: data.userId },
        });
      });
    } else {
      await step.run("upsert-membership", async () => {
        // The org row must exist for the FK; upsert defensively in case the
        // membership webhook arrives before the organization one.
        await db.organization.upsert({
          where: { id: data.orgId },
          create: { id: data.orgId, name: "Organization" },
          update: {},
        });
        await db.membership.upsert({
          where: { orgId_userId: { orgId: data.orgId, userId: data.userId } },
          create: {
            orgId: data.orgId,
            userId: data.userId,
            role: data.role,
          },
          update: { role: data.role },
        });
      });
    }

    // Org-plan seat count may have changed — let billing reconcile.
    await step.sendEvent("seats-sync", {
      name: "billing/seats.sync",
      data: { orgId: data.orgId },
    });

    return { orgId: data.orgId, userId: data.userId, eventType: data.eventType };
  },
);
