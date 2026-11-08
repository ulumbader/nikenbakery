#!/bin/sh
set -e

echo "🚀 [Niken Bakery] Menjalankan start script..."

# Load .env file jika ada
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Jalankan migrasi database
echo "🔄 [Niken Bakery] Memeriksa migrasi database..."
node scripts/migrate.js

# Jalankan server
if [ -f server.js ]; then
  echo "🧁 [Niken Bakery] Menjalankan standalone server (server.js)..."
  exec node server.js
else
  echo "🧁 [Niken Bakery] Menjalankan Next.js server..."
  exec npm run start
fi

