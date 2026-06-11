import { generateOAuthUrl } from "corsair/oauth";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { getSessionTenantId } from "@/server/auth";
import { corsair, isSupportedPlugin } from "@/server/corsair";

/**
 * Starts the OAuth flow for the given plugin (gmail | googlecalendar).
 *
 * Redirects the signed-in user to Google's consent screen, scoped to their
 * tenant (Clerk user id). The HMAC-signed state is stored in an httpOnly
 * cookie and verified on the callback to prevent CSRF.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plugin: string }> },
) {
  const { plugin } = await params;

  if (!isSupportedPlugin(plugin)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  const tenantId = await getSessionTenantId();
  if (!tenantId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const redirectUri = `${env.APP_URL}/api/integrations/${plugin}/callback`;

  const { url, state } = await generateOAuthUrl(corsair, plugin, {
    tenantId,
    redirectUri,
  });

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });
  return response;
}
