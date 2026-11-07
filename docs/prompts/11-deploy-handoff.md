# Tahap 11 — Deploy & Serah Terima

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 10 selesai. Baca dulu: `docs/02-ARCHITECTURE.md` (bagian Deployment, env), `docs/DECISIONS.md` (D-004, D-007, D-009).

## Tujuan

Aplikasi dapat dijalankan di server dengan data yang persisten dan bisa dicadangkan, serta pemilik punya panduan yang mudah diikuti. **Jangan men-deploy sungguhan kecuali pengguna meminta.**

## Tugas

1. `output: "standalone"` di konfigurasi Next. `Dockerfile` multi-stage (gunakan image Node LTS berbasis Debian slim agar modul native `better-sqlite3` aman), `.dockerignore`, `docker-compose.yml` dengan volume `./data:/app/data`, variabel env dari file, dan healthcheck ke `/api/health`.
2. Skrip start yang menjalankan migrasi lalu menyalakan server, tanpa menimpa data yang ada.
3. **Backup**: skrip yang membuat salinan konsisten SQLite (`VACUUM INTO` atau API backup) dan mengarsipkan `uploads/` ke satu file bertanggal; versi untuk Linux (shell) dan Windows (PowerShell). Dokumentasikan restore.
4. `docs/DEPLOY.md`: langkah deploy ke VPS (Docker, reverse proxy HTTPS dengan Caddy atau Nginx, env wajib, `admin:create`, jadwal backup via cron), serta jalur migrasi ke Turso/Postgres bila ingin pindah ke platform serverless (D-009).
5. `docs/ADMIN_GUIDE.md`: panduan **untuk pemilik non-teknis**, Bahasa Indonesia, bahasa awam, langkah bernomor: login, tambah kue, ganti foto, tandai habis, ubah promo, ubah nomor WA dan jam buka, apa yang dilakukan bila lupa password (jalankan `admin:create` lewat pengelola teknis).
6. Tulis ulang `README.md` proyek: deskripsi, cara menjalankan lokal (env, migrasi, seed, admin), struktur singkat, tautan ke `docs/`.
7. Daftar periksa produksi di DEPLOY.md: `SESSION_SECRET` kuat, password admin kuat, HTTPS aktif, data seed CONTOH sudah diganti data asli, backup terjadwal.

## Batasan

- Jangan menaruh rahasia di repo atau image Docker.
- Jangan mengubah perilaku aplikasi; hanya packaging dan dokumentasi.

## Selesai jika

- [ ] `docker compose up` (jika Docker tersedia) menjalankan aplikasi; data bertahan setelah container di-recreate.
- [ ] Skrip backup menghasilkan arsip yang bisa dipulihkan (uji restore ke folder lain).
- [ ] ADMIN_GUIDE dapat diikuti orang awam tanpa istilah teknis yang tidak dijelaskan.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `chore(deploy): add docker setup, backup scripts and docs`
