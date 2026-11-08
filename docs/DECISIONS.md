# DECISIONS — Log Keputusan

Status: **Disepakati** = diputuskan pengguna. **Usulan** = diusulkan agent, belum ditolak; boleh diubah bila pengguna meminta.
Tambahkan keputusan baru di bawah (ID berurutan). Jangan menghapus keputusan lama; tandai "Digantikan oleh D-xxx".

| ID | Keputusan | Status | Alasan / catatan |
|---|---|---|---|
| D-001 | Katalog + order via WhatsApp, tanpa keranjang/payment di fase 1 | Disepakati | Cocok untuk UMKM; pembayaran online jadi fase 2 |
| D-002 | Desain neo-brutalism (tulang punggung) + frosted glass (lapisan sekunder, tetap berborder tebal + hard shadow) | Disepakati | Aturan peran di `03-DESIGN_SYSTEM.md` |
| D-003 | Database SQLite dahulu | Disepakati | Sederhana untuk skala UMKM |
| D-004 | Drizzle ORM + `better-sqlite3`. Akses DB terisolasi di `src/db/` | Usulan | TS-first, ringan, jalur mudah ke libSQL/Turso atau Postgres. Fallback jika `better-sqlite3` gagal terpasang: `@libsql/client` dengan URL `file:` |
| D-005 | Social = halaman `/social` (galeri kurasi + link sosmed) + section preview di Home | Usulan | Menghormati daftar fitur awal; tanpa embed pihak ketiga demi performa |
| D-006 | Auth admin: `jose` (JWT di cookie httpOnly) + `bcryptjs`; admin dibuat lewat script dari env | Usulan | Sederhana, tanpa layanan eksternal |
| D-007 | Upload gambar disimpan di `data/uploads` (di luar `public/`), diproses `sharp` ke WebP (large 1200w + thumb 480w), disajikan lewat route `/media/[...path]` | Usulan | File yang diunggah setelah build tetap tersaji; metadata EXIF dibuang |
| D-008 | Detail produk = halaman `/menu/[slug]` (bagus untuk SEO dan share link). Quick-view modal opsional di tahap polish | Usulan | Modal via intercepting route cukup kompleks; tunda |
| D-009 | Target hosting: VPS/Docker/PaaS dengan volume persisten untuk `data/`. Jika ingin Vercel, pindah ke Turso (libSQL) | Usulan | SQLite berbasis file tidak persisten di serverless |
| D-010 | UI dan konten Bahasa Indonesia; kode Bahasa Inggris; commit Conventional Commits Inggris | Usulan | Konsistensi |
| D-011 | Font: Bricolage Grotesque (heading) + Figtree (body). Bisa diganti jika brand punya font sendiri | Usulan | Karakter kuat untuk heading, body tetap mudah dibaca |
| D-012 | Proyek tidak memakai `src/` — file langsung di root (`app/`, `components/`, `lib/`, dll). Path di `02-ARCHITECTURE.md` disesuaikan | Usulan | Hasil `create-next-app` v16 tidak membuat `src/`; alias `@/*` → `./*` sudah benar |
| D-013 | Nonaktifkan opsi `cacheComponents` dan `partialPrefetching` di `next.config.ts`, gunakan dynamic rendering pada halaman publik yang membaca data langsung | Usulan | Sesuai `02-ARCHITECTURE.md`: perubahan admin harus langsung tampak di publik dan menghindari konflik prerender `new Date()` pada Next 16 |
| D-014 | Gunakan konvensi `proxy.ts` alih-alih `middleware.ts` untuk proteksi awal rute admin | Usulan | Di Next.js 16, `middleware.ts` sudah dideprecate secara resmi dan digantikan oleh `proxy.ts` (ekspor fungsi `proxy`) |
| D-015 | Pasang `@playwright/test`, `@axe-core/playwright`, dan `vitest` untuk pengujian otomatis E2E, audit aksesibilitas, dan unit testing | Usulan | Sesuai tahap 10b: pengujian browser sungguhan untuk alur WA & admin, audit aksesibilitas a11y, dan unit test logika murni tanpa menyentuh data produksi |
| D-016 | Hapus fitur gambar pada banner promo; banner fokus pada teks pengumuman, blok warna token, dan tombol CTA | Disepakati | Permintaan pengguna: banner promo lebih bersih, ringkas, dan fokus pada teks pengumuman & warna tema tanpa upload gambar |
