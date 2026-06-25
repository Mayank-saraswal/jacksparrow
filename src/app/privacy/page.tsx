import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { TrustedBy } from "../_components/trusted-by";

export const metadata = {
  title: "Privacy Policy · Hedwigs",
  description: "How we collect, use, and handle your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <div className="flex-1 mx-auto max-w-[800px] w-full px-6 py-16 font-mono text-sm leading-relaxed text-[#262626]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-3" /> Back to home
      </Link>

      <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
        Privacy Policy
      </h1>
      <p className="text-xs text-muted-foreground mb-8">
        Last updated: June 18, 2026
      </p>

      <div className="space-y-6 text-[13px]">
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            1. Overview
          </h2>
          <p>
            At Hedwigs, we build mail and calendar tools designed to help you reclaim your time. 
            Because your assistant operates on your personal communication data, security and privacy 
            are baked into our architecture. We encrypt credential tokens at rest, and our AI drafts 
            messages but will never send them without your explicit manual approval.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            2. Data We Access
          </h2>
          <p>
            To power your AI chief of staff, we connect securely to your Gmail, Outlook, or Google 
            Calendar. We retrieve messages and event details to index them semantically for search 
            and context routing. This data is processed strictly to generate suggestions and coordinate 
            your inbox actions. We do not sell your personal communication data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            3. Encryption & Storage
          </h2>
          <p>
            All authorization credentials (OAuth tokens) are encrypted per user with secure KMS keys. 
            Local sync stores are protected and isolated per tenant. Real-time background sync runs 
            on sandboxed container workers and does not store full message archives unless required 
            for active threads under your context window.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            4. Your Control
          </h2>
          <p>
            You have full control over connected accounts. You can revoke authorization credentials at 
            any time through the Integrations panel or directly from your provider settings. If you 
            delete your account, all corresponding cached mail documents, summaries, and tokens are 
            permanently purged from our database within 24 hours.
          </p>
        </section>
      </div>
      </div>
      <TrustedBy />
    </div>
  );
}
