import { existsSync, rmSync, mkdirSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export default async function globalSetup() {
  console.log("\n🧪 [Playwright Global Setup] Menyiapkan environment & database isolasi tes...");

  // Set environment variable khusus tes
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  process.env.DB_PATH = "./data/test.db";
  process.env.UPLOAD_DIR = "./data/test-uploads";
  process.env.SESSION_SECRET = "super_secret_for_playwright_test_session_key_32chars";
  process.env.ADMIN_USERNAME = "testadmin";
  process.env.ADMIN_PASSWORD = "testadmin12345";
  process.env.PORT = "3100";

  const testDbPath = path.resolve(process.cwd(), "data/test.db");
  const testUploadDir = path.resolve(process.cwd(), "data/test-uploads");
  const authDir = path.resolve(process.cwd(), "e2e/.auth");

  // Pastikan direktori ada
  mkdirSync(path.resolve(process.cwd(), "data"), { recursive: true });
  mkdirSync(authDir, { recursive: true });

  // 1. Bersihkan database tes lama
  if (existsSync(testDbPath)) rmSync(testDbPath, { force: true });
  if (existsSync(`${testDbPath}-wal`)) rmSync(`${testDbPath}-wal`, { force: true });
  if (existsSync(`${testDbPath}-shm`)) rmSync(`${testDbPath}-shm`, { force: true });

  // 2. Bersihkan folder test-uploads lama
  if (existsSync(testUploadDir)) {
    rmSync(testUploadDir, { recursive: true, force: true });
  }
  mkdirSync(testUploadDir, { recursive: true });

  // 3. Jalankan migrasi ke test.db
  console.log("  → Menjalankan migrasi Drizzle ke test.db...");
  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const { migrate } = await import("drizzle-orm/better-sqlite3/migrator");
  const schema = await import("../db/schema");

  const sqlite = new Database(testDbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("  ✓ Migrasi selesai.");

  // 4. Masukkan Seed Dasar
  console.log("  → Menjalankan data seed...");

  // Kategori
  const categoryData = [
    { name: "Cake", slug: "cake", color: "pink" as const, sortOrder: 1 },
    { name: "Brownies & Bars", slug: "brownies-bars", color: "butter" as const, sortOrder: 2 },
    { name: "Cookies", slug: "cookies", color: "mint" as const, sortOrder: 3 },
    { name: "Pastry", slug: "pastry", color: "lavender" as const, sortOrder: 4 },
  ];
  for (const c of categoryData) {
    db.insert(schema.categories).values(c).run();
  }

  const allCats = db.select().from(schema.categories).all();
  const catMap = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

  // Produk Utama
  const p1 = db
    .insert(schema.products)
    .values({
      name: "Strawberry Shortcake",
      slug: "strawberry-shortcake",
      description: "Sponge cake lembut dengan strawberry segar dan whipped cream.",
      basePrice: 185000,
      categoryId: catMap["cake"],
      status: "ready",
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
    })
    .returning()
    .get();

  db.insert(schema.productVariants)
    .values([
      { productId: p1.id, label: "Diameter 16 cm", price: 185000, sortOrder: 1 },
      { productId: p1.id, label: "Diameter 20 cm", price: 265000, sortOrder: 2 },
    ])
    .run();

  db.insert(schema.products)
    .values({
      name: "Lemon Bars",
      slug: "lemon-bars",
      description: "Lemon bars segar dengan shortbread base yang buttery.",
      basePrice: 75000,
      categoryId: catMap["brownies-bars"],
      status: "soldout",
      isFeatured: false,
      isPublished: true,
      sortOrder: 2,
    })
    .run();

  db.insert(schema.products)
    .values({
      name: "Mille Crepes",
      slug: "mille-crepes",
      description: "Puluhan lapisan crepe tipis dengan pastry cream.",
      basePrice: 210000,
      categoryId: catMap["cake"],
      status: "preorder",
      preorderNote: "Pre-order H-2",
      isFeatured: true,
      isPublished: true,
      sortOrder: 3,
    })
    .run();

  db.insert(schema.products)
    .values({
      name: "Fudgy Brownies",
      slug: "fudgy-brownies",
      description: "Brownies super fudgy dengan dark chocolate premium.",
      basePrice: 65000,
      categoryId: catMap["brownies-bars"],
      status: "ready",
      isFeatured: true,
      isPublished: true,
      sortOrder: 4,
    })
    .run();

  // Produk unpublished untuk tes PUB-06
  db.insert(schema.products)
    .values({
      name: "Secret Unpublished Cake",
      slug: "secret-unpublished-cake",
      description: "Kue rahasia yang belum dipublikasikan.",
      basePrice: 100000,
      categoryId: catMap["cake"],
      status: "ready",
      isFeatured: false,
      isPublished: false,
      sortOrder: 99,
    })
    .run();

  // Banners
  const past = new Date(Date.now() - 86400 * 1000);
  const future = new Date(Date.now() + 86400 * 1000 * 7);
  const farFutureStart = new Date(Date.now() + 86400 * 1000 * 30);
  const farFutureEnd = new Date(Date.now() + 86400 * 1000 * 40);

  db.insert(schema.banners)
    .values([
      {
        title: "Promo Akhir Pekan!",
        subtitle: "Diskon 15% untuk semua brownies.",
        ctaLabel: "Lihat menu",
        ctaUrl: "/menu?kategori=brownies-bars",
        color: "butter",
        isActive: true,
        startsAt: past,
        endsAt: future,
        sortOrder: 1,
      },
      {
        title: "Promo Tahun Depan",
        subtitle: "Promo rahasia masa depan.",
        ctaLabel: "Segera",
        ctaUrl: "/menu",
        color: "pink",
        isActive: true,
        startsAt: farFutureStart,
        endsAt: farFutureEnd,
        sortOrder: 2,
      },
    ])
    .run();

  // Testimoni
  db.insert(schema.testimonials)
    .values([
      {
        name: "Rina",
        handle: "@rina_foodie",
        content: "Burnt cheesecake-nya juara banget! Creamy dan nggak terlalu manis.",
        rating: 5,
        isPublished: true,
        sortOrder: 1,
      },
      {
        name: "Dimas",
        handle: "@dimas.k",
        content: "Brownies paling fudgy yang pernah aku coba.",
        rating: 5,
        isPublished: true,
        sortOrder: 2,
      },
    ])
    .run();

  // Social Posts
  db.insert(schema.socialPosts)
    .values([
      {
        platform: "instagram",
        caption: "Fresh from the oven! Croissant butter kami siap menemani pagimu.",
        postUrl: "https://instagram.com/p/contoh1",
        isPublished: true,
        sortOrder: 1,
      },
      {
        platform: "tiktok",
        caption: "Behind the scenes proses mille crepes 20 lapisan ✨",
        postUrl: "https://tiktok.com/@nikenbakery_contoh/video/contoh1",
        isPublished: true,
        sortOrder: 2,
      },
    ])
    .run();

  // FAQs
  db.insert(schema.faqs)
    .values([
      {
        question: "Bagaimana cara memesan kue?",
        answer: "Pilih kue yang kamu mau di halaman Menu, lalu klik tombol 'Pesan via WhatsApp'.",
        isPublished: true,
        sortOrder: 1,
      },
      {
        question: "Berapa lama waktu pembuatan kue custom?",
        answer: "Untuk kue custom kami butuh minimal 3 hari kerja.",
        isPublished: true,
        sortOrder: 2,
      },
    ])
    .run();

  // Site Settings
  const settingsData: { key: string; value: string }[] = [
    { key: "business_name", value: "Niken Bakery" },
    { key: "tagline", value: "Kue lezat untuk setiap momen spesialmu" },
    { key: "timezone", value: "Asia/Jakarta" },
    { key: "whatsapp_number", value: "6281234567890" },
    { key: "wa_default_message", value: "Halo Niken Bakery! Aku mau tanya-tanya soal kue 🙌" },
    { key: "email", value: "contoh@nikenbakery.id" },
    { key: "address", value: "Alamat CONTOH, Jl. Contoh No. 1, Kota Contoh" },
    { key: "maps_url", value: "https://maps.google.com" },
    {
      key: "opening_hours",
      value: JSON.stringify([
        { day: "Senin", open: "08:00", close: "20:00", closed: false },
        { day: "Selasa", open: "08:00", close: "20:00", closed: false },
        { day: "Rabu", open: "08:00", close: "20:00", closed: false },
        { day: "Kamis", open: "08:00", close: "20:00", closed: false },
        { day: "Jumat", open: "08:00", close: "20:00", closed: false },
        { day: "Sabtu", open: "09:00", close: "21:00", closed: false },
        { day: "Minggu", open: "09:00", close: "21:00", closed: false },
      ]),
    },
    { key: "instagram_url", value: "https://instagram.com/nikenbakery_contoh" },
    { key: "tiktok_url", value: "https://tiktok.com/@nikenbakery_contoh" },
    {
      key: "about_story",
      value: "Niken Bakery lahir dari dapur kecil di rumah Niken pada tahun 2020.",
    },
    { key: "about_values", value: JSON.stringify(["Bahan Premium", "Fresh Daily", "Resep Autentik"]) },
  ];

  for (const s of settingsData) {
    db.insert(schema.siteSettings).values(s).run();
  }

  // 5. Buat Akun Admin Tes
  console.log("  → Membuat akun admin tes...");
  const { hashPassword } = await import("../lib/auth/password");
  const adminHash = await hashPassword("testadmin12345");
  db.insert(schema.adminUsers)
    .values({
      username: "testadmin",
      passwordHash: adminHash,
    })
    .run();

  sqlite.close();
  console.log("✅ [Playwright Global Setup] Database tes dan admin berhasil disiapkan!\n");
}
