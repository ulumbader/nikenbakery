# Deploy Niken Bakery ke Vercel + Supabase

Web berjalan sebagai Next.js di Vercel. PostgreSQL menyimpan data katalog, pengaturan, akun admin, dan analitik; Supabase Storage menyimpan gambar. SQLite lokal dan folder fungsi Vercel tidak dipakai sebagai penyimpanan produksi.

## 1. Siapkan Supabase

1. Buat project Supabase dan simpan password database dengan aman.
2. Buka **Project Settings → Database → Connection string → Transaction pooler**. Salin URI pooler pada port `6543`; encode karakter khusus pada password sebelum menaruhnya di URI. Tambahkan `?workaround=supabase-pooler.vercel` jika URL belum memiliki query string, atau `&workaround=supabase-pooler.vercel` jika sudah ada.
3. Buka **Storage → New bucket**, buat bucket `nikenbakery-media`, lalu aktifkan **Public bucket** agar gambar katalog dapat dibaca pengunjung. Aplikasi hanya mengunggah dan menghapus objek dari server menggunakan service role.
4. Dari **Project Settings → API**, salin Project URL dan service role key. Jangan menaruh service role key di variabel `NEXT_PUBLIC_*`, kode browser, atau repository.

## 2. Konfigurasi lokal dan migrasi schema

Salin `.env.example` ke `.env.local`, lalu isi nilai berikut:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:DB_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?workaround=supabase-pooler.vercel
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=nikenbakery-media
SESSION_SECRET=nilai-acak-minimal-32-karakter
NEXT_PUBLIC_SITE_URL=https://domain-anda.vercel.app
```

Jalankan migrasi schema satu kali untuk project Supabase yang akan dipakai:

```bash
npm run db:migrate
```

Skrip migrasi berhenti jika koneksi tidak tersedia dan tidak dijalankan otomatis pada setiap Vercel build. Untuk database baru yang benar-benar kosong, data contoh opsional dapat ditambahkan dengan `npm run db:seed`; seed bersifat aditif dan mempertahankan konten yang sudah ada. Buat admin awal setelah variabel `ADMIN_USERNAME` dan `ADMIN_PASSWORD` diisi, lalu jalankan `npm run admin:create`.

## 3. Pindahkan database dan gambar SQLite yang sudah ada

Jika website saat ini sudah berisi data, migrasikan sebelum mengarahkan domain produksi:

1. Pertahankan file sumber `data/nikenbakery.db` dan `data/uploads/` sebagai backup. Jangan jalankan `npm run db:seed` untuk memindahkan data.
2. Pastikan `.env.local` sudah memiliki `DATABASE_URL`, variabel Storage Supabase, serta:

   ```env
   SQLITE_SOURCE_PATH=./data/nikenbakery.db
   SQLITE_UPLOAD_DIR=./data/uploads
   ```

3. Pastikan schema sudah dimigrasikan dan bucket sudah dibuat, lalu jalankan:

   ```bash
   npm run db:import-sqlite
   ```

Importer menolak berjalan jika ada tabel Supabase yang sudah terisi. Import mempertahankan ID dan relasi, mengonversi timestamp/boolean SQLite, menyalin gambar ke bucket, dan mengganti URL gambar pada data tujuan. File SQLite sumber tidak diubah. Setelah selesai, cek jumlah baris dan gambar melalui aplikasi/dashboard sebelum mengaktifkan deployment produksi.

Jika importer terputus sebelum database diisi, perbaiki penyebabnya lalu ulangi. Jika database sudah terisi sebagian oleh tindakan manual, kosongkan atau buat project Supabase baru setelah melakukan backup; importer sengaja tidak menimpa data.

## 4. Deploy aplikasi ke Vercel

1. Push repository ke GitHub/GitLab/Bitbucket, lalu buat project baru di Vercel dan pilih repository.
2. Gunakan framework preset **Next.js**. Build command standar `npm run build`; jangan menambahkan build step untuk menjalankan migrasi database.
3. Tambahkan environment variables di **Project Settings → Environment Variables** untuk Production, Preview, dan Development sesuai kebutuhan:

   | Nama | Isi |
   |---|---|
   | `DATABASE_URL` | Transaction pooler Supabase, port 6543 |
   | `SUPABASE_URL` | Project URL Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key server-only |
   | `SUPABASE_STORAGE_BUCKET` | `nikenbakery-media` |
   | `SESSION_SECRET` | Rahasia acak minimal 32 karakter |
   | `NEXT_PUBLIC_SITE_URL` | Domain publik yang aktif |

   Untuk keamanan, gunakan project Supabase terpisah bagi Preview bila tersedia; jika Preview menggunakan database produksi, preview dapat membaca/menulis konten produksi.
4. Deploy. Pastikan halaman publik, `/admin/login`, upload gambar dari admin, dan link gambar yang tampil berfungsi. Pilih ulang foto untuk menguji upload baru karena upload baru harus masuk Supabase Storage.
5. Atur domain di Vercel. HTTPS disediakan untuk domain Vercel dan domain kustom setelah DNS terverifikasi.

## Koneksi Postgres di Vercel

Gunakan connection pooler transaction Supabase, bukan koneksi langsung database untuk fungsi serverless. Adapter menggunakan `postgres-js` dengan `prepare: false`, SSL, dan maksimal satu koneksi per instance Vercel. Untuk workload besar, evaluasi batas koneksi dan paket Supabase sesuai trafik.

## Variabel rahasia dan keamanan

- `SESSION_SECRET` harus acak, minimal 32 karakter. Ganti jika pernah masuk ke Git atau terkirim ke publik.
- `SUPABASE_SERVICE_ROLE_KEY` memiliki hak server luas. Simpan hanya sebagai environment variable server-side di Vercel.
- Migrasi mengaktifkan Row Level Security tanpa kebijakan publik pada tabel aplikasi. Rute server menggunakan koneksi pooler dengan kredensial database; jangan membuat kebijakan anon yang membuka tabel admin atau data toko.
- Bucket gambar bersifat public untuk pembacaan gambar produk; service role tetap diperlukan untuk mengunggah dan menghapus.
- `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dipakai hanya saat menjalankan skrip lokal `npm run admin:create`, tidak perlu dipasang di Vercel setelah akun admin dibuat.
- Jangan masukkan `.env.local`, export database, atau file di `data/` ke Git.

## Operasional dan backup

Vercel tidak menyimpan berkas runtime secara persisten. Foto produksi berada di Supabase Storage dan data terstruktur berada di Postgres. Atur backup/export database melalui fitur Supabase sesuai paket project, dan simpan salinan objek Storage terpisah bila foto penting. Sebelum migrasi schema atau import besar, buat backup terlebih dahulu.

Script `events:prune` memangkas analitik lebih lama dari 180 hari jika perlu dijalankan manual dari lingkungan aman dengan `DATABASE_URL`; jadwalkan hanya jika kebijakan retensi memang menghendakinya.
