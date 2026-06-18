import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { DashboardChat } from "./_components/dashboard-chat";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ??
    "there";

  return (
    <>
      {/* Assistant — reuses the existing /api/chat agent path */}
      <div className="min-h-0 flex-1 flex flex-col">
        <DashboardChat key="new-chat" firstName={firstName} />
      </div>
    </>
  );
}
