import { sql } from "drizzle-orm";
import { db, postgresClient } from "@/db";
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
  const cutoffTimestamp = new Date(Date.now() - RETENTION_DAYS * 86400_000);

  console.log(`[Events Prune] Memeriksa event analitik lebih lama dari ${RETENTION_DAYS} hari...`);
  console.log(`[Events Prune] Cutoff timestamp: ${cutoffTimestamp.toISOString()}`);

  const result = await db
    .delete(events)
    .where(sql`${events.createdAt} < ${cutoffTimestamp}`)
    .returning({ id: events.id });

  console.log(`[Events Prune] Selesai. Sebanyak ${result.length} baris event telah dipangkas.`);
}

pruneOldEvents().catch((err) => {
  console.error("[Events Prune] Error:", err);
  process.exit(1);
}).finally(async () => {
  await postgresClient.end();
});
