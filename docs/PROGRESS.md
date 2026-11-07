# PROGRESS — Dokumen Hidup

> **Agent WAJIB memperbarui file ini di akhir setiap sesi/tahap.** Ini adalah memori proyek antar sesi.
> Dibuat: 2026-11-07. Terakhir diperbarui: 2026-11-07.

## Posisi saat ini

- **Tahap aktif:** 05 — About Us & Social
- **Status:** selesai ✅
- **Kondisi repo:** Halaman `/about` (cerita brand, 3 nilai toko, lokasi dengan Google Maps, jam operasional dengan penanda real-time Buka/Tutup via `lib/hours.ts`, info pengiriman & kebijakan, FAQ neo-brutal native `<details>/<summary>`, kontak CTA) dan `/social` (galeri kartu post Instagram/TikTok tanpa embed pihak ketiga, tombol ikuti akun, ajakan tag), lint & build lulus.
- **Langkah berikutnya:** kerjakan `docs/prompts/06-admin-auth.md` (Tahap 06).

## Checklist tahap

| Tahap | Prompt | Status |
|---|---|---|
| 01 | Foundation & setup (audit, token, komponen UI dasar, styleguide) | [x] |
| 02 | Database & seed (Drizzle, skema, query, data contoh) | [x] |
| 03 | Layout publik & Home | [x] |
| 04 | Menu, detail produk, order WhatsApp | [x] |
| 05 | About Us & Social | [x] |
| 06 | Admin: auth & kerangka dashboard | [ ] |
| 07 | Admin: produk, kategori, upload gambar | [ ] |
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
| Foto produk | Belum ada. Pakai `PlaceholderCake` |
| Cerita brand (About) | Belum ada. Pakai teks CONTOH |
| Akun Instagram/TikTok | Belum ada. Pakai nilai CONTOH |

Perbarui tabel ini begitu pengguna memberi data asli.

## Blocker & pertanyaan terbuka

- (kosong)

## Ringkasan sesi terakhir

- Tahap 05 selesai. Helper `lib/hours.ts` dibuat dan diverifikasi murni untuk menghitung status buka/tutup toko saat ini berdasarkan jadwal jam buka dan zona waktu `Asia/Jakarta`. Halaman `/about` mengintegrasikan cerita brand, 3 nilai toko, info lokasi, jadwal jam buka dengan penanda status aktif, info pengiriman & kebijakan pesanan, FAQ interaktif berbasis native `<details>/<summary>`, dan CTA kontak. Halaman `/social` menyajikan galeri postingan media sosial solid tanpa embed script pihak ketiga, tombol ikuti Instagram/TikTok, serta ajakan tag akun. Lint & build lulus.

## Log sesi (terbaru di atas)

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
