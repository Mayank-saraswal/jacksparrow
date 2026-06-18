# Local Development Setup

This guide details the steps to set up and run the Hedwigs platform in a local development environment.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+)
- **Bun** (the primary package manager and runtime used in this repository)
- **Docker** or **Podman** (for running the local PostgreSQL database)
- **ngrok** (for local webhook testing)
- **WSL** (if you are on Windows, required to execute the database start script)

---

## 1. Environment Configuration

1. Copy the `.env.example` template to a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Generate a 32-byte Key Encryption Key (KEK) for Corsair:
   ```bash
   openssl rand -base64 32
   ```
   Copy the generated key and set it as `CORSAIR_KEK` in `.env`. 
   > [!WARNING]
   > Do not lose this key; it encrypts/decrypts the stored OAuth credentials in your database.

3. Fill in other required and optional secrets in `.env`, including Clerk API keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and optional OpenAI credentials (`OPENAI_API_KEY`) for AI features.

---

## 2. Database Setup

We use PostgreSQL hosted inside a Docker container for local development.

1. Start the PostgreSQL container:
   - **Linux / macOS**: Run the setup script directly:
     ```bash
     chmod +x start-database.sh
     ./start-database.sh
     ```
   - **Windows**: Run the script inside **WSL**:
     ```bash
     wsl ./start-database.sh
     ```

2. Generate the Prisma client and apply database migrations:
   ```bash
   bun run db:generate
   bun run db:push
   ```
   - `db:generate` builds the local Prisma client from `prisma/schema.prisma`.
   - `db:push` syncs the schema mapping directly into the PostgreSQL database.
   - For managing migrations, use `bun run db:migrate` to deploy compiled migration files.

3. Open Prisma Studio (optional database GUI):
   ```bash
   bun run db:studio
   ```

---

## 3. Webhook Tunneling (ngrok)

To receive webhooks locally from Google, Slack, and other third-party integrations, you need a public HTTPS tunnel.

1. Launch ngrok using the pre-configured project command:
   ```bash
   bun run ngrok:dev
   ```
   This exposes `http://localhost:3000` via the public tunnel `https://vast-lemur-notable.ngrok-free.app`.

2. Update your `.env` variables to route callbacks through ngrok:
   ```env
   APP_URL="https://vast-lemur-notable.ngrok-free.app"
   ```

---

## 4. Corsair Integrations Setup

OAuth integrations must register their Client IDs and secrets with Corsair once at the integration level.

1. Insert client credentials for Gmail, Google Calendar, Slack, HubSpot, Jira, Zendesk, etc., in your `.env` file.
2. Run the Corsair setup script:
   ```bash
   bun run corsair:setup
   ```
   This reads the client credentials from `.env`, encrypts them using `CORSAIR_KEK`, and writes them to the integration-level configuration tables in the database.

---

## 5. Booting Development Servers

Run the application stack using two parallel terminal tabs:

### Tab 1: Web & API Server
Start Next.js (boosted by `--turbo` and configured with IPv4 resolution priority):
```bash
bun run dev
```

### Tab 2: Background Jobs Server (Inngest)
Start the Inngest local development server to monitor and trigger background workflows:
```bash
npx inngest-cli@latest dev
```
Open `http://localhost:8288` in your browser to view the Inngest Dev Server dashboard.
