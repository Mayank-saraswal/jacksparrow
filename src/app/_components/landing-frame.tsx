import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Small "+" corner mark used throughout the Firecrawl-style reference design.
 * Rendered as a thin SVG cross so it stays crisp at any zoom.
 */
function PlusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-2.5 text-border",
        className,
      )}
    >
      <path
        d="M6 0v12M0 6h12"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Bordered blueprint container with a "+" mark in each corner — the recurring
 * frame from the reference landing page. Vertical rails come from `fc-rails`.
 */
export function Frame({
  children,
  className,
  corners = true,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  corners?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={cn("fc-rails relative", className)}>
      {corners && (
        <>
          <PlusMark className="-top-[5px] -left-[5px]" />
          <PlusMark className="-top-[5px] -right-[5px]" />
          <PlusMark className="-bottom-[5px] -left-[5px]" />
          <PlusMark className="-right-[5px] -bottom-[5px]" />
        </>
      )}
      {children}
    </div>
  );
}

/**
 * Numbered section divider matching the reference, e.g.
 * `│  [ 01 / 06 ]  ·  MAIN FEATURES`.
 */
export function SectionRule({
  index,
  total,
  title,
}: {
  index: number;
  total: number;
  title: string;
}) {
  return (
    <div className="relative border-y border-border">
      <div className="mx-auto flex max-w-[1112px] items-center gap-3 px-4 py-5 md:px-14">
        <span className="h-4 w-0.5 shrink-0 bg-primary" aria-hidden="true" />
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground/60">
          [{" "}
          <span className="text-primary">{String(index).padStart(2, "0")}</span>{" "}
          / {String(total).padStart(2, "0")} ]
        </span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground/40 uppercase">
          {title}
        </span>
      </div>
    </div>
  );
}
