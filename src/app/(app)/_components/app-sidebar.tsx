"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@phosphor-icons/react";

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
          
          {/* Spacer to push the bottom links down */}
          <div className="flex-1" />

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
