"use client";

import * as React from "react";
import { TelegramLogo, WhatsappLogo, CheckCircle } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

import { QRCodeSVG } from "qrcode.react";

type Channel = "telegram" | "whatsapp";

const META: Record<Channel, { name: string; icon: React.ReactNode; hint: string }> = {
  telegram: {
    name: "Telegram",
    icon: <TelegramLogo weight="fill" className="size-5" />,
    hint: "Scan the QR code to connect your Telegram account directly, or message /link CODE",
  },
  whatsapp: {
    name: "WhatsApp",
    icon: <WhatsappLogo weight="fill" className="size-5" />,
    hint: "On WhatsApp, send your number the code as a message",
  },
};

export function ChannelLinks() {
  const utils = api.useUtils();
  const links = api.channels.links.useQuery();
  const [codes, setCodes] = React.useState<Record<string, string>>({});

  const createCode = api.channels.createLinkCode.useMutation({
    onSuccess: (data, vars) =>
      setCodes((c) => ({ ...c, [vars.channel]: data.code })),
  });
  const unlink = api.channels.unlink.useMutation({
    onSuccess: () => void utils.channels.links.invalidate(),
  });

  const linkedFor = (channel: Channel) =>
    (links.data ?? []).find((l) => l.channel === channel);

  return (
    <div className="space-y-3">
      {(["telegram", "whatsapp"] as const).map((channel) => {
        const meta = META[channel];
        const linked = linkedFor(channel);
        const code = codes[channel];
        return (
          <div key={channel} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{meta.icon}</span>
                <span className="text-sm font-medium">{meta.name}</span>
              </div>
              {linked ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle weight="fill" /> Connected
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Not connected
                </span>
              )}
            </div>

            {linked ? (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Chat {linked.externalChatId}
                </span>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => unlink.mutate({ channel })}
                  disabled={unlink.isPending}
                >
                  Unlink
                </Button>
              </div>
            ) : code ? (
              <div className="mt-4 flex flex-col items-center justify-center space-y-3 rounded-lg bg-muted/50 p-4">
                {channel === "telegram" && (
                  <div className="rounded-xl bg-white p-2 shadow-sm">
                    <QRCodeSVG
                      value={`https://t.me/hedwigsaibot?start=${code}`}
                      size={140}
                      level="Q"
                      includeMargin={false}
                    />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{meta.hint}</p>
                  <p className="mt-2 font-mono text-xl font-bold tracking-widest text-foreground">
                    {code}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                    Expires in 10 minutes
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => createCode.mutate({ channel })}
                  disabled={createCode.isPending}
                >
                  Generate link code
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
