"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Tray,
  CalendarBlank,
  UsersThree,
  PlugsConnected,
  GearSix,
  ChatCircleDots,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/inbox", label: "Inbox", icon: Tray },
  { href: "/calendar", label: "Calendar", icon: CalendarBlank },
  { href: "/team", label: "Team", icon: UsersThree },
  { href: "/integrations", label: "Integrations", icon: PlugsConnected },
  { href: "/settings", label: "Settings", icon: GearSix },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
      <div className="flex items-center gap-2 px-4 py-4">
        <ChatCircleDots weight="fill" className="size-5 text-primary" />
        <span className="text-sm font-semibold tracking-tight">Workspace</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-2">
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
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                weight={active ? "fill" : "regular"}
                className="size-4 shrink-0"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 text-[11px] text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" /> All systems
          synced
        </p>
      </div>
    </aside>
  );
}
