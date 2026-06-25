"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PIYUSH_LINK = "https://accounts.hedwigs.site/sign-in?__clerk_ticket=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaXMiOjI1OTIwMDAsImV4cCI6MTc4NDk3NDA1OCwiaWlkIjoiaW5zXzNGSXN1OTdCd0dLcllxRmNTV2dEV3k1QzhIcSIsInNpZCI6InNpdF8zRmNsNXpmSVh4aGMxMFdoVnFxY3d6VnlmZEIiLCJzdCI6InNpZ25faW5fdG9rZW4ifQ.YNsskizK7l2Hr12fGzvaZBIRCJNUoPY8Rml2HaOGQvmZoGsQGmDaMHqFxd68ZmGkvXW3blqhVD4CCvbT4pesi2hvAmAvljzvGOZQFiaFlHP4LoeF3X2eC1X6_rU0J4mcquxVgW1HmPhsv_nZ2ABZOsAkJ0kqbATrJQOgeb41-3cWDMCKC0M1dJmA6ruaZLkgUbbChxvuOWo6jatLZIrdqPzfgD96GYuNe3biHXl4LKQdl8rEpFyjcyK7v7RB_8A_caLZ83NQBvPTYUktDhgwVah4ueDkQVbjtYYdEgeXVeI53jah80Q4Xnm9r4gP5qGew40loLksEvh-gmMxA75BWQ";
const HITESH_LINK = "https://accounts.hedwigs.site/sign-in?__clerk_ticket=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaXMiOjI1OTIwMDAsImV4cCI6MTc4NDk3NDA1OCwiaWlkIjoiaW5zXzNGSXN1OTdCd0dLcllxRmNTV2dEV3k1QzhIcSIsInNpZCI6InNpdF8zRmNsNXVyUzJDMWJ0cHRpSm9UQWhXVzE5eUQiLCJzdCI6InNpZ25faW5fdG9rZW4ifQ.r7wJIXzB_x5wiuc_3gh51BB_YHiLFMspDu_Tcwu6fF0XkErAMej40vJnL43Rdk6Oj5-HOZJGDm6Vj3yDJNBcccPKlb0Jgitmz7zNEAWcttpiIapv6cQBhp2VEgupqoysXVxx0cK6zmZe99INpFjwZSI9sMmmjqq4rdWW48JvH-tjzw-Ue7SKqN1cbl7EVdadI7v63KnzJa7M0HrqUvgExeH1yBEA-UZTW_IxQkQwbvEaab0M_F6TeoYVXGUq0Kiv7ZC8uxfZDSqR6JRZjoUaAWrjQQvKA8ls8ajJU9TIckva_dDsOpzPAtHegNCmvTIIA9MeudVmVmi8ffazeJ2LQQ";

export function DemoLoginPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2 flex flex-col gap-1 shadow-xl">
        <p className="text-[10px] font-semibold text-muted-foreground mb-1 px-2 uppercase tracking-wider">Default</p>
        <SignInButton mode="modal">
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
        <a href={PIYUSH_LINK} className="text-sm px-2 py-2 hover:bg-muted rounded-md transition-colors font-medium flex items-center gap-2">
          <img src="/logo/piyush-garg.webp" alt="Piyush Sir" className="size-6 rounded-full object-cover" /> Login as Piyush Sir
        </a>
        <a href={HITESH_LINK} className="text-sm px-2 py-2 hover:bg-muted rounded-md transition-colors font-medium flex items-center gap-2">
          <img src="/logo/hiteshsir.jpg" alt="Hitesh Sir" className="size-6 rounded-full object-cover" /> Login as Hitesh Sir
        </a>
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
