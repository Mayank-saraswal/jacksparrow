import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Terms of Service · Hedwigs",
  description: "Terms governing use of the Hedwigs platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16 font-mono text-sm leading-relaxed text-[#262626]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-3" /> Back to home
      </Link>

      <h1 className="text-2xl font-medium tracking-tight text-foreground mb-2">
        Terms of Service
      </h1>
      <p className="text-xs text-muted-foreground mb-8">
        Last updated: June 18, 2026
      </p>

      <div className="space-y-6 text-[13px]">
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            1. Agreement to Terms
          </h2>
          <p>
            By creating an account or accessing the Hedwigs platform, you agree to be bound by these 
            Terms of Service. If you do not agree to all of these terms, do not access or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            2. AI Actions & Approvals
          </h2>
          <p>
            Hedwigs functions as an assistant that drafts messages and stages actions (such as scheduling 
            invitations or RSVPs). Because all actions require manual confirmation (your approval), 
            you are solely responsible for all final communications sent and calendar actions committed 
            under your account credentials.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            3. Usage Restrictions
          </h2>
          <p>
            You agree not to use the Hedwigs agent pipeline to dispatch bulk unsolicited spam, conduct 
            phishing schemes, or automate malicious interactions. Any violation of these standards will 
            result in immediate suspension of your API sync capabilities and deletion of your tenant workspace.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
            4. Limitation of Liability
          </h2>
          <p>
            Hedwigs is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee 
            uninterrupted synchronization or absolute accuracy of AI-generated email classifications. 
            Under no circumstances shall we be liable for any lost data, missed meetings, or business 
            disruption resulting from service outages or sync failures.
          </p>
        </section>
      </div>
    </div>
  );
}
