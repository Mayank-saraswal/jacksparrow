import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { AiFeed } from "./_components/ai-feed";

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
    <div className="flex h-full flex-col overflow-y-auto bg-muted/10 p-4 md:p-8">
      <div className="mx-auto w-full max-w-3xl pb-8 text-center mt-4">
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-foreground drop-shadow-sm">
          Good morning, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is your AI Chief of Staff briefing for today.
        </p>
      </div>

      <AiFeed />
    </div>
  );
}
