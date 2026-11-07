# Tahap 03 — Layout Publik & Home

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 01 dan 02 selesai. Baca dulu: `docs/01-PROJECT_BRIEF.md` (Home, alur WA, tone), `docs/03-DESIGN_SYSTEM.md` (panduan per bagian halaman, aturan glass).

## Tujuan

Kerangka situs publik dan halaman Home yang lengkap, memakai data dari database.

## Tugas

1. Buat `lib/whatsapp.ts`: `normalizePhone()` (`08...` atau `+62...` menjadi `62...`), `buildWhatsAppLink(number, message)` (`https://wa.me/<nomor>?text=<encodeURIComponent>`), `generalMessage(settings)`, `orderMessage({ productName, variantLabel })` sesuai template di brief.
2. Route group `(public)` dengan `layout.tsx`: **Navbar** (glass sticky: logo teks "Niken Bakery", link Home/Menu/Social/About Us, tombol WA; hamburger + panel menu di mobile, bisa ditutup dengan Esc, fokus terkelola), **Footer** (blok solid: navigasi, jam buka ringkas, sosmed, kontak, dari settings), **FloatingWhatsApp**.
3. **Home** (`/`) berurutan: Hero (heading raksasa, tagline, 2 tombol, satu stiker miring, foto/placeholder kue) · Marquee (frasa pendek sentence case, mis. "Dipanggang tiap pagi", "Bisa custom", "Pre-order terbuka") · Produk andalan (`listFeaturedProducts`) · Banner promo (hanya bila ada aktif) · Cara Pesan (3 sampai 4 langkah bernomor: pilih kue, klik WhatsApp, konfirmasi, ambil/kirim) · Testimoni · Preview Social (6 post + link "Lihat semua") · Penutup (CTA WA + lokasi singkat).
4. Komponen `ProductCard` (solid, sesuai design system) di `components/public/`. Tombol di kartu membuka WA dengan `orderMessage` (produk habis: "Tanya via WhatsApp").
5. Halaman stub `/menu`, `/social`, `/about` berisi judul dan "Segera hadir" agar navigasi tidak 404 (diisi di tahap 04 dan 05).
6. Metadata Home (title, description dari settings). Semua teks dari `site_settings` / DB, tanpa hardcode kontak.

## Batasan

- Glass hanya di Navbar dan wadah FloatingWhatsApp (dan dialog menu mobile). Hero, kartu, banner, testimoni: solid.
- Tidak ada animasi masuk per section. Gerak hanya hover/tekan dan satu momen di hero.
- Gambar produk kosong menampilkan `PlaceholderCake`, bukan kotak kosong.

## Selesai jika

- [ ] Home tampil lengkap dengan data seed di 375px dan 1280px; tanpa scroll horizontal.
- [ ] Semua link navbar/footer berfungsi; tombol WA membuka link dengan nomor dan pesan benar dari settings.
- [ ] Maksimal 3 elemen glass per viewport.
- [ ] Navigasi keyboard lengkap (menu mobile, tab order, focus ring).
- [ ] `npm run lint` dan `npm run build` lulus; PROGRESS.md diperbarui.

Commit: `feat(public): add layout and home page`
