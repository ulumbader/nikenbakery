# 02 — Architecture

Notasi path memakai `src/`. Jika proyek tidak memakai `src/`, sesuaikan secara konsisten dan catat di `DECISIONS.md` (tahap 01).

## Stack

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js App Router, TypeScript strict |
| Styling | Tailwind CSS (cek versi: v4 memakai `@theme` di CSS, v3 memakai `tailwind.config`) |
| Database | SQLite (file `data/nikenbakery.db`), Drizzle ORM, `better-sqlite3`, WAL mode, `foreign_keys = ON` |
| Validasi | zod |
| Auth admin | `jose` (JWT HS256) + `bcryptjs`, cookie httpOnly |
| Gambar | `sharp` (WebP) |
| Script TS | `tsx` |

## Struktur folder (target)

```
src/
  app/
    (public)/
      layout.tsx            # Navbar, Footer, FloatingWhatsApp
      page.tsx              # Home
      menu/page.tsx
      menu/[slug]/page.tsx
      social/page.tsx
      about/page.tsx
    admin/
      login/page.tsx
      (dashboard)/
        layout.tsx          # sidebar + requireAdmin()
        page.tsx            # ringkasan
        products/ (page, new, [id])
        categories/ banners/ testimonials/ social/ faqs/ settings/
    media/[...path]/route.ts  # sajikan file upload
    api/health/route.ts
    styleguide/page.tsx       # hanya development
    sitemap.ts  robots.ts  not-found.tsx  error.tsx
  components/
    ui/        # Button, Card, Badge, Pill, GlassPanel, Marquee, Input, ...
    public/    # Navbar, Footer, ProductCard, Hero, ...
    admin/     # AdminSidebar, DataTable, ImageUploader, ...
  db/
    index.ts  schema.ts  seed.ts  migrations/
    queries/   # products.ts, categories.ts, settings.ts, content.ts, events.ts
  actions/     # server actions per entitas (products.ts, ...)
  lib/
    format.ts       # formatRupiah, formatDate
    whatsapp.ts     # normalizePhone, buildWhatsAppLink, template pesan
    auth/           # password.ts, session.ts, require-admin.ts
    upload.ts       # validasi + sharp + simpan/hapus file
    slug.ts  settings.ts  hours.ts
data/                       # di-gitignore: nikenbakery.db, uploads/
scripts/                    # backup, admin:create
```

## Environment variables

Lihat `.env.example`: `DB_PATH`, `UPLOAD_DIR`, `SESSION_SECRET` (≥ 32 karakter), `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`/`ADMIN_PASSWORD` (hanya untuk script `admin:create`).

## Skema database (acuan; sesuaikan sintaks dengan versi `drizzle-orm` terpasang)

```ts
// src/db/schema.ts
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

const ts = {
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
};
const COLORS = ["pink", "butter", "mint", "lavender"] as const;

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  ...ts,
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color", { enum: COLORS }).notNull().default("butter"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  basePrice: integer("base_price").notNull(),             // Rupiah
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  status: text("status", { enum: ["ready", "preorder", "soldout"] }).notNull().default("ready"),
  preorderNote: text("preorder_note"),                    // mis. "Pre-order H-2"
  ingredients: text("ingredients"),
  allergens: text("allergens"),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
}, (t) => [index("products_category_idx").on(t.categoryId)]);

export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),                         // mis. "Diameter 18 cm"
  price: integer("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),                  // large 1200w
  thumbName: text("thumb_name").notNull(),                // thumb 480w
  alt: text("alt").notNull().default(""),
  isCover: integer("is_cover", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageFile: text("image_file"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  color: text("color", { enum: COLORS }).notNull().default("pink"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle"),                                 // mis. "@username"
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const socialPosts = sqliteTable("social_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform", { enum: ["instagram", "tiktok", "other"] }).notNull().default("instagram"),
  imageFile: text("image_file"),
  caption: text("caption").notNull().default(""),
  postUrl: text("post_url").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),                         // string; nilai kompleks = JSON
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["product_view", "wa_click"] }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
}, (t) => [index("events_type_created_idx").on(t.type, t.createdAt)]);
```

### Aturan data

- **Harga tampil**: jika produk punya varian, tampilkan "Mulai dari Rp{harga varian terendah}"; jika tidak, pakai `basePrice`.
- **Cover**: tepat satu `is_cover` per produk; jika tidak ada, pakai gambar pertama; jika tidak ada gambar, tampilkan `PlaceholderCake`.
- **Publik hanya melihat**: produk `isPublished = true`, banner aktif dalam rentang jadwal, testimoni/FAQ/social yang published.
- **Slug**: unik, huruf kecil, tanda hubung; dibuat otomatis dari nama, bisa diedit; tangani tabrakan dengan sufiks `-2`, `-3`.

### Kunci `site_settings` (dengan nilai default seed bertanda CONTOH)

`business_name`, `tagline`, `timezone` (default `Asia/Jakarta`), `whatsapp_number` (disimpan ternormalisasi), `wa_default_message`, `email`, `address`, `maps_url`, `maps_embed_url`, `opening_hours` (JSON: `[{day, open, close, closed}]` ×7), `instagram_url`, `tiktok_url`, `about_story`, `about_values` (JSON array 3 item), `about_image`, `delivery_info`, `order_policy`, `halal_info`, `custom_order_enabled`, `custom_order_min_days`.

Akses lewat `getSettings()` yang mengembalikan objek bertipe dengan default aman bila kunci kosong.

## Rute

| Rute | Tipe | Keterangan |
|---|---|---|
| `/` `/menu` `/menu/[slug]` `/social` `/about` | Publik | Data dari DB; `/menu` membaca `?kategori=` dan `?q=` |
| `/admin/login` | Publik | Form login |
| `/admin/**` | Terproteksi | `requireAdmin()` di layout **dan** di setiap action |
| `/media/[...path]` | Publik | Sajikan file dari `UPLOAD_DIR`; blok path traversal; cache panjang (nama file acak) |
| `/api/health` | Publik | `{ ok: true }` untuk healthcheck |

## Keamanan

- Cookie sesi: `httpOnly`, `sameSite=lax`, `secure` di production, masa berlaku 7 hari. `SESSION_SECRET` wajib; aplikasi gagal start jika kosong di production.
- Pesan error login generik ("Username atau password salah"). Batasi percobaan login (mis. 5 kali per 15 menit per IP+username, in-memory cukup).
- Upload: hanya JPEG/PNG/WebP/AVIF, maksimal 5 MB, verifikasi isi file lewat `sharp`, selalu re-encode (membuang EXIF). SVG ditolak.
- Semua input admin divalidasi zod di server. Escape output (React sudah default); jangan memakai `dangerouslySetInnerHTML` untuk konten admin.
- Link eksternal: `target="_blank"` selalu dengan `rel="noopener noreferrer"`.
- `/admin` dan `/media` di-`noindex`/disallow di robots untuk admin.
- Event analitik tidak menyimpan IP atau data pribadi.

## Caching dan tampilan perubahan admin

Perubahan dari admin harus langsung terlihat di publik. Panggil `revalidatePath` setelah setiap mutasi. Jika perilaku caching membingungkan di versi Next terpasang, render halaman publik secara dinamis (trafik UMKM kecil) dan catat di `DECISIONS.md`.

## Deployment

SQLite berbasis file **tidak persisten di platform serverless** (mis. Vercel). Target: VPS atau PaaS dengan volume persisten untuk `data/` (Docker + `output: "standalone"`). Jika ingin Vercel, pindah ke Turso (libSQL; Drizzle mendukung) cukup dengan mengganti `src/db/index.ts` karena akses DB terisolasi.
