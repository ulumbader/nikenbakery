#!/usr/bin/env bash
set -e

# ─── Script Backup Niken Bakery (Linux / VPS) ───
# Menghasilkan arsip bertanggal nikenbakery_backup_YYYYMMDD_HHMMSS.tar.gz
# berisi database SQLite (salinan konsisten WAL) dan folder uploads.

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATA_DIR="${DATA_DIR:-./data}"
DB_PATH="${DB_PATH:-$DATA_DIR/nikenbakery.db}"
UPLOADS_DIR="${UPLOAD_DIR:-$DATA_DIR/uploads}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEMP_DIR="$BACKUP_DIR/tmp_$TIMESTAMP"
ARCHIVE_NAME="nikenbakery_backup_$TIMESTAMP.tar.gz"
ARCHIVE_PATH="$BACKUP_DIR/$ARCHIVE_NAME"

echo "🧁 [Niken Bakery] Memulai proses backup..."
mkdir -p "$BACKUP_DIR"
mkdir -p "$TEMP_DIR"

cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# 1. Buat salinan konsisten SQLite menggunakan helper node (aman WAL mode)
echo "📦 Menyalin database SQLite..."
if [ -f "$DB_PATH" ]; then
  node scripts/sqlite-backup.js "$TEMP_DIR/nikenbakery.db"
else
  echo "⚠️ File database $DB_PATH tidak ditemukan, lewati DB backup."
fi

# 2. Salin folder uploads jika ada
if [ -d "$UPLOADS_DIR" ]; then
  echo "🖼️ Menyalin file media upload..."
  cp -r "$UPLOADS_DIR" "$TEMP_DIR/uploads"
else
  mkdir -p "$TEMP_DIR/uploads"
fi

# 3. Arsipkan ke tar.gz
echo "🗜️ Mengompresi ke $ARCHIVE_PATH..."
tar -czf "$ARCHIVE_PATH" -C "$TEMP_DIR" .

SIZE=$(du -h "$ARCHIVE_PATH" | cut -f1)
echo "✅ Backup selesai dengan sukses!"
echo "📁 Lokasi: $ARCHIVE_PATH ($SIZE)"

