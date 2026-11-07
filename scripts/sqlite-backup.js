/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Helper untuk membuat salinan konsisten SQLite online (WAL mode safe)
 * Usage: node scripts/sqlite-backup.js <output_db_path>
 */
const Database = require("better-sqlite3");
const { existsSync, mkdirSync } = require("node:fs");
const { dirname, resolve } = require("node:path");

const targetPath = process.argv[2];
if (!targetPath) {
  console.error("Usage: node scripts/sqlite-backup.js <output_db_path>");
  process.exit(1);
}

const sourceDbPath = process.env.DB_PATH || "./data/nikenbakery.db";

if (!existsSync(sourceDbPath)) {
  console.error(`Database tidak ditemukan di ${sourceDbPath}`);
  process.exit(1);
}

const targetDir = dirname(resolve(targetPath));
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

async function runBackup() {
  const db = new Database(sourceDbPath);
  try {
    console.log(`📦 Memulai backup SQLite dari ${sourceDbPath} ke ${targetPath}...`);
    await db.backup(targetPath);
    console.log(`✅ Salinan SQLite konsisten berhasil dibuat di ${targetPath}`);
  } catch (error) {
    console.error("❌ Gagal membuat backup SQLite:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

runBackup();
