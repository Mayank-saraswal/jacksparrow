# 🦉 Hedwigs (formerly Jacksparrow)

**The AI chief of staff that runs your inbox and calendar so you can sleep 2 hours more.**

Hedwigs is a smart, collaborative inbox and productivity workspace. It brings all your daily communication and management tools into a single, unified interface powered by an AI assistant that triages, drafts, and schedules across every app you work in.

---

## 🚀 Features

1. **Smart Triage & Shared Inboxes**: Connect personal or shared team mailboxes (Gmail, Outlook). Every email is scored the moment it lands—urgent, important, or noise.
2. **AI Assistant**: A built-in AI agent that drafts replies, schedules events, and prepares follow-ups. **You stay in control** — the agent drafts the actions, but nothing leaves your account without your explicit approval.
3. **Massive Integration Ecosystem**: Jira, Linear, HubSpot, Slack, Notion, Zoom, Teams, Zendesk, Intercom, Calendly, Todoist, Asana, and Fireflies. Turn emails into Jira issues, save them to HubSpot, or auto-generate Teams/Zoom links for calendar events.
4. **Keyboard-First & Fast**: Command palette, single-key shortcuts, and an undo stack let you fly through your inbox without touching the mouse. Hybrid search surfaces the right thread in under a second.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (React, TypeScript)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database & Realtime**: [Supabase](https://supabase.com) (PostgreSQL) + [Prisma ORM](https://prisma.io)
- **Integrations & OAuth**: Corsair SDK
- **Background Jobs**: [Inngest](https://inngest.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **AI Models**: Vercel AI SDK + OpenAI

---

## 🧪 Hackathon Demo Credentials

If you are reviewing this project for a hackathon, you can use the following demo credentials to explore the platform without setting up your own accounts:

**User 1:**
- **Email:** `piyush@chaicode.com`
- **Password:** `chaicodehq`

**User 2:**
- **Email:** `hitesh@chaicode.com`
- **Password:** `chaicodehq`

*(Both accounts are pre-seeded with the Business Membership plan).*

---

## 💻 Local Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo-url> hedwigs
   cd hedwigs
   bun install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example` and fill in your Supabase, Clerk, and Corsair credentials.

3. **Set up Database & Integrations**
   ```bash
   bunx prisma db push
   bun run corsair:setup
   ```

4. **Run the Development Server**
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. **Start the Inngest Background Worker**
   In a separate terminal window:
   ```bash
   npx inngest-cli@latest dev
   ```

---

## 🐞 Recent Fixes & Engineering Highlights

- **Seamless Rebranding:** Successfully migrated callbacks, routes, and brand assets from the legacy `Jacksparrow` name to `Hedwigs` on `https://www.hedwigs.site/`.
- **Zendesk Subdomain OAuth:** Overcame Zendesk's non-standard OAuth requirements by building a custom API flow to parse subdomains dynamically and manage secure state exchanges.
- **HubSpot Scope Alignment:** Resolved persistent connection issues by reverse-engineering HubSpot's exact required scope combinations in the developer portal.
- **EPERM Build Resolutions:** Mitigated strict Windows file-system locking restrictions during the Next.js/Tailwind tracing steps by implementing isolated `USERPROFILE` builds.
- **Real-Time Sync Enhancements:** Optimized Inngest job queues and Supabase realtime subscriptions to provide instantaneous UI updates for connection statuses and mailbox syncs.

---

> Built for the **Corsair x Chaicode Hackathon**.
