# 🧁 Niken Bakery

Website katalog kue untuk Niken Bakery dengan tampilan neo-brutalism, dashboard admin, checkout satu produk melalui WhatsApp, dan tautan marketplace per produk.

## Stack

- Next.js App Router, TypeScript strict, Tailwind CSS v4
- Supabase PostgreSQL melalui Drizzle ORM dan `postgres-js`
- Supabase Storage untuk foto publik produk dan konten
- `sharp` untuk mengubah gambar ke WebP; `zod` untuk validasi
- `jose` + `bcryptjs` untuk sesi admin

## Menjalankan lokal

1. Instal dependensi:

   ```bash
   npm install
   ```

2. Buat project Supabase, salin `.env.example` menjadi `.env.local`, lalu isi `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, dan `SESSION_SECRET`. Untuk koneksi aplikasi, gunakan connection string **Transaction Pooler** Supabase.

3. Buat bucket Storage bernama `nikenbakery-media` dan atur sebagai **public**. Upload dan hapus tetap memakai service role dari server; kunci tersebut jangan pernah diberi awalan `NEXT_PUBLIC_`.

4. Jalankan migrasi database, lalu (opsional) data contoh dan akun admin:

   ```bash
   npm run db:migrate
   npm run db:seed
   npm run admin:create
   ```

5. Jalankan situs:

   ```bash
   npm run dev
   ```

Seed hanya menambahkan contoh yang belum ada dan tidak menghapus atau menimpa konten yang sudah tersimpan.

## Memindahkan data SQLite lama

Jika situs telah memiliki data di `data/nikenbakery.db`, jangan jalankan seed sebagai cara migrasi. Setelah schema Supabase dimigrasikan dan bucket tersedia, atur `SQLITE_SOURCE_PATH` serta `SQLITE_UPLOAD_DIR`, lalu jalankan:

```bash
npm run db:import-sqlite
```

Importer hanya berjalan jika tabel Supabase masih kosong, memindahkan metadata dan foto, serta membiarkan file SQLite asli utuh. Periksa hasil import dan cadangkan file sumber sebelum menghapus/memindahkan apa pun.

## Deploy ke Vercel

Panduan langkah demi langkah, konfigurasi environment, pooler, Storage, dan migrasi tersedia di [docs/DEPLOY.md](docs/DEPLOY.md). Buat project Vercel dari repository dan tambahkan environment variables untuk Production, Preview, dan Development yang diperlukan. Jalankan `npm run db:migrate` sekali terhadap project Supabase sebelum menerima trafik.

Environment minimum runtime:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Instal dari browser

Situs produksi harus menggunakan HTTPS agar browser mengizinkan instalasi. Chrome/Edge menampilkan **Install app / Instal aplikasi**; iPhone/iPad memakai Safari → **Bagikan** → **Tambahkan ke Layar Utama**. Aplikasi tetap memerlukan internet; mode offline belum tersedia.

## Perintah utama

```bash
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:seed
npm run admin:create
```

Informasi desain, keamanan, admin, dan riwayat keputusan ada di folder `docs/`.
