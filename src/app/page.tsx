import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CalendarBlank,
  Sparkle,
  MagnifyingGlass,
  ChatCircleDots,
  Check,
  ShieldCheck,
  MoonStars,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { Reveal } from "./_components/reveal";
import { LogoMarquee } from "./_components/logo-marquee";
import { AsciiSignal } from "./_components/ascii-signal";
import { Frame, SectionRule } from "./_components/landing-frame";

const FEATURES = [
  {
    index: 1,
    label: "Triage",
    icon: Sparkle,
    title: "Priority that sorts itself",
    body: "Every email is scored the moment it lands — urgent, important, or noise — so your Important tab only holds what truly matters.",
  },
  {
    index: 2,
    label: "Agent",
    icon: ChatCircleDots,
    title: "An assistant that drafts, never sends",
    body: "Ask it to reply, schedule, or follow up. It drafts the action and waits — nothing leaves your account until you approve it.",
  },
  {
    index: 3,
    label: "Calendar",
    icon: CalendarBlank,
    title: "Mail and calendar, one surface",
    body: "Accept invites from the thread, see your week without leaving the inbox, and book meetings in a keystroke.",
  },
  {
    index: 4,
    label: "Search",
    icon: MagnifyingGlass,
    title: "Find anything, instantly",
    body: "Hybrid search blends semantic recall with live mailbox lookups, so the right thread surfaces in under a second.",
  },
];

const STATS = [
  { value: "+2 hrs", label: "of sleep reclaimed each day" },
  { value: "2×", label: "faster through the inbox" },
  { value: "4 hrs", label: "saved every week" },
];

const FAQS = [
  {
    q: "How does the AI keep me in control?",
    a: "Every write action — sending mail, creating events, RSVPs — becomes a pending action you approve. The assistant can draft, but it can never act on your behalf without a tap.",
  },
  {
    q: "Which accounts can I connect?",
    a: "Gmail, Outlook, and Google Calendar today, connected securely through Corsair with tokens encrypted per user. More integrations land every month.",
  },
  {
    q: "Can I command it from my phone?",
    a: "Yes. Link Telegram or WhatsApp and message the bot — it drafts the same approvable actions and posts confirmation back to the chat.",
  },
  {
    q: "Is it keyboard-first?",
    a: "Completely. A command palette, single-key shortcuts, and an undo stack let you fly through your inbox without touching the mouse.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  const primaryHref = userId ? "/dashboard" : "/sign-up";

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Announcement bar */}
      <div className="mx-auto max-w-[1112px] px-4 pt-3 md:px-14">
        <Reveal>
          <div className="group relative overflow-hidden rounded-[10px] bg-primary px-4 py-2.5 text-center text-[13px] tracking-wide text-primary-foreground">
            <AsciiSignal className="pointer-events-none absolute inset-0 z-0 opacity-20 transition duration-700 group-hover:opacity-40" />
            <div className="relative z-10">
              <span className="opacity-95">
                Introducing your AI chief of staff. It works your inbox so you can
                sleep.{" "}
              </span>
              <Link href={primaryHref} className="font-medium underline">
                Try it now →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Hero */}
      <section className="relative z-0">
        <div className="fc-blueprint pointer-events-none absolute inset-0 z-0 opacity-50" />
        <div className="fc-sunrise pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]" />
        <AsciiSignal className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40 mix-blend-multiply" />

        <Frame className="relative z-10 mx-auto max-w-[1112px]">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-16 text-center sm:pt-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E8] bg-white pl-3 pr-1 py-1 text-sm font-medium text-[#262626] group cursor-pointer hover:border-[rgba(0,0,0,0.2)] transition-colors shadow-sm">
                Sleep more, inbox less
                <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-white group-hover:bg-[#FF4C00] transition-colors shrink-0">
                  <ArrowRight className="h-3 w-3" weight="bold" />
                </div>
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 text-[40px] leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl">
                It works for you and runs your day
                <br className="hidden sm:inline" /> so you can{" "}
                <span className="text-primary">sleep 2 hours more</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-balance text-[15px] text-muted-foreground sm:text-base">
                Mail, calendar, and an AI agent that triages, drafts, and
                schedules across every app you work in. You stay in control —
                nothing sends without your approval. Close the laptop earlier.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={primaryHref}
                  className="bg-[#FF4C00] text-white px-6 h-10 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e64400] transition-colors font-medium shadow-sm text-sm"
                >
                  <MoonStars weight="fill" className="size-4" /> Get more sleep
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-lg bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] px-6 h-10 text-sm font-medium text-[#262626] transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)]"
                >
                  See how it works
                </Link>
              </div>
            </Reveal>
          </div>


        </Frame>
      </section>

      {/* Trusted by */}
      <Frame className="mx-auto max-w-[1112px] border-t border-border">
        <div className="px-6 py-12">
          <p className="mb-6 text-center font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Built for teams who live in their inbox
          </p>
          <LogoMarquee />
        </div>
      </Frame>

      <SectionRule index={1} total={6} title="Main Features" />

      {/* Features */}
      <Frame id="features" className="mx-auto max-w-[1112px]">
        <div className="px-6 py-16">
          <Reveal className="mb-10 text-center">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="text-primary">{"// "}</span>Core
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-4xl">
              Everything your inbox should already do
            </h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.index} delay={i * 80}>
                  <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                    <AsciiSignal className="pointer-events-none absolute inset-0 z-0 opacity-5 transition duration-700 group-hover:opacity-30" />
                    <div className="relative z-10">
                      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                        <span className="text-primary">
                          [ {String(f.index).padStart(2, "0")} /{" "}
                          {String(FEATURES.length).padStart(2, "0")} ]
                        </span>{" "}
                        · {f.label}
                      </p>
                      <span className="mt-3 flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                        <Icon weight="fill" className="size-4" />
                      </span>
                      <h3 className="mt-3 text-base font-semibold tracking-tight">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Frame>

      <SectionRule index={2} total={6} title="Agent" />

      {/* Code / terminal panel */}
      <Frame className="mx-auto max-w-[1112px]">
        <div className="grid items-center gap-8 px-6 py-16 sm:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="text-primary">{"// "}</span>Agent ready
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Command it in plain language
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              From the web, the command palette, or a chat message — describe
              what you want and the agent assembles the actions. Every send and
              event is an approval away, never a surprise.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Reply, forward, and schedule from one prompt",
                "Approve / edit / reject every drafted action",
                "Works in Telegram & WhatsApp too",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check weight="bold" className="size-4 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-xl border border-border bg-[oklch(0.18_0.01_60)] font-mono text-[12px] text-neutral-200 shadow-lg">
              <AsciiSignal className="pointer-events-none absolute inset-0 z-0 opacity-15" />
              <div className="relative z-10 flex items-center gap-2 border-b border-white/10 px-3 py-2 text-neutral-400 backdrop-blur-sm bg-black/20">
                <ChatCircleDots className="size-3.5" /> ask
              </div>
              <pre className="relative z-10 overflow-x-auto p-4 leading-relaxed drop-shadow-md">
                <span className="text-neutral-400">{"> "}</span>
                schedule a call with bob@x.com Thursday 9am{"\n"}
                {"  "}and email him that I look forward to it{"\n\n"}
                <span className="text-primary">drafted 2 actions ✓</span>
                {"\n"}
                {"  "}1. create_event · Thu 09:00 · bob@x.com{"\n"}
                {"  "}2. send_email · bob@x.com{"\n\n"}
                <span className="text-neutral-400">awaiting approval…</span>
              </pre>
            </div>
          </Reveal>
        </div>
      </Frame>

      <SectionRule index={3} total={6} title="Results" />

      {/* Stats */}
      <Frame className="mx-auto max-w-[1112px]">
        <div className="px-6 py-12">
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="group relative overflow-hidden bg-card">
                <AsciiSignal className="pointer-events-none absolute inset-0 z-0 opacity-5 transition duration-700 group-hover:opacity-30" />
                <div className="relative z-10 p-6 text-center">
                  <p className="text-3xl font-medium tracking-tight text-primary drop-shadow-md">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground drop-shadow-sm">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Frame>

      <SectionRule index={4} total={6} title="Testimonials" />

      {/* Testimonials */}
      <Frame className="mx-auto max-w-[1112px]">
        <div className="px-6 py-16">
          <Reveal className="mb-8 text-center">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <span className="text-primary">{"// "}</span>Loved by power users
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-4xl">
              People fly through email again
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                q: "I cleared my inbox before my coffee got cold.",
                by: "@morgan",
              },
              {
                q: "The approval flow means I actually trust the AI.",
                by: "@chrisd",
              },
              { q: "Telegram + inbox is unreasonably good.", by: "@alexr" },
            ].map((t, i) => (
              <Reveal key={t.by} delay={i * 80}>
                <figure className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-5">
                  <AsciiSignal className="pointer-events-none absolute inset-0 z-0 opacity-5 transition duration-500 group-hover:opacity-25" />
                  <div className="relative z-10">
                    <blockquote className="text-sm drop-shadow-sm">
                      &ldquo;{t.q}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground drop-shadow-sm">
                      {t.by}
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Frame>

      <SectionRule index={5} total={6} title="Get Started" />

      {/* CTA */}
      <Frame className="mx-auto max-w-[1112px]">
        <div className="px-6 py-16">
          <Reveal>
            <div className="fc-sunrise relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center">
              <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 opacity-50" />
              <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-card/40 via-card/70 to-card" />
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                <span className="text-primary">{"// "}</span>Get started
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight sm:text-4xl">
                Ready to sleep two hours more?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Connect your mail in a minute. Tokens are encrypted per user and
                nothing sends without your approval.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={primaryHref}
                  className="bg-[#FF4C00] text-white px-6 h-10 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e64400] transition-colors font-medium shadow-sm text-sm"
                >
                  <MoonStars weight="fill" className="size-4" /> Get more sleep
                </Link>
                <Link
                  href="/integrations"
                  className="inline-flex items-center justify-center rounded-lg bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] px-6 h-10 text-sm font-medium text-[#262626] transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)]"
                >
                  Connect accounts
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Frame>

      <SectionRule index={6} total={6} title="FAQ" />

      {/* FAQ */}
      <Frame className="mx-auto max-w-[1112px]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Reveal className="mb-8 text-center">
            <h2 className="text-2xl font-medium tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                  {f.q}
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Frame>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-border">
        <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <div className="mx-auto flex max-w-[1112px] flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/FIRE_SVG_Animated.svg" alt="" className="size-4" />
            Phoenix
          </div>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Tokens encrypted per user ·
            approval-gated actions
          </p>
          <p>© {new Date().getFullYear()} Phoenix</p>
        </div>
      </footer>
    </div>
  );
}
