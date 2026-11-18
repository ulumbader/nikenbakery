# 02 — Architecture

Proyek tidak memakai direktori `src/`; folder `app/`, `db/`, `lib/`, dan lainnya berada langsung di root.

## Stack

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js App Router, TypeScript strict |
| Styling | Tailwind CSS (cek versi: v4 memakai `@theme` di CSS, v3 memakai `tailwind.config`) |
| Database | Supabase PostgreSQL, Drizzle ORM, `pg` connection pool (max 1 per serverless instance), SSL |
| Validasi | zod |
| Auth admin | `jose` (JWT HS256) + `bcryptjs`, cookie httpOnly |
| Gambar | `sharp` (WebP) + Supabase Storage (`nikenbakery-media`) |
| Script TS | `tsx` |

## Struktur folder (target)

```
src/
  app/
    (public)/
      layout.tsx            # Navbar, Footer, FloatingWhatsApp
      page.tsx              # Home
      menu/page.tsx
      menu/[slug]/page.tsx
      checkout/page.tsx      # review satu produk + data pemesan, tanpa menyimpan order
      social/page.tsx
      about/page.tsx
    admin/
      login/page.tsx
      (dashboard)/
        layout.tsx          # sidebar + requireAdmin()
        page.tsx            # ringkasan
        products/ (page, new, [id])
        categories/ banners/ testimonials/ social/ faqs/ settings/
    media/[...path]/route.ts  # kompatibilitas file lokal lama
    api/health/route.ts
    styleguide/page.tsx       # hanya development
    sitemap.ts  robots.ts  not-found.tsx  error.tsx
  components/
    ui/        # Button, Card, Badge, Pill, GlassPanel, Marquee, Input, ...
    public/    # Navbar, Footer, ProductCard, Hero, ...
    admin/     # AdminSidebar, DataTable, ImageUploader, ...
  db/
    index.ts  schema.ts  seed.ts  migrations/
    queries/   # products.ts, categories.ts, settings.ts, content.ts, events.ts
  actions/     # server actions per entitas (products.ts, ...)
  lib/
    format.ts       # formatRupiah, formatDate
    whatsapp.ts     # normalizePhone, buildWhatsAppLink, template pesan
    auth/           # password.ts, session.ts, require-admin.ts
    upload.ts       # validasi + sharp + simpan/hapus objek Storage
    slug.ts  settings.ts  hours.ts
data/                       # di-gitignore: nikenbakery.db, uploads/
scripts/                    # backup, admin:create
```

## Environment variables

- `DATABASE_URL`: Supabase Transaction pooler connection string, server-side only.
- `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`: server-side access untuk Supabase Storage; key tidak pernah diekspos ke browser.
- `SESSION_SECRET` (≥ 32 karakter), `NEXT_PUBLIC_SITE_URL`, dan `ADMIN_USERNAME`/`ADMIN_PASSWORD` untuk script `admin:create`.
- `DB_PATH` dan `UPLOAD_DIR` hanya menunjuk sumber SQLite lama saat menjalankan `npm run migrate:supabase`.

## Skema database

Skema PostgreSQL aktif berada di `db/schema.ts`, dengan migrasi Drizzle di `db/migrations-pg/`. Skrip `db/migrate.ts` mengaktifkan RLS tanpa policy publik; aplikasi mengakses database lewat koneksi server `DATABASE_URL`. Skema SQLite lama disimpan di `db/schema-sqlite.ts` khusus untuk tes integrasi in-memory dan migrasi data lokal.

## Rute

| Rute | Tipe | Keterangan |
|---|---|---|
| `/` `/menu` `/menu/[slug]` `/social` `/about` | Publik | Data dari DB; `/menu` membaca `?kategori=` dan `?q=` |
| `/admin/login` | Publik | Form login |
| `/admin/**` | Terproteksi | `requireAdmin()` di layout **dan** di setiap action |
| `/media/[...path]` | Publik | Kompatibilitas upload lokal lama; foto production memakai URL Supabase Storage |
| `/api/health` | Publik | `{ ok: true }` untuk healthcheck |

## Keamanan

- Cookie sesi: `httpOnly`, `sameSite=lax`, `secure` di production, masa berlaku 7 hari. `SESSION_SECRET` wajib; aplikasi gagal start jika kosong di production.
- Pesan error login generik ("Username atau password salah"). Batasi percobaan login (mis. 5 kali per 15 menit per IP+username, in-memory cukup).
- Upload: hanya JPEG/PNG/WebP/AVIF, maksimal 5 MB, verifikasi isi file lewat `sharp`, selalu re-encode (membuang EXIF). SVG ditolak.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server. RLS aktif tanpa policy publik pada tabel aplikasi; browser tidak mengakses Data API secara langsung.
- Semua input admin divalidasi zod di server. Escape output (React sudah default); jangan memakai `dangerouslySetInnerHTML` untuk konten admin.
- Link eksternal: `target="_blank"` selalu dengan `rel="noopener noreferrer"`.
- Tautan marketplace produk divalidasi sebagai URL HTTPS di server. Tombol publik hanya tampil saat tautan tersedia dan kanal diaktifkan admin.
- `/admin` dan `/media` di-`noindex`/disallow di robots untuk admin.
- Event analitik tidak menyimpan IP atau data pribadi.

## Caching dan tampilan perubahan admin

Perubahan dari admin harus langsung terlihat di publik. Panggil `revalidatePath` setelah setiap mutasi. Jika perilaku caching membingungkan di versi Next terpasang, render halaman publik secara dinamis (trafik UMKM kecil) dan catat di `DECISIONS.md`.

## Deployment

Target produksi adalah Vercel dengan Supabase PostgreSQL dan Supabase Storage. Gunakan Transaction pooler URL untuk koneksi fungsi serverless. File unggahan tidak disimpan pada filesystem Vercel; upload baru dan gambar hasil migrasi disimpan sebagai objek pada bucket `nikenbakery-media`. Lihat `docs/DEPLOY.md` untuk impor dari SQLite, variabel Vercel, akun admin, dan backup terpisah untuk database serta Storage.
