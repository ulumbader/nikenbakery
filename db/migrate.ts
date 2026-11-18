import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL wajib diatur untuk menjalankan migrasi Supabase.");
  }

  const client = new Pool({
    connectionString,
    max: 1,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔄 Menjalankan migrasi skema Supabase Postgres...");
    await migrate(drizzle(client), { migrationsFolder: "./db/migrations-pg" });

    for (const tableName of [
      "admin_users", "categories", "products", "product_variants", "product_images",
      "banners", "testimonials", "social_posts", "faqs", "site_settings", "events",
    ]) {
      await client.query(`ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY`);
    }

    console.log("✅ Migrasi selesai; RLS aktif tanpa akses publik.");
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error("❌ Migrasi gagal:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
