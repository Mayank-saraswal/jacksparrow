import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Lightning } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { TRPCReactProvider } from "@/trpc/react";
import { Button } from "@/components/ui/button";
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
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(geist.variable, "font-mono", jetbrainsMono.variable)}
      >
        <body>
          <TRPCReactProvider>
            <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm font-semibold tracking-tight"
              >
                <Lightning
                  weight="fill"
                  className="size-4 text-primary"
                />
                Jack Sparrow
              </Link>
              <nav className="flex items-center gap-3">
                {userId ? (
                  <>
                    <Link
                      href="/integrations"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Integrations
                    </Link>
                    <UserButton />
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <Button size="sm">Sign in</Button>
                  </SignInButton>
                )}
              </nav>
            </header>
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
