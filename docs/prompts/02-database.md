# Tahap 02 — Database & Seed

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 01 selesai. Baca dulu: `docs/02-ARCHITECTURE.md` (skema, aturan data, kunci settings), `docs/01-PROJECT_BRIEF.md` (untuk isi seed).

## Tujuan

Database SQLite + Drizzle siap, termasuk migrasi, fungsi query, dan data contoh sehingga halaman publik bisa dibangun tanpa input manual.

## Tugas

1. Pasang `drizzle-orm`, `better-sqlite3`; dev: `drizzle-kit`, `@types/better-sqlite3`, `tsx`. Jika `better-sqlite3` gagal terpasang, catat di PROGRESS.md lalu pakai `@libsql/client` dengan URL `file:` (lihat D-004).
2. Buat `drizzle.config.ts` (dialect `sqlite`, schema `src/db/schema.ts`, out `src/db/migrations`).
3. Tulis `src/db/schema.ts` mengikuti `02-ARCHITECTURE.md`.
4. Tulis `src/db/index.ts`: singleton koneksi (aman terhadap hot-reload dev lewat `globalThis`), buat folder `data/` bila belum ada, aktifkan `journal_mode = WAL` dan `foreign_keys = ON`, baca `DB_PATH`.
5. Script npm: `db:generate`, `db:migrate`, `db:seed`, `db:studio` (script TS dijalankan dengan `tsx --env-file=.env.local`). Generate migrasi awal dan commit foldernya.
6. Buat `src/db/queries/` dengan fungsi baca bertipe (hanya data yang boleh dilihat publik, sesuai aturan data):
   `getSettings()`, `listCategories()`, `listProducts({ categorySlug?, q?, status? })`, `getProductBySlug(slug)` (dengan varian dan gambar), `listFeaturedProducts(limit)`, `listRelatedProducts(productId, limit)`, `listActiveBanners()`, `listTestimonials()`, `listSocialPosts(limit?)`, `listFaqs()`.
7. Tulis `src/db/seed.ts` yang **idempotent** (aman dijalankan berulang, tanpa duplikat; opsi `--reset` untuk mengosongkan data konten):
   - 4 kategori (mis. Cake, Brownies & Bars, Cookies, Pastry) dengan warna token berbeda.
   - 12 sampai 14 produk contoh bernuansa bakery masa kini (mis. strawberry shortcake, fudgy brownies, red velvet, burnt cheesecake, butter cookies, croissant, mille crepes, bolu pandan), harga realistis, sebagian punya 2 sampai 3 varian, campuran status Ready/Pre-order/Habis, 5 sampai 6 `isFeatured`. **Tanpa gambar** (fallback `PlaceholderCake`).
   - 2 banner, 5 testimoni, 6 post social, 6 FAQ, dan seluruh `site_settings` dengan nilai **CONTOH** yang jelas (mis. alamat "Alamat CONTOH, Jl. Contoh No. 1", nomor WA contoh yang tidak nyata).
8. Buat helper `lib/slug.ts` dan `lib/settings.ts` (parsing JSON settings dengan default aman).

## Batasan

- Komponen UI tidak boleh mengimpor `drizzle-orm`/`better-sqlite3`; hanya `src/db/**` dan kode server (action, route, page server component lewat fungsi query).
- Jangan membuat tabel/kolom di luar skema tanpa catatan di DECISIONS.md.
- Jangan commit file `.db`.

## Selesai jika

- [ ] `npm run db:migrate && npm run db:seed` dijalankan **dua kali** tanpa error dan tanpa data ganda.
- [ ] Setiap fungsi query dapat dipanggil dan mengembalikan data seed (verifikasi dengan script sementara atau halaman dev sementara yang dihapus sebelum commit).
- [ ] `npm run lint` dan `npm run build` lulus (pastikan `better-sqlite3` tidak ikut ke bundle client).
- [ ] PROGRESS.md diperbarui, tahap 02 dicentang.

Commit: `feat(db): add schema, migrations, queries and seed data`
