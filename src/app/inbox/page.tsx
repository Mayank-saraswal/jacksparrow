import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { InboxApp } from "./_components/inbox-app";

export default async function InboxPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <InboxApp />;
}
