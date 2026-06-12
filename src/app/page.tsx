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
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "./_components/reveal";
import { LogoMarquee } from "./_components/logo-marquee";
import { AsciiSignal } from "./_components/ascii-signal";

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
  { value: "2×", label: "faster through the inbox" },
  { value: "<300ms", label: "perceived search latency" },
  { value: "4 hrs", label: "saved every week" },
];

const FAQS = [
  {
    q: "How does the AI keep me in control?",
    a: "Every write action — sending mail, creating events, RSVPs — becomes a pending action you approve. The assistant can draft, but it can never act on your behalf without a tap.",
  },
  {
    q: "Which accounts can I connect?",
    a: "Gmail and Google Calendar today, connected securely through Corsair with tokens encrypted per user. More integrations are on the way.",
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
  const primaryHref = userId ? "/inbox" : "/sign-in";

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
          <Reveal>
            <Link
              href="https://blog.superhuman.com"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground uppercase transition hover:border-primary/40 hover:text-foreground"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/FIRE_SVG_Animated.svg" alt="" className="size-3.5" />
              Introducing Jack Sparrow →{" "}
              <span className="text-primary">read more</span>
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
              The inbox that{" "}
              <span className="text-primary">works for you</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
              Mail, calendar, and an AI agent that triages, drafts, and schedules
              — across every app and channel you work in. You stay in control;
              nothing sends without your approval.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  Get Jack Sparrow <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">See how it works</Link>
              </Button>
            </div>
          </Reveal>

          {/* Product mock */}
          <Reveal delay={320} className="mt-14 w-full">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                    { from: "Sarah Lin", subj: "Re: Q3 launch plan", dot: "bg-red-500" },
                    { from: "Stripe", subj: "Your receipt", dot: "bg-muted-foreground/30" },
                    { from: "Antonio", subj: "Lunch Thursday?", dot: "bg-amber-500" },
                  ].map((m) => (
                    <div
                      key={m.subj}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <span className={`size-1.5 rounded-full ${m.dot}`} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{m.from}</p>
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
                      <Sparkle weight="fill" className="size-3" /> Drafted · awaiting
                      approval
                    </p>
                    <p className="mt-1.5 text-xs">
                      Reply to Sarah: &ldquo;I&apos;m in for the Q3 plan — let&apos;s
                      lock Thursday 3pm.&rdquo;
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
      </section>

      {/* Trusted by */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-6 text-center font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Built for teams who live in their inbox
        </p>
        <LogoMarquee />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <Reveal className="mb-10 text-center">
          <SectionLabel index={2} total={6}>
            Core
          </SectionLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            Everything your inbox should already do
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.index} delay={i * 80}>
                <div className="h-full rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <SectionLabel index={f.index} total={FEATURES.length}>
                    {f.label}
                  </SectionLabel>
                  <span className="mt-3 flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon weight="fill" className="size-4" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Code / terminal panel */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <Reveal>
            <SectionLabel index={3} total={6}>
              Agent ready
            </SectionLabel>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Command it in plain language
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              From the web, the command palette, or a chat message — describe what
              you want and the agent assembles the actions. Every send and event is
              an approval away, never a surprise.
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
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="bg-card">
              <div className="p-6 text-center">
                <p className="text-3xl font-bold tracking-tight text-primary">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal className="mb-8 text-center">
          <SectionLabel index={5} total={6}>
            Loved by power users
          </SectionLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
            People fly through email again
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { q: "I cleared my inbox before my coffee got cold.", by: "@morgan" },
            { q: "The approval flow means I actually trust the AI.", by: "@chrisd" },
            { q: "Telegram + inbox is unreasonably good.", by: "@alexr" },
          ].map((t, i) => (
            <Reveal key={t.by} delay={i * 80}>
              <figure className="h-full rounded-xl border border-border bg-card p-5">
                <blockquote className="text-sm">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="mt-3 font-mono text-[11px] text-muted-foreground">
                  {t.by}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal className="mb-8 text-center">
          <SectionLabel index={6} total={6}>
            FAQ
          </SectionLabel>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
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
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center">
            <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 opacity-50" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-card/40 via-card/70 to-card" />
            <SectionLabel index={1} total={1}>
              Get started
            </SectionLabel>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Ready to take back your inbox?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Connect Google in a minute. Your tokens are encrypted per user and
              nothing sends without your approval.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>
                  Get started <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/integrations">Connect accounts</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-border">
        <AsciiSignal className="pointer-events-none absolute inset-0 -z-10 opacity-30" />
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
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
