import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  Tray,
  CalendarBlank,
  UsersThree,
  PlugsConnected,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import { DashboardChat } from "./_components/dashboard-chat";

const QUICK_LINKS = [
  {
    href: "/inbox",
    label: "Inbox",
    desc: "Triaged mail, drafts, and follow-ups",
    icon: Tray,
  },
  {
    href: "/calendar",
    label: "Calendar",
    desc: "Your week, meetings, and invites",
    icon: CalendarBlank,
  },
  {
    href: "/team",
    label: "Team",
    desc: "Shared inboxes and members",
    icon: UsersThree,
  },
  {
    href: "/integrations",
    label: "Integrations",
    desc: "Connect mail, calendar, and tools",
    icon: PlugsConnected,
  },
];

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
        <DashboardChat firstName={firstName} />
      </div>
    </>
  );
}
