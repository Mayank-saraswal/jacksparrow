import { CreateOrganization } from "@clerk/nextjs";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#262626]">
          Welcome to Jack Sparrow
        </h1>
        <p className="mt-2 text-muted-foreground">
          Let&apos;s create a workspace for your team to get started.
        </p>
      </div>
      <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
    </div>
  );
}
