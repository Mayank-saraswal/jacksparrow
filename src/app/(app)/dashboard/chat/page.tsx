import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardChat } from "../_components/dashboard-chat";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ??
    "there";

  return (
    <div className="min-h-0 flex-1 flex flex-col bg-muted/10 h-full">
      <DashboardChat
        key="new-chat"
        firstName={firstName}
      />
    </div>
  );
}
