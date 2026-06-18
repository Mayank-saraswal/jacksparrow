"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  SquaresFour,
  Tray,
  CalendarBlank,
  UsersThree,
  PlugsConnected,
  GearSix,
  ChatCircleDots,
  CreditCard,
  Plus,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/inbox", label: "Inbox", icon: Tray },
  { href: "/calendar", label: "Calendar", icon: CalendarBlank },
  { href: "/team", label: "Team", icon: UsersThree },
  { href: "/integrations", label: "Integrations", icon: PlugsConnected },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isSettingsActive = pathname.startsWith("/settings") && pathname !== "/settings/billing";
  const isBillingActive = pathname === "/settings/billing";

  const { data: conversations, isLoading: chatsLoading } = api.chat.getConversations.useQuery();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-[#F9F9F9] md:flex">
      <div className="flex items-center gap-2 px-5 py-5 mb-2">
        <ChatCircleDots weight="fill" className="size-5 text-[#FF4C00]" />
        <span className="text-sm font-bold tracking-tight text-[#262626]">Workspace</span>
      </div>

      <div className="flex-1 px-3 pb-3 flex flex-col">
        <nav className="flex-1 flex flex-col p-1 bg-[rgba(0,0,0,0.04)] rounded-xl relative space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
                  active
                    ? "text-[#262626]"
                    : "text-[rgba(0,0,0,0.48)] hover:text-[#262626]"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarTabBg"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon
                  weight={active ? "fill" : "regular"}
                  className="size-4 shrink-0"
                />
                {item.label}
              </Link>
            );
          })}

          {/* Chat History Section */}
          <div className="flex-1 overflow-y-auto mt-4 pt-4 border-t border-[rgba(0,0,0,0.05)] flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[#262626] bg-white border border-[#E8E8E8] shadow-sm hover:bg-gray-50 transition-colors mb-2 mx-1"
            >
              <Plus className="size-4 shrink-0" />
              New AI Chat
            </Link>

            <div className="px-3 mb-1 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[rgba(0,0,0,0.48)]">Recent Chats</span>
            </div>
            
            <div className="flex flex-col gap-0.5 px-1 max-h-[120px] overflow-y-auto pr-0.5">
              {chatsLoading ? (
                <div className="px-2 py-1.5 text-xs text-muted-foreground animate-pulse">Loading...</div>
              ) : conversations?.length === 0 ? (
                <div className="px-2 py-1.5 text-xs text-[rgba(0,0,0,0.48)]">No recent chats</div>
              ) : (
                conversations?.map((conv) => {
                  const isActive = pathname === `/dashboard/c/${conv.id}`;
                  return (
                    <ChatItem key={conv.id} conv={conv} isActive={isActive} />
                  );
                })
              )}
            </div>
          </div>

          <Link
            href="/settings/billing"
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
              isBillingActive
                ? "text-[#262626]"
                : "text-[rgba(0,0,0,0.48)] hover:text-[#262626]"
            )}
          >
            {isBillingActive && (
              <motion.div
                layoutId="sidebarTabBg"
                className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <CreditCard
              weight={isBillingActive ? "fill" : "regular"}
              className="size-4 shrink-0"
            />
            Billing
          </Link>
          <Link
            href="/settings"
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
              isSettingsActive
                ? "text-[#262626]"
                : "text-[rgba(0,0,0,0.48)] hover:text-[#262626]"
            )}
          >
            {isSettingsActive && (
              <motion.div
                layoutId="sidebarTabBg"
                className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <GearSix
              weight={isSettingsActive ? "fill" : "regular"}
              className="size-4 shrink-0"
            />
            Settings
          </Link>
        </nav>
      </div>

      <div className="px-5 py-4 text-[11px] text-[rgba(0,0,0,0.48)] border-t border-[rgba(0,0,0,0.05)]">
        <p className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" /> All systems
          synced
        </p>
      </div>
    </aside>
  );
}

function ChatItem({ conv, isActive }: { conv: { id: string; title: string }; isActive: boolean }) {
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [title, setTitle] = React.useState(conv.title);
  const utils = api.useUtils();
  const router = useRouter();

  const renameMutation = api.chat.renameConversation.useMutation({
    onSuccess: () => void utils.chat.getConversations.invalidate(),
  });
  
  const deleteMutation = api.chat.deleteConversation.useMutation({
    onSuccess: () => {
      void utils.chat.getConversations.invalidate();
      if (isActive) router.push("/dashboard");
    },
  });

  const handleRename = () => {
    if (title.trim() && title !== conv.title) {
      renameMutation.mutate({ conversationId: conv.id, title: title.trim() });
    }
    setIsRenaming(false);
  };

  return (
    <div className={cn(
      "group relative flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md transition-colors",
      isActive 
        ? "text-[#262626] bg-[rgba(0,0,0,0.06)]"
        : "text-[rgba(0,0,0,0.6)] hover:text-[#262626] hover:bg-[rgba(0,0,0,0.04)]"
    )}>
      {isRenaming ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setTitle(conv.title);
              setIsRenaming(false);
            }
          }}
          className="flex-1 min-w-0 bg-white border border-[#E8E8E8] rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-[#FF4C00] text-[#262626]"
        />
      ) : (
        <Link href={`/dashboard/c/${conv.id}`} className="flex-1 min-w-0 truncate block pr-12">
          {conv.title}
        </Link>
      )}

      {!isRenaming && (
        <div className="absolute right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); setIsRenaming(true); }}
            className="text-[rgba(0,0,0,0.4)] hover:text-[#FF4C00] transition-colors"
            title="Rename"
          >
            <Pencil className="size-3.5" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); deleteMutation.mutate({ conversationId: conv.id }); }}
            className="text-[rgba(0,0,0,0.4)] hover:text-red-500 transition-colors"
            title="Delete"
            disabled={deleteMutation.isPending}
          >
            <Trash className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
