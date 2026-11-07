import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq, and, sql } from "drizzle-orm";
import * as schema from "@/db/schema";

describe("Tes Integrasi Query Database SQLite", () => {
  let sqlite: InstanceType<typeof Database>;
  let db: ReturnType<typeof drizzle>;

  beforeEach(() => {
    // Gunakan in-memory SQLite terisolasi untuk tes integrasi query
    sqlite = new Database(":memory:");
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "./db/migrations" });
  });

  afterEach(() => {
    sqlite.close();
  });

  it("produk yang unpublished tidak boleh terlihat dalam query katalog publik", () => {
    // Buat kategori
    const cat = db
      .insert(schema.categories)
      .values({
        name: "Cake",
        slug: "cake",
        color: "pink",
        sortOrder: 1,
      })
      .returning()
      .get();

    // Buat produk published dan unpublished
    db.insert(schema.products)
      .values([
        {
          name: "Published Cake",
          slug: "published-cake",
          description: "Kue publik",
          basePrice: 150000,
          categoryId: cat.id,
          status: "ready",
          isPublished: true,
          isFeatured: true,
          sortOrder: 1,
        },
        {
          name: "Unpublished Secret",
          slug: "unpublished-secret",
          description: "Kue rahasia",
          basePrice: 120000,
          categoryId: cat.id,
          status: "ready",
          isPublished: false,
          isFeatured: false,
          sortOrder: 2,
        },
      ])
      .run();

    // Query publik: hanya mengambil isPublished = true
    const publicProducts = db
      .select()
      .from(schema.products)
      .where(eq(schema.products.isPublished, true))
      .all();

    expect(publicProducts.length).toBe(1);
    expect(publicProducts[0].name).toBe("Published Cake");
  });

  it("banner yang dijadwalkan di masa depan tidak muncul dalam banner aktif", () => {
    const past = new Date(Date.now() - 86400 * 1000);
    const future = new Date(Date.now() + 86400 * 1000 * 10);
    const futureEnd = new Date(Date.now() + 86400 * 1000 * 20);

    db.insert(schema.banners)
      .values([
        {
          title: "Promo Aktif",
          ctaLabel: "Lihat",
          ctaUrl: "/menu",
          color: "butter",
          isActive: true,
          startsAt: past,
          endsAt: future,
          sortOrder: 1,
        },
        {
          title: "Promo Masa Depan",
          ctaLabel: "Lihat",
          ctaUrl: "/menu",
          color: "pink",
          isActive: true,
          startsAt: future,
          endsAt: futureEnd,
          sortOrder: 2,
        },
      ])
      .run();

    // Query banner aktif sesuai waktu saat ini
    const activeBanners = db
      .select()
      .from(schema.banners)
      .where(
        and(
          eq(schema.banners.isActive, true),
          sql`(${schema.banners.startsAt} IS NULL OR ${schema.banners.startsAt} <= unixepoch())`,
          sql`(${schema.banners.endsAt} IS NULL OR ${schema.banners.endsAt} >= unixepoch())`
        )
      )
      .all();

    expect(activeBanners.length).toBe(1);
    expect(activeBanners[0].title).toBe("Promo Aktif");
  });

  it("foreign key constraint berjalan dengan benar pada relasi tabel", () => {
    const cat = db
      .insert(schema.categories)
      .values({
        name: "Test Cat",
        slug: "test-cat",
        color: "mint",
        sortOrder: 1,
      })
      .returning()
      .get();

    const prod = db
      .insert(schema.products)
      .values({
        name: "Child Product",
        slug: "child-product",
        description: "Anak kategori",
        basePrice: 50000,
        categoryId: cat.id,
        status: "ready",
        isPublished: true,
        isFeatured: false,
        sortOrder: 1,
      })
      .returning()
      .get();

    // Varian terikat ke produk (cascade delete)
    db.insert(schema.productVariants)
      .values({
        productId: prod.id,
        label: "Ukuran Standar",
        price: 50000,
        sortOrder: 1,
      })
      .run();

    const variantsBefore = db
      .select()
      .from(schema.productVariants)
      .where(eq(schema.productVariants.productId, prod.id))
      .all();
    expect(variantsBefore.length).toBe(1);

    // Hapus produk -> varian terhapus otomatis (cascade)
    db.delete(schema.products).where(eq(schema.products.id, prod.id)).run();

    const variantsAfter = db
      .select()
      .from(schema.productVariants)
      .where(eq(schema.productVariants.productId, prod.id))
      .all();
    expect(variantsAfter.length).toBe(0);
  });
});
