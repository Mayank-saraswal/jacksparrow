import { Reveal } from "./reveal";

const LOGOS = [
  { name: "Shopify", src: "/logo/shopify.png" },
  { name: "Canva", src: "/logo/canva.png" },
  { name: "Replit", src: "/logo/replit.png" },
  { name: "Lovable", src: "/logo/lovable.png" },
  { name: "Gamma", src: "/logo/gamma.png" },
  { name: "Zapier", src: "/logo/zapier.png" },
  { name: "Alibaba", src: "/logo/alibaba.png" },
  { name: "Apple", src: "/logo/apple.png" },
  { name: "Cognism", src: "/logo/cognism.png" },
  { name: "11x", src: "/logo/11x.png" },
];

const LOGOS_REPEATED = [...LOGOS, ...LOGOS, ...LOGOS];

export function TrustedBy() {
  return (
    <div className="w-full border-t border-b border-border/50 bg-neutral-50/50 dark:bg-neutral-950/50 py-10 overflow-hidden relative">
      <Reveal className="mb-8 text-center">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Trusted by top teams
        </p>
      </Reveal>
      
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden marquee-mask">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {LOGOS_REPEATED.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex w-48 shrink-0 items-center justify-center mx-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-50 sm:max-h-50 w-auto object-contain dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
