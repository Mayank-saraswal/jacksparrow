import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { OrgPanel } from "./_components/org-panel";

export default async function OrganizationPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Team</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Organization</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage members, invitations, and roles for your team.
        </p>
      </header>
      <OrgPanel />
    </main>
  );
}
