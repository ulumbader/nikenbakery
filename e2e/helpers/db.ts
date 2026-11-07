import Database from "better-sqlite3";
import path from "node:path";

export function getTestDb() {
  const dbPath = process.env.DB_PATH || "./data/test.db";
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  return new Database(resolvedPath, { readonly: true });
}

