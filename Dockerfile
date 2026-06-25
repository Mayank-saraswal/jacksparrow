# Base image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage 1: Install dependencies
FROM base AS deps
# Copy package manifests and patches
COPY package.json bun.lock ./
COPY patches ./patches
COPY prisma ./prisma
# Install dependencies including the Zoom patch
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bun run db:generate

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Build Next.js in production standalone mode
ENV SKIP_ENV_VALIDATION=1
ENV NODE_ENV=production
RUN bun run build

# Stage 3: Runner stage
FROM base AS runner
WORKDIR /usr/src/app

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Don't run production as root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/prisma ./prisma

COPY entrypoint.sh ./

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "entrypoint.sh"]
