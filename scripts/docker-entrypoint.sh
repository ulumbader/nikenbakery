#!/bin/sh
set -e

echo "🚀 [Niken Bakery] Memulai container..."

# Pastikan folder data dan uploads ada
mkdir -p /app/data /app/data/uploads

# Jalankan migrasi database
echo "🔄 [Niken Bakery] Menjalankan migrasi database..."
node scripts/migrate.js

echo "✅ [Niken Bakery] Database siap. Menjalankan server aplikasi..."

exec "$@"

