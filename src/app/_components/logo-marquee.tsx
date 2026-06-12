const LOGOS = [
  "shopify",
  "canva",
  "apple",
  "replit",
  "alibaba",
  "phmg",
  "zapier",
  "you",
  "cognism",
  "ada",
  "11x",
  "gamma",
  "lovable",
  "sprinklr",
];

export function LogoMarquee() {
  return (
    <div className="marquee-mask overflow-hidden py-2">
      <div className="flex w-max animate-marquee items-center gap-12 pr-12">
        {[...LOGOS, ...LOGOS].map((name, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${name}-${i}`}
            src={`/logo/${name}.png`}
            alt={name}
            className="h-6 w-auto shrink-0 opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}
