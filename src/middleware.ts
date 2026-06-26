import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Routes that require an authenticated Clerk session and an active organization.
 *
 * The Corsair webhook endpoint (/api/webhooks/corsair) and the Inngest endpoint
 * are intentionally left public — they are called by external services and do
 * their own verification.
 */
const isProtectedRoute = createRouteMatcher([
  "/integrations(.*)",
  "/api/integrations(.*)",
  "/team(.*)",
  "/settings(.*)",
  "/dashboard(.*)",
  "/inbox(.*)",
  "/calendar(.*)",
  "/scheduled(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
    
    // Force organization creation
    const { orgId } = await auth();
    if (!orgId) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
}, {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim(),
  secretKey: process.env.CLERK_SECRET_KEY?.trim(),
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
