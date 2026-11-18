import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import * as schema from "../db/schema";
import { getMediaObjectKey, uploadMediaObject } from "../lib/supabase-admin";

type SourceRow = Record<string, unknown>;

const appTableNames = [
  "admin_users",
  "categories",
  "products",
  "product_variants",
  "product_images",
  "banners",
  "testimonials",
  "social_posts",
  "faqs",
  "site_settings",
  "events",
] as const;

const booleanColumns: Record<string, string[]> = {
  products: [
    "isFeatured",
    "isPublished",
    "shopeeEnabled",
    "tokopediaEnabled",
    "tiktokShopEnabled",
  ],
  product_images: ["isCover"],
  banners: ["isActive"],
  testimonials: ["isPublished"],
  social_posts: ["isPublished"],
  faqs: ["isPublished"],
};

const timestampColumns: Record<string, string[]> = {
  admin_users: ["createdAt", "updatedAt"],
  categories: ["createdAt", "updatedAt"],
  products: ["createdAt", "updatedAt"],
  banners: ["startsAt", "endsAt"],
  site_settings: ["updatedAt"],
  events: ["createdAt"],
};

function getDatabasePath(): string {
  const configuredPath = process.env.DB_PATH || "./data/nikenbakery.db";
  return path.resolve(configuredPath);
}

function toCamelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

function convertBoolean(value: unknown, tableName: string, columnName: string): boolean {
  if (value === 0 || value === false) return false;
  if (value === 1 || value === true) return true;
  throw new Error(`Nilai boolean tidak valid pada ${tableName}.${columnName}.`);
}

function convertTimestamp(
  value: unknown,
  tableName: string,
  columnName: string
): Date | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Nilai waktu tidak valid pada ${tableName}.${columnName}.`);
  }
  return new Date(value * 1000);
}

function readTable(source: Database.Database, tableName: string): SourceRow[] {
  const rows = source.prepare(`SELECT * FROM "${tableName}"`).all();
  return rows as SourceRow[];
}

async function prepareRows(
  source: Database.Database,
  tableName: (typeof appTableNames)[number],
  mediaCache: Map<string, string>,
  uploadDir: string
): Promise<Record<string, unknown>[]> {
  const rows = readTable(source, tableName);
  const boolColumns = new Set(booleanColumns[tableName] ?? []);
  const dateColumns = new Set(timestampColumns[tableName] ?? []);
  const prepared: Record<string, unknown>[] = [];

  for (const sourceRow of rows) {
    const row: Record<string, unknown> = {};
    for (const [sourceColumn, sourceValue] of Object.entries(sourceRow)) {
      const column = toCamelCase(sourceColumn);
      if (boolColumns.has(column)) {
        row[column] = convertBoolean(sourceValue, tableName, column);
      } else if (dateColumns.has(column)) {
        row[column] = convertTimestamp(sourceValue, tableName, column);
      } else {
        row[column] = sourceValue;
      }
    }

    const mediaFields =
      tableName === "product_images"
        ? ["fileName", "thumbName"]
        : tableName === "banners" || tableName === "social_posts"
          ? ["imageFile"]
          : tableName === "site_settings" && row.key === "about_image"
            ? ["value"]
            : [];

    for (const field of mediaFields) {
      const value = row[field];
      if (typeof value !== "string" || !value.startsWith("/media/")) continue;

      let publicUrl = mediaCache.get(value);
      if (!publicUrl) {
        const key = getMediaObjectKey(value);
        if (!key || path.basename(key) !== key) {
          throw new Error(`Referensi media lokal tidak valid pada ${tableName}.${field}.`);
        }
        const localPath = path.resolve(uploadDir, key);
        if (!localPath.startsWith(`${uploadDir}${path.sep}`)) {
          throw new Error(`Referensi media lokal keluar dari direktori upload.`);
        }
        let content: Buffer;
        try {
          content = await fs.readFile(localPath);
        } catch {
          throw new Error(`File gambar sumber tidak ditemukan: ${key}.`);
        }
        publicUrl = await uploadMediaObject(key, content);
        mediaCache.set(value, publicUrl);
      }
      row[field] = publicUrl;
    }

    prepared.push(row);
  }

  return prepared;
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databasePath = getDatabasePath();
  const uploadDir = path.resolve(
    process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads")
  );

  if (!connectionString || !supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "DATABASE_URL, SUPABASE_URL, dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local."
    );
  }
  await fs.access(databasePath);

  const supabaseProject = new URL(supabaseUrl).hostname.split(".")[0];
  const databaseUrl = new URL(connectionString);
  const databaseProject = databaseUrl.hostname.startsWith("db.")
    ? databaseUrl.hostname.split(".")[1]
    : databaseUrl.username.split(".")[1];
  if (databaseProject && databaseProject !== supabaseProject) {
    throw new Error("DATABASE_URL dan SUPABASE_URL mengarah ke proyek Supabase berbeda.");
  }

  const source = new Database(databasePath, { readonly: true, fileMustExist: true });
  const client = new Pool({
    connectionString,
    max: 1,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(client);

  try {
    const existingTables = await client.query<{ table_name: string }>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    const existingNames = new Set(
      existingTables.rows
        .map((row) => row.table_name)
        .filter((name) => appTableNames.includes(name as (typeof appTableNames)[number]))
    );
    if (existingNames.size > 0 && existingNames.size !== appTableNames.length) {
      throw new Error(
        "Skema aplikasi Supabase sudah terisi sebagian. Migrasi dihentikan agar tidak mengubah tabel yang ada."
      );
    }

    const migrationLedgerResult = await client.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema IN ('drizzle', 'public') AND table_name = '__drizzle_migrations'
      ) AS exists
    `);
    const migrationLedgerExists = Boolean(migrationLedgerResult.rows[0]?.exists);
    if (existingNames.size > 0 && !migrationLedgerExists) {
      throw new Error(
        "Tabel aplikasi sudah ada tanpa catatan migrasi Drizzle. Migrasi dihentikan untuk mencegah konflik skema."
      );
    }
    if (existingNames.size === 0 && migrationLedgerExists) {
      throw new Error(
        "Catatan migrasi Drizzle sudah ada tanpa tabel aplikasi. Migrasi dihentikan agar tidak memakai skema Supabase yang tidak dikenal."
      );
    }

    if (existingNames.size > 0) {
      const nonEmptyTables: string[] = [];
      for (const tableName of appTableNames) {
        const result = await client.query<{ count: number }>(
          `SELECT count(*)::int AS count FROM public."${tableName}"`
        );
        if (Number(result.rows[0]?.count ?? 0) > 0) nonEmptyTables.push(tableName);
      }
      if (nonEmptyTables.length > 0) {
        throw new Error(
          `Database Supabase sudah berisi data di tabel: ${nonEmptyTables.join(", ")}. Tidak ada data yang ditimpa.`
        );
      }
    }

    console.log("🔄 Menyiapkan skema Supabase Postgres...");
    await migrate(db, { migrationsFolder: "./db/migrations-pg" });
    for (const tableName of appTableNames) {
      await client.query(`ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY`);
    }

    const mediaCache = new Map<string, string>();
    const migrated = {
      adminUsers: await prepareRows(source, "admin_users", mediaCache, uploadDir),
      categories: await prepareRows(source, "categories", mediaCache, uploadDir),
      products: await prepareRows(source, "products", mediaCache, uploadDir),
      productVariants: await prepareRows(source, "product_variants", mediaCache, uploadDir),
      productImages: await prepareRows(source, "product_images", mediaCache, uploadDir),
      banners: await prepareRows(source, "banners", mediaCache, uploadDir),
      testimonials: await prepareRows(source, "testimonials", mediaCache, uploadDir),
      socialPosts: await prepareRows(source, "social_posts", mediaCache, uploadDir),
      faqs: await prepareRows(source, "faqs", mediaCache, uploadDir),
      siteSettings: await prepareRows(source, "site_settings", mediaCache, uploadDir),
      events: await prepareRows(source, "events", mediaCache, uploadDir),
    };

    console.log(
      `📦 Mengimpor data SQLite dan ${mediaCache.size} file gambar ke Supabase...`
    );
    await db.transaction(async (tx) => {
      if (migrated.adminUsers.length) await tx.insert(schema.adminUsers).values(migrated.adminUsers as (typeof schema.adminUsers.$inferInsert)[]);
      if (migrated.categories.length) await tx.insert(schema.categories).values(migrated.categories as (typeof schema.categories.$inferInsert)[]);
      if (migrated.products.length) await tx.insert(schema.products).values(migrated.products as (typeof schema.products.$inferInsert)[]);
      if (migrated.productVariants.length) await tx.insert(schema.productVariants).values(migrated.productVariants as (typeof schema.productVariants.$inferInsert)[]);
      if (migrated.productImages.length) await tx.insert(schema.productImages).values(migrated.productImages as (typeof schema.productImages.$inferInsert)[]);
      if (migrated.banners.length) await tx.insert(schema.banners).values(migrated.banners as (typeof schema.banners.$inferInsert)[]);
      if (migrated.testimonials.length) await tx.insert(schema.testimonials).values(migrated.testimonials as (typeof schema.testimonials.$inferInsert)[]);
      if (migrated.socialPosts.length) await tx.insert(schema.socialPosts).values(migrated.socialPosts as (typeof schema.socialPosts.$inferInsert)[]);
      if (migrated.faqs.length) await tx.insert(schema.faqs).values(migrated.faqs as (typeof schema.faqs.$inferInsert)[]);
      if (migrated.siteSettings.length) await tx.insert(schema.siteSettings).values(migrated.siteSettings as (typeof schema.siteSettings.$inferInsert)[]);
      if (migrated.events.length) await tx.insert(schema.events).values(migrated.events as (typeof schema.events.$inferInsert)[]);

      for (const tableName of appTableNames.filter((name) => name !== "site_settings")) {
        await tx.execute(sql`
          SELECT setval(
            pg_get_serial_sequence(${`public.${tableName}`}, 'id'),
            COALESCE((SELECT MAX(id) FROM ${sql.identifier(tableName)}), 1),
            EXISTS (SELECT 1 FROM ${sql.identifier(tableName)})
          )
        `);
      }
    });

    console.log("✅ Migrasi selesai. Database SQLite dan file sumber tetap utuh.");
    for (const tableName of appTableNames) {
      const expected = readTable(source, tableName).length;
      const actualResult = await client.query<{ count: number }>(
        `SELECT count(*)::int AS count FROM public."${tableName}"`
      );
      const actual = Number(actualResult.rows[0]?.count ?? 0);
      if (actual !== expected) {
        throw new Error(`Jumlah baris ${tableName} tidak cocok setelah impor.`);
      }
      console.log(`  ${tableName}: ${actual} baris cocok`);
    }
  } finally {
    source.close();
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    "❌ Migrasi SQLite ke Supabase gagal:",
    error instanceof Error ? error.message : "Unknown error"
  );
  process.exitCode = 1;
});
