"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SlackLogo, Lock, CheckCircle } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Org-level connections (shown only inside an active org). Connecting a shared
 * inbox or Slack is admin-only; members see disabled buttons with a hint. All
 * connect links use `?scope=org` so the grant lands under the org tenant.
 */
export function OrgIntegrations() {
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  const current = api.organization.current.useQuery(undefined, {
    retry: false,
  });
  const statusQuery = api.integrations.orgStatus.useQuery(undefined, {
    enabled: !!current.data,
  });

  // No active org → nothing to show here.
  if (current.isError || !current.data) return null;

  const isAdmin = current.data.role === "admin";

  const cards = [
    {
      key: "gmail",
      name: "Shared Gmail inbox",
      description: "Connect support@ or sales@ for the team to triage together.",
      logo: "/logo/gmail.svg",
    },
    {
      key: "outlook",
      name: "Shared Outlook inbox",
      description: "Connect a shared Microsoft mailbox for collaborative triage.",
      logo: "/logo/outlook.svg",
    },
    {
      key: "slack",
      name: "Slack",
      description: "Bring DMs and mentions into your unified stream.",
      logo: null,
    },
    {
      key: "hubspot",
      name: "HubSpot",
      description: "Log threads to contacts and surface deal context. Business+.",
      logo: "/logo/hubspot.svg",
    },
    {
      key: "linear",
      name: "Linear",
      description: "Turn emails into Linear issues. Business+.",
      logo: "/logo/linear.svg",
    },
    {
      key: "jira",
      name: "Jira",
      description: "Turn emails into Jira issues. Business+.",
      logo: "/logo/jira.svg",
    },
    {
      key: "teams",
      name: "Microsoft Teams",
      description:
        "Team chat & channels. Teams meeting links use your connected Microsoft (Outlook) calendar.",
      logo: "/logo/teams.svg",
    },
    {
      key: "zendesk",
      name: "Zendesk",
      description: "Turn shared-inbox threads into Zendesk tickets. Business+.",
      logo: "/logo/zendesk.svg",
    },
    {
      key: "intercom",
      name: "Intercom",
      description: "Reply and triage Intercom conversations from the shared inbox. Business+.",
      logo: "/logo/intercom.svg",
    },
  ] as const;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight text-[#262626]">
        {current.data.name} · team connections
      </h2>
      <p className="mt-1 mb-4 text-sm text-[rgba(0,0,0,0.48)]">
        Shared across your organization.{" "}
        {isAdmin ? "" : "Only admins can connect these."}
      </p>
      <div 
        className="grid gap-1.5 sm:grid-cols-2 p-2 bg-[rgba(0,0,0,0.02)] rounded-[1.25rem] relative"
        onMouseLeave={() => setHoveredCard(null)}
      >
        {cards.map((c) => {
          const status = statusQuery.data?.find((s) => s.plugin === c.key)?.state;
          const connected = status === "connected";

          return (
            <div 
              key={c.key} 
              className="relative z-10"
              onMouseEnter={() => setHoveredCard(c.key)}
            >
              {hoveredCard === c.key && (
                <motion.div
                  layoutId="orgIntegrationHoverBg"
                  className="absolute inset-0 bg-white shadow-sm border border-[#E8E8E8] rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Card className="rounded-xl border-transparent bg-transparent shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm border border-[#E8E8E8]">
                        {c.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.logo}
                            alt=""
                            className="size-full object-contain"
                          />
                        ) : (
                          <SlackLogo className="size-4 text-[#4A154B]" />
                        )}
                      </span>
                      <CardTitle className="text-[#262626]">{c.name}</CardTitle>
                    </div>
                    {connected && (
                      <Badge variant="success">
                        <CheckCircle weight="fill" /> Connected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter>
                  {isAdmin ? (
                    <a
                      href={`/api/integrations/${c.key}/connect?scope=org`}
                      className="inline-flex items-center rounded-md bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] px-3 py-1.5 text-sm font-medium text-[#262626] transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)]"
                    >
                      {connected ? "Reconnect" : "Connect"}
                    </a>
                  ) : (
                    <button
                      disabled
                      title="Admins only"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(0,0,0,0.04)] px-3 py-1.5 text-sm font-medium text-[#262626] border border-transparent opacity-50 pointer-events-none"
                    >
                      <Lock className="size-4" /> Admins only
                    </button>
                  )}
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
