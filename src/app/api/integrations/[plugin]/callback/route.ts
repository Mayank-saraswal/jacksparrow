import { processOAuthCallback } from "corsair/oauth";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { db } from "@/server/db";
import { inngest } from "@/inngest/client";
import { corsair, isSupportedPlugin, parseTenantId } from "@/server/corsair";

/**
 * Completes the OAuth flow. Verifies the state cookie (CSRF) and the tenant
 * cookie (set at connect), exchanges the code via Corsair, then emits the
 * backfill event under the correct tenant. For an org mail connect we also
 * create the SharedInbox row so the team can triage it.
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

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { searchParams } = new URL(request.url);
  const oauthError = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;
  const storedTenant = request.cookies.get("oauth_tenant")?.value;

  const redirectWith = (key: string, value: string) => {
    settingsUrl.searchParams.set(key, value);
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_tenant");
    return response;
  };

  if (oauthError) return redirectWith("error", oauthError);
  if (!code || !state) return redirectWith("error", "missing_code_or_state");
  if (!storedState || storedState !== state) {
    return redirectWith("error", "invalid_state");
  }

  // The tenant was decided (and authorized) at connect time.
  const ref = storedTenant
    ? parseTenantId(storedTenant)
    : { kind: "user" as const, userId };

  // Re-verify org admin on the callback so a swapped cookie can't bind to an
  // org the user can't administer.
  if (ref.kind === "org") {
    const membership = await db.membership.findUnique({
      where: { orgId_userId: { orgId: ref.orgId, userId } },
      select: { role: true },
    });
    if (membership?.role !== "admin") {
      return redirectWith("error", "not_authorized");
    }
  }

  const redirectUri = `${env.APP_URL}/api/integrations/${plugin}/callback`;

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri,
    });

    await inngest.send({
      name: "integration/connected",
      data: {
        clerkUserId: userId,
        plugin: result.plugin,
        tenantKind: ref.kind,
        orgId: ref.kind === "org" ? ref.orgId : undefined,
      },
    });

    // For an org mail connect, register the shared inbox.
    if (
      ref.kind === "org" &&
      (result.plugin === "gmail" || result.plugin === "outlook")
    ) {
      await db.sharedInbox.create({
        data: {
          orgId: ref.orgId,
          name: `${result.plugin} shared inbox`,
          plugin: result.plugin,
          connectedByUserId: userId,
        },
      });
    }

    return redirectWith("connected", result.plugin);
  } catch (err) {
    console.error(`[corsair oauth] callback failed for ${plugin}:`, err);
    return redirectWith("error", "oauth_failed");
  }
}
