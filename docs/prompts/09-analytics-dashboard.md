# Tahap 09 — Analitik Dasar & Dashboard Ringkasan

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 07 selesai. Baca dulu: `docs/02-ARCHITECTURE.md` (tabel `events`, keamanan), `docs/03-DESIGN_SYSTEM.md`.

## Tujuan

Pemilik melihat hal yang berguna: kue mana yang dilihat dan diklik, dan apa yang perlu dilengkapi. Tanpa layanan analitik pihak ketiga.

## Tugas

1. **Pencatatan event** ke tabel `events`:
   - `product_view`: dicatat saat detail produk dibuka (server-side, abaikan bot sederhana berdasarkan user-agent, dedupe harian per produk lewat cookie anonim tanpa data pribadi).
   - `wa_click`: dicatat saat tombol WA ditekan lewat `WhatsAppButton` (tahap 04), memakai `navigator.sendBeacon` ke route handler ringan. Sertakan `productId` bila ada. Route harus tahan spam sederhana (validasi zod, batas ukuran, rate limit in-memory).
2. **Dashboard `/admin`** (halaman utama): kartu ringkas (produk aktif, produk Habis, klik WA 7/30 hari, kunjungan produk 7/30 hari), **Top 5 produk** berdasarkan view dan klik WA, grafik batang 14 hari dengan CSS/SVG sederhana (tanpa library chart), pintasan aksi cepat (tambah produk, ubah promo, edit pengaturan).
3. **Checklist kelengkapan konten**: nomor WA terisi, alamat terisi, minimal satu produk berfoto, ada banner aktif, jam buka diisi. Tiap butir yang belum memiliki link langsung ke halaman admin terkait.
4. Query agregasi di `src/db/queries/events.ts` (indeks `events_type_created_idx` sudah ada). Script `scripts/prune-events` (atau fungsi) untuk menghapus event > 180 hari; dokumentasikan di PROGRESS.md.

## Batasan

- Jangan menyimpan IP, user-agent mentah, atau pengenal pribadi.
- Pencatatan tidak boleh memperlambat atau memblokir navigasi pengunjung.

## Selesai jika

- [ ] Membuka detail produk dan menekan tombol WA menambah event yang sesuai (verifikasi di DB atau dashboard).
- [ ] Dashboard memuat cepat dan terbaca di 375px; angka cocok dengan data.
- [ ] Spam ke route event ditolak atau dibatasi.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(analytics): add event tracking and admin dashboard overview`
