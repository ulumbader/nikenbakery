# 🧁 Niken Bakery

Website katalog kue modern dan responsif untuk UMKM **Niken Bakery**. Dirancang dengan estetika visual **neo-brutalism** yang berani dan energik dipadukan aksen **frosted glass**, ditargetkan untuk generasi muda (Gen-Z). Alur transaksi dirancang gesit dan langsung terhubung ke **WhatsApp** tanpa friksi keranjang atau proses pembayaran rumit.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript strict)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan palet kustom neo-brutalism (Cream, Butter, Pink, Matcha, Lilac, Ink)
- **Database & ORM**: SQLite (`better-sqlite3` dalam mode WAL) & [Drizzle ORM](https://orm.drizzle.team/)
- **Autentikasi Admin**: `jose` (JWT cookie HttpOnly Lax) & `bcryptjs`
- **Optimasi Gambar**: [Sharp](https://sharp.pixelplumbing.com/) (re-encode ke WebP 1200w & 480w, strip EXIF, sajikan via `/media/[...path]`)
- **Validasi Data**: [Zod](https://zod.dev/) pada seluruh Server Actions & Form
- **Pengujian**: [Vitest](https://vitest.dev/) (unit & integrasi query) & [Playwright](https://playwright.dev/) + `@axe-core/playwright` (E2E browser sungguhan & audit aksesibilitas)

---

## 🚀 Memulai (Local Development)

### 1. Kebutuhan Sistem
- [Node.js](https://nodejs.org/) versi 20 LTS atau lebih tinggi
- NPM (bawaan Node.js)

### 2. Instalasi Dependensi
```bash
git clone <URL_REPO>
cd nikenbakery
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin contoh berkas environment:
```bash
cp .env.example .env.local
```
Sesuaikan nilai variabel lingkungan jika diperlukan:
```env
PORT=3000
DB_PATH=./data/nikenbakery.db
UPLOAD_DIR=./data/uploads
SESSION_SECRET=kunci_rahasia_sesi_admin_minimal_32_karakter_acak!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword123
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Migrasi & Seed Database Awal
```bash
# Menjalankan migrasi Drizzle ke SQLite
npm run db:migrate

# Mengisi data awal CONTOH (kategori, kue, foto contoh, testimoni, FAQ, pengaturan toko)
npm run db:seed

# Membuat akun login admin awal
npm run admin:create
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di:
- **Halaman Publik**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) (login dengan akun yang dibuat di langkah 4)

---

## 🧪 Menjalankan Pengujian (Testing)

Proyek ini memiliki pengujian otomatis terisolasi yang **tidak pernah** menyentuh database produksi (`data/nikenbakery.db`):

```bash
# Menjalankan unit test Vitest (fungsi pure, validasi WhatsApp, jam buka, format Rupiah, query)
npm test

# Menjalankan seluruh pengujian E2E Playwright (headless browser: Chromium desktop & Pixel 7 mobile)
npm run test:e2e

# Menjalankan UI interaktif Playwright
npm run test:e2e:ui

# Membuka laporan visual pengujian Playwright
npm run test:e2e:report

# Menjalankan seluruh rangkaian tes (Unit + E2E)
npm run test:all
```

---

## 📦 Menjalankan dengan Docker

Aplikasi telah dikemas dengan Docker multi-stage (Node 20 Bookworm Slim untuk kompatibilitas native binary `better-sqlite3` dan `sharp`):

```bash
# Bangun citra dan jalankan kontainer
docker compose up -d --build

# Periksa status dan log aplikasi
docker compose ps
docker compose logs -f
```
Data tersimpan aman dan persisten pada volume lokal `./data` yang dimount ke dalam kontainer.

---

## 💾 Pencadangan & Pemulihan (Backup & Restore)

### Windows (PowerShell)
```powershell
# Backup database SQLite konsisten & uploads ke file ZIP bertanggal
.\scripts\backup.ps1

# Restore dari arsip ZIP
.\scripts\restore.ps1 -BackupFile .\backups\nikenbakery_backup_YYYYMMDD_HHMMSS.zip
```

### Linux / Server VPS (Bash)
```bash
# Backup ke file .tar.gz
chmod +x scripts/*.sh
./scripts/backup.sh

# Restore dari arsip .tar.gz
./scripts/restore.sh ./backups/nikenbakery_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 📁 Struktur Direktori

```text
├── actions/             # Next.js Server Actions (produk, kategori, banner, admin auth, setting)
├── app/                 # Next.js App Router (halaman publik, rute admin /admin, API)
├── components/          # Komponen UI modular
│   ├── admin/           # Sidebar, modal, form, dan tabel admin
│   ├── public/          # Header, footer, kartu produk, banner, hero, review
│   └── ui/              # Komponen primitif neo-brutalism (Button, Card, Badge, Modal, Input)
├── data/                # Database SQLite persisten dan berkas unggahan gambar (diabaikan git)
├── db/                  # Skema Drizzle ORM, migrasi, dan seed script
├── docs/                # Dokumentasi arsitektur, panduan deploy, desain, dan panduan pemilik
├── e2e/                 # Skenario pengujian Playwright E2E browser & audit a11y
├── lib/                 # Utilitas helper (auth JWT, format Rupiah, jam buka toko, WhatsApp link)
├── scripts/             # Skrip automasi (start, migrasi, backup/restore, create admin)
└── tests/               # Pengujian unit & integrasi Vitest
```

---

## 📚 Peta Dokumentasi Lengkap

Untuk panduan mendalam lainnya, silakan baca berkas pada folder `docs/`:

| Dokumentasi | Deskripsi |
|---|---|
| [docs/01-PROJECT_BRIEF.md](docs/01-PROJECT_BRIEF.md) | Visi produk, profil target pasar Gen-Z, dan kriteria sukses |
| [docs/02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) | Arsitektur teknis, aturan keamanan, dan struktur data |
| [docs/03-DESIGN_SYSTEM.md](docs/03-DESIGN_SYSTEM.md) | Token warna neo-brutalism, tipografi, dan aturan glassmorphism |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Panduan lengkap deploy ke VPS, HTTPS reverse proxy, dan cron backup |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | Panduan operasional berbahasa awam untuk pemilik toko/UMKM |
| [docs/UAT_CHECKLIST.md](docs/UAT_CHECKLIST.md) | Lembar uji coba manual (UAT) pada perangkat HP riil |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Catatan log keputusan arsitektural proyek |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Riwayat status implementasi seluruh tahapan proyek |
