"use client";

import * as React from "react";

const CHARS = ["+", ":", "-", "=", "x", "X", "."] as const;
const CELL = 14;

interface Glyph {
  gx: number;
  gy: number;
  char: string;
  seed: number;
}

function smoothstep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]!;
}

/**
 * Animated ASCII "signal" background — orange glyphs glow as two waves sweep
 * across the grid. Sizes itself to its (relative-positioned) parent and stops
 * on prefers-reduced-motion.
 */
export function AsciiSignal({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;

    let cols = 0;
    let rows = 0;
    let glyphs: Glyph[] = [];
    let raf = 0;

    const resize = () => {
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      glyphs = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          glyphs.push({ gx: x, gy: y, char: randomChar(), seed: Math.random() * 1000 });
        }
      }
    };

    const draw = (timeMs: number) => {
      const time = timeMs * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const wave = (time * 0.5) % 1;

      for (const g of glyphs) {
        const px = g.gx * CELL + CELL / 2;
        const py = g.gy * CELL + CELL / 2;
        const nx = px / canvas.width;
        const ny = py / canvas.height;
        const band = 0.5 + 0.5 * Math.sin(ny * 10 + g.seed + time * 2);
        const leftGlow = 1 - smoothstep(0, 0.18, Math.abs(nx - wave));
        const rightGlow = 1 - smoothstep(0, 0.18, Math.abs(1 - nx - wave));
        const intensity = Math.max(leftGlow, rightGlow) * band;
        if (intensity < 0.02) continue;
        ctx.fillStyle = `rgba(161,85,0,${intensity * 0.9})`;
        if (Math.random() < 0.015) g.char = randomChar();
        ctx.fillText(g.char, px, py);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
