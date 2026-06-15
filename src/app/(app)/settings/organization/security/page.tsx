import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { SecuritySettings } from "./_components/security-settings";

export default async function SecurityPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/settings/organization");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Enterprise</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Security &amp; data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          SSO, data retention, and legal holds for your organization.
        </p>
      </header>
      <SecuritySettings />
    </main>
  );
}
