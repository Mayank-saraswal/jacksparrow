import "server-only";

import { TRPCError } from "@trpc/server";

import { db } from "@/server/db";
import { audit } from "@/server/audit";
import { decideSsoAccess } from "@/lib/sso-enforce";

/**
 * Org SSO enforcement, called inside `orgProcedure`. When the org has an active
 * SSO connection with `enforceSso`, a non-SSO session is rejected with the typed
 * "sso_required" error (the UI turns this into a re-login screen). Admins on the
 * break-glass allowlist are exempted — and every break-glass use is audited.
 */
export async function enforceSsoForOrg(args: {
  orgId: string;
  userId: string;
  strategy: string | null;
  ip: string | null;
  userAgent: string | null;
}): Promise<void> {
  const conn = await db.ssoConnection.findFirst({
    where: { orgId: args.orgId, status: "active", enforceSso: true },
    select: { breakGlassUserIds: true },
  });
  if (!conn) return; // no enforcing connection → nothing to do

  const decision = decideSsoAccess({
    enforceSso: true,
    strategy: args.strategy,
    breakGlassUserIds: conn.breakGlassUserIds,
    userId: args.userId,
  });

  if (decision.allowed && decision.reason === "break_glass") {
    audit(
      { userId: args.userId, orgId: args.orgId, ip: args.ip, userAgent: args.userAgent },
      "auth.breakglass_used",
      { targetType: "organization", targetId: args.orgId },
    );
    return;
  }

  if (!decision.allowed) {
    throw new TRPCError({ code: "FORBIDDEN", message: "sso_required" });
  }
}
