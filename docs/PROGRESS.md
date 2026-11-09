# PROGRESS — Dokumen Hidup

> **Agent WAJIB memperbarui file ini di akhir setiap sesi/tahap.** Ini adalah memori proyek antar sesi.
> Dibuat: 2026-11-07. Terakhir diperbarui: 2026-11-09.

## Posisi saat ini

- **Tahap aktif:** 11 — Deploy & serah terima
- **Status:** selesai ✅
- **Kondisi repo:** Tahap 11 deploy tetap selesai. Atas permintaan pengguna, alur pemesanan kini mencakup jumlah pcs, checkout ringkas untuk satu produk, biodata pemesan, dan bill ke WhatsApp. Tidak ada penyimpanan order, keranjang multi-produk, atau pembayaran online. Lihat keputusan D-020.
- **Langkah berikutnya:** serah-terima. Tahap 12 (opsional: form custom order) tetap terpisah.

## Checklist tahap

| Tahap | Prompt | Status |
|---|---|---|
| 01 | Foundation & setup (audit, token, komponen UI dasar, styleguide) | [x] |
| 02 | Database & seed (Drizzle, skema, query, data contoh) | [x] |
| 03 | Layout publik & Home | [x] |
| 04 | Menu, detail produk, order WhatsApp | [x] |
| 05 | About Us & Social | [x] |
| 06 | Admin: auth & kerangka dashboard | [x] |
| 07 | Admin: produk, kategori, upload gambar | [x] |
| 08 | Admin: banner, testimoni, social, FAQ, pengaturan | [x] |
| 09 | Analitik dasar & dashboard ringkasan | [x] |
| 10 | Polish: SEO, performa, aksesibilitas, QA | [x] |
| 10b | Testing E2E (Playwright) & UAT | [x] |
| 11 | Deploy & serah terima | [x] |
| 12 | (Opsional) Form custom order | [ ] |

Status: `[ ]` belum · `[~]` sedang dikerjakan · `[x]` selesai (lint + build lulus, commit dibuat).

## Kondisi awal proyek (diisi di tahap 01)

- Versi Next.js: 16.4.5 / React: 19.3.0 / Tailwind CSS: v4 (syntax `@theme`)
- Memakai `src/`? **Tidak** — file langsung di root (`app/`, `components/`, `lib/`, dll)
- Alias import: `@/*` → `./*`
- Package manager: npm
- ESLint: flat config (`eslint.config.mjs`), `eslint-config-next` core-web-vitals + typescript
- TypeScript: strict mode aktif

## Data bisnis & input dari pengguna

| Item | Status |
|---|---|
| Logo & warna brand Niken Bakery | Belum ada. Pakai palet default di `03-DESIGN_SYSTEM.md` |
| Nomor WhatsApp | Nilai awal CONTOH, dapat diubah via `/admin/settings` |
| Alamat, jam buka, link Maps | Nilai awal CONTOH, dapat diubah via `/admin/settings` |
| Foto produk & foto About | Dapat diunggah via admin (WebP otomatis) |
| Cerita brand (About) | Nilai awal CONTOH, dapat diubah via `/admin/settings` |
| Akun Instagram/TikTok | Nilai awal CONTOH, dapat diubah via `/admin/settings` |

Perbarui tabel ini begitu pengguna memberi data asli.

## Cara Membuat Akun Admin Pertama
1. Buka `.env.local` dan pastikan konfigurasi berikut terisi:
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password_minimal_10_karakter
   SESSION_SECRET=secret_acak_minimal_32_karakter
   ```
2. Jalankan perintah di terminal:
   ```bash
   npm run admin:create
   ```
3. Akun admin otomatis dibuat/diperbarui di database SQLite.

## Pemeliharaan Data Analitik (Prune Events)
Untuk menjaga database SQLite tetap ramping dan performa query tetap cepat, data event analitik yang lebih lama dari 180 hari dapat dipangkas secara berkala:
```bash
npm run events:prune
```
Script ini (`scripts/prune-events.ts`) menghapus seluruh baris di tabel `events` di mana `createdAt < now - 180 hari`. Dapat dijadwalkan lewat cron di server produksi (mis. mingguan atau bulanan).

## Panduan Menjalankan Pengujian (Testing Suite)

Proyek ini dilengkapi rangkaian pengujian otomatis bertingkat (Unit Test, Integration Test, dan Browser E2E Test Playwright) serta checklist UAT manual:

1. **Unit & Integration Test (Vitest):**
   ```bash
   npm test
   ```
   Menjalankan 37 pengujian fungsi murni (`normalizePhone`, `buildWhatsAppLink`, `orderMessage`, `formatRupiah`, `slug`, `hours`, validasi Zod) dan query integrasi SQLite in-memory secara cepat (< 2 detik).

2. **Playwright E2E Headless (Semua Kasus Desktop & Mobile):**
   ```bash
   npm run test:e2e
   ```
   Menjalankan 57 skenario uji browser sesungguhnya (project `desktop` 1280×800 dan `mobile` Pixel 7) mencakup alur publik PUB-01 s/d PUB-09, alur admin ADM-01 s/d ADM-09, celah keamanan SEC-01 s/d SEC-06, dan kualitas QLT-01 s/d QLT-04.

3. **Playwright UI Mode (Interaktif):**
   ```bash
   npm run test:e2e:ui
   ```
   Membuka antarmuka interaktif Playwright untuk melihat proses pengujian langkah demi langkah beserta inspect DOM visual dan time-travel debugging.

4. **Laporan HTML Playwright:**
   ```bash
   npm run test:e2e:report
   ```
   Membuka laporan HTML interaktif hasil pengujian terakhir di browser.

5. **Pengujian Menyeluruh (One-Shot):**
   ```bash
   npm run test:all
   ```
   Menjalankan `npm test` dilanjutkan `npm run test:e2e` secara otomatis dari kondisi bersih.

> [!NOTE]
> **Isolasi Data Penuh:** Pengujian E2E menggunakan `.env.test` (`DB_PATH=./data/test.db` dan `UPLOAD_DIR=./data/test-uploads`). File database pengguna `data/nikenbakery.db` dan upload fisik `data/uploads/` **terisolasi 100% dan tidak pernah disentuh oleh runner pengujian**.

6. **Checklist UAT Manual Perangkat Asli:**
   Tersedia di `docs/UAT_CHECKLIST.md` untuk menguji pembukaan aplikasi WhatsApp nyata di smartphone fisik, interaksi gestur sentuhan, dan review "vibe" estetika bersama calon target pasar.

## Blocker & pertanyaan terbuka

- (kosong)

## Ringkasan sesi terakhir

- Tambahkan kontrol jumlah pcs `[- 1 +]` di detail produk. Tombol pesan membawa produk, varian, dan jumlah ke `/checkout`.
- Halaman checkout menampilkan ringkasan bill dan meminta nama, nomor WhatsApp, tanggal ambil/kirim, metode pemenuhan, alamat jika dikirim, serta catatan opsional.
- Tombol **Beli sekarang** membuka WhatsApp dengan format bill rapi. Website tidak menyimpan data pembeli/order; ongkir dikonfirmasi admin dan tidak termasuk subtotal.
- Catat keputusan pengguna di D-020 dan selaraskan brief, arsitektur, aturan agent, serta design system.
- `npm run lint` dan `npm run build` lulus. Checkout diperiksa pada lebar 375px dan 1280px, detail pada 1280px; topbar tetap terlihat dan layout tidak meluber.

## Log sesi (terbaru di atas)

### 2026-11-09 — Checkout Satu Produk ke WhatsApp
- Dikerjakan:
  1. Tambahkan kontrol jumlah pcs 1–99 pada detail produk dan hitung subtotal langsung; produk habis tetap memakai tombol tanya ketersediaan.
  2. Tambahkan `/checkout` yang mengambil ulang produk, varian, dan harga dari SQLite, lalu menyajikan ringkasan serta form data pemesan.
  3. Buat bill teks berisi item, harga satuan, jumlah, subtotal, metode ambil/kirim, tanggal, kontak, alamat opsional, catatan, dan keterangan ongkir; tombol **Beli sekarang** meneruskannya ke WhatsApp.
  4. Tidak menyimpan data form atau pesanan. Perbarui D-020, brief, arsitektur, desain, dan aturan agent agar scope checkout baru jelas.
- File penting yang diubah/dibuat: `components/public/ProductDetailClient.tsx`, `components/public/CheckoutForm.tsx`, `app/(public)/checkout/page.tsx`, `lib/whatsapp.ts`, `docs/DECISIONS.md`, `docs/01-PROJECT_BRIEF.md`, `docs/02-ARCHITECTURE.md`, `docs/03-DESIGN_SYSTEM.md`, `AGENTS.md`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅; halaman `/checkout?product=fudgy-brownies&quantity=2` tampil pada 375px dan 1280px, serta detail `/menu/fudgy-brownies` diperiksa pada 1280px.
- Berikutnya: selesai; server development tetap aktif di `http://localhost:3000`.

### 2026-11-09 — Splash SVG Kue dan Transisi Aksi
- Dikerjakan:
  1. Tambahkan transisi route berbasis `template.tsx` pada halaman publik, login admin, dan dashboard admin; topbar publik tetap di layout persisten.
  2. Buat splash inline SVG dengan empat variasi kue acak, animasi mengambang singkat, lapisan blur yang mereda, dan fade-in konten dengan efek kedalaman saat halaman dibuka atau berpindah rute.
  3. Tambahkan micro-interaction untuk hover/tekan kontrol, fokus form, pembukaan dialog, dan FAQ. Matikan splash dan gerak saat `prefers-reduced-motion` aktif.
  4. Samakan fallback `loading.tsx` publik dengan visual splash SVG dan catat keputusan pengguna di D-019 serta `03-DESIGN_SYSTEM.md`.
- File penting yang diubah/dibuat: `app/globals.css`, `app/(public)/template.tsx`, `app/(public)/loading.tsx`, `app/admin/(dashboard)/template.tsx`, `app/admin/login/template.tsx`, `components/public/PageTransition.tsx`, `components/public/CakeSplashVisual.tsx`, `docs/03-DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅; pratinjau splash/reveal desktop dan mobile, perpindahan ke `/menu`, serta `prefers-reduced-motion`.
- Berikutnya: selesai; server development tetap aktif di `http://localhost:3000`.

### 2026-11-09 — Pembaruan Menyeluruh Foto Produk Katalog (2 Foto per Menu, Product Photography Style)
- Dikerjakan:
  1. Hasilkan foto produk baru menggunakan AI Image Generator (`gemini-3.1-flash-image`) untuk Strawberry Shortcake dan Red Velvet Cake dalam gaya studio bakery product photography yang bersih dan menggugah selera.
  2. Susun dan jalankan skrip kurasi `scripts/seed-product-images.ts` untuk melengkapi seluruh 14 menu katalog Niken Bakery, masing-masing dengan 2 foto produk (1 cover andalan + 1 foto detail/slice sudut alternatif):
     - Seluruh foto diproses melalui pipeline kompresi Sharp ke format WebP ganda: ukuran large 1200w (`-1200w.webp`) dan thumbnail 480w (`-480w.webp`) dengan kualitas 80 dan EXIF dibersihkan.
     - Total 28 file foto tersimpan rapi di direktori fisik `data/uploads/` dan tercatat pada tabel `product_images` di database SQLite `data/nikenbakery.db`.
  3. Perbaiki rasio kontras warna teks kategori dan harga pada `components/public/HeroSection.tsx` (`text-ink/60` → `text-ink/75`) untuk memenuhi standar aksesibilitas WCAG AA (kontras > 4.5:1).
  4. Jalankan rangkaian verifikasi pengujian:
     - `npm run lint`: 0 error, 0 warning.
     - `npm run build`: Berhasil kompilasi produksi Turbopack.
     - `npm test`: 40/40 vitest unit & query integration tests lulus.
     - Playwright E2E: 27/27 tests lulus (PUB-01 s/d PUB-09, QLT-01 s/d QLT-04) di Desktop dan Mobile.
- File penting yang diubah/dibuat: `scripts/seed-product-images.ts`, `components/public/HeroSection.tsx`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E 27/27 ✅; periksa katalog `/menu`, beranda `/`, dan detail produk `/menu/[slug]`.
- Berikutnya: Selesai. Seluruh foto produk telah terpasang dan aktif di katalog.

### 2026-11-09 — Poles Hero Home
- Dikerjakan:
  1. Susun ulang `HeroSection` menjadi layout dua kolom pada desktop dan satu kolom pada mobile, dengan hierarchy tipografi yang lebih rapat, dua CTA jelas, serta info alamat dan jam buka tetap terlihat.
  2. Hubungkan visual kartu hero ke produk unggulan pertama yang sudah diambil oleh Home, tampilkan foto WebP, nama, kategori, dan harga. Sediakan `PlaceholderCake` bila belum ada foto; tambahkan `loading="eager"` untuk gambar LCP.
  3. Ganti gelombang dekoratif besar dengan aksen datar yang lebih tenang, border neo-brutal dan hard shadow. Navbar/topbar tetap.
  4. Tambahkan `playwright-report/**` dan `test-results/**` ke daftar global ignore ESLint karena konfigurasi global saat ini tidak mewarisi ignore `.gitignore`.
  5. Pulihkan panduan lokal Niken Bakery di luar marker yang dikelola Next.js setelah `next dev` mengganti teks di dalam marker tersebut.
- File penting yang diubah: `components/public/HeroSection.tsx`, `app/(public)/page.tsx`, `eslint.config.mjs`, `AGENTS.md`, `docs/PROGRESS.md`.
- Masalah / utang teknis: foto produk unggulan yang saat ini tersimpan bukan foto kue; perlu diganti lewat admin untuk hasil final yang sesuai brand.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅; pratinjau Home pada 375px, 390px, dan 1280px.
- Berikutnya: bila ingin hero menampilkan foto produk sebenarnya, unggah/ganti foto produk unggulan lewat `/admin/products`. Tahap 12 tetap opsional.

### 2026-11-09 — Perbaikan Batas Ukuran Upload Server Actions & Peringatan Parent Image
- Dikerjakan:
  1. Perbaiki kendala `Error: Body exceeded 1 MB limit (413 Payload Too Large)` pada Server Actions Next.js:
     - Di `next.config.ts`: tambahkan konfigurasi `experimental.serverActions.bodySizeLimit: "10mb"` sehingga pengunggahan multi-foto produk kamera beresolusi tinggi (sampai 10 MB per form submission) dapat diterima oleh server tanpa error 500/413 sebelum diproses kompresi WebP oleh Sharp.
  2. Perbaiki peringatan konsol browser `Image with src ... has "fill" and parent element with invalid "position". Provided "static" should be one of absolute,fixed,relative`:
     - Di `components/public/ProductCard.tsx`: tambahkan kelas `relative` pada elemen `<Link className="relative block w-full h-full ...">` yang membungkus Next.js `<Image fill />`.
  3. Verifikasi pengujian: `npm run lint` (0 error), `npm run build` (lulus), `npm test` (40/40 tests lulus), Playwright E2E `admin-flows.spec.ts` (19/19 tests lulus).
- File penting yang diubah: `next.config.ts`, `components/public/ProductCard.tsx`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E ✅.
- Berikutnya: Selesai.

### 2026-11-09 — Tampilan Frosted Glass pada Sticky Action Bar Mobile Detail Produk
- Dikerjakan:
  1. Terapkan tampilan frosted glass (`.glass`) pada sticky bottom action bar halaman detail produk (`components/public/ProductDetailClient.tsx`) agar serasi dengan topbar (`Navbar.tsx`):
     - Gunakan kelas `.glass` (`background: rgb(255 255 255 / 0.6)`, `backdrop-filter: blur(14px) saturate(140%)`) langsung pada kontainer `fixed bottom-0 left-0 right-0 z-30`.
     - Pertahankan border atas neo-brutal `border-t-3 border-ink`, netralkan border samping/bawah (`!border-x-0 !border-b-0 !rounded-none`), serta terapkan drop shadow ke arah atas `!shadow-[0_-4px_0_#2B1B17]`.
     - Lapisan frosted glass menutup penuh hingga ujung terbawah layar ponsel (area gesture indicator), sedangkan konten tombol dan harga berada di dalam padding safe area tanpa celah terpotong.
  2. Verifikasi pengujian lengkap: `npm run lint` (0 error, 0 warning), `npm run build` (lulus bersih), `npm test` (40/40 tests lulus), Playwright E2E `pub-flows.spec.ts` & `quality.spec.ts` (28/28 tests lulus).
- File penting yang diubah: `components/public/ProductDetailClient.tsx`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E ✅.
- Berikutnya: Selesai.

### 2026-11-09 — Optimasi Mobile View: Grid 2 Kolom Kompak & Efisiensi Tata Letak
- Dikerjakan:
  1. Perbaiki tata letak kartu produk (`ProductCard.tsx`) agar beradaptasi menjadi 2 kolom (`grid-cols-2`) di layar mobile sesuai sketsa referensi pengguna:
     - Ubah grid di `page.tsx` (Home), `menu/page.tsx` (Katalog), dan `menu/[slug]/page.tsx` (Rekomendasi) menjadi `grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6`.
     - Buat kartu produk mobile lebih proporsional dan tidak boros layar: border 2px (`border-2 sm:border-3`), radius 10px (`rounded-[10px] sm:rounded-[14px]`), padding konten kompak (`p-2.5 sm:p-4`), judul `text-xs sm:text-lg` (2 baris rapi), sembunyikan paragraf deskripsi panjang di mobile agar tinggi kartu seragam, serta tombol aksi kompak (`💬 Pesan WA` di mobile, `💬 Pesan via WhatsApp` di desktop).
  2. Optimasi seluruh bagian publik yang boros ruang di tampilan mobile:
     - Di `app/(public)/page.tsx`:
       - Kurangi jarak vertikal antar-seksi dari 64px menjadi lebih proporsional (`space-y-10 sm:space-y-16 md:space-y-24`).
       - Hero section: heading judul responsif `clamp(2.1rem,6vw,5.5rem)`, padding showcase card diperkecil, dan gap tombol dirapatkan.
       - Banner promo: padding responsif `p-4 sm:p-6 md:p-8` dengan ukuran teks judul yang pas.
       - Cara pesan: ubah dari 4 baris vertikal bertumpuk menjadi grid 2x2 (`grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6`) sehingga seluruh langkah dapat dilihat seketika dalam satu layar.
       - Preview postingan sosial: jadikan grid 2 kolom seperti feed Instagram.
     - Di `app/(public)/social/page.tsx`: ubah kartu postingan menjadi 2 kolom kompak (`grid-cols-2`).
     - Di `components/ui/SectionHeading.tsx`: buat margin bawah dan ukuran teks adaptif terhadap mobile (`mb-4 sm:mb-8`, `text-2xl sm:text-[clamp(2rem,5vw,3.5rem)]`).
     - Di `components/public/Navbar.tsx` & `Footer.tsx`: kurangi tinggi dan padding vertikal pada mobile (`h-16 sm:h-18`, padding footer `pt-10 sm:pt-16 pb-8 sm:pb-12`).
  3. Verifikasi pengujian lengkap:
     - `npm test`: 37/37 unit & query integration tests lulus.
     - `npm run lint`: Lulus 0 error, 0 warning.
     - `npm run build`: Lulus kompilasi Turbopack.
     - Playwright E2E: 27/27 tes lulus (Desktop Chromium & Mobile Pixel 7), termasuk QLT-01 (audit scroll horizontal nihil di mobile) dan QLT-02 (audit aksesibilitas axe-core).
- File penting yang diubah: `components/public/ProductCard.tsx`, `components/public/ProductDetailClient.tsx`, `components/ui/SectionHeading.tsx`, `components/public/Navbar.tsx`, `components/public/Footer.tsx`, `app/(public)/page.tsx`, `app/(public)/menu/page.tsx`, `app/(public)/menu/[slug]/page.tsx`, `app/(public)/social/page.tsx`, `app/(public)/about/page.tsx`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, `npx playwright test e2e/pub-flows.spec.ts e2e/quality.spec.ts` ✅.
- Berikutnya: Proyek siap serah terima atau lanjut ke tahap deployment.

### 2026-11-08 — Penyempurnaan Tampilan Admin: Pembersihan Keterangan Teknis & URL Path
- Dikerjakan:
  1. Bersihkan seluruh keterangan teknis URL path (seperti `/menu`, `/about`, `(/menu?kategori=...)`) dari antarmuka pengguna akhir:
     - Di `components/admin/BannerManager.tsx`:
       - Ubah label opsi dropdown halaman dan kategori menjadi nama halaman toko yang ramah awam (contoh: *🍰 Halaman Menu Katalog*, *ℹ️ Halaman Tentang Kami & Kontak*, *🏷️ Kategori: Brownies & Bars*) tanpa menampilkan kurung path URL teknis.
       - Hapus badge tampilan URL mentah (`{internalUrl}`) di bawah dropdown dan ganti dengan petunjuk fungsi sederhana.
       - Pada kartu daftar banner promo: format tujuan tombol menjadi nama ramah awam menggunakan helper `getCtaDestinationLabel` (contoh: *Tombol: Lihat Menu → Kategori: Brownies & Bars* alih-alih *(/menu?kategori=brownies-bars)*).
       - Perjelas nama tab menjadi *🏠 Halaman Toko* dan *🌐 Link Luar / Sosmed*.
       - Bersihkan teks dialog konfirmasi hapus dari sisa teks teknis berkas gambar.
     - Di `components/admin/FaqManager.tsx`: hapus penyebutan path `(/about)` pada deskripsi halaman FAQ.
     - Di `docs/ADMIN_GUIDE.md`: sesuaikan panduan dengan nama baru yang non-teknis.
  2. Verifikasi seluruh pengujian: `npm run lint` (0 error, 0 warning), `npm run build` (lulus), `npm test` (37 unit tests lulus), Playwright E2E 19/19 admin tests lulus.
- File penting yang diubah/dibuat: `components/admin/BannerManager.tsx`, `components/admin/FaqManager.tsx`, `docs/ADMIN_GUIDE.md`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, `npx playwright test e2e/admin-flows.spec.ts` ✅.
- Berikutnya: Proyek siap serah terima atau lanjut Tahap 12 (opsional).

### 2026-11-08 — Penghapusan Fitur Gambar pada Banner Promo
- Dikerjakan:
  1. Hapus seluruh fitur dan keterkaitan gambar pada banner promo sesuai instruksi pengguna:
     - Di `components/admin/BannerManager.tsx`: hapus input file upload gambar, state preview dan removal gambar, serta render avatar gambar di daftar banner (diganti dengan avatar blok warna tema banner dan ikon megafon yang seragam).
     - Di `actions/banners.ts`: hapus pembacaan upload file gambar dan pemrosesan `processAndSaveImage`, set `imageFile: null`, serta tambahkan pembersihan otomatis file gambar fisik lama jika ada banner lama yang diperbarui atau dihapus.
     - Di `app/(public)/page.tsx`: kembalikan komponen banner promo menjadi blok warna penuh dengan judul, subjudul, dan tombol CTA yang bersih dan proporsional tanpa gambar.
     - Di `docs/DECISIONS.md`: catat keputusan D-016 (banner fokus pada pengumuman teks ringkas, warna tema, dan tombol CTA).
  2. Jalankan seluruh pengujian: `npm test` (37 unit tests), Playwright E2E (`e2e/pub-flows.spec.ts`, `e2e/admin-flows.spec.ts`), `npm run lint` (0 error, 0 warning), dan `npm run build` (sukses).
- File penting yang diubah/dibuat: `components/admin/BannerManager.tsx`, `actions/banners.ts`, `app/(public)/page.tsx`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-016
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E ADM-06 & QLT-04 ✅.
- Berikutnya: Proyek siap serah terima atau lanjut Tahap 12 (opsional).

### 2026-11-08 — Perbaikan UX: Pemilih Link Tujuan Tombol Banner Promo
- Dikerjakan:
  1. Perbaiki isian "Link Tujuan Tombol" di `components/admin/BannerManager.tsx` dan `app/admin/(dashboard)/banners/page.tsx` dari input teks manual yang membingungkan menjadi pemilih intuitif dua mode:
     - **Mode Halaman Internal**: dropdown pilihan siap pakai berisi Halaman Menu Katalog (`/menu`), Tentang Kami (`/about`), Media Sosial (`/social`), Beranda (`/`), serta seluruh kategori produk yang ada di database (`/menu?kategori=slug`). Disertai teks petunjuk dan badge preview URL.
     - **Mode Link Eksternal**: input URL fleksibel untuk mengetik atau menempel (*paste*) tautan lengkap (misal media sosial, WhatsApp, promo marketplace) dengan validasi URL.
  2. Perbarui `docs/ADMIN_GUIDE.md` pada bagian Banner Promo untuk memandu pengelola toko non-teknis tentang penggunaan pemilih link baru ini.
  3. Ambil dan verifikasi tangkapan layar tampilan form baru di `e2e/screenshots/admin-banner-form.png`.
  4. Jalankan pengujian otomatis, lint, dan build: semuanya 100% lulus.
- File penting yang diubah/dibuat: `components/admin/BannerManager.tsx`, `app/admin/(dashboard)/banners/page.tsx`, `docs/ADMIN_GUIDE.md`, `e2e/quality.spec.ts`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E ADM-06 & QLT-04 ✅.
- Berikutnya: Proyek siap serah terima atau lanjut Tahap 12 (opsional).

### 2026-11-09 — Redesign Hero Section Publik (Hapus Kartu Hero & Implementasi Desain Gelombang Pastel Neo-Brutal)
- Dikerjakan:
  1. Hapus kartu produk hero statis (`PlaceholderCake`, "FAVORIT PELANGGAN", "★ 4.9 Bintang") dari hero section sesuai permintaan pengguna.
  2. Pertahankan desain topbar (`components/public/Navbar.tsx`) tanpa perubahan.
  3. Buat komponen baru `components/public/HeroSection.tsx` dan integrasikan ke `app/(public)/page.tsx`.
  4. Implementasikan layout hero beranda yang lapang, elegan, dan playful sesuai gambar referensi:
     - Background gelombang pastel organik multi-lapis (kuning & pink lembut di kiri atas, kuning mentega di kanan atas & kiri bawah, serta signature double-layer rose-pink waves di kanan bawah).
     - Elemen dekoratif mengambang (sparkle pink, sparkle kuning, titik aksen, dan garis aksen melengkung).
     - Badge "✦ Dipanggang Segar Setiap Pagi!" berlatar pink neo-brutal dengan 3 garis sinar kuning (sunburst) di kanan atasnya.
     - Tipografi judul "Kue Lezat, Momen Lebih Manis." dengan garis bawah lengkung pink ceria di bawah kata "Manis." dan dua aksen whisker pink di sebelah kanannya.
     - Tombol aksi pill-shaped ganda: "💬 Pesan via WhatsApp" (hijau WA) dan "🍰 Lihat Koleksi Menu" (kuning mentega) dengan border tebal dan drop shadow neo-brutal.
     - Bar informasi cepat toko: "📍 Toko di {alamat} | ⏰ Hari ini: {jam buka}".
  5. Verifikasi visual: tangkapan layar `desktop-home.png` (1280px) dan `mobile-home.png` (375px) di `e2e/screenshots/` terverifikasi rapi, responsif, dan tanpa scroll horizontal (`QLT-01`).
  6. Suite pengujian: Vitest (40/40 passed), Playwright E2E & Quality tests (27/27 passed), Lint (0 errors), Build sukses.
- File penting yang diubah/dibuat: `components/public/HeroSection.tsx`, `components/public/index.ts`, `app/(public)/page.tsx`, `docs/PROGRESS.md`.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅, Playwright E2E `pub-flows.spec.ts` & `quality.spec.ts` ✅.
- Berikutnya: Proyek stabil dan siap digunakan.

### 2026-11-08 — Audit & Pengujian Siklus Upload Foto (Produk, Sosial, Pengaturan)
- Dikerjakan:
  1. Audit komprehensif seluruh entitas yang memiliki fitur upload foto: Produk (`ProductForm.tsx`, `actions/products.ts`), Postingan Sosial (`SocialManager.tsx`, `actions/social.ts`), dan Pengaturan Toko (`SettingsManager.tsx`, `actions/settings.ts`).
  2. Perbaiki bug file input unmounted pada `SocialManager.tsx` dan `SettingsManager.tsx`: pemilihan file sebelumnya langsung merender preview dan meng-unmount `<input type="file" />` sehingga `FormData` kehilangan data berkas gambar. Diperbaiki dengan menyimpan `selectedFile` di React state dan menginjeksinya ke `FormData` saat form dikirimkan.
  3. Perbaiki tampilan foto sosmed di beranda publik (`app/(public)/page.tsx`): sebelumnya hardcoded merender `PlaceholderCake`, kini menampilkan foto `post.imageFile` melalui Next.js `<Image />` dengan fallback `PlaceholderCake`.
  4. Buat rangkaian uji integrasi siklus hidup berkas `tests/integration/upload-flow.test.ts` (3 skenario: upload, simpan fisik WebP ke disk, ganti, hapus berkas fisik dari disk secara individual maupun cascading delete pada Produk, Postingan Sosial, dan Foto About Pengaturan Toko).
  5. Perluas skenario Playwright E2E `ADM-08` di `e2e/admin-flows.spec.ts` untuk menguji upload foto asli (`cake.jpg`) pada postingan sosial, verifikasi di admin, dan verifikasi tampil di Beranda (`/`) serta Galeri Sosial (`/social`).
  6. Jalankan lint (`npm run lint`), build (`npm run build`), dan suite pengujian (`npm test` 40/40 passed, Playwright E2E 19/19 admin flows passed).
- File penting yang diubah/dibuat: `app/(public)/page.tsx`, `components/admin/SocialManager.tsx`, `components/admin/SettingsManager.tsx`, `e2e/admin-flows.spec.ts`, `tests/integration/upload-flow.test.ts`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada.
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅, `npm test` ✅ (40/40 tests passed), E2E test `ADM-08` ✅.
- Berikutnya: Proyek stabil dan teruji penuh.

### 2026-11-09 — Hapus Floating WhatsApp Button & Tombol Beli pada Card
- Dikerjakan:
  1. Hapus komponen floating button (`FloatingWhatsApp`) secara bersih dari layout publik `app/(public)/layout.tsx` dan `components/public/index.ts`. Hapus file `components/public/FloatingWhatsApp.tsx` sehingga tidak ada kode mati.
  2. Tambahkan ikon `IconShoppingBag` ke pustaka ikon neo-brutal `components/ui/Icons.tsx`.
  3. Ganti tombol "Pesan via WhatsApp" pada kartu produk `components/public/ProductCard.tsx` menjadi tombol "Beli" bertema neo-brutal (`bg-butter` dengan hard shadow) yang langsung membuka detail produk (`/menu/[slug]`). Hal ini memastikan pembeli melihat dan memilih varian/opsi spesifik kue terlebih dahulu sebelum memesan via WhatsApp di halaman detail.
  4. Bila produk habis (`soldout`), tombol otomatis menyesuaikan menjadi "Lihat Detail" dengan varian ghost.
  5. Verifikasi pengujian: `npm run lint` (0 error, 0 warning), `npm run build` (lulus bersih), `npm test` (40/40 lulus), `npx playwright test` (45/45 lulus).
- File penting yang diubah/dihapus: `components/public/FloatingWhatsApp.tsx` (dihapus), `app/(public)/layout.tsx`, `components/public/ProductCard.tsx`, `components/public/index.ts`, `components/ui/Icons.tsx`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-018 (Hapus Floating WhatsApp dan ganti tombol card dengan Beli).
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅ (40 passed), `npx playwright test` ✅ (45 passed).
- Berikutnya: Selesai.

### 2026-11-09 — Penggantian Semua Emoji Menjadi Custom Neo-Brutal SVG Icon Set
- Dikerjakan:
  1. Buat pustaka ikon SVG kustom `components/ui/Icons.tsx` bergaya neo-brutal (stroke tebal 2.5px, rounded join & cap, `currentColor`, `aria-hidden="true"`) dan ekspor melalui `components/ui/index.ts`.
  2. Ganti seluruh icon emoji di aplikasi publik dan panel admin tanpa menyisakan raw emoji di antarmuka pengguna:
     - Header, Navbar, Footer, HeroSection, FloatingWhatsApp, WhatsAppButton.
     - ProductDetailClient, SearchInput, CategoryPills, Menu (filter reset), About Us, Social, Loading skeleton, NotFound, Error boundary, OpenGraph generator.
     - Admin dashboard overview, AdminNav, CategoryManager, BannerManager, ProductListTable, ProductForm, SettingsManager, SocialManager, TestimonialManager, FaqManager.
     - Halaman demo Styleguide.
  3. Memastikan semua tombol interaktif memiliki `aria-label` yang jelas dan mempertahankan kompatibilitas dengan suite pengujian otomatis Playwright.
  4. Jalankan scan menyeluruh memastikan 0 emoji tersisa di seluruh komponen UI (`app/` dan `components/`).
  5. Verifikasi: `npm run lint` (0 error, 0 warning), `npm run build` (lulus bersih), `npm test` (40/40 tests lulus), `playwright test` (45/45 E2E desktop & mobile lulus).
- File penting yang diubah/dibuat: `components/ui/Icons.tsx`, `components/ui/index.ts`, `components/public/*`, `components/admin/*`, `app/(public)/*`, `app/admin/*`, `docs/PROGRESS.md`.
- Keputusan baru: D-017 (Custom Neo-Brutal SVG Icon Set pengganti raw emoji).
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, `npm test` ✅ (40 passed), `npx playwright test` ✅ (45 passed).
- Berikutnya: Proyek inti dan polish visual telah lengkap.

### 2026-11-07 — Tahap 11
- Dikerjakan:
  1. Perbaiki dropdown menu mobile di `components/public/Navbar.tsx`: pindahkan drawer dialog ke luar elemen `<header>` (React Fragment `<>`) agar terhindar dari containing block yang diinduksi oleh `backdrop-filter` CSS, gunakan warna latar solid `bg-cream` (`#FFF4E0`) sesuai panduan neo-brutalism sehingga menu tidak lagi transparan dan tidak tumpang tindih dengan hero section. Verifikasi visual dengan screenshot `e2e/screenshots/mobile-menu-drawer.png`.
  2. Konfigurasi `output: "standalone"` di `next.config.ts`.
  3. Buat `Dockerfile` multi-stage (Node 20 Bookworm Slim), `.dockerignore`, dan `docker-compose.yml` dengan volume mount `./data:/app/data`, environment file, dan healthcheck `/api/health`.
  4. Buat skrip migrasi mandiri `scripts/migrate.js` (CommonJS untuk standalone container), `scripts/docker-entrypoint.sh`, dan `scripts/start.sh`.
  5. Buat sistem pencadangan konsisten SQLite WAL mode (`scripts/sqlite-backup.js`) serta skrip backup dan restore untuk Linux (`scripts/backup.sh`, `scripts/restore.sh`) dan Windows (`scripts/backup.ps1`, `scripts/restore.ps1`). Uji coba pemulihan data ke folder uji coba terisolasi berhasil 100%.
  6. Buat `docs/DEPLOY.md` (deploy VPS, Docker, reverse proxy Caddy & Nginx, cron backup harian, jalur migrasi ke Turso/libSQL bila ingin pindah ke Vercel, dan Production Checklist).
  7. Buat `docs/ADMIN_GUIDE.md` (panduan non-teknis berbahasa Indonesia awam untuk pemilik toko UMKM).
  8. Tulis ulang `README.md` utama proyek secara komprehensif.
  9. Jalankan verifikasi lint (`npm run lint`), build (`npm run build`), dan suite pengujian (`npm test` & Playwright E2E) -> seluruhnya 100% lulus.
- File penting yang diubah/dibuat: `components/public/Navbar.tsx`, `next.config.ts`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `scripts/migrate.js`, `scripts/docker-entrypoint.sh`, `scripts/start.sh`, `scripts/sqlite-backup.js`, `scripts/backup.sh`, `scripts/restore.sh`, `scripts/backup.ps1`, `scripts/restore.ps1`, `docs/DEPLOY.md`, `docs/ADMIN_GUIDE.md`, `README.md`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada (mengikuti D-004, D-007, D-009).
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run lint` lulus (0 error, 0 warning), `npm run build` lulus, `powershell .\scripts\backup.ps1` berhasil membuat ZIP, `powershell .\scripts\restore.ps1` berhasil memulihkan data, screenshot visual mobile drawer bersih tanpa tumpang tindih.
- Berikutnya: Proyek inti selesai dan siap serah terima. Tahap 12 (opsional: form custom order).

### 2026-11-07 — Tahap 10b
- Dikerjakan:
  1. Pasang dev dependency `@playwright/test`, `@axe-core/playwright`, `vitest`, `dotenv`. Install browser Chromium engine via `npx playwright install chromium`. Catat keputusan D-015 di `docs/DECISIONS.md`.
  2. Buat konfigurasi `.env.test`, `vitest.config.ts`, dan `playwright.config.ts` (project `setup`, `desktop` 1280×800, `mobile` Pixel 7, serial execution, headless webServer di port 3100 dengan database terisolasi `data/test.db` & uploads `data/test-uploads`).
  3. Buat `e2e/global-setup.ts` (migrasi Drizzle, seed data uji, dan pembuatan admin tes bersih) dan `e2e/auth.setup.ts` (simpan sesi login admin ke `e2e/.auth/admin.json`).
  4. Tulis 37 unit & integration tests di `tests/unit/` (`format`, `whatsapp`, `slug`, `hours`, `validation`) dan `tests/integration/queries.test.ts` -> 37 passed.
  5. Tulis 4 file spesifikasi Playwright E2E di `e2e/`:
     - `pub-flows.spec.ts` (PUB-01 s/d PUB-09)
     - `admin-flows.spec.ts` (ADM-01 s/d ADM-09)
     - `security.spec.ts` (SEC-01 s/d SEC-06)
     - `quality.spec.ts` (QLT-01 s/d QLT-04)
  6. Perbaikan bugs & a11y yang ditemukan selama penulisan tes:
     - Perbaiki query `saveProductAction` di `actions/products.ts` (sebelumnya `.orderBy(products.sortOrder)` pada SELECT dari `productImages` yang memicu SQLite error, diperbaiki menjadi `.orderBy(productImages.sortOrder)`).
     - Perbaiki contrast ratio teks tombol WhatsApp ke `text-ink` (> 10:1) untuk memenuhi standar WCAG AAA.
     - Perbaiki label-content mismatch pada `FloatingWhatsApp` dan `ProductCard`.
     - Tambahkan isolasi IP `x-forwarded-for` per-request pada pengujian rate limiting SEC-05.
     - Tangani sinkronisasi response Server Action di SEC-04 dan ADM-09.
  7. Hasilkan tangkapan layar visual penuh 375px dan 1280px ke `e2e/screenshots/`.
  8. Buat dokumen `docs/UAT_CHECKLIST.md` untuk pengujian aplikasi fisik WhatsApp, jaringan 4G lambat, touch feel di HP, dan evaluasi vibe Gen-Z.
  9. Jalankan verifikasi lint (`npm run lint`), build (`npm run build`), dan suite pengujian penuh (`npm run test:all`) -> seluruhnya 100% lulus.
- File penting yang diubah/dibuat: `playwright.config.ts`, `vitest.config.ts`, `.env.test`, `.gitignore`, `package.json`, `docs/DECISIONS.md`, `docs/UAT_CHECKLIST.md`, `docs/PROGRESS.md`, `e2e/`, `tests/`, `actions/products.ts`, `components/public/FloatingWhatsApp.tsx`, `components/ui/Button.tsx`, `components/public/ProductCard.tsx`.
- Keputusan baru: D-015 (Playwright dan Vitest untuk Testing Suite & E2E).
- Masalah / utang teknis: tidak ada.
- Cara verifikasi: `npm run test:all` lulus (37 Vitest + 57 Playwright), `npm run lint` lulus (0 errors, 0 warnings), `npm run build` lulus.
- Berikutnya: tahap 11 (Deploy & serah terima).

### 2026-11-07 — Tahap 10
- Dikerjakan: lengkapi metadata SEO di `app/layout.tsx` (`metadataBase`, Open Graph, Twitter, canonical, robots). Buat `app/sitemap.ts` (dinamis dari database SQLite). Update `app/robots.ts` (blokir `/admin` & `/api`, izinkan `/`). Buat `app/opengraph-image.tsx` (kartu pratinjau sosial neo-brutal dinamis 1200x630 via `ImageResponse`). Buat `app/manifest.ts` dan `app/icon.svg`. Tambahkan JSON-LD structured data `Bakery` di `app/(public)/layout.tsx` dan `Product` dengan `offers` ketersediaan di `app/(public)/menu/[slug]/page.tsx`. Pasang skip link aksesibilitas `#main-content` di layout publik. Buat boundary error `app/error.tsx` dan skeleton loading `app/(public)/loading.tsx`. Optimasi ukuran thumbnail foto kue di `ProductDetailClient.tsx` (`sizes="80px"`). Uji verifikasi aturan robots dan url sitemap.
- File penting yang diubah/dibuat: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/icon.svg`, `app/opengraph-image.tsx`, `app/(public)/layout.tsx`, `app/(public)/menu/[slug]/page.tsx`, `components/public/ProductDetailClient.tsx`, `app/error.tsx`, `app/(public)/loading.tsx`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: scratch test verifikasi robots disallow & sitemap listing 18 URLs lulus, `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅.
- Berikutnya: tahap 11 (Deploy & serah terima)

### 2026-11-07 — Tahap 09
- Dikerjakan: buat `lib/events.ts` (deteksi bot user-agent, dedupe harian cookie anonim). Buat route `app/api/events/route.ts` (POST event wa_click, validasi zod, batas ukuran 2KB, rate limiter in-memory tahan spam). Update `components/public/WhatsAppButton.tsx` (prop `productId`, pencatatan non-blocking via `navigator.sendBeacon`). Update `ProductCard.tsx` dan `ProductDetailClient.tsx` (sertakan `productId` ke `WhatsAppButton`, sinkronisasi cookie dedupe). Update `app/(public)/menu/[slug]/page.tsx` (catat `product_view` server-side). Buat query agregasi `db/queries/events.ts` (`getAnalyticsSummary`, time-series 14 hari, checklist toko) dan ekspor ke `db/queries/index.ts`. Buat grafik batang neo-brutal responsif `components/admin/AnalyticsChart.tsx`. Rombak total halaman utama `app/admin/(dashboard)/page.tsx` (4 kartu metrik, checklist kelengkapan toko interaktif, grafik batang 14 hari, Top 5 produk views/WA clicks, pintasan aksi cepat). Buat script pemangkasan data `scripts/prune-events.ts` dan script `npm run events:prune`.
- File penting yang diubah/dibuat: `lib/events.ts`, `app/api/events/route.ts`, `components/public/WhatsAppButton.tsx`, `components/public/ProductCard.tsx`, `components/public/ProductDetailClient.tsx`, `app/(public)/menu/[slug]/page.tsx`, `db/queries/events.ts`, `db/queries/index.ts`, `components/admin/AnalyticsChart.tsx`, `app/admin/(dashboard)/page.tsx`, `scripts/prune-events.ts`, `package.json`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: scratch test script lulus (validasi route, penolakan bot, rate limiting 429 pada spam, data point 14 hari), `npm run events:prune` lulus, `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅.
- Berikutnya: tahap 10 (Polish: SEO, performa, aksesibilitas, QA)

### 2026-11-07 — Tahap 08
- Dikerjakan: buat `actions/banners.ts` (CRUD banner promo, validasi jadwal mulai/selesai & URL, upload/hapus gambar via Sharp, sortir urutan, toggle aktif), buat `components/admin/BannerManager.tsx` dan perbarui `app/admin/(dashboard)/banners/page.tsx`. Buat `actions/testimonials.ts` (CRUD testimoni, rating 1-5, sortir, toggle publish), buat `components/admin/TestimonialManager.tsx` dan perbarui `app/admin/(dashboard)/testimonials/page.tsx`. Buat `actions/social.ts` (CRUD kurasi sosmed Instagram/TikTok, validasi URL http/https, upload foto, sortir, toggle publish), buat `components/admin/SocialManager.tsx` dan perbarui `app/admin/(dashboard)/social/page.tsx`. Buat `actions/faqs.ts` (CRUD tanya-jawab, sortir, toggle publish), buat `components/admin/FaqManager.tsx` dan perbarui `app/admin/(dashboard)/faqs/page.tsx`. Buat `actions/settings.ts` (kelola identitas toko, normalisasi WA, jam operasional 7 hari, Google Maps URL/embed, cerita & 3 nilai brand, upload foto About, kebijakan, pengiriman, kehalalan, akun sosmed, dan custom order) serta `components/admin/SettingsManager.tsx` bertab lengkap dengan tombol tes link WA interaktif dan perbarui `app/admin/(dashboard)/settings/page.tsx`.
- File penting yang diubah/dibuat: `actions/banners.ts`, `actions/testimonials.ts`, `actions/social.ts`, `actions/faqs.ts`, `actions/settings.ts`, `components/admin/BannerManager.tsx`, `components/admin/TestimonialManager.tsx`, `components/admin/SocialManager.tsx`, `components/admin/FaqManager.tsx`, `components/admin/SettingsManager.tsx`, `app/admin/(dashboard)/**`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: script uji banner scheduling lulus (banner masa depan dan lampau tidak tampil di `listActiveBanners()`), `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅ (semua route berhasil dioptimasi).
- Berikutnya: tahap 09 (Analitik dasar & dashboard ringkasan)

### 2026-11-07 — Tahap 07
- Dikerjakan: pasang `sharp`. Buat `lib/upload.ts` (validasi ukuran 5MB, format JPEG/PNG/WebP/AVIF via Sharp, auto-rotate, WebP 1200w dan 480w, strip EXIF, proteksi SVG, `deleteUploadedFile`). Buat route `app/media/[...path]/route.ts` (anti path-traversal, header MIME dan `Cache-Control` immutable). Buat Server Actions `actions/categories.ts` (CRUD, sorting, reassignment dialog) dan komponen `components/admin/CategoryManager.tsx` pada `/admin/categories`. Buat Server Actions `actions/products.ts` (toggle cepat status/publish/featured, hapus produk beserta file fisik di disk, simpan/update produk dengan varian dan gambar). Buat tabel produk responsif `components/admin/ProductListTable.tsx` pada `/admin/products` (search, category filter, status filter, inline toggle, delete dialog). Buat form produk `components/admin/ProductForm.tsx` serta halaman tambah `/admin/products/new` dan edit `/admin/products/[id]` (auto-slug, manajemen varian dinamis, galeri multi-upload foto).
- File penting yang diubah/dibuat: `lib/upload.ts`, `app/media/[...path]/route.ts`, `actions/categories.ts`, `actions/products.ts`, `components/admin/CategoryManager.tsx`, `components/admin/ProductListTable.tsx`, `components/admin/ProductForm.tsx`, `app/admin/(dashboard)/categories/page.tsx`, `app/admin/(dashboard)/products/**`, `package.json`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada (mengikuti D-007)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: pipeline test scratch script lulus (SVG ditolak, non-image ditolak, path traversal terblokir), `npm run lint` ✅ (0 error, 0 warning), `npm run build` ✅.
- Berikutnya: tahap 08 (Admin: banner, testimoni, social, FAQ, pengaturan)

### 2026-11-07 — Tahap 06
- Dikerjakan: pasang `jose`, `bcryptjs`, `zod`, `@types/bcryptjs`. Buat `lib/auth/password.ts` (hash & compare bcrypt), `lib/auth/session.ts` (SignJWT & jwtVerify HS256, cookie httpOnly 7 hari), `lib/auth/require-admin.ts`. Buat script CLI `scripts/create-admin.ts` dan script npm `admin:create` (validasi password minimal 10 karakter). Buat Server Action `actions/auth.ts` (`loginAction` dengan rate limiting dan zod, `logoutAction`). Buat form login `components/admin/LoginForm.tsx` (`useActionState`) dan halaman `app/admin/login/page.tsx`. Buat proteksi ganda: `proxy.ts` (konvensi Next.js 16 pengganti `middleware.ts`, D-014) dan `requireAdmin()` di layout dashboard. Buat kerangka admin `components/admin/AdminNav.tsx` dan `app/admin/(dashboard)/layout.tsx` (neo-brutal bersih, tanpa glass). Buat halaman overview `app/admin/(dashboard)/page.tsx` dan 7 stub rute admin (`products`, `categories`, `banners`, `testimonials`, `social`, `faqs`, `settings`). Buat `app/robots.ts` (disallow `/admin`).
- File penting yang diubah/dibuat: `lib/auth/*.ts`, `actions/auth.ts`, `scripts/create-admin.ts`, `components/admin/*.tsx`, `proxy.ts`, `app/admin/login/page.tsx`, `app/admin/(dashboard)/**`, `app/robots.ts`, `package.json`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-014 (gunakan `proxy.ts` sesuai konvensi Next.js 16)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run admin:create` berhasil, akses `/admin` tanpa cookie diredirect ke `/admin/login`, `npm run lint` ✅, `npm run build` ✅.
- Berikutnya: tahap 07 (Admin: produk, kategori, upload gambar)

### 2026-11-07 — Tahap 05
- Dikerjakan: buat `lib/hours.ts` (`isOpenNow`, `timeToMinutes`) dengan kemampuan uji tanggal custom, verifikasi logika penanda buka/tutup toko. Buat komponen `components/public/FaqAccordion.tsx` berbasis HTML native `<details>` dan `<summary>` dengan styling neo-brutal (aksesibel via keyboard). Perbarui `app/(public)/about/page.tsx` dengan cerita brand, 3 kartu nilai, lokasi & link Google Maps (iframe kondisional), penanda jam buka aktif, kebijakan & pengiriman, FAQ, dan CTA kontak. Perbarui `app/(public)/social/page.tsx` dengan galeri post solid (Instagram/TikTok), tombol follow sosmed, dan ajakan tag. Pastikan seluruh bagian kosong kondisional dan tidak merender wadah kosong.
- File penting yang diubah/dibuat: `lib/hours.ts`, `components/public/FaqAccordion.tsx`, `components/public/index.ts`, `app/(public)/about/page.tsx`, `app/(public)/social/page.tsx`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, uji logika jam buka dengan script pengujian murni, periksa halaman `/about` dan `/social` di 375px dan 1280px (tanpa scroll horizontal, tidak ada script pihak ketiga).
- Berikutnya: tahap 06 (Admin: auth & kerangka dashboard)

### 2026-11-07 — Tahap 04
- Dikerjakan: buat `components/public/WhatsAppButton.tsx`, refactor `ProductCard` memakai `WhatsAppButton`. Buat `components/public/SearchInput.tsx` (debounced search), `components/public/CategoryPills.tsx` (link filter kategori shareable). Buat `app/(public)/menu/page.tsx` membaca `searchParams` bertipe Promise di Next 16, menampilkan grid produk dan `EmptyState`. Buat `components/public/ProductDetailClient.tsx` (galeri foto, pemilih varian, update harga & pesan WA dinamis, share button dengan fallback toast copy clipboard, sticky mobile glass bar). Buat `app/(public)/menu/[slug]/page.tsx` dengan metadata produk dinamis, pengecekan 404, dan rekomendasi produk terkait. Buat `app/not-found.tsx` bergaya neo-brutal.
- File penting yang diubah/dibuat: `components/public/WhatsAppButton.tsx`, `components/public/SearchInput.tsx`, `components/public/CategoryPills.tsx`, `components/public/ProductDetailClient.tsx`, `components/public/ProductCard.tsx`, `components/public/index.ts`, `app/(public)/menu/page.tsx`, `app/(public)/menu/[slug]/page.tsx`, `app/not-found.tsx`, `docs/PROGRESS.md`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, uji filter & pencarian di `/menu`, uji ganti varian di `/menu/strawberry-shortcake`, uji slug ngawur di `/menu/kue-ngawur-404` mengarah ke not-found.
- Berikutnya: tahap 05 (About Us & Social)

### 2026-11-07 — Tahap 03
- Dikerjakan: buat `lib/whatsapp.ts` (`normalizePhone`, `buildWhatsAppLink`, `generalMessage`, `orderMessage`, `inquiryMessage`). Buat komponen publik di `components/public/` (`Navbar`, `Footer`, `FloatingWhatsApp`, `ProductCard`). Buat route group `app/(public)/layout.tsx` dan `app/(public)/page.tsx` dengan 8 section berurutan sesuai brief. Buat halaman stub `/menu`, `/social`, `/about`. Update `Button` untuk mendukung link polymorphic (`href`). Nonaktifkan `cacheComponents`/`partialPrefetching` di `next.config.ts` untuk dynamic rendering UMKM yang stabil (D-013).
- File penting yang diubah/dibuat: `lib/whatsapp.ts`, `components/public/Navbar.tsx`, `components/public/Footer.tsx`, `components/public/FloatingWhatsApp.tsx`, `components/public/ProductCard.tsx`, `components/public/index.ts`, `components/ui/Button.tsx`, `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/(public)/menu/page.tsx`, `app/(public)/social/page.tsx`, `app/(public)/about/page.tsx`, `next.config.ts`, `docs/DECISIONS.md`, `docs/PROGRESS.md`.
- Keputusan baru: D-013
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, periksa responsivitas Home di 375px dan 1280px (tanpa scroll horizontal, max 2-3 elemen glass).
- Berikutnya: tahap 04 (Menu, detail produk, order WhatsApp)

### 2026-11-07 — Tahap 02
- Dikerjakan: pasang `drizzle-orm`, `better-sqlite3`, `drizzle-kit`, `@types/better-sqlite3`, `tsx`. Buat `drizzle.config.ts`, `db/schema.ts`, `db/index.ts` (singleton WAL mode & foreign keys), `db/migrate.ts`, dan migrasi awal `db/migrations/0000_free_magma.sql`. Buat fungsi query bertipe di `db/queries/index.ts`, helper `lib/slug.ts` dan `lib/settings.ts`. Buat seed script `db/seed.ts` (idempotent, 14 produk kekinian, 4 kategori, 2 banner, 5 testimoni, 6 post social, 6 FAQ, 20 settings bertanda CONTOH). Uji idempotency seed dan verifikasi seluruh query.
- File penting yang diubah/dibuat: `drizzle.config.ts`, `db/schema.ts`, `db/index.ts`, `db/migrate.ts`, `db/migrations/*`, `db/seed.ts`, `db/queries/index.ts`, `lib/settings.ts`, `lib/slug.ts`, `package.json`.
- Keputusan baru: tidak ada
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run db:migrate`, `npm run db:seed` dijalankan 2x idempotently, query test lulus, `npm run lint` ✅, `npm run build` ✅.
- Berikutnya: tahap 03 (Layout publik & Home)

### 2026-11-07 — Tahap 01
- Dikerjakan: audit proyek, bersihkan boilerplate, set `lang="id"`, metadata title template, font Bricolage Grotesque + Figtree, token warna + shadow di `globals.css` (Tailwind v4 `@theme`), kelas `.glass` + fallback + `-webkit-`, `prefers-reduced-motion`, focus ring. Buat 11 komponen UI (`Button`, `Card`, `Badge`/`Sticker`, `StatusBadge`, `Pill`, `GlassPanel`, `Marquee`, `SectionHeading`, `Input`/`Select`/`Textarea`, `PlaceholderCake`, `EmptyState`). Buat `lib/format.ts` (`formatRupiah`, `formatDate`). Buat halaman `/styleguide` (notFound di prod). Perbarui `.gitignore` (tambah `data/`, perbaiki `.env*`).
- File penting yang diubah/dibuat: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/styleguide/page.tsx`, `components/ui/*.tsx`, `components/ui/index.ts`, `lib/format.ts`, `.gitignore`
- Keputusan baru: D-012 (proyek tidak memakai `src/`, path disesuaikan)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, buka `/styleguide` di dev (`npm run dev`) dan periksa di 375px dan 1280px
- Berikutnya: tahap 02 (Database & seed)
