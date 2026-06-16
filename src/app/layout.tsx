import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import { TRPCReactProvider } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { AgentDock } from "@/app/_components/agent-dock";
import { CommandMenu } from "@/app/_components/command-menu";
import { CommandContextProvider } from "@/app/_components/command-context";
import { ShortcutProvider } from "@/app/_components/shortcut-provider";
import { ToastProvider } from "@/app/_components/toast";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Jack Sparrow",
  description: "Your AI-powered inbox.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let userId: string | null = null;
  try {
    const authSession = await auth();
    userId = authSession.userId;
  } catch (e) {
    // clerkMiddleware was skipped for this request (e.g. 404 on a static file)
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(geist.variable, "font-mono", jetbrainsMono.variable)}
      >
        <body>
          <TRPCReactProvider>
            <ToastProvider>
            <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
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
                Jack Sparrow
              </Link>
              <nav className="flex items-center gap-3">
                {userId ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-muted-foreground hover:text-[#262626] transition-colors"
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
            {userId ? (
              <ShortcutProvider>
                <CommandContextProvider>
                  {children}
                  <AgentDock />
                  <CommandMenu />
                </CommandContextProvider>
              </ShortcutProvider>
            ) : (
              children
            )}
            </ToastProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
