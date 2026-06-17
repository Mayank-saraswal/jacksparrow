#!/bin/sh

# Set fallback URLs if not specified but standard postgres is available in compose
if [ -z "$DATABASE_URL" ] && [ -n "$DB_HOST" ]; then
  export DATABASE_URL="postgresql://postgres:password@${DB_HOST}:${DB_PORT:-5432}/postgres"
fi

if [ -z "$DIRECT_URL" ] && [ -n "$DATABASE_URL" ]; then
  export DIRECT_URL="$DATABASE_URL"
fi

# Run migrations if database details are provided
if [ -n "$DATABASE_URL" ]; then
  echo "Checking database connection & deploying migrations..."
  bun x prisma migrate deploy || echo "Warning: Prisma migration deployment failed or was skipped."
else
  echo "DATABASE_URL not set. Skipping migrations."
fi

# Start Next.js standalone app using bun
echo "Starting Next.js App on port ${PORT:-3000}..."
exec bun server.js
