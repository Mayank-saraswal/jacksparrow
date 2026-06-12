import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { BillingPanel } from "./_components/billing-panel";

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Billing</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Plan &amp; usage
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and monitor your monthly AI usage.
        </p>
      </header>
      <BillingPanel />
    </main>
  );
}
