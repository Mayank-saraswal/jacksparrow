"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function SiteHeader({ userId }: { userId: string | null }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <header className="landing-nav">
        <Link href="/" className="landing-brand" aria-label="Hedwigs home">
          <span className="landing-brand-mark">H</span>
          <span>Hedwigs</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <Link href="#product">Product</Link>
          <Link href="#how-it-works">How it works</Link>
          <Link href="#integrations">Integrations</Link>
          <Link href="#security">Security</Link>
        </nav>

        <div className="landing-nav-actions">
          {userId ? (
            <Link href="/dashboard" className="landing-nav-login">
              Dashboard
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="landing-nav-login" type="button">
                Log in
              </button>
            </SignInButton>
          )}
          <Link
            href={userId ? "/dashboard" : "/sign-up"}
            className="landing-pill landing-pill-dark landing-nav-cta"
          >
            Get started
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-12 items-center justify-between border-b px-4 backdrop-blur">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/FIRE_SVG_Animated.svg" alt="" className="size-5" />
        Hedwigs
      </Link>
      <nav className="flex items-center gap-3">
        {userId ? (
          <>
            <Link
              href="/dashboard"
              className="text-muted-foreground text-sm font-medium transition-colors hover:text-[#262626]"
            >
              Dashboard
            </Link>
            <OrganizationSwitcher
              hidePersonal={true}
              afterCreateOrganizationUrl="/settings/organization"
              afterSelectOrganizationUrl="/dashboard"
            />
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button size="sm">Sign in</Button>
          </SignInButton>
        )}
      </nav>
    </header>
  );
}
