# Tahap 11 — Deploy & Serah Terima

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 10 selesai. Baca dulu `docs/02-ARCHITECTURE.md`, `docs/DECISIONS.md`, dan `docs/DEPLOY.md`.

## Tujuan

Aplikasi siap dideploy ke Vercel dengan Supabase PostgreSQL untuk data persisten dan Supabase Storage untuk gambar. **Jangan melakukan deployment sungguhan kecuali pengguna meminta.**

## Tugas

1. Gunakan connection pool server-side yang sesuai untuk fungsi serverless; simpan seluruh rahasia hanya pada environment server.
2. Sediakan migrasi data satu kali dari SQLite lokal. Pertahankan ID, foreign key, timestamp, akun admin, konten, dan foto. Target tidak boleh berisi data aplikasi. Jangan menghapus atau mengubah sumber SQLite.
3. Aktifkan RLS pada tabel aplikasi tanpa policy publik. Upload gambar melalui service role server-side ke bucket Storage; gambar katalog boleh dibaca publik.
4. Dokumentasikan konfigurasi Vercel, admin, migrasi, backup database, dan backup objek Storage secara terpisah.
5. Perbarui README, `docs/PROGRESS.md`, `docs/DECISIONS.md`, dan panduan pemilik bila diperlukan.

## Batasan

- Jangan menaruh rahasia di repo, bundle browser, atau image Docker.
- Jangan menimpa atau menghapus sumber data milik pengguna.
- Jangan mengaktifkan akses publik ke tabel database.

## Selesai jika

- [x] Migrasi menolak target yang sudah berisi data dan memeriksa jumlah baris setelah impor.
- [x] Data SQLite dan foto lokal tetap tersedia sebagai sumber pemulihan.
- [x] Aplikasi memakai Supabase Postgres dan Storage tanpa filesystem persisten.
- [x] Lint dan build lulus; `PROGRESS.md` diperbarui.

Commit mengikuti Conventional Commits berbahasa Inggris.
