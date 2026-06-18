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

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]!;
}

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
    
    // Mouse tracking for flashlight effect
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHovering = true;
    };
    
    const onMouseLeave = () => {
      isHovering = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

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
      
      if (!isHovering) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const rect = canvas.getBoundingClientRect();
      const localX = mouseX - rect.left;
      const localY = mouseY - rect.top;

      for (const g of glyphs) {
        const px = g.gx * CELL + CELL / 2;
        const py = g.gy * CELL + CELL / 2;
        
        const dx = px - localX;
        const dy = py - localY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const radius = 180; // Size of the flashlight
        
        if (dist > radius) continue;
        
        const intensity = 1 - (dist / radius);
        const band = 0.5 + 0.5 * Math.sin(g.seed + time * 5);
        const finalIntensity = intensity * band;

        if (finalIntensity < 0.05) continue;
        
        // Gray color
        ctx.fillStyle = `rgba(160, 160, 160, ${finalIntensity})`;
        
        if (Math.random() < 0.05) g.char = randomChar();
        ctx.fillText(g.char, px, py);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
