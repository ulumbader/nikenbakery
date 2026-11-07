# Panduan Deployment — Niken Bakery

Dokumen ini menjelaskan langkah-langkah untuk menjalankan aplikasi **Niken Bakery** di lingkungan produksi menggunakan VPS (Virtual Private Server) berbasis Linux (Ubuntu/Debian) dengan Docker, konfigurasi reverse proxy HTTPS, pencadangan otomatis (cron), serta jalur migrasi database bila ingin berpindah ke layanan serverless seperti Turso.

---

## 1. Arsitektur & Kebutuhan Sistem

- **Aplikasi**: Next.js (App Router, Node.js 20 LTS) dengan konfigurasi `output: "standalone"`.
- **Database**: SQLite lokal via `better-sqlite3` dalam mode WAL. Data dan berkas unggahan disimpan dalam folder persisten `./data` (di-mount ke `/app/data` di dalam kontainer Docker).
- **Spesifikasi Minimum VPS**:
  - CPU: 1 vCPU
  - RAM: 1 GB (disarankan 2 GB jika melakukan build langsung di server)
  - Penyimpanan: 10 GB SSD (disesuaikan dengan volume unggahan foto)
  - OS: Ubuntu 22.04 LTS / 24.04 LTS atau Debian 12 (Bookworm)
  - Perangkat Lunak: Docker Engine (>= 24.x) dan Docker Compose (>= 2.x)

> [!IMPORTANT]
> Jangan menjalankan aplikasi ini di platform *ephemeral serverless* (seperti Vercel atau Netlify) dengan SQLite lokal, karena berkas `./data` akan hilang setiap kali kontainer serverless di-restart. Untuk Vercel, lihat [Bagian 7: Jalur Migrasi ke Turso](#7-jalur-migrasi-ke-turso-serverless).

---

## 2. Langkah-Langkah Deploy ke VPS

### Langkah 1: Persiapan Server & Clone Repo

1. Masuk ke VPS Anda melalui SSH:
   ```bash
   ssh user@ip-server-anda
   ```
2. Pastikan Docker dan Docker Compose telah terpasang:
   ```bash
   docker --version
   docker compose version
   ```
3. Unduh atau clone repositori proyek:
   ```bash
   git clone <URL_REPO_ANDA> /var/www/nikenbakery
   cd /var/www/nikenbakery
   ```

### Langkah 2: Konfigurasi Environment Produksi

Buat berkas `.env` di root direktori proyek:
```bash
cp .env.example .env # atau nano .env
```

Isi variabel lingkungan produksi dengan nilai yang aman:
```env
# Node & Port
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Database & Uploads
DB_PATH=/app/data/nikenbakery.db
UPLOAD_DIR=/app/data/uploads

# Kunci Rahasia Sesi Admin (WAJIB: string acak minimal 32 karakter)
# Buat dengan: openssl rand -base64 32
SESSION_SECRET=ganti_dengan_kunci_acak_yang_sangat_panjang_dan_rahasia_32chars!

# URL Publik Situs (untuk SEO & OpenGraph)
NEXT_PUBLIC_SITE_URL=https://nikenbakery.com
```

### Langkah 3: Bangun & Jalankan Aplikasi dengan Docker Compose

Jalankan perintah berikut untuk membangun citra Docker dan menyalakan kontainer di latar belakang:
```bash
docker compose up -d --build
```

Docker entrypoint (`scripts/docker-entrypoint.sh`) akan otomatis:
1. Memastikan folder `/app/data` dan `/app/data/uploads` siap.
2. Menjalankan migrasi skema database (`node scripts/migrate.js`).
3. Menjalankan server Next.js standalone.

Periksa status kontainer:
```bash
docker compose ps
docker compose logs -f
```

### Langkah 4: Membuat Akun Admin Awal

Jalankan perintah berikut di dalam kontainer yang sedang berjalan:
```bash
docker compose exec web node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('/app/data/nikenbakery.db');
const username = 'admin';
const password = 'GantiPasswordKuatIni!';
const hash = bcrypt.hashSync(password, 10);
const now = new Date().toISOString();
db.prepare('INSERT OR REPLACE INTO admin_users (id, username, password_hash, created_at, updated_at) VALUES (1, ?, ?, ?, ?)').run(username, hash, now, now);
console.log('Admin berhasil dibuat!');
db.close();
"
```
*(Atau jalankan skrip `npm run admin:create` jika Node.js dan dependensi terpasang di host server).*

---

## 3. Konfigurasi Reverse Proxy & HTTPS

Aplikasi berjalan pada port internal `3000`. Gunakan reverse proxy untuk menangani sertifikat SSL/HTTPS otomatis dan meneruskan trafik publik (port 80 & 443) ke port 3000.

### Pilihan A: Menggunakan Caddy (Sangat Direkomendasikan — Termudah)

Caddy secara otomatis mengelola dan memperbarui sertifikat SSL Let's Encrypt tanpa konfigurasi rumit.

1. Pasang Caddy di server (`sudo apt install caddy`).
2. Edit `/etc/caddy/Caddyfile`:
   ```caddy
   nikenbakery.com, www.nikenbakery.com {
       reverse_proxy 127.0.0.1:3000

       # Kompresi gzip/zstd
       encode gzip zstd

       # Batas upload file 10MB
       request_body {
           max_size 10MB
       }

       # Header keamanan standar
       header {
           Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
           X-Content-Type-Options "nosniff"
           X-Frame-Options "DENY"
           Referrer-Policy "strict-origin-when-cross-origin"
       }
   }
   ```
3. Muat ulang Caddy:
   ```bash
   sudo systemctl reload caddy
   ```

### Pilihan B: Menggunakan Nginx + Certbot

1. Buat berkas `/etc/nginx/sites-available/nikenbakery`:
   ```nginx
   server {
       server_name nikenbakery.com www.nikenbakery.com;

       client_max_body_size 10M;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
2. Aktifkan situs dan pasang sertifikat Let's Encrypt:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nikenbakery /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d nikenbakery.com -d www.nikenbakery.com
   ```

---

## 4. Pencadangan Otomatis (Cron Job)

Database SQLite dalam mode WAL membutuhkan pencadangan konsisten agar data tidak korup saat server sedang membaca/menulis data. Repositori telah dilengkapi dengan skrip:
- `scripts/backup.sh` (Linux / VPS)
- `scripts/backup.ps1` (Windows)
- `scripts/sqlite-backup.js` (Helper online backup SQLite)

### Mengatur Jadwal Cron di VPS

1. Buka editor crontab:
   ```bash
   crontab -e
   ```
2. Tambahkan baris jadwal berikut untuk menjalankan backup setiap hari pada jam 02.00 pagi dan menghapus arsip yang lebih lama dari 30 hari:
   ```cron
   # Backup harian Niken Bakery jam 02:00 WIB
   0 2 * * * cd /var/www/nikenbakery && ./scripts/backup.sh >> /var/log/nikenbakery-backup.log 2>&1

   # Hapus backup lama (> 30 hari) jam 03:00 WIB
   0 3 * * * find /var/www/nikenbakery/backups -type f -name "nikenbakery_backup_*.tar.gz" -mtime +30 -delete
   ```

---

## 5. Panduan Pemulihan Data (Restore)

Jika terjadi kendala sistem atau ingin memindahkan server:

1. Matikan sementara kontainer web agar tidak ada transaksi baru:
   ```bash
   docker compose down
   ```
2. Jalankan skrip restore:
   ```bash
   ./scripts/restore.sh ./backups/nikenbakery_backup_YYYYMMDD_HHMMSS.tar.gz
   ```
   *(Skrip akan otomatis membuat salinan pengaman darurat sebelum mengekstrak database dan berkas foto).*
3. Nyalakan kembali kontainer:
   ```bash
   docker compose up -d
   ```

---

## 6. Jalur Migrasi ke Turso (Serverless / Vercel)

Jika di masa mendatang tim ingin meng-host web di Vercel atau edge serverless:

1. **Buat Database di Turso**:
   ```bash
   turso db create nikenbakery
   turso db show nikenbakery --url
   turso db tokens create nikenbakery
   ```
2. **Ubah Adapter Database (`db/index.ts`)**:
   Drizzle ORM mendukung libSQL / Turso. Ganti `better-sqlite3` dengan `@libsql/client`:
   ```ts
   import { drizzle } from "drizzle-orm/libsql";
   import { createClient } from "@libsql/client";

   const client = createClient({
     url: process.env.TURSO_DATABASE_URL!,
     authToken: process.env.TURSO_AUTH_TOKEN,
   });

   export const db = drizzle(client);
   ```
3. **Pindahkan Berkas Unggahan**:
   Karena Vercel tidak memiliki sistem berkas lokal persisten, alihkan folder `data/uploads` ke penyimpanan objek seperti Cloudflare R2, AWS S3, atau Supabase Storage.
4. **Push Skema ke Turso**:
   ```bash
   npx drizzle-kit push
   ```

---

## 7. Daftar Periksa Produksi (Production Checklist)

Sebelum meresmikan website untuk publik, pastikan seluruh poin di bawah telah terpenuhi:

- [ ] **Kunci Sesi Kuat**: `SESSION_SECRET` di `.env` telah diisi string acak minimal 32 karakter (bukan nilai default).
- [ ] **Password Admin Unik**: Password akun admin telah diubah dari nilai default dan memiliki kombinasi yang aman.
- [ ] **HTTPS Aktif**: Akses via `http://` otomatis di-redirect ke `https://` dan sertifikat SSL valid.
- [ ] **Data Bisnis Asli**: Teks bertanda **CONTOH** (nomor WA, alamat toko, jam buka, link Instagram/TikTok) di menu Pengaturan Admin telah diganti dengan data riil toko.
- [ ] **Katalog Produk Riil**: Produk contoh telah disesuaikan dengan daftar kue dan harga asli Niken Bakery.
- [ ] **Uji Pesan WhatsApp**: Klik tombol "Pesan via WhatsApp" dari ponsel untuk memastikan aplikasi WhatsApp terbuka dengan format pesan yang benar.
- [ ] **Pencadangan Teruji**: Skrip `backup.sh` telah diuji coba dan menghasilkan berkas arsip yang valid di folder `backups/`.
- [ ] **Firewall Server**: Hanya port 22 (SSH), 80 (HTTP), dan 443 (HTTPS) yang terbuka untuk publik. Port internal 3000 tidak boleh dibuka langsung ke internet.
