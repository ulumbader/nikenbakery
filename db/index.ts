import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl && process.env.VERCEL === "1") {
  throw new Error("DATABASE_URL must be configured in the Vercel project settings.");
}

// A local fallback URL lets `next build` complete without opening a connection.
// The first database query still fails until DATABASE_URL is configured.
const connectionString =
  databaseUrl ?? "postgresql://missing:missing@127.0.0.1:5432/missing";

const globalForDb = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export const postgresClient =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    max: process.env.VERCEL === "1" ? 1 : 5,
    prepare: false,
    ssl: "require",
    connect_timeout: 10,
    idle_timeout: 20,
  });

export const db =
  globalForDb.db ?? drizzle(postgresClient, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = postgresClient;
  globalForDb.db = db;
}
