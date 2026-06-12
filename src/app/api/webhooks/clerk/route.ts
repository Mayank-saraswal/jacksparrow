import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse, type NextRequest } from "next/server";

import { inngest } from "@/inngest/client";

/**
 * Clerk webhook receiver for organization + membership sync.
 *
 * We verify the Svix signature with Clerk's official `verifyWebhook` helper
 * (uses CLERK_WEBHOOK_SECRET), then hand off to Inngest and return 200 fast.
 * The Inngest functions do idempotent upserts keyed by Clerk ids.
 */

function normalizeRole(role: string | undefined): "admin" | "member" {
  // Clerk roles look like "org:admin" / "org:member".
  return role?.endsWith("admin") ? "admin" : "member";
}

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const type = evt.type;
  const data = evt.data as unknown as Record<string, unknown>;

  try {
    if (type.startsWith("organization.")) {
      await inngest.send({
        name: "clerk/org.sync",
        data: {
          eventType: type,
          id: String(data.id),
          name: typeof data.name === "string" ? data.name : undefined,
        },
      });
    } else if (type.startsWith("organizationMembership.")) {
      const org = data.organization as { id?: string } | undefined;
      const publicUser = data.public_user_data as
        | { user_id?: string }
        | undefined;
      const orgId = org?.id;
      const userId = publicUser?.user_id;
      if (orgId && userId) {
        await inngest.send({
          name: "clerk/membership.sync",
          data: {
            eventType: type,
            orgId,
            userId,
            role: normalizeRole(
              typeof data.role === "string" ? data.role : undefined,
            ),
          },
        });
      }
    }
  } catch (err) {
    console.error("[clerk webhook] dispatch failed:", err);
    // Still 200 so Clerk doesn't hammer retries on a transient enqueue error;
    // Clerk will resend on non-2xx, and our handlers are idempotent anyway.
  }

  return NextResponse.json({ received: true });
}
