#!/usr/bin/env bash
set -e

# ─── Script Restore Niken Bakery (Linux / VPS) ───
# Mengembalikan database dan uploads dari arsip backup .tar.gz
# Usage: ./scripts/restore.sh <path_to_backup_archive.tar.gz>

ARCHIVE_PATH="$1"
DATA_DIR="${DATA_DIR:-./data}"
FORCE=0

for arg in "$@"; do
  if [ "$arg" = "-y" ] || [ "$arg" = "--yes" ]; then
    FORCE=1
  fi
done

if [ -z "$ARCHIVE_PATH" ]; then
  echo "❌ Penggunaan: ./scripts/restore.sh <path_file_backup.tar.gz> [-y]"
  exit 1
fi

if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "❌ File backup tidak ditemukan: $ARCHIVE_PATH"
  exit 1
fi

if [ $FORCE -eq 0 ]; then
  echo "⚠️ PERINGATAN: Memulihkan backup akan menimpa data dan gambar yang ada di $DATA_DIR!"
  read -p "Apakah Anda yakin ingin melanjutkan? (y/N): " CONFIRM
  if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ Pemulihan dibatalkan."
    exit 0
  fi
fi

# Buat snapshot darurat sebelum overwrite
EMERGENCY_BACKUP="./backups/pre_restore_$(date +%Y%m%d_%H%M%S)"
echo "🛡️ Membuat salinan pengaman darurat di $EMERGENCY_BACKUP..."
mkdir -p "$EMERGENCY_BACKUP"
if [ -d "$DATA_DIR" ]; then
  cp -r "$DATA_DIR"/* "$EMERGENCY_BACKUP/" 2>/dev/null || true
fi

TEMP_EXTRACT="./backups/tmp_restore_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$TEMP_EXTRACT"
cleanup() {
  rm -rf "$TEMP_EXTRACT"
}
trap cleanup EXIT

echo "📦 Mengekstrak arsip backup..."
tar -xzf "$ARCHIVE_PATH" -C "$TEMP_EXTRACT"

mkdir -p "$DATA_DIR"
if [ -f "$TEMP_EXTRACT/nikenbakery.db" ]; then
  echo "💾 Memulihkan database SQLite..."
  cp "$TEMP_EXTRACT/nikenbakery.db" "$DATA_DIR/nikenbakery.db"
  # Hapus file wal & shm lama agar tidak bentrok dengan db baru
  rm -f "$DATA_DIR/nikenbakery.db-wal" "$DATA_DIR/nikenbakery.db-shm"
fi

if [ -d "$TEMP_EXTRACT/uploads" ]; then
  echo "🖼️ Memulihkan folder uploads..."
  mkdir -p "$DATA_DIR/uploads"
  cp -r "$TEMP_EXTRACT/uploads"/* "$DATA_DIR/uploads/" 2>/dev/null || true
fi

echo "✅ Pemulihan data selesai dengan sukses!"
