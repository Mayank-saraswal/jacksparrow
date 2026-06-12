"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Lightweight inline-SVG charts — no charting library. Themed with the
 * chart-1..5 tokens. Line + bar with axes and a hover tooltip. Kept compact;
 * good enough for the analytics dashboard.
 */

export interface Series {
  label: string;
  points: { x: string; y: number }[];
  colorVar?: string; // e.g. "--chart-1"
}

const W = 640;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 36 };

function niceMax(values: number[]): number {
  const max = Math.max(1, ...values);
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / pow) * pow;
}

export function LineChart({ series }: { series: Series[] }) {
  const [hover, setHover] = React.useState<{ i: number; label: string; vals: string[] } | null>(
    null,
  );
  const xs = series[0]?.points.map((p) => p.x) ?? [];
  const allY = series.flatMap((s) => s.points.map((p) => p.y));
  const maxY = niceMax(allY);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xStep = xs.length > 1 ? innerW / (xs.length - 1) : innerW;

  const px = (i: number) => PAD.left + i * xStep;
  const py = (v: number) => PAD.top + innerH - (v / maxY) * innerH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
        {/* Y gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + innerH * (1 - f)}
              y2={PAD.top + innerH * (1 - f)}
              className="stroke-border"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={PAD.top + innerH * (1 - f) + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[9px]"
            >
              {Math.round(maxY * f)}
            </text>
          </g>
        ))}
        {/* Lines */}
        {series.map((s, si) => (
          <polyline
            key={s.label}
            fill="none"
            strokeWidth={2}
            stroke={`var(${s.colorVar ?? `--chart-${(si % 5) + 1}`})`}
            points={s.points.map((p, i) => `${px(i)},${py(p.y)}`).join(" ")}
          />
        ))}
        {/* X labels (sparse) */}
        {xs.map((x, i) =>
          i % Math.ceil(xs.length / 6 || 1) === 0 ? (
            <text
              key={x}
              x={px(i)}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              {x.slice(5)}
            </text>
          ) : null,
        )}
        {/* Hover hit areas */}
        {xs.map((x, i) => (
          <rect
            key={`hit-${x}`}
            x={px(i) - xStep / 2}
            y={PAD.top}
            width={xStep}
            height={innerH}
            fill="transparent"
            onMouseEnter={() =>
              setHover({
                i,
                label: x,
                vals: series.map((s) => `${s.label}: ${s.points[i]?.y ?? 0}`),
              })
            }
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute rounded border border-border bg-popover px-2 py-1 text-[10px] shadow"
          style={{ left: `${(px(hover.i) / W) * 100}%`, top: 4 }}
        >
          <p className="font-medium">{hover.label}</p>
          {hover.vals.map((v) => (
            <p key={v} className="text-muted-foreground">
              {v}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function BarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const maxY = niceMax(data.map((d) => d.value));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const bw = innerW / Math.max(1, data.length);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {data.map((d, i) => {
        const h = (d.value / maxY) * innerH;
        return (
          <g key={d.label}>
            <rect
              x={PAD.left + i * bw + bw * 0.15}
              y={PAD.top + innerH - h}
              width={bw * 0.7}
              height={h}
              fill={`var(--chart-${(i % 5) + 1})`}
              rx={2}
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            <text
              x={PAD.left + i * bw + bw / 2}
              y={H - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function StatCard({
  label,
  value,
  deltaPct,
}: {
  label: string;
  value: number | string;
  deltaPct?: number;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {deltaPct !== undefined && (
        <p
          className={cn(
            "text-[11px]",
            deltaPct >= 0 ? "text-emerald-500" : "text-destructive",
          )}
        >
          {deltaPct >= 0 ? "▲" : "▼"} {Math.abs(deltaPct)}% vs prev
        </p>
      )}
    </div>
  );
}
