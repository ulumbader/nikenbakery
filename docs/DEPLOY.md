# Deploy Niken Bakery ke Vercel + Supabase

Aplikasi memakai Next.js di Vercel, Supabase PostgreSQL untuk data, dan Supabase Storage untuk gambar. Aplikasi memakai Node.js runtime dan koneksi Postgres server-side; jangan mengubah route aplikasi menjadi Edge Runtime.

## 1. Prasyarat

- Proyek Supabase aktif.
- Repositori tersedia di Git provider yang akan dihubungkan ke Vercel.
- SQLite lokal `data/nikenbakery.db` dan folder `data/uploads/` masih ada jika ingin mengimpor instalasi lama.

## 2. Migrasi data SQLite satu kali

Sebelum deployment, siapkan `.env.local` lokal. Isi `DATABASE_URL` dari **Connect → Transaction pooler**, `SUPABASE_URL`, dan `SUPABASE_SERVICE_ROLE_KEY`. Pastikan `DB_PATH` dan `UPLOAD_DIR` menunjuk ke instalasi SQLite lama.

Jalankan dari root proyek:

```bash
npm install
npm run migrate:supabase
```

Skrip akan:

1. Memastikan `DATABASE_URL` dan `SUPABASE_URL` mengarah ke proyek yang sama.
2. Menolak target yang memiliki tabel aplikasi parsial atau data aplikasi, agar tidak menimpa isi Supabase.
3. Membuat tabel Postgres dan mengaktifkan Row Level Security tanpa policy publik.
4. Membuat bucket publik `nikenbakery-media`, mengunggah gambar WebP, dan menyalin seluruh tabel dengan ID serta foreign key tetap.
5. Membandingkan jumlah baris sumber dan target.

> Sumber SQLite dan file unggahan tidak dihapus. Simpan keduanya sampai semua halaman dan foto pada deployment sudah diperiksa. Jangan jalankan `npm run db:seed` pada database yang sudah dimigrasikan.

## 3. Konfigurasi proyek Vercel

1. Impor repositori ke Vercel dan pilih preset Next.js. Build command dan output dapat memakai nilai bawaan Next.js.
2. Tambahkan environment variables untuk Production:

   | Nama | Nilai |
   |---|---|
   | `DATABASE_URL` | Supabase Transaction pooler connection string |
   | `SUPABASE_URL` | Project URL dari Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key; rahasia server saja |
   | `SESSION_SECRET` | Nilai acak minimal 32 karakter |
   | `NEXT_PUBLIC_SITE_URL` | URL HTTPS domain publik |

3. Isi variabel yang sesuai untuk Preview. Gunakan proyek Supabase Preview terpisah bila Preview dapat mengubah data.
4. Deploy. Jika variabel diubah setelah deploy, buat deployment baru agar runtime menerima nilainya.
5. Setelah domain tersambung, uji halaman publik dan `/admin`.

`SUPABASE_SERVICE_ROLE_KEY` tidak boleh diberi prefix `NEXT_PUBLIC_`, dimasukkan ke kode klien, atau disimpan di Git. Aplikasi tidak memakai Supabase anon key di browser. Akses database terjadi di server melalui `DATABASE_URL`; tabel memiliki RLS aktif dan tidak memiliki policy akses publik.

## 4. Membuat akun admin

Isi `.env.local` dengan `DATABASE_URL` produksi serta `ADMIN_USERNAME` dan `ADMIN_PASSWORD` yang kuat. Jalankan:

```bash
npm run admin:create
```

Skrip menambah akun atau memperbarui password pada database yang dituju `DATABASE_URL`. Pastikan targetnya benar sebelum menjalankan.

## 5. Gambar dan Supabase Storage

Unggahan admin diproses menjadi dua ukuran WebP dan disimpan pada bucket `nikenbakery-media`. Bucket mengizinkan pembacaan publik supaya foto katalog dapat ditampilkan; operasi unggah dan hapus hanya memakai service role di server.

Backup database Supabase **tidak** menyertakan file Storage. Siapkan pencadangan objek bucket secara terpisah. Petunjuk pencadangan database dan pemulihan ada di [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups); petunjuk mengambil objek Storage ada di [Supabase Download Objects](https://supabase.com/docs/guides/storage/management/download-objects).

## 6. Backup dan restore

Gunakan backup terkelola Supabase atau ekspor logical database secara berkala. Untuk pemulihan, ikuti prosedur Supabase dan rencanakan downtime. Backup objek `nikenbakery-media` secara terpisah karena database hanya menyimpan URL dan metadata gambar.

Skrip `scripts/backup.ps1`, `scripts/backup.sh`, `scripts/restore.ps1`, dan `scripts/restore.sh` adalah utilitas instalasi SQLite lama; skrip tersebut tidak mencadangkan database atau Storage Supabase.

## 7. Pengujian Playwright

Jalankan E2E hanya dengan proyek Supabase khusus yang berbeda dari proyek aplikasi. Di `.env.test`, isi:

```env
E2E_DATABASE_URL=postgresql://...
E2E_SUPABASE_URL=https://<project-ref>.supabase.co
E2E_SUPABASE_SERVICE_ROLE_KEY=...
```

Runner memeriksa agar proyek database E2E tidak sama dengan proyek pada `.env.local`. Global setup mengisi ulang data contoh dan akun tes di database tersebut. Jangan arahkan variabel `E2E_*` ke proyek produksi.

## 8. Pemeriksaan sebelum publik

- [ ] Environment Production di Vercel berisi variabel server yang benar.
- [ ] `SESSION_SECRET` acak minimal 32 karakter.
- [ ] Password admin unik dan kuat.
- [ ] Domain publik menggunakan HTTPS.
- [ ] `/`, `/menu`, `/about`, `/social`, dan `/admin` merespons.
- [ ] Foto katalog terbuka dari Supabase Storage.
- [ ] Data bertanda **CONTOH** dan harga awal sudah ditinjau pemilik.
- [ ] Tombol checkout membuka WhatsApp dengan bill yang benar di ponsel.
- [ ] Database dan bucket Storage memiliki rencana backup terpisah.
- [ ] Home, menu, detail produk, dan admin diperiksa pada lebar 375px dan 1280px.

Untuk deploy mandiri dengan Docker, aplikasi tetap memerlukan Supabase Postgres dan Supabase Storage serta variabel environment yang sama. Volume lokal Docker tidak lagi menjadi penyimpanan database atau gambar.
