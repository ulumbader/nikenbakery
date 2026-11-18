import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL wajib diatur untuk terhubung ke Supabase Postgres.");
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    ssl: { rejectUnauthorized: false },
    keepAlive: true,
    idleTimeoutMillis: 10_000,
  });

  return { pool, db: drizzle({ client: pool, schema }) };
}

const globalForDb = globalThis as unknown as {
  __nikenDb?: ReturnType<typeof createDb>;
};

const connection = globalForDb.__nikenDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__nikenDb = connection;
}

export const db = connection.db;
export const sqlClient = connection.pool;
