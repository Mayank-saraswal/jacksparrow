import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { ShortcutSettings } from "./_components/shortcut-settings";
import { ChannelLinks } from "./_components/channel-links";
import { GeneralSettings } from "./_components/general-settings";
import { SplitSettings } from "./_components/split-settings";
import { WritingStyleSettings } from "./_components/writing-style-settings";
import { TriageSettings } from "./_components/triage-settings";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel index={1} total={6}>
          Settings
        </SectionLabel>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">
          Command channels
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect Telegram or WhatsApp to command your inbox from chat.
        </p>
      </header>
      <ChannelLinks />

      <header id="writing-style" className="mt-10 mb-6 scroll-mt-16">
        <SectionLabel index={2} total={6}>
          Settings
        </SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">Writing style</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          AI drafts mimic your voice using samples from your sent mail.
        </p>
      </header>
      <WritingStyleSettings />

      <header id="triage" className="mt-10 mb-6 scroll-mt-16">
        <SectionLabel index={3} total={6}>
          Settings
        </SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Learned triage
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Senders Hedwigs has learned to prioritise or mute for you.
        </p>
      </header>
      <TriageSettings />

      <header id="general" className="mt-10 mb-6 scroll-mt-16">
        <SectionLabel index={4} total={6}>
          Settings
        </SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Sending &amp; follow-ups
        </h2>
      </header>
      <GeneralSettings />

      <header id="splits" className="mt-10 mb-6 scroll-mt-16">
        <SectionLabel index={5} total={6}>
          Settings
        </SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">Split inbox</h2>
      </header>
      <SplitSettings />

      <header className="mt-10 mb-6">
        <SectionLabel index={6} total={6}>
          Settings
        </SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Keyboard shortcuts
        </h2>
      </header>
      <ShortcutSettings />
    </main>
  );
}
