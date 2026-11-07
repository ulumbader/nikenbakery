# Tahap 12 (Opsional) — Form Custom Order

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 04 selesai. Kerjakan hanya jika pengguna meminta. Baca dulu: `docs/01-PROJECT_BRIEF.md`, `docs/03-DESIGN_SYSTEM.md`.

## Tujuan

Pembeli bisa menyusun permintaan kue custom (tema, tulisan, ukuran) dan mengirimkannya sebagai pesan WhatsApp terstruktur.

## Tugas

1. Halaman `/custom-order` dengan form: jenis kue (dari kategori), ukuran atau jumlah porsi, rasa, tema/teks di kue, tanggal dibutuhkan (minimal H+`custom_order_min_days` dari settings), kisaran budget (opsional), nama. Validasi dengan zod di klien.
2. Tombol "Kirim lewat WhatsApp" menyusun pesan terstruktur dan membuka `wa.me`. Ingatkan pembeli untuk melampirkan foto referensi di chat WA. Tidak ada penyimpanan ke DB dan tidak ada upload.
3. Tambahkan pengaturan admin: `custom_order_enabled` (menampilkan/menyembunyikan halaman dan tautannya) dan `custom_order_min_days`.
4. Tambahkan tautan di Home (CTA), footer, dan About bila diaktifkan.

## Batasan

- Tidak ada pembayaran, DP online, atau penyimpanan data pembeli.

## Selesai jika

- [ ] Pesan WA hasil form lengkap, terbaca rapi, dan ter-encode benar.
- [ ] Menonaktifkan fitur di admin menghilangkan halaman (404) dan semua tautannya.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(custom-order): add custom cake request form`
