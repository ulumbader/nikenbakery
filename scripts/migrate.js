/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Database migration runner for production / Docker standalone
 * Menggunakan CommonJS agar dapat dijalankan langsung dengan node runtime tanpa dev dependencies
 */
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const { migrate } = require("drizzle-orm/better-sqlite3/migrator");
const { existsSync, mkdirSync } = require("node:fs");
const { dirname, resolve } = require("node:path");

const DB_PATH = process.env.DB_PATH || "./data/nikenbakery.db";

// Pastikan folder data dan uploads tersedia
const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const uploadDir = process.env.UPLOAD_DIR || "./data/uploads";
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = drizzle(sqlite);

console.log("🔄 Menjalankan migrasi database...");
const migrationsFolder =
  process.env.MIGRATIONS_FOLDER || resolve(__dirname, "../db/migrations");

try {
  migrate(db, { migrationsFolder });
  console.log("✅ Migrasi database berhasil!");
} catch (error) {
  console.error("❌ Gagal menjalankan migrasi:", error);
  process.exit(1);
} finally {
  sqlite.close();
}
