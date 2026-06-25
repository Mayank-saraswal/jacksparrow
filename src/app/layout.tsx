
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { AgentDock } from "@/app/_components/agent-dock";
import { CommandMenu } from "@/app/_components/command-menu";
import { CommandContextProvider } from "@/app/_components/command-context";
import { ShortcutProvider } from "@/app/_components/shortcut-provider";
import { ToastProvider } from "@/app/_components/toast";
import { cn } from "@/lib/utils";
import { Agentation } from "agentation";
import { DemoLoginPopover } from "@/app/_components/site-header";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Hedwigs",
  description: "Your AI-powered inbox.",
  icons: [{ rel: "icon", url: "/logo/FIRE_SVG_Animated.svg", type: "image/svg+xml" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim().padEnd(34, '=') ?? undefined}
      appearance={{ theme: [dark] }}
    >
      <html
        lang="en"
        className={cn(geist.variable, "font-sans", "dark")}
        style={{ colorScheme: "dark" }}
      >
        <body>
          <TRPCReactProvider>
            <ToastProvider>
            <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo/FIRE_SVG_Animated.svg"
                    alt=""
                    className="size-5"
                  />
                  Hedwigs
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <Link href="/#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                  <Link href="/#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                  <Link href="/integrations" className="hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </nav>
                <nav className="flex items-center gap-3">
                  <SignedIn>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                    <OrganizationSwitcher
                      hidePersonal={true}
                      afterCreateOrganizationUrl="/dashboard"
                      afterSelectOrganizationUrl="/dashboard"
                    />
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <DemoLoginPopover>
                      <Button size="sm">Sign in</Button>
                    </DemoLoginPopover>
                  </SignedOut>
                </nav>
              </div>
            </header>
            <SignedIn>
              <ShortcutProvider>
                <CommandContextProvider>
                  {children}
                  <AgentDock />
                  <CommandMenu />
                </CommandContextProvider>
              </ShortcutProvider>
            </SignedIn>
            <SignedOut>
              {children}
            </SignedOut>
            {process.env.NODE_ENV === "development" && <Agentation />}
            </ToastProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
