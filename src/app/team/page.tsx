import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SharedInboxApp } from "./_components/shared-inbox-app";

export default async function TeamPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!orgId) redirect("/settings/organization");

  return <SharedInboxApp />;
}
