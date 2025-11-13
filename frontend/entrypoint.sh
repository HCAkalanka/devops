#!/bin/sh
set -e

# Ensure dependencies are installed inside the container volume
if [ ! -d node_modules ] || [ ! -f node_modules/.install-lock ] || ! cmp -s package-lock.json node_modules/.install-lock 2>/dev/null; then
  echo "[entrypoint] Installing dependencies (syncing with lockfile)..."
  if [ -f package-lock.json ]; then
    npm ci --no-progress --legacy-peer-deps
  else
    npm install --no-progress --legacy-peer-deps
  fi
  cp package-lock.json node_modules/.install-lock 2>/dev/null || true
else
  echo "[entrypoint] Dependencies are up to date."
fi

# Start Vite dev server
exec npm run dev -- --host
