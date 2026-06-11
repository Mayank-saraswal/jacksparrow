import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        The inbox that works for you
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Connect Gmail and Google Calendar to get started. Your accounts are
        connected securely through Corsair, with tokens encrypted per user.
      </p>
      <div className="flex items-center gap-3">
        {userId ? (
          <Button asChild>
            <Link href="/integrations">Manage integrations</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/sign-in">Get started</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
