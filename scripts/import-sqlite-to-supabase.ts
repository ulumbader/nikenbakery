import Database from "better-sqlite3";
import { promises as fs } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { getSupabaseAdmin, getSupabaseStorageConfig } from "../lib/supabase-admin";

type Row = Record<string, unknown>;

const tables = [
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

function toDate(value: unknown, milliseconds = false): Date | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return new Date(milliseconds ? numericValue : numericValue * 1000);
}

function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

function asText(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  const sqlitePath = path.resolve(
    process.env.SQLITE_SOURCE_PATH ?? "./data/nikenbakery.db"
  );
  const uploadDir = path.resolve(process.env.SQLITE_UPLOAD_DIR ?? "./data/uploads");

  if (!databaseUrl) throw new Error("Isi DATABASE_URL dengan connection string Supabase.");
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY untuk menyalin foto.");
  }

  const sqlite = new Database(sqlitePath, { readonly: true, fileMustExist: true });
  sqlite.pragma("foreign_keys = ON");
  const pg = postgres(databaseUrl, { max: 1, prepare: false, ssl: "require" });
  const storageConfig = getSupabaseStorageConfig();
  if (!storageConfig) throw new Error("Konfigurasi Supabase Storage tidak lengkap.");
  const bucketName = storageConfig.bucket;

  const uploadedPaths: string[] = [];
  const objectUrlCache = new Map<string, string>();

  async function moveImage(value: unknown): Promise<string | null> {
    const original = asText(value);
    if (!original) return null;
    let localReference = original;
    if (/^https?:\/\//i.test(original)) {
      const imageUrl = new URL(original);
      if (!imageUrl.pathname.startsWith("/media/")) return original;
      localReference = imageUrl.pathname;
    }

    const filename = path.basename(localReference.split("?")[0].replace(/\\/g, "/"));
    if (!filename || filename === "." || filename === "..") {
      throw new Error(`Path gambar lokal tidak valid: ${original}`);
    }
    const objectPath = `legacy/${filename}`;
    const cachedUrl = objectUrlCache.get(objectPath);
    if (cachedUrl) return cachedUrl;

    const localPath = path.join(uploadDir, filename);
    const buffer = await fs.readFile(localPath);
    const { error } = await getSupabaseAdmin()
      .storage.from(bucketName)
      .upload(objectPath, buffer, {
        cacheControl: "31536000",
        contentType: filename.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : "application/octet-stream",
        upsert: true,
      });
    if (error) throw new Error(`Gagal mengunggah ${filename}: ${error.message}`);

    uploadedPaths.push(objectPath);
    const url = getSupabaseAdmin()
      .storage.from(bucketName)
      .getPublicUrl(objectPath).data.publicUrl;
    objectUrlCache.set(objectPath, url);
    return url;
  }

  try {
    const targetTables = await pg.unsafe<{ count: string }[]>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1)`,
      [Array.from(tables)]
    );
    if (targetTables.length !== tables.length) {
      throw new Error("Skema Supabase belum lengkap. Jalankan npm run db:migrate terlebih dahulu.");
    }

    const targetCounts = await Promise.all(
      tables.map(async (table) => {
        const result = await pg.unsafe<{ count: string }[]>(`SELECT count(*)::text AS count FROM "${table}"`);
        return { table, count: Number(result[0]?.count ?? 0) };
      })
    );
    const occupied = targetCounts.filter((entry) => entry.count > 0);
    if (occupied.length > 0) {
      throw new Error(
        `Supabase harus kosong sebelum import. Tabel sudah berisi data: ${occupied.map((entry) => entry.table).join(", " )}`
      );
    }

    const rows = Object.fromEntries(
      tables.map((table) => [
        table,
        sqlite.prepare(`SELECT * FROM "${table}"`).all() as Row[],
      ])
    ) as Record<(typeof tables)[number], Row[]>;

    for (const row of rows.product_images) {
      row.file_name = await moveImage(row.file_name);
      row.thumb_name = await moveImage(row.thumb_name);
    }
    for (const row of rows.banners) row.image_file = await moveImage(row.image_file);
    for (const row of rows.social_posts) row.image_file = await moveImage(row.image_file);
    for (const row of rows.site_settings) {
      if (row.key === "about_image") row.value = (await moveImage(row.value)) ?? "";
    }

    for (const table of ["admin_users", "categories", "products"] as const) {
      for (const row of rows[table]) {
        row.created_at = toDate(row.created_at);
        row.updated_at = toDate(row.updated_at);
      }
    }
    for (const row of rows.products) {
      row.is_featured = toBoolean(row.is_featured);
      row.is_published = toBoolean(row.is_published);
      row.shopee_enabled = toBoolean(row.shopee_enabled);
      row.tokopedia_enabled = toBoolean(row.tokopedia_enabled);
      row.tiktok_shop_enabled = toBoolean(row.tiktok_shop_enabled);
    }
    for (const row of rows.product_images) row.is_cover = toBoolean(row.is_cover);
    for (const row of rows.banners) {
      row.is_active = toBoolean(row.is_active);
      row.starts_at = toDate(row.starts_at, true);
      row.ends_at = toDate(row.ends_at, true);
    }
    for (const row of rows.testimonials) row.is_published = toBoolean(row.is_published);
    for (const row of rows.social_posts) row.is_published = toBoolean(row.is_published);
    for (const row of rows.faqs) row.is_published = toBoolean(row.is_published);
    for (const row of rows.site_settings) row.updated_at = toDate(row.updated_at);
    for (const row of rows.events) row.created_at = toDate(row.created_at);

    await pg.begin(async (transaction) => {
      for (const table of tables) {
        for (const row of rows[table]) {
          const columns = Object.keys(row);
          if (columns.length === 0) continue;
          const names = columns.map((column) => `"${column}"`).join(", ");
          const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
      const values = columns.map((column) => row[column]) as (
        | string
        | number
        | boolean
        | Date
        | null
      )[];
          await transaction.unsafe(
            `INSERT INTO "${table}" (${names}) VALUES (${placeholders})`,
            values
          );
        }
      }

      for (const table of ["admin_users", "categories", "products", "product_variants", "product_images", "banners", "testimonials", "social_posts", "events"] as const) {
        await transaction.unsafe(
          `SELECT setval(pg_get_serial_sequence('public.${table}', 'id'), GREATEST(COALESCE((SELECT MAX(id) FROM public.${table}), 1), 1), EXISTS (SELECT 1 FROM public.${table}))`
        );
      }
    });

    console.log("Import selesai; database SQLite sumber tidak diubah.");
    for (const table of tables) console.log(`  ${table}: ${rows[table].length} baris`);
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await getSupabaseAdmin().storage.from(bucketName).remove(uploadedPaths);
    }
    throw error;
  } finally {
    sqlite.close();
    await pg.end();
  }
}

main().catch((error: unknown) => {
  console.error("Import SQLite → Supabase gagal:", error);
  process.exitCode = 1;
});
