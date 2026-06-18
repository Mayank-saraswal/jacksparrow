import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";

import { DashboardChat } from "../../_components/dashboard-chat";

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const conversation = await db.chatConversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (conversation?.userId !== userId) {
    redirect("/dashboard");
  }

  const user = await currentUser();
  const firstName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ??
    "there";

  const initialMessages = conversation.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <DashboardChat
        key={conversation.id}
        firstName={firstName}
        initialMessages={initialMessages}
        conversationId={conversation.id}
      />
    </div>
  );
}
