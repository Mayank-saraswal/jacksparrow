import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that require an authenticated Clerk session.
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
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
