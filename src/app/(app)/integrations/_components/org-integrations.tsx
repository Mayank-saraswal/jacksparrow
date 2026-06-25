"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  SlackLogo,
  Lock,
  CheckCircle,
  ArrowsClockwise,
  CircleNotch,
} from "@phosphor-icons/react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const BACKFILL_PLUGINS = ["gmail", "outlook"] as const;
type OrgBackfillPlugin = (typeof BACKFILL_PLUGINS)[number];

function isOrgBackfillPlugin(p: string): p is OrgBackfillPlugin {
  return (BACKFILL_PLUGINS as readonly string[]).includes(p);
}

function formatSyncedAt(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function ZendeskConnectButton({ connected }: { connected: boolean }) {
  const [subdomain, setSubdomain] = React.useState("");
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800">
          {connected ? "Reconnect" : "Connect"}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Zendesk</DialogTitle>
          <DialogDescription>
            Enter your Zendesk subdomain. For example, if your Zendesk URL is <strong>https://acme.zendesk.com</strong>, enter <strong>acme</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={subdomain} 
            onChange={(e) => setSubdomain(e.target.value)} 
            placeholder="acme" 
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && subdomain.trim()) {
                window.location.href = `/api/integrations/zendesk/connect?scope=org&subdomain=${encodeURIComponent(subdomain.trim())}&t=${Date.now()}`;
              }
            }}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <a
            href={subdomain.trim() ? `/api/integrations/zendesk/connect?scope=org&subdomain=${encodeURIComponent(subdomain.trim())}&t=${Date.now()}` : "#"}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${subdomain.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground pointer-events-none opacity-50'}`}
          >
            Continue
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Org-level connections (shown only inside an active org). Connecting a shared
 * inbox or Slack is admin-only; members see disabled buttons with a hint. All
 * connect links use `?scope=org` so the grant lands under the org tenant.
 */
export function OrgIntegrations() {
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  const utils = api.useUtils();
  const current = api.organization.current.useQuery(undefined, {
    retry: false,
  });
  const statusQuery = api.integrations.orgStatus.useQuery(undefined, {
    enabled: !!current.data,
  });

  // Poll org sync status to detect resync progress (mirrors personal flow).
  const syncQuery = api.integrations.getOrgSyncStatus.useQuery(undefined, {
    enabled: !!current.data,
    refetchInterval: (query) => {
      const sync = query.state.data;
      const statuses = statusQuery.data;
      if (!sync || !statuses) return 2500;
      const anySyncing = statuses.some(
        (s) =>
          s.state === "connected" &&
          isOrgBackfillPlugin(s.plugin) &&
          sync[s.plugin].backfilledAt == null,
      );
      return anySyncing ? 2500 : false;
    },
  });

  const orgResync = api.integrations.orgResync.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.integrations.getOrgSyncStatus.invalidate(),
        utils.integrations.orgStatus.invalidate(),
      ]);
    },
  });

  // No active org → nothing to show here.
  if (current.isError || !current.data) return null;

  const isAdmin = current.data.role === "admin";
  const sync = syncQuery.data;

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
      comingSoon: true,
    },
    {
      key: "linear",
      name: "Linear",
      description: "Turn emails into Linear issues. Business+.",
      logo: "/logo/linear.webp",
    },
    {
      key: "jira",
      name: "Jira",
      description: "Turn emails into Jira issues. Business+.",
      logo: "/logo/jira.png",
    },
    {
      key: "teams",
      name: "Microsoft Teams",
      description:
        "Team chat & channels. Teams meeting links use your connected Microsoft (Outlook) calendar.",
      logo: "/logo/microsoft-teams.png",
    },
    {
      key: "zendesk",
      name: "Zendesk",
      description: "Turn shared-inbox threads into Zendesk tickets. Business+.",
      logo: "/logo/zendesk-icon.svg",
    },
    {
      key: "intercom",
      name: "Intercom",
      description: "Reply and triage Intercom conversations from the shared inbox. Business+.",
      logo: "/logo/intercom.png",
      comingSoon: true,
    },
  ] as const;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight text-[#262626] dark:text-neutral-200">
        {current.data.name} · team connections
      </h2>
      <p className="mt-1 mb-4 text-sm text-[rgba(0,0,0,0.48)] dark:text-neutral-400">
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
          const backfillCapable = isOrgBackfillPlugin(c.key);
          const backfilledAt =
            backfillCapable && sync ? sync[c.key].backfilledAt : null;
          // Syncing = connected + backfill-capable + timestamp is null
          const syncing = connected && backfillCapable && backfilledAt == null;
          // Synced = connected + (not backfill-capable OR timestamp is set)
          const synced = connected && (!backfillCapable || backfilledAt != null);
          const isResyncing = orgResync.isPending && orgResync.variables?.plugin === c.key;

          return (
            <div 
              key={c.key} 
              className="relative z-10"
              onMouseEnter={() => setHoveredCard(c.key)}
            >
              {hoveredCard === c.key && (
                <motion.div
                  layoutId="orgIntegrationHoverBg"
                  className="absolute inset-0 bg-neutral-900/60 shadow-sm border border-neutral-800/50 rounded-xl -z-10"
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
                      <CardTitle className="text-[#262626] dark:text-neutral-200 flex items-center gap-2">
                        {c.name}
                        {("comingSoon" in c && c.comingSoon) && (
                          <Badge variant="outline" className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted/50">
                            Coming soon
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    {synced && (
                      <Badge variant="success">
                        <CheckCircle weight="fill" /> Connected
                      </Badge>
                    )}
                    {syncing && (
                      <Badge variant="secondary" className="bg-[rgba(0,0,0,0.04)] dark:bg-neutral-800 text-[#262626] dark:text-neutral-300 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-neutral-700">
                        <CircleNotch className="animate-spin mr-1" /> Syncing
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {syncing ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CircleNotch className="size-3.5 animate-spin text-[#262626] dark:text-neutral-300" />
                      Syncing your inbox… this runs in the background.
                    </p>
                  ) : synced ? (
                    <p className="text-xs text-muted-foreground">
                      Last synced {formatSyncedAt(backfilledAt)}.
                    </p>
                  ) : null}
                </CardContent>

                <CardFooter className="gap-2">
                  {isAdmin ? (
                    <>
                      {c.key === "zendesk" ? (
                        <ZendeskConnectButton connected={connected} />
                      ) : (
                        <a
                          href={("comingSoon" in c && c.comingSoon) ? "#" : `/api/integrations/${c.key}/connect?scope=org`}
                          className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors border ${
                            ("comingSoon" in c && c.comingSoon)
                              ? "bg-[rgba(0,0,0,0.02)] dark:bg-white/5 text-muted-foreground opacity-50 cursor-not-allowed border-transparent pointer-events-none"
                              : "bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 text-[#262626] dark:text-neutral-200 border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800"
                          }`}
                        >
                          {connected ? "Reconnect" : "Connect"}
                        </a>
                      )}
                      {connected && backfillCapable && (
                        <button
                          disabled={syncing || isResyncing}
                          onClick={() => {
                            if (c.key === "gmail" || c.key === "outlook") {
                              orgResync.mutate({ plugin: c.key });
                            }
                          }}
                          className={
                            "inline-flex items-center gap-1.5 rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800 " +
                            (syncing || isResyncing ? "opacity-50 pointer-events-none" : "")
                          }
                        >
                          <ArrowsClockwise
                            className={syncing || isResyncing ? "animate-spin" : ""}
                          />
                          Resync
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      disabled
                      title="Admins only"
                      className="inline-flex items-center gap-1.5 rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 border border-transparent opacity-50 pointer-events-none"
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
