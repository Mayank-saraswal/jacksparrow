import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { api } from "@/trpc/server";
import { IntegrationsList } from "./_components/integrations-list";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Something went wrong connecting your account. Please try again.",
  invalid_state: "The connection request expired or was tampered with. Please try again.",
  missing_code_or_state: "The provider did not return a valid response. Please try again.",
  access_denied: "You declined the permission request.",
};

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const integrations = await api.integrations.status();

  const params = await searchParams;
  const connected =
    typeof params.connected === "string" ? params.connected : undefined;
  const errorKey = typeof params.error === "string" ? params.error : undefined;
  const errorMessage = errorKey
    ? (ERROR_MESSAGES[errorKey] ?? "Connection failed. Please try again.")
    : undefined;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your accounts to power your inbox.
        </p>
      </header>

      {connected && (
        <div className="mb-4 border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
          {connected} connected successfully.
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      )}

      <IntegrationsList integrations={integrations} />
    </main>
  );
}
