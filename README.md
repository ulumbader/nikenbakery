# Niken Bakery

Website katalog kue UMKM dengan desain neo-brutalism dan frosted glass. Pembelian dilakukan untuk satu produk melalui checkout ringkas yang mengirim bill ke WhatsApp; tidak ada keranjang, penyimpanan pesanan, atau pembayaran online.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4
- Supabase PostgreSQL melalui Drizzle ORM dan `pg`
- Supabase Storage untuk foto katalog; gambar diproses menjadi WebP oleh Sharp
- Zod, `jose`, dan `bcryptjs` untuk validasi serta autentikasi admin

## Mulai lokal

Gunakan Node.js 20 atau lebih baru dan npm.

1. Pasang dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env.local`, lalu isi `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `SESSION_SECRET`. Ambil connection string dari Supabase **Connect → Transaction pooler** untuk aplikasi serverless. Jangan beri prefix `NEXT_PUBLIC_` pada service role key.

3. Siapkan skema dan bucket, lalu buat admin:

   ```bash
   npm run db:migrate
   npm run storage:setup
   npm run admin:create
   ```

   `npm run db:seed` hanya untuk database baru yang memang ingin diisi data **CONTOH**. Jangan jalankan seed pada database yang sudah berisi data toko.

4. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

Buka `http://localhost:3000`; dashboard admin tersedia di `/admin`.

## Impor SQLite lama ke Supabase

Jika memindahkan instalasi SQLite yang sudah ada, isi `.env.local` dengan koneksi Supabase serta lokasi sumber `DB_PATH` dan `UPLOAD_DIR`, lalu jalankan:

```bash
npm run migrate:supabase
```

Skrip ini hanya menerima target kosong, membuat skema Postgres dan bucket gambar, menyalin data beserta ID/relasinya, mengunggah foto, lalu membandingkan jumlah baris. Database SQLite dan folder gambar sumber tetap utuh. Periksa ringkasan jumlah baris sebelum mengarahkan deployment ke database tersebut.

## Deploy ke Vercel

Hubungkan repositori ke Vercel dan atur variabel berikut untuk deployment Production (dan Preview bila Preview memakai proyek Supabase terpisah):

- `DATABASE_URL` — connection string Supabase Transaction pooler
- `SUPABASE_URL` — URL proyek Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — rahasia server untuk Supabase Storage
- `SESSION_SECRET` — string acak minimal 32 karakter
- `NEXT_PUBLIC_SITE_URL` — URL situs publik HTTPS

Vercel akan mendeteksi Next.js dan membangun proyek. Lihat [panduan deploy](docs/DEPLOY.md) untuk langkah rinci, keamanan variabel, dan pencadangan.

## Pengujian

- `npm test` menjalankan tes unit dan integrasi SQLite in-memory. Tes upload memakai direktori sementara lokal.
- Playwright E2E memerlukan proyek Supabase khusus yang berbeda dari proyek aplikasi. Isi `E2E_DATABASE_URL`, `E2E_SUPABASE_URL`, dan `E2E_SUPABASE_SERVICE_ROLE_KEY` di `.env.test`; runner menolak koneksi ke proyek yang sama dengan `.env.local`.

## Struktur ringkas

```text
actions/       Server Actions admin
app/           Halaman publik, admin, dan API
components/    Komponen publik, admin, dan UI
db/            Skema PostgreSQL, migrasi Postgres, dan seed
lib/           Auth, format, WhatsApp, upload, dan Supabase Storage
scripts/       Migrasi SQLite, admin, backup lama, dan utilitas
tests/         Unit dan integrasi lokal
e2e/           Skenario Playwright dengan proyek Supabase terpisah
docs/          Brief, arsitektur, deployment, desain, dan panduan admin
```

## Dokumentasi

- [Arsitektur](docs/02-ARCHITECTURE.md)
- [Panduan deployment](docs/DEPLOY.md)
- [Panduan admin](docs/ADMIN_GUIDE.md)
- [Design system](docs/03-DESIGN_SYSTEM.md)
- [Keputusan proyek](docs/DECISIONS.md)
- [Progres](docs/PROGRESS.md)
