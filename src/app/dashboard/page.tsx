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

import { DashboardSidebar } from "./_components/dashboard-sidebar";
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
    <div className="flex h-[calc(100vh-3rem)]">
      <DashboardSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Quick-access strip */}
        <div className="border-b border-border px-4 py-3">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon weight="fill" className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-medium">
                      {q.label}
                      <ArrowRight className="size-3 opacity-0 transition group-hover:opacity-100" />
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {q.desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Assistant — reuses the existing /api/chat agent path */}
        <div className="min-h-0 flex-1">
          <DashboardChat firstName={firstName} />
        </div>
      </main>
    </div>
  );
}
