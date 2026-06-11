import "server-only";

import { auth } from "@clerk/nextjs/server";

/**
 * Returns the Clerk user id of the signed-in user, which we use as the Corsair
 * tenant id. Returns null when there is no authenticated session.
 *
 * Always read the tenant id from the session like this — never from a request
 * query parameter — so a caller cannot bind an OAuth grant to another user.
 */
export async function getSessionTenantId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}
