import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SectionLabel } from "@/components/ui/section-label";
import { ShortcutSettings } from "./_components/shortcut-settings";
import { ChannelLinks } from "./_components/channel-links";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-6">
        <SectionLabel index={1} total={2}>
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

      <header className="mt-10 mb-6">
        <SectionLabel index={2} total={2}>
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
