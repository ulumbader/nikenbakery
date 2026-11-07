import { sql } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";

/**
 * Script untuk memangkas (prune) data event analitik yang lebih lama dari 180 hari
 * agar ukuran database SQLite tetap ramping dan performa query tetap cepat.
 *
 * Jalankan manual dengan:
 *   npm run events:prune
 */
async function pruneOldEvents() {
  const RETENTION_DAYS = 180;
  const cutoffTimestamp = Math.floor(Date.now() / 1000) - RETENTION_DAYS * 86400;

  console.log(`[Events Prune] Memeriksa event analitik lebih lama dari ${RETENTION_DAYS} hari...`);
  console.log(`[Events Prune] Cutoff timestamp: ${cutoffTimestamp} (${new Date(cutoffTimestamp * 1000).toISOString()})`);

  const result = db
    .delete(events)
    .where(sql`${events.createdAt} < ${cutoffTimestamp}`)
    .run();

  console.log(`[Events Prune] Selesai. Sebanyak ${result.changes} baris event telah dipangkas.`);
}

pruneOldEvents().catch((err) => {
  console.error("[Events Prune] Error:", err);
  process.exit(1);
});
