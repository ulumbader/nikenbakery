# Tahap 04 — Menu, Detail Produk, Order WhatsApp

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 03 selesai. Baca dulu: `docs/01-PROJECT_BRIEF.md` (Menu, alur WA), `docs/02-ARCHITECTURE.md` (aturan data), `docs/03-DESIGN_SYSTEM.md`.

## Tujuan

Pengunjung bisa menjelajah, memfilter, membuka detail kue, dan memesan lewat WhatsApp.

## Tugas

1. **`/menu`**: server component yang membaca `searchParams` (di Next versi baru ini Promise, gunakan `await`). Filter kategori lewat `?kategori=<slug>` (Pill berupa link, bisa dibagikan), pencarian `?q=` (input client yang memperbarui URL dengan debounce), jumlah hasil, grid `ProductCard`, `EmptyState` dengan arahan.
2. **`/menu/[slug]`**: `notFound()` jika slug tidak ada atau tidak dipublikasikan. Isi: galeri (thumbnail mengganti foto utama; fallback `PlaceholderCake`), nama, harga mengikuti varian terpilih, pemilih varian (client), `StatusBadge` + lead time pre-order, deskripsi, bahan dan alergen, tombol **Pesan via WhatsApp** (pesan membawa produk + varian terpilih), tombol Bagikan (Web Share API, fallback salin link dengan toast), produk terkait.
3. Produk **Habis**: tombol utama menjadi "Tanya via WhatsApp" dengan pesan tanya ketersediaan.
4. Di mobile, panel ringkasan harga + tombol WA pada detail produk berupa `GlassPanel` sticky di bawah (satu-satunya glass di halaman itu selain navbar). Aman dari safe-area iOS.
5. `generateMetadata` per produk (title, description, gambar bila ada).
6. Tombol WA dibuat dari satu komponen `WhatsAppButton` yang menerima `href` dan `label`, agar tahap 09 bisa menambah pelacakan klik di satu tempat.

## Batasan

- Dilarang glass di grid kartu atau daftar produk.
- Detail produk tetap halaman penuh (D-008), bukan modal.
- Jangan membuat keranjang atau input jumlah ke server; jumlah dan tanggal diisi pembeli langsung di chat WA.

## Selesai jika

- [ ] Filter kategori dan pencarian bekerja dan URL-nya bisa dibagikan; empty state tampil bila hasil kosong.
- [ ] Mengganti varian mengubah harga dan isi pesan WA; link WA yang dibuka benar (cek `wa.me` dan teks ter-encode).
- [ ] Produk Habis dan Pre-order menampilkan perilaku dan badge yang benar.
- [ ] `/menu/slug-ngawur` menampilkan not-found.
- [ ] Tidak ada scroll horizontal di 375px; lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(menu): add catalog, product detail and whatsapp ordering`
