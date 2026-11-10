import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("Isi DATABASE_URL dengan connection string Supabase terlebih dahulu.");
}

const client = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  ssl: "require",
});

try {
  console.log("🔄 Running PostgreSQL migrations...");
  await migrate(drizzle(client), {
    migrationsFolder: "./db/migrations-postgres",
  });
  console.log("✅ PostgreSQL migrations complete!");
} finally {
  await client.end();
}
