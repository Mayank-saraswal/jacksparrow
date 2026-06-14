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
