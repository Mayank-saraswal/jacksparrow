import { generateOAuthUrl } from "corsair/oauth";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  corsair,
  isSupportedPlugin,
  PLUGIN_FEATURE,
  tenantId as toTenantId,
  type TenantRef,
} from "@/server/corsair";
import { hasFeature, orgOwner, userOwner } from "@/server/billing/entitlements";

/**
 * Starts the OAuth flow for the given plugin.
 *
 * Personal connect (default) binds the grant to the user's tenant. Org connect
 * (`?scope=org`, admin only) binds it to `org:{orgId}` so shared inboxes /
 * Slack land under the org tenant. The chosen tenant is signed into the state
 * cookie alongside Corsair's state and re-verified on the callback.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ plugin: string }> },
) {
  const { plugin } = await params;

  if (!isSupportedPlugin(plugin)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const scope = request.nextUrl.searchParams.get("scope");
  let ref: TenantRef = { kind: "user", userId };

  if (scope === "org") {
    if (!orgId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }
    // Org connect is admin-only (verified against our mirrored membership).
    const membership = await db.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { role: true },
    });
    if (membership?.role !== "admin") {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }
    ref = { kind: "org", orgId };
  }

  // Plan-gate integrations that require a paid capability. Org integrations
  // (HubSpot/Linear/Jira/Teams/Zendesk/Intercom) bill to the org; user-level
  // ones (Fireflies → meetingIntelligence) bill to the user.
  const feature = PLUGIN_FEATURE[plugin];
  if (feature) {
    const owner = ref.kind === "org" ? orgOwner(ref.orgId) : userOwner(userId);
    if (!(await hasFeature(owner, feature))) {
      return NextResponse.json(
        { error: "Your plan does not include this integration." },
        { status: 403 },
      );
    }
  }

  const tenant = toTenantId(ref);
  const redirectUri = `${env.APP_URL}/api/integrations/${plugin}/callback`;

  // ── Zendesk: subdomain-scoped OAuth ─────────────────────────────────────
  // Zendesk OAuth URLs are scoped to each customer's subdomain, so we can't
  // use the generic generateOAuthUrl(). We build the URL manually instead.
  if (plugin === "zendesk") {
    let subdomain = request.nextUrl.searchParams.get("subdomain");
    if (!subdomain) {
      return NextResponse.json(
        { error: "Zendesk requires a subdomain parameter." },
        { status: 400 },
      );
    }

    // Clean subdomain: extract subdomain if a full URL or hostname is passed
    subdomain = subdomain.trim();
    if (subdomain.includes("://") || subdomain.includes(".")) {
      try {
        let tempUrl = subdomain;
        if (!/^https?:\/\//i.test(tempUrl)) {
          tempUrl = "https://" + tempUrl;
        }
        const parsed = new URL(tempUrl);
        const host = parsed.hostname;
        const parts = host.split(".");
        if (parts.length > 0 && parts[0]) {
          subdomain = parts[0];
        }
      } catch {
        subdomain = subdomain.replace(/^https?:\/\//i, "").split(".")[0] || subdomain;
      }
    }
    // Remove any remaining invalid characters
    subdomain = subdomain.replace(/[^a-zA-Z0-9-]/g, "");


    // Use Corsair's encodeOAuthState to get a signed state parameter
    const { encodeOAuthState } = await import("corsair/oauth");
    const state = encodeOAuthState(plugin, tenant);

    // Retrieve the client_id from Corsair integration-level keys
    const clientId = await corsair.keys.zendesk.get_client_id();
    if (!clientId) {
      return NextResponse.json(
        { error: "Zendesk OAuth client_id not configured. Run corsair:setup." },
        { status: 500 },
      );
    }

    const authUrl = new URL(
      `https://${encodeURIComponent(subdomain)}.zendesk.com/oauth/authorizations/new`,
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);
    
    // Zendesk REQUIRES the scope parameter, and strictly requires %20 for spaces.
    // We append it manually to bypass URLSearchParams turning spaces into +
    const finalUrl = authUrl.toString() + "&scope=read%20write";
    const response = NextResponse.redirect(finalUrl);
    
    // Completely disable caching of this redirect to prevent stale parameters
    response.headers.set("Cache-Control", "no-store, max-age=0");
    
    const cookieOpts = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    };
    response.cookies.set("oauth_state", state, cookieOpts);
    response.cookies.set("oauth_tenant", tenant, cookieOpts);
    response.cookies.set("oauth_zendesk_subdomain", subdomain, cookieOpts);
    return response;
  }

  // ── All other plugins: standard Corsair OAuth flow ──────────────────────
  const { url, state } = await generateOAuthUrl(corsair, plugin, {
    tenantId: tenant,
    redirectUri,
  });

  const response = NextResponse.redirect(url);
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  };
  response.cookies.set("oauth_state", state, cookieOpts);
  response.cookies.set("oauth_tenant", tenant, cookieOpts);
  return response;
}

