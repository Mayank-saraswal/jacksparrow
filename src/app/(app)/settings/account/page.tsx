import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { AccountData } from "./_components/account-data";

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel>Account</SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Your data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Export everything we hold about you, or delete your account.
        </p>
      </header>
      <AccountData />
    </main>
  );
}
