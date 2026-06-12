import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { AuditTable } from "./_components/audit-table";

export default async function AuditPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/settings/organization");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Enterprise</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Append-only trail of security-relevant actions in your organization.
        </p>
      </header>
      <AuditTable />
    </main>
  );
}
