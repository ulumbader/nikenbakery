# Tahap 05 — About Us & Social

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 03 selesai. Baca dulu: `docs/01-PROJECT_BRIEF.md` (About, Social), `docs/02-ARCHITECTURE.md` (settings), `docs/03-DESIGN_SYSTEM.md`.

## Tujuan

Dua halaman terakhir dari sisi publik, seluruhnya digerakkan oleh data settings dan konten.

## Tugas

1. **`/about`**: cerita brand (`about_story`) dan nilai (`about_values`, 3 poin); lokasi (alamat, tombol "Buka di Google Maps" dari `maps_url`, iframe embed hanya bila `maps_embed_url` terisi, dimuat `loading="lazy"`); jam buka (tabel 7 hari) dengan penanda **"Buka sekarang" / "Tutup"** dihitung di server berdasarkan `timezone` settings (`lib/hours.ts`, memakai `Intl`); kontak (WA, email); info pengiriman; kebijakan pesanan; FAQ memakai `<details>`/`<summary>` (aksesibel secara native, gaya neo-brutal); info halal/PIRT hanya bila terisi.
2. **`/social`**: judul + tombol ikuti Instagram/TikTok dari settings, grid kartu post solid (gambar atau `PlaceholderCake`, caption, badge platform, link eksternal `target="_blank" rel="noopener noreferrer"`), ajakan "Tag kami" bila relevan. Tanpa script embed pihak ketiga.
3. Metadata kedua halaman. Bagian yang datanya kosong disembunyikan, bukan menampilkan kotak kosong.
4. Pastikan section Social di Home (tahap 03) tetap konsisten dengan halaman ini.

## Batasan

- Tidak ada embed Instagram/TikTok (performa dan privasi).
- Tidak ada glass di luar navbar/floating WA.
- Semua teks dari settings; jangan hardcode alamat atau jam.

## Selesai jika

- [ ] Penanda buka/tutup benar untuk beberapa jam uji (verifikasi dengan fungsi murni yang bisa dipanggil dengan waktu tertentu).
- [ ] FAQ bisa dibuka/tutup dengan keyboard.
- [ ] Bagian kosong tidak merender kerangka kosong.
- [ ] Tanpa scroll horizontal di 375px; lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(public): add about and social pages`
