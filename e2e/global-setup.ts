import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

function getProjectRef(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname.startsWith("db.")) return url.hostname.split(".")[1] ?? null;
    return url.username.split(".")[1] ?? null;
  } catch {
    return null;
  }
}

function runNpm(args: string[], env: NodeJS.ProcessEnv): void {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npmCommand, args, { cwd: process.cwd(), env, stdio: "inherit" });
}

export default async function globalSetup() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

  const e2eDatabaseUrl = process.env.E2E_DATABASE_URL;
  const e2eSupabaseUrl = process.env.E2E_SUPABASE_URL;
  const e2eServiceRoleKey = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY;
  if (!e2eDatabaseUrl || !e2eSupabaseUrl || !e2eServiceRoleKey) {
    throw new Error(
      "E2E memerlukan proyek Supabase khusus. Isi E2E_DATABASE_URL, E2E_SUPABASE_URL, dan E2E_SUPABASE_SERVICE_ROLE_KEY di .env.test."
    );
  }

  const e2eProjectRef = getProjectRef(e2eDatabaseUrl);
  const storageProjectRef = new URL(e2eSupabaseUrl).hostname.split(".")[0];
  if (!e2eProjectRef || e2eProjectRef !== storageProjectRef) {
    throw new Error("Database dan Storage E2E harus berasal dari proyek Supabase yang sama.");
  }

  const localEnvPath = path.resolve(process.cwd(), ".env.local");
  const localEnv = dotenv.parse(readFileSync(localEnvPath));
  if (
    e2eDatabaseUrl === localEnv.DATABASE_URL ||
    e2eProjectRef === getProjectRef(localEnv.DATABASE_URL)
  ) {
    throw new Error("E2E ditolak: gunakan proyek Supabase terpisah dari database aplikasi.");
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: e2eDatabaseUrl,
    SUPABASE_URL: e2eSupabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: e2eServiceRoleKey,
    SESSION_SECRET: "super_secret_for_playwright_test_session_key_32chars",
    ADMIN_USERNAME: "testadmin",
    ADMIN_PASSWORD: "testadmin12345",
    PORT: "3100",
  };

  console.log("🧪 Menyiapkan database dan Storage Supabase khusus E2E...");
  runNpm(["run", "db:migrate"], env);
  runNpm(["run", "db:seed", "--", "--reset"], env);
  runNpm(["run", "admin:create"], env);
  runNpm(["run", "storage:setup"], env);
  console.log("✅ Supabase khusus E2E siap.");
}
