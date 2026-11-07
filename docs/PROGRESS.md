# PROGRESS — Dokumen Hidup

> **Agent WAJIB memperbarui file ini di akhir setiap sesi/tahap.** Ini adalah memori proyek antar sesi.
> Dibuat: 2026-11-07. Terakhir diperbarui: 2026-11-07.

## Posisi saat ini

- **Tahap aktif:** 07 — Admin: produk, kategori, upload gambar
- **Status:** selesai ✅
- **Kondisi repo:** Pipeline upload gambar aman dengan Sharp (WebP 1200w/480w, strip EXIF, tolak SVG & non-image, route `/media/[...path]` dengan cache immutable & proteksi path traversal), manajemen Kategori (`/admin/categories`) dengan sortir tombol naik/turun dan pengecekan produk terkait sebelum hapus, tabel produk responsif (`/admin/products`) dengan pencarian, filter, toggle cepat inline (status, published, featured), dialog konfirmasi hapus (otomatis un-link file gambar di disk), form produk lengkap (`/admin/products/new` dan `/[id]`) dengan auto-slug generator, pengelola varian dinamis, dan galeri foto multi-upload (preview instan, cover selector, alt text, reorder, delete). Lint & build lulus 100%.
- **Langkah berikutnya:** kerjakan `docs/prompts/08-admin-content-settings.md` (Tahap 08).

## Checklist tahap

| Tahap | Prompt | Status |
|---|---|---|
| 01 | Foundation & setup (audit, token, komponen UI dasar, styleguide) | [x] |
| 02 | Database & seed (Drizzle, skema, query, data contoh) | [x] |
| 03 | Layout publik & Home | [x] |
| 04 | Menu, detail produk, order WhatsApp | [x] |
| 05 | About Us & Social | [x] |
| 06 | Admin: auth & kerangka dashboard | [x] |
| 07 | Admin: produk, kategori, upload gambar | [x] |
| 08 | Admin: banner, testimoni, social, FAQ, pengaturan | [ ] |
| 09 | Analitik dasar & dashboard ringkasan | [ ] |
| 10 | Polish: SEO, performa, aksesibilitas, QA | [ ] |
| 11 | Deploy & serah terima | [ ] |
| 12 | (Opsional) Form custom order | [ ] |

Status: `[ ]` belum · `[~]` sedang dikerjakan · `[x]` selesai (lint + build lulus, commit dibuat).

## Kondisi awal proyek (diisi di tahap 01)

- Versi Next.js: 16.4.5 / React: 19.3.0 / Tailwind CSS: v4 (syntax `@theme`)
- Memakai `src/`? **Tidak** — file langsung di root (`app/`, `components/`, `lib/`, dll)
- Alias import: `@/*` → `./*`
- Package manager: npm
- ESLint: flat config (`eslint.config.mjs`), `eslint-config-next` core-web-vitals + typescript
- TypeScript: strict mode aktif

## Data bisnis & input dari pengguna

| Item | Status |
|---|---|
| Logo & warna brand Niken Bakery | Belum ada. Pakai palet default di `03-DESIGN_SYSTEM.md` |
| Nomor WhatsApp | Belum ada. Pakai nilai CONTOH |
| Alamat, jam buka, link Maps | Belum ada. Pakai nilai CONTOH |
| Foto produk | Belum ada. Pakai `PlaceholderCake` / Upload WebP |
| Cerita brand (About) | Belum ada. Pakai teks CONTOH |
| Akun Instagram/TikTok | Belum ada. Pakai nilai CONTOH |

Perbarui tabel ini begitu pengguna memberi data asli.

## Cara Membuat Akun Admin Pertama
1. Buka `.env.local` dan pastikan konfigurasi berikut terisi:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password_minimal_10_karakter
   SESSION_SECRET=secret_acak_minimal_32_karakter
   ```
2. Jalankan perintah di terminal:
   ```bash
   npm run admin:create
   ```
3. Akun admin otomatis dibuat/diperbarui di database SQLite.

## Blocker & pertanyaan terbuka

- (kosong)

## Ringkasan sesi terakhir

- Tahap 07 selesai. Dipasang library `sharp`. Dibuat pipeline upload `lib/upload.ts` (validasi batas 5 MB, verifikasi format via Sharp, auto-orientasi EXIF, konversi WebP 1200w dan 480w tanpa EXIF, tolak SVG). Dibuat route handler `app/media/[...path]/route.ts` dengan proteksi path traversal dan caching immutable. Dibuat Server Action `actions/categories.ts` dan komponen `CategoryManager.tsx` pada `/admin/categories` (CRUD kategori, sorting urutan naik/turun, verifikasi produk sebelum hapus dengan pemilih kategori pengganti). Dibuat Server Action `actions/products.ts` (toggle cepat stok, publish, featured, penghapusan produk beserta file fisik di disk, simpan/edit produk). Dibuat tabel produk `components/admin/ProductListTable.tsx` pada `/admin/products` (pencarian, filter kategori/status, toggle cepat inline, dialog hapus). Dibuat `components/admin/ProductForm.tsx` serta halaman `app/admin/(dashboard)/products/new/page.tsx` dan `app/admin/(dashboard)/products/[id]/page.tsx` (auto-slug, pengelola varian harga, galeri multi-upload foto dengan preview, cover selector, reorder, delete). Lint dan build lulus 100%.

## Log sesi (terbaru di atas)

### 2026-11-07 — Tahap 07
- Dikerjakan: pasang `sharp`. Buat `lib/upload.ts` (validasi ukuran 5MB, format JPEG/PNG/WebP/AVIF via Sharp, auto-rotate, WebP 1200w dan 480w, strip EXIF, proteksi SVG, `deleteUploadedFile`). Buat route `app/media/[...path]/route.ts` (anti path-traversal, header MIME dan `Cache-Control` immutable). Buat Server Actions `actions/categories.ts` (CRUD, sorting, reassignment dialog) dan komponen `components/admin/CategoryManager.tsx` pada `/admin/categories`. Buat Server Actions `actions/products.ts` (toggle cepat status/publish/featured, hapus produk beserta file fisik di disk, simpan/update produk dengan varian dan gambar). Buat tabel produk responsif `components/admin/ProductListTable.tsx` pada `/admin/products` (search, category filter, status filter, inline toggle, delete dialog). Buat form produk `components/admin/ProductForm.tsx` serta halaman tambah `/admin/products/new` dan edit `/admin/products/[id]` (auto-slug, manajemen varian dinamis, galeri multi-upload foto).
- File penting yang diubah/dibuat: `lib/upload.ts`, `app/media/[...path]/route.ts`, `actions/categories.ts`, `actions/products.ts`, `components/admin/CategoryManager.tsx`, `components/admin/ProductListTable.tsx`, `components/admin/ProductForm.tsx`, `app/admin/(dashboard)/categories/page.tsx`, `app/admin/(dashboard)/products/**`, `package.json`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada (mengikuti D-007)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: pipeline test scratch script lulus (SVG ditolak, non-image ditolak, path traversal terblokir), `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅.
- Berikutnya: tahap 08 (Admin: banner, testimoni, social, FAQ, pengaturan)

### 2026-11-07 — Tahap 06
- Dikerjakan: pasang `jose`, `bcryptjs`, `zod`, `@types/bcryptjs`. Buat `lib/auth/password.ts` (hash & compare bcrypt), `lib/auth/session.ts` (SignJWT & jwtVerify HS256, cookie httpOnly 7 hari), `lib/auth/require-admin.ts`. Buat script CLI `scripts/create-admin.ts` dan script npm `admin:create` (validasi password minimal 10 karakter). Buat Server Action `actions/auth.ts` (`loginAction` dengan rate limiting dan zod, `logoutAction`). Buat form login `components/admin/LoginForm.tsx` (`useActionState`) dan halaman `app/admin/login/page.tsx`. Buat proteksi ganda: `proxy.ts` (konvensi Next.js 16 pengganti `middleware.ts`, D-014) dan `requireAdmin()` di layout dashboard. Buat kerangka admin `components/admin/AdminNav.tsx` dan `app/admin/(dashboard)/layout.tsx` (neo-brutal bersih, tanpa glass). Buat halaman overview `app/admin/(dashboard)/page.tsx` dan 7 stub rute admin (`products`, `categories`, `banners`, `testimonials`, `social`, `faqs`, `settings`). Buat `app/robots.ts` (disallow `/admin`).
- File penting yang diubah/dibuat: `lib/auth/*.ts`, `actions/auth.ts`, `scripts/create-admin.ts`, `components/admin/*.tsx`, `proxy.ts`, `app/admin/login/page.tsx`, `app/admin/(dashboard)/**`, `app/robots.ts`, `package.json`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-014 (gunakan `proxy.ts` sesuai konvensi Next.js 16)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run admin:create` berhasil, akses `/admin` tanpa cookie diredirect ke `/admin/login`, `npm run lint` ✅, `npm run build` ✅.
- Berikutnya: tahap 07 (Admin: produk, kategori, upload gambar)

### 2026-11-07 — Tahap 05
- Dikerjakan: buat `lib/hours.ts` (`isOpenNow`, `timeToMinutes`) dengan kemampuan uji tanggal custom, verifikasi logika penanda buka/tutup toko. Buat komponen `components/public/FaqAccordion.tsx` berbasis HTML native `<details>` dan `<summary>` dengan styling neo-brutal (aksesibel via keyboard). Perbarui `app/(public)/about/page.tsx` dengan cerita brand, 3 kartu nilai, lokasi & link Google Maps (iframe kondisional), penanda jam buka aktif, kebijakan & pengiriman, FAQ, dan CTA kontak. Perbarui `app/(public)/social/page.tsx` dengan galeri post solid (Instagram/TikTok), tombol follow sosmed, dan ajakan tag. Pastikan seluruh bagian kosong kondisional dan tidak merender wadah kosong.
- File penting yang diubah/dibuat: `lib/hours.ts`, `components/public/FaqAccordion.tsx`, `components/public/index.ts`, `app/(public)/about/page.tsx`, `app/(public)/social/page.tsx`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, uji logika jam buka dengan script pengujian murni, periksa halaman `/about` dan `/social` di 375px dan 1280px (tanpa scroll horizontal, tidak ada script pihak ketiga).
- Berikutnya: tahap 06 (Admin: auth & kerangka dashboard)

### 2026-11-07 — Tahap 04
- Dikerjakan: buat `components/public/WhatsAppButton.tsx`, refactor `ProductCard` memakai `WhatsAppButton`. Buat `components/public/SearchInput.tsx` (debounced search), `components/public/CategoryPills.tsx` (link filter kategori shareable). Buat `app/(public)/menu/page.tsx` membaca `searchParams` bertipe Promise di Next 16, menampilkan grid produk dan `EmptyState`. Buat `components/public/ProductDetailClient.tsx` (galeri foto, pemilih varian, update harga & pesan WA dinamis, share button dengan fallback toast copy clipboard, sticky mobile glass bar). Buat `app/(public)/menu/[slug]/page.tsx` dengan metadata produk dinamis, pengecekan 404, dan rekomendasi produk terkait. Buat `app/not-found.tsx` bergaya neo-brutal.
- File penting yang diubah/dibuat: `components/public/WhatsAppButton.tsx`, `components/public/SearchInput.tsx`, `components/public/CategoryPills.tsx`, `components/public/ProductDetailClient.tsx`, `components/public/ProductCard.tsx`, `components/public/index.ts`, `app/(public)/menu/page.tsx`, `app/(public)/menu/[slug]/page.tsx`, `app/not-found.tsx`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, uji filter & pencarian di `/menu`, uji ganti varian di `/menu/strawberry-shortcake`, uji slug ngawur di `/menu/kue-ngawur-404` mengarah ke not-found.
- Berikutnya: tahap 05 (About Us & Social)

### 2026-11-07 — Tahap 03
- Dikerjakan: buat `lib/whatsapp.ts` (`normalizePhone`, `buildWhatsAppLink`, `generalMessage`, `orderMessage`, `inquiryMessage`). Buat komponen publik di `components/public/` (`Navbar`, `Footer`, `FloatingWhatsApp`, `ProductCard`). Buat route group `app/(public)/layout.tsx` dan `app/(public)/page.tsx` dengan 8 section berurutan sesuai brief. Buat halaman stub `/menu`, `/social`, `/about`. Update `Button` untuk mendukung link polymorphic (`href`). Nonaktifkan `cacheComponents`/`partialPrefetching` di `next.config.ts` untuk dynamic rendering UMKM yang stabil (D-013).
- File penting yang diubah/dibuat: `lib/whatsapp.ts`, `components/public/Navbar.tsx`, `components/public/Footer.tsx`, `components/public/FloatingWhatsApp.tsx`, `components/public/ProductCard.tsx`, `components/public/index.ts`, `components/ui/Button.tsx`, `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/(public)/menu/page.tsx`, `app/(public)/social/page.tsx`, `app/(public)/about/page.tsx`, `next.config.ts`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-013
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, periksa responsivitas Home di 375px dan 1280px (tanpa scroll horizontal, max 2-3 elemen glass).
- Berikutnya: tahap 04 (Menu, detail produk, order WhatsApp)

### 2026-11-07 — Tahap 02
- Dikerjakan: pasang `drizzle-orm`, `better-sqlite3`, `drizzle-kit`, `@types/better-sqlite3`, `tsx`. Buat `drizzle.config.ts`, `db/schema.ts`, `db/index.ts` (singleton WAL mode & foreign keys), `db/migrate.ts`, dan migrasi awal `db/migrations/0000_free_magma.sql`. Buat fungsi query bertipe di `db/queries/index.ts`, helper `lib/slug.ts` dan `lib/settings.ts`. Buat seed script `db/seed.ts` (idempotent, 14 produk kekinian, 4 kategori, 2 banner, 5 testimoni, 6 post social, 6 FAQ, 20 settings bertanda CONTOH). Uji idempotency seed dan verifikasi seluruh query.
- File penting yang diubah/dibuat: `drizzle.config.ts`, `db/schema.ts`, `db/index.ts`, `db/migrate.ts`, `db/migrations/*`, `db/seed.ts`, `db/queries/index.ts`, `lib/settings.ts`, `lib/slug.ts`, `package.json`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run db:migrate`, `npm run db:seed` dijalankan 2x idempotently, query test lulus, `npm run lint` ✅, `npm run build` ✅.
- Berikutnya: tahap 03 (Layout publik & Home)

### 2026-11-07 — Tahap 01
- Dikerjakan: audit proyek, bersihkan boilerplate, set `lang="id"`, metadata title template, font Bricolage Grotesque + Figtree, token warna + shadow di `globals.css` (Tailwind v4 `@theme`), kelas `.glass` + fallback + `-webkit-`, `prefers-reduced-motion`, focus ring. Buat 11 komponen UI (`Button`, `Card`, `Badge`/`Sticker`, `StatusBadge`, `Pill`, `GlassPanel`, `Marquee`, `SectionHeading`, `Input`/`Select`/`Textarea`, `PlaceholderCake`, `EmptyState`). Buat `lib/format.ts` (`formatRupiah`, `formatDate`). Buat halaman `/styleguide` (notFound di prod). Perbarui `.gitignore` (tambah `data/`, perbaiki `.env*`).
- File penting yang diubah/dibuat: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/styleguide/page.tsx`, `components/ui/*.tsx`, `components/ui/index.ts`, `lib/format.ts`, `.gitignore`
- Keputusan baru: D-012 (proyek tidak memakai `src/`, path disesuaikan)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, buka `/styleguide` di dev (`npm run dev`) dan periksa di 375px dan 1280px
- Berikutnya: tahap 02 (Database & seed)
