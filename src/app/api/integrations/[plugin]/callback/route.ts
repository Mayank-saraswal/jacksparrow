import { processOAuthCallback } from "corsair/oauth";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { getSessionTenantId } from "@/server/auth";
import { corsair, isSupportedPlugin } from "@/server/corsair";

/**
 * Completes the OAuth flow for the given plugin.
 *
 * Verifies the state cookie (CSRF), exchanges the authorization code for tokens
 * via Corsair (which stores them encrypted per tenant), then redirects back to
 * the settings page with a status query param. The state cookie is cleared on
 * every exit path.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plugin: string }> },
) {
  const { plugin } = await params;
  const settingsUrl = new URL("/integrations", env.APP_URL);

  if (!isSupportedPlugin(plugin)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  const tenantId = await getSessionTenantId();
  if (!tenantId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { searchParams } = new URL(request.url);
  const oauthError = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;

  const redirectWith = (key: string, value: string) => {
    settingsUrl.searchParams.set(key, value);
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("oauth_state");
    return response;
  };

  if (oauthError) {
    return redirectWith("error", oauthError);
  }
  if (!code || !state) {
    return redirectWith("error", "missing_code_or_state");
  }
  if (!storedState || storedState !== state) {
    return redirectWith("error", "invalid_state");
  }

  const redirectUri = `${env.APP_URL}/api/integrations/${plugin}/callback`;

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri,
    });
    return redirectWith("connected", result.plugin);
  } catch (err) {
    console.error(`[corsair oauth] callback failed for ${plugin}:`, err);
    return redirectWith("error", "oauth_failed");
  }
}
