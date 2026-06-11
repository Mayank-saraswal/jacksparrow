import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Firecrawl-style monospace meta-label, e.g. `[ 01 / 06 ] · MAIN FEATURES`.
 * Sits above section headings.
 */
function SectionLabel({
  index,
  total,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  index?: number
  total?: number
}) {
  const showIndex = typeof index === "number" && typeof total === "number"
  return (
    <span
      data-slot="section-label"
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    >
      {showIndex && (
        <>
          <span className="text-primary">
            [ {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")} ]
          </span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
        </>
      )}
      {children}
    </span>
  )
}

export { SectionLabel }
