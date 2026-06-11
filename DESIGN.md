# DESIGN.md: Firecrawl (firecrawl.dev)

## Source
- URL: https://www.firecrawl.dev/
- Capture date: 2026-06-12
- Evidence: rendered page scrape (`.firecrawl/firecrawl-homepage.md`).
- Limitation: the `firecrawl` CLI / `FIRECRAWL_API_KEY` were not available, so the
  structured `branding` tokens and full-page screenshot were not captured.
  Color hex values below are **inferred** from the rendered page and Firecrawl's
  public brand. Layout/components/voice are **observed** from the scrape.

## Design Summary
Firecrawl's site is a clean, developer-first marketing aesthetic: a near-white
canvas, near-black high-contrast type, and a single warm **orange flame** accent
used sparingly for CTAs and highlights. The signature move is **monospace
meta-labels** — small uppercase tags like `[ 01 / 06 ] · MAIN FEATURES` and
`// Developer First //` sitting above bold, tight headings. Content sits in
rounded cards with hairline borders and soft shadows; technical content sits in
dark "terminal" panels. Lots of whitespace, calm density, confident typography.

An agent recreating this should reach for: white/warm-white backgrounds, one
orange accent, monospace labels + numbering, bold short headings, rounded cards
with subtle borders, and dark code panels.

## Design Tokens

### Colors (inferred hex; mapped to oklch in globals.css)
- Brand / primary: `#F9591E` orange flame (CTAs, active states, highlights)
- Primary hover: slightly darker orange `#E24E16`
- Foreground / ink: `#0A0A0A`
- Background: `#FFFFFF` (with very subtly warm off-white sections `#FAFAF8`)
- Muted text: `#6B7280`
- Border: `#E7E5E4` (warm gray, hairline)
- Dark panel (code/terminal): `#0B0B0C` bg with `#E5E5E5` text
- Success: emerald `#10B981`; Warning: amber `#F59E0B`; Destructive: red `#EF4444`

### Typography
- Headings: bold, tight tracking, short. (Firecrawl uses a geometric sans; this
  project standardizes on its existing mono/sans stack — we keep that.)
- Meta-labels: **monospace**, uppercase, small (11–12px), letter-spaced, muted,
  often with `//` delimiters or `[ 01 / 06 ]` numbering.
- Body: regular sans, ~14–16px, relaxed line height, muted-gray for secondary.
- Code: monospace inside dark panels.

### Spacing And Layout
- Centered max-width container (~1100–1200px) with generous side padding.
- Vertical section rhythm is large (py-16 → py-24).
- Radius: medium-large on cards (rounded-xl ≈ 12–16px), pills fully rounded.
- Borders: 1px hairline warm-gray. Shadows: soft, low-opacity.
- Grid: 2–3 column feature/card grids, collapsing to 1 column on mobile.

## Components
- **Buttons**: primary = solid orange, white text, rounded-md, hover darkens;
  secondary = outline (hairline border, transparent bg); link = orange underline.
- **Section label**: mono uppercase tag, optional `NN / NN` index + middot +
  name, or wrapped in `// … //`. Muted color, occasionally orange.
- **Cards**: white bg, hairline border, rounded-xl, soft shadow, padded; title
  (semibold) + description (muted) + action row.
- **Badges/pills**: rounded-full, subtle tinted bg (e.g. emerald/amber/orange at
  ~12% opacity) with matching text; used for status ("All systems normal").
- **Code panel**: dark rounded panel, mono text, small tab row, filename chip.
- **Logo cloud**: muted/greyscale logos in a row under a small caption.

## Page Patterns
- Hero: small eyebrow/announcement pill → big bold headline → one-line subhead →
  primary + secondary CTA → product visual.
- Alternating feature sections, each led by a mono section label.
- Social proof (logo cloud / stats / testimonials) between feature blocks.
- FAQ accordion near the bottom; large "Ready to build?" CTA band before footer.
- Responsive: multi-column → single column; labels and headings stay left-aligned
  (hero may center).

## Content Style
- Confident, concise, developer-direct. Short imperative CTAs ("Start scraping",
  "Get started", "Start for free").
- Headings are punchy fragments, not sentences ("We handle the hard stuff").
- Subheads explain value in one plain line. Numbers/stats called out in mono.

## Agent Build Instructions
1. Theme: white background, near-black text, one orange accent (`#F9591E`).
   Map to the existing shadcn oklch variables (primary + ring = orange).
2. Add a `SectionLabel` component rendering a monospace uppercase tag with an
   optional `NN / NN` index and middot, muted color. Use it above every section
   heading.
3. Headings: bold + tight tracking, short. Subheads: muted, one line.
4. Cards: white, hairline border, `rounded-xl`, soft shadow, generous padding.
5. Buttons: solid-orange primary, outline secondary, rounded-md.
6. Status uses rounded-full pills with tinted backgrounds (emerald/amber/orange).
7. Use dark rounded panels for any code/technical content.
8. Keep generous vertical rhythm and a centered max-width container.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://www.firecrawl.dev/
target_stack: Next.js 15 + Tailwind v4 + shadcn
output: DESIGN.md
