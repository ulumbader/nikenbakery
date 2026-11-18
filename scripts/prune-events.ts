import { lt } from "drizzle-orm";
import { db, sqlClient } from "@/db";
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
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000);

  console.log(`[Events Prune] Memeriksa event analitik lebih lama dari ${RETENTION_DAYS} hari...`);
  console.log(`[Events Prune] Batas tanggal: ${cutoff.toISOString()}`);

  const deleted = await db
    .delete(events)
    .where(lt(events.createdAt, cutoff))
    .returning({ id: events.id });

  console.log(`[Events Prune] Selesai. Sebanyak ${deleted.length} baris event telah dipangkas.`);
}

pruneOldEvents().catch((err) => {
  console.error("[Events Prune] Error:", err);
  process.exitCode = 1;
}).finally(async () => {
  await sqlClient.end();
});
