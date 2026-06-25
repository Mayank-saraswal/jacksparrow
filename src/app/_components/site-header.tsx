"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { getDemoLoginUrl } from "@/app/actions/demo-login";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DemoLoginPopover({ children }: { children: React.ReactNode }) {
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const handleDemoLogin = async (email: string) => {
    try {
      setLoadingUser(email);
      const url = await getDemoLoginUrl(email);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Failed to generate demo login link. " + (err instanceof Error ? err.message : ""));
      setLoadingUser(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2 flex flex-col gap-1 shadow-xl">
        <p className="text-[10px] font-semibold text-muted-foreground mb-1 px-2 uppercase tracking-wider">Default</p>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
          <button className="text-sm px-2 py-2 hover:bg-muted rounded-md transition-colors font-medium flex items-center gap-2 text-left w-full">
            <span className="size-6 flex items-center justify-center bg-primary/10 rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/FIRE_SVG_Animated.svg" alt="Hedwigs" className="size-4" />
            </span>
            Standard Sign In
          </button>
        </SignInButton>

        <div className="my-1 border-t border-border mx-1" />
        
        <p className="text-[10px] font-semibold text-muted-foreground mb-1 mt-1 px-2 uppercase tracking-wider">Hackathon Demo</p>
        <button 
          onClick={() => handleDemoLogin("piyush@chaicode.com")}
          disabled={loadingUser !== null}
          className="text-sm px-2 py-2 hover:bg-muted rounded-md transition-colors font-medium flex items-center justify-between gap-2 w-full text-left disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/piyush-garg.webp" alt="Piyush Sir" className="size-6 rounded-full object-cover" /> Login as Piyush Sir
          </div>
          {loadingUser === "piyush@chaicode.com" && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}
        </button>
        <button 
          onClick={() => handleDemoLogin("hitesh@chaicode.com")}
          disabled={loadingUser !== null}
          className="text-sm px-2 py-2 hover:bg-muted rounded-md transition-colors font-medium flex items-center justify-between gap-2 w-full text-left disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/hiteshsir.jpg" alt="Hitesh Sir" className="size-6 rounded-full object-cover" /> Login as Hitesh Sir
          </div>
          {loadingUser === "hitesh@chaicode.com" && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}
        </button>
      </PopoverContent>
    </Popover>
  );
}

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
            <Link href="/dashboard" prefetch={true} className="landing-nav-login">
              Dashboard
            </Link>
          ) : (
            <DemoLoginPopover>
              <button className="landing-nav-login" type="button">Log in</button>
            </DemoLoginPopover>
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
              prefetch={true}
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
          <DemoLoginPopover>
            <Button variant="ghost" size="sm">Sign in</Button>
          </DemoLoginPopover>
        )}
      </nav>
    </header>
  );
}
