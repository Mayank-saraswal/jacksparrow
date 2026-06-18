import { processOAuthCallback, decodeOAuthState } from "corsair/oauth";
import { initializeAccountDEK } from "corsair/core";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { db } from "@/server/db";
import { inngest } from "@/inngest/client";
import { corsair, isSupportedPlugin, parseTenantId } from "@/server/corsair";

/** Token response shape from Zendesk's /oauth/tokens endpoint. */
interface ZendeskTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

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
    response.cookies.delete("oauth_zendesk_subdomain");
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
    // ── Zendesk: manual token exchange (subdomain-scoped) ────────────────
    if (plugin === "zendesk") {
      const subdomain = request.cookies.get("oauth_zendesk_subdomain")?.value;
      if (!subdomain) {
        return redirectWith("error", "missing_zendesk_subdomain");
      }

      // Verify the state token is valid and extract the tenant info
      const decoded = decodeOAuthState(state, { maxAgeMs: 10 * 60 * 1000 });
      if (!decoded || decoded.plugin !== "zendesk") {
        return redirectWith("error", "invalid_state");
      }
      const tenantId = decoded.tenantId;

      // Get client credentials from Corsair integration-level keys
      const clientId = await corsair.keys.zendesk.get_client_id();
      const clientSecret = await corsair.keys.zendesk.get_client_secret();
      if (!clientId || !clientSecret) {
        return redirectWith("error", "zendesk_credentials_missing");
      }

      // Exchange auth code for access token via Zendesk token endpoint
      const tokenUrl = `https://${encodeURIComponent(subdomain)}.zendesk.com/oauth/tokens`;
      const bodyParams = {
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        scope: "read write",
      };

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyParams),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error(
          `[zendesk oauth] Token exchange failed: ${tokenResponse.status} ${errText}`,
        );
        return redirectWith("error", "token_exchange_failed");
      }

      const tokenData = (await tokenResponse.json()) as ZendeskTokenResponse;
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return redirectWith("error", "no_access_token");
      }

      // Initialize the account DEK (encryption key) for this tenant + plugin
      // This is idempotent — if one already exists it will be reused
      try {
        await initializeAccountDEK(
          corsair as unknown as Parameters<typeof initializeAccountDEK>[0],
          "zendesk",
          tenantId,
          env.CORSAIR_KEK,
        );
      } catch {
        // DEK may already exist, which is fine
      }

      // Ensure the account row exists in the database so we can set keys on it
      const integration = await db.corsairIntegration.findFirst({
        where: { name: "zendesk" },
      });
      if (!integration) {
        return redirectWith("error", "zendesk_integration_missing");
      }

      let account = await db.corsairAccount.findFirst({
        where: { tenantId, integrationId: integration.id },
      });
      if (!account) {
        await db.corsairAccount.create({
          data: {
            id: crypto.randomUUID(),
            tenantId,
            integrationId: integration.id,
          },
        });
      }

      // Store the access_token and subdomain in Corsair encrypted key store
      const tenant = corsair.withTenant(tenantId);
      await tenant.zendesk.keys.set_access_token(accessToken);
      await tenant.zendesk.keys.set_subdomain(subdomain);

      // Emit integration connected event
      await inngest.send({
        name: "integration/connected",
        data: {
          clerkUserId: userId,
          plugin: "zendesk",
          tenantKind: ref.kind,
          orgId: ref.kind === "org" ? ref.orgId : undefined,
        },
      });

      return redirectWith("connected", "zendesk");
    }

    // ── All other plugins: standard Corsair token exchange ───────────────
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
  } catch (err: any) {
    console.error(`[corsair oauth] callback failed for ${plugin}:`, err);
    return redirectWith("error", "oauth_failed&details=" + encodeURIComponent(err?.message || "unknown"));
  }
}

