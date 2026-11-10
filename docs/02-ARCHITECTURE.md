# 02 — Arsitektur

## Stack

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js App Router, TypeScript strict |
| Styling | Tailwind CSS v4 |
| Database produksi | Supabase PostgreSQL, Drizzle ORM, `postgres-js` |
| Media produksi | Supabase Storage, bucket publik `nikenbakery-media` |
| Validasi | Zod |
| Auth admin | `jose` (JWT HS256) + `bcryptjs`, cookie httpOnly |
| Gambar | `sharp`, re-encode ke WebP |
| Script TS | `tsx` |

SQLite (`better-sqlite3`) dan migrasi lama hanya dipakai sebagai sumber saat import satu kali; aplikasi runtime memakai PostgreSQL. File koneksi dan query ada di root `db/` karena repository ini tidak memakai `src/`.

## Struktur folder

```text
app/                    # Halaman publik, admin, API, metadata
actions/                # Server Actions dengan validasi server dan requireAdmin
components/             # UI admin, publik, dan primitif
db/                     # Schema PostgreSQL, koneksi, migrasi, query, seed
db/migrations/          # Migrasi SQLite historis, sumber import
db/migrations-postgres/ # Migrasi PostgreSQL yang dijalankan di Supabase
lib/                    # Auth, upload, settings, format, WhatsApp
scripts/                # Migrasi/import data dan utilitas admin
data/                   # Sumber SQLite/uploads lokal; diabaikan Git
docs/                   # Arsitektur, deployment, desain, keputusan
```

## Environment variables

Runtime wajib di production:

- `DATABASE_URL`: Supabase Transaction Pooler, port 6543; URL pooler untuk pemakaian Vercel mengikuti `?workaround=supabase-pooler.vercel`.
- `SUPABASE_URL`: URL project Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only, tidak boleh memakai prefix `NEXT_PUBLIC_`.
- `SUPABASE_STORAGE_BUCKET`: nama bucket Storage publik, default `nikenbakery-media`.
- `SESSION_SECRET`: minimal 32 karakter acak.
- `NEXT_PUBLIC_SITE_URL`: URL publik untuk SEO, metadata, dan sitemap.

Import SQLite opsional menerima `SQLITE_SOURCE_PATH` dan `SQLITE_UPLOAD_DIR`; keduanya hanya untuk skrip `db:import-sqlite`, bukan koneksi runtime.

## Data dan query

Schema PostgreSQL bertipe berada di `db/schema.ts`. Migrasi SQL dihasilkan dengan `npm run db:generate` dan diterapkan eksplisit menggunakan `npm run db:migrate`. Jangan menjalankan migrasi database secara otomatis sebagai bagian dari build Vercel.

Tabel utama: `admin_users`, `categories`, `products`, `product_variants`, `product_images`, `banners`, `testimonials`, `social_posts`, `faqs`, `site_settings`, `events`. Harga disimpan sebagai integer Rupiah; boolean memakai tipe PostgreSQL boolean; timestamp memakai `timestamp with time zone`.

Aturan:

- Harga tampil: varian termurah bila tersedia, jika tidak gunakan `basePrice`.
- Produk publik harus `isPublished = true`; banner harus aktif dan dalam jangka waktu; FAQ, testimoni, dan social harus published.
- Slug unik, huruf kecil, pemisah tanda hubung; konflik mendapat sufiks.
- Pengaturan bisnis seperti nomor WA, alamat, jam, dan sosmed dibaca dari `site_settings`, bukan di-hardcode pada komponen.
- Checkout tetap satu produk, berakhir di WhatsApp, dan tidak menyimpan data pesanan atau memproses pembayaran.

## Penyimpanan gambar

`lib/upload.ts` memvalidasi isi gambar, membatasi 5 MB, lalu mengubahnya ke WebP ukuran lebar 1200 px dan thumbnail 480 px. Di production, hasil disimpan pada bucket Supabase Storage dan URL publik dicatat di tabel. Local fallback boleh digunakan untuk development ketika Storage tidak dikonfigurasi. Route `/media/[...path]` adalah kompatibilitas file lokal lama, bukan penyimpanan persisten produksi.

## Rute

| Rute | Keterangan |
|---|---|
| `/`, `/menu`, `/menu/[slug]`, `/checkout`, `/social`, `/about` | Halaman publik; checkout hanya satu produk |
| `/admin/login` | Login admin |
| `/admin/**` | Dashboard; layout memeriksa sesi dan setiap mutation tetap memanggil `requireAdmin()` |
| `/api/events` | Menerima event analitik tervalidasi tanpa menyimpan IP |
| `/api/health` | Healthcheck |
| `/media/[...path]` | Menyajikan file lokal lama di development/self-hosted saja |

## Keamanan

- Cookie sesi `httpOnly`, `sameSite=lax`, `secure` di production, berlaku 7 hari.
- Setiap input action divalidasi dengan Zod; semua Server Action admin memanggil `requireAdmin()`.
- Upload hanya JPEG/PNG/WebP/AVIF, maksimal 5 MB, diperiksa dan di-encode ulang; SVG ditolak.
- Jangan menggunakan `dangerouslySetInnerHTML` untuk konten admin.
- Link eksternal dibuka dengan `rel="noopener noreferrer"`; link marketplace harus HTTPS.
- Admin dan API tidak dimasukkan ke sitemap; periksa `robots.ts` saat menambah rute.
- Rate limiter in-memory bukan koordinasi global lintas instance serverless; untuk perlindungan trafik tinggi, tambahkan rate limiting di edge sebelum mengaktifkan kampanye besar.

## Deployment

Target production adalah Vercel + Supabase. Koneksi database memakai Supabase Transaction Pooler dengan prepared statements dimatikan; file upload berada di Supabase Storage, bukan filesystem fungsi Vercel. Petunjuk pembuatan project, migrasi, import SQLite, environment, dan deploy ada di [DEPLOY.md](DEPLOY.md).
