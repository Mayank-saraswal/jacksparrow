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
  { href: "/dashboard/chat", label: "AI Chat", icon: ChatCircleDots },
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
    <aside id="tour-sidebar" className="hidden w-56 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-5 py-5 mb-2">
        <ChatCircleDots weight="fill" className="size-5 text-primary" />
        <span className="text-sm font-bold tracking-tight text-sidebar-foreground">Workspace</span>
      </div>

      <div className="flex-1 px-3 pb-3 flex flex-col">
        <nav className="flex-1 flex flex-col p-1 bg-black/5 dark:bg-white/5 rounded-xl relative space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : item.href === "/dashboard/chat"
                ? pathname === "/dashboard/chat"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarTabBg"
                    className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10"
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
          <div className="flex-1 overflow-y-auto mt-4 pt-4 border-t border-border flex flex-col gap-1">
            <Link
              href="/dashboard/chat"
              prefetch={true}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-foreground bg-background border border-border shadow-sm hover:bg-accent transition-colors mb-2 mx-1"
            >
              <Plus className="size-4 shrink-0" />
              New AI Chat
            </Link>

            <div className="px-3 mb-1 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Recent Chats</span>
            </div>
            
            <div className="flex flex-col gap-0.5 px-1 max-h-[120px] overflow-y-auto pr-0.5">
              {chatsLoading ? (
                <div className="px-2 py-1.5 text-xs text-muted-foreground animate-pulse">Loading...</div>
              ) : conversations?.length === 0 ? (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">No recent chats</div>
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
            prefetch={true}
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
              isBillingActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isBillingActive && (
              <motion.div
                layoutId="sidebarTabBg"
                className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10"
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
            prefetch={true}
            className={cn(
              "relative flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg z-10 transition-colors",
              isSettingsActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isSettingsActive && (
              <motion.div
                layoutId="sidebarTabBg"
                className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10"
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

      <div className="px-5 py-4 text-[11px] text-muted-foreground border-t border-border">
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
        ? "text-foreground bg-accent"
        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
          className="flex-1 min-w-0 bg-background border border-border rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-primary text-foreground"
        />
      ) : (
        <Link href={`/dashboard/c/${conv.id}`} prefetch={true} className="flex-1 min-w-0 truncate block pr-12">
          {conv.title}
        </Link>
      )}

      {!isRenaming && (
        <div className="absolute right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); setIsRenaming(true); }}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Rename"
          >
            <Pencil className="size-3.5" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); deleteMutation.mutate({ conversationId: conv.id }); }}
            className="text-muted-foreground hover:text-destructive transition-colors"
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
