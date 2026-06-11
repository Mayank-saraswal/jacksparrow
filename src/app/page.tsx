import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Lightning, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col items-center justify-center gap-7 px-6 py-20 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        <Lightning weight="fill" className="size-3 text-primary" />
        Superpowers for your inbox
      </span>

      <SectionLabel index={1} total={1}>
        Jack Sparrow
      </SectionLabel>

      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        The inbox that <span className="text-primary">works for you</span>
      </h1>

      <p className="max-w-md text-sm text-muted-foreground sm:text-base">
        Connect Gmail and Google Calendar to get started. Your accounts connect
        securely through Corsair, with tokens encrypted per user.
      </p>

      <div className="flex items-center gap-3">
        {userId ? (
          <Button asChild size="lg">
            <Link href="/integrations">
              Manage integrations <ArrowRight />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/sign-in">
                Get started <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
