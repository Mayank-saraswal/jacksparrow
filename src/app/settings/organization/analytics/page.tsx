import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { AnalyticsDashboard } from "./_components/analytics-dashboard";

export default async function AnalyticsPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/settings/organization");

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Enterprise</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Org usage and productivity. Counts and timings only — never content.
        </p>
      </header>
      <AnalyticsDashboard />
    </main>
  );
}
