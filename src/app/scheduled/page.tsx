import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { ScheduledList } from "./_components/scheduled-list";

export default async function ScheduledPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <SectionLabel>Outbox</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Scheduled &amp; sending
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Messages waiting to send, plus anything that failed.
        </p>
      </header>
      <ScheduledList />
    </main>
  );
}
