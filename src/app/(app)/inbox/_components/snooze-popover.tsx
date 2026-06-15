"use client";

import * as React from "react";
import { Clock } from "@phosphor-icons/react";

import { computeSnoozePresets } from "@/lib/snooze-presets";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Snooze menu: standard presets (computed in the browser's tz) plus a custom
 * date/time input. Emits the chosen wake instant as an ISO string.
 */
export function SnoozePopover({
  children,
  onSnooze,
}: {
  children: React.ReactNode;
  onSnooze: (isoUtc: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [custom, setCustom] = React.useState("");

  const tz = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );
  const presets = React.useMemo(
    () => computeSnoozePresets(new Date(), tz),
    [tz],
  );

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));

  const pick = (iso: string) => {
    onSnooze(iso);
    setOpen(false);
    setCustom("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="px-2 py-1.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          <Clock className="mr-1 inline size-3" /> Snooze until
        </p>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => pick(p.at)}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
          >
            <span>{p.label}</span>
            <span className="text-xs text-muted-foreground">{fmt(p.at)}</span>
          </button>
        ))}
        <div className="mt-1 border-t border-border p-2">
          <label className="mb-1 block text-xs text-muted-foreground">
            Pick a date &amp; time
          </label>
          <input
            type="datetime-local"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1 text-sm outline-none"
          />
          <button
            disabled={!custom}
            onClick={() => {
              const d = new Date(custom);
              if (!Number.isNaN(d.getTime())) pick(d.toISOString());
            }}
            className="mt-1.5 w-full rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            Snooze
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
