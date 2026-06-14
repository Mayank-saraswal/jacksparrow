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
          <div className="relative overflow-hidden rounded-[10px] bg-primary px-4 py-2.5 text-center text-[13px] tracking-wide text-primary-foreground">
            <span className="opacity-95">
              Introducing your AI chief of staff. It works your inbox so you can
              sleep.{" "}
            </span>
            <Link href={primaryHref} className="font-medium underline">
              Try it now →
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="fc-blueprint pointer-events-none absolute inset-0 -z-10" />
        <div className="fc-sunrise pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-40" />

        <Frame className="mx-auto max-w-[1112px]">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-16 pb-16 text-center sm:pt-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 py-1 pr-1 pl-3 text-xs font-medium backdrop-blur">
                Sleep more, inbox less
                <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowRight className="size-2.5" weight="bold" />
                </span>
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
                <Button asChild size="lg" className="fc-cta rounded-[10px]">
                  <Link href={primaryHref}>
                    <MoonStars weight="fill" /> Get more sleep
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-[10px]"
                >
                  <Link href="#features">See how it works</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Product mock */}
          <div className="border-t border-border px-4 pt-10 pb-12 sm:px-10">
            <Reveal delay={320}>
              <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                  <span className="size-2.5 rounded-full bg-destructive/40" />
                  <span className="size-2.5 rounded-full bg-amber-400/50" />
                  <span className="size-2.5 rounded-full bg-emerald-400/50" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                    jacksparrow / inbox
                  </span>
                </div>
                <div className="grid gap-px bg-border sm:grid-cols-[1fr_1.3fr]">
                  <div className="space-y-2 bg-background p-3 text-left">
                    {[
                      {
                        from: "Sarah Lin",
                        subj: "Re: Q3 launch plan",
                        dot: "bg-red-500",
                      },
                      {
                        from: "Stripe",
                        subj: "Your receipt",
                        dot: "bg-muted-foreground/30",
                      },
                      {
                        from: "Antonio",
                        subj: "Lunch Thursday?",
                        dot: "bg-amber-500",
                      },
                    ].map((m) => (
                      <div
                        key={m.subj}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                      >
                        <span className={`size-1.5 rounded-full ${m.dot}`} />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {m.from}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {m.subj}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-background p-3 text-left">
                    <div className="rounded-lg bg-accent/50 p-2.5">
                      <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-primary uppercase">
                        <Sparkle weight="fill" className="size-3" /> Drafted ·
                        awaiting approval
                      </p>
                      <p className="mt-1.5 text-xs">
                        Reply to Sarah: &ldquo;I&apos;m in for the Q3 plan —
                        let&apos;s lock Thursday 3pm.&rdquo;
                      </p>
                      <div className="mt-2 flex gap-1.5">
                        <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                          Approve
                        </span>
                        <span className="rounded-md border border-border px-2 py-0.5 text-[10px]">
                          Edit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
                  <div className="h-full rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
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
            <div className="overflow-hidden rounded-xl border border-border bg-[oklch(0.18_0.01_60)] font-mono text-[12px] text-neutral-200 shadow-lg">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-neutral-400">
                <ChatCircleDots className="size-3.5" /> ask
              </div>
              <pre className="overflow-x-auto p-4 leading-relaxed">
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
              <Reveal key={s.label} delay={i * 80} className="bg-card">
                <div className="p-6 text-center">
                  <p className="text-3xl font-medium tracking-tight text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
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
                <figure className="h-full rounded-xl border border-border bg-card p-5">
                  <blockquote className="text-sm">
                    &ldquo;{t.q}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground">
                    {t.by}
                  </figcaption>
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
                <Button asChild size="lg" className="fc-cta rounded-[10px]">
                  <Link href={primaryHref}>
                    <MoonStars weight="fill" /> Get more sleep
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-[10px]"
                >
                  <Link href="/integrations">Connect accounts</Link>
                </Button>
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
            Jack Sparrow
          </div>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" /> Tokens encrypted per user ·
            approval-gated actions
          </p>
          <p>© {new Date().getFullYear()} Jack Sparrow</p>
        </div>
      </footer>
    </div>
  );
}
