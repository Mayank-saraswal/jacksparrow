"use client";

import {
  OrganizationProfile,
  CreateOrganization,
  useOrganization,
} from "@clerk/nextjs";

/**
 * Organization management. Clerk's <OrganizationProfile> handles the members
 * list, invitations, and role management (admin-gated by Clerk). Users without
 * an active org get the create-org flow. Membership changes are mirrored into
 * our DB via the Clerk webhook → Inngest sync.
 */
export function OrgPanel() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!organization) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create an organization to share inboxes and collaborate with your
          team. Your personal account keeps working either way.
        </p>
        <CreateOrganization afterCreateOrganizationUrl="/settings/organization" />
      </div>
    );
  }

  return <OrganizationProfile routing="hash" />;
}
