import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { adminUsers } from "../db/schema";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!username) {
    console.error("❌ Error: ADMIN_USERNAME belum diisi di environment variable!");
    process.exit(1);
  }

  if (!password) {
    console.error("❌ Error: ADMIN_PASSWORD belum diisi di environment variable!");
    process.exit(1);
  }

  if (password.length < 10) {
    console.error(
      "❌ Error: Password admin terlalu pendek! Minimal 10 karakter untuk keamanan."
    );
    process.exit(1);
  }

  console.log(`🔐 Memproses akun admin '${username}'...`);

  const passwordHash = await hashPassword(password);
  const existing = db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .get();

  if (existing) {
    db.update(adminUsers)
      .set({
        passwordHash,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(adminUsers.id, existing.id))
      .run();
    console.log(`✅ Password untuk admin '${username}' berhasil diperbarui!`);
  } else {
    db.insert(adminUsers)
      .values({
        username,
        passwordHash,
      })
      .run();
    console.log(`✅ Akun admin '${username}' berhasil dibuat!`);
  }
}

main().catch((err) => {
  console.error("❌ Gagal membuat/memperbarui admin:", err);
  process.exit(1);
});
