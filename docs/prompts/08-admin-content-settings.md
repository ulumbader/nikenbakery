# Tahap 08 — Admin: Banner, Testimoni, Social, FAQ, Pengaturan

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 06 dan 07 selesai (pakai ulang pipeline upload). Baca dulu: `docs/02-ARCHITECTURE.md` (skema, kunci `site_settings`), `docs/03-DESIGN_SYSTEM.md`.

## Tujuan

Pemilik bisa mengubah semua konten non-produk dan identitas situs tanpa menyentuh kode.

## Tugas

1. **Banner promo** (`/admin/banners`): CRUD, judul, subjudul, warna token, teks dan URL tombol, gambar opsional, aktif/nonaktif, jadwal mulai/selesai (opsional), urutan. Validasi: tanggal selesai tidak boleh sebelum mulai; URL hanya `http(s)` atau path internal.
2. **Testimoni** (`/admin/testimonials`): CRUD, nama, handle, isi, rating 1 sampai 5, publish, urutan.
3. **Post Social** (`/admin/social`): CRUD, platform, upload gambar, caption, URL post (wajib `http(s)`), publish, urutan.
4. **FAQ** (`/admin/faqs`): CRUD, publish, urutan.
5. **Pengaturan** (`/admin/settings`) dalam kelompok bertab atau bagian terpisah: Identitas (nama, tagline), Kontak (nomor WA dengan normalisasi dan pratinjau link "Tes WhatsApp", email), Lokasi (alamat, link Maps, embed Maps), Jam buka (7 baris: buka, tutup, libur), Sosmed (Instagram, TikTok), Konten (cerita About, 3 nilai, foto About, info pengiriman, kebijakan pesanan, info halal), Pesan WA default. Simpan ke `site_settings`.
6. Untuk CRUD sederhana yang mirip, boleh membuat komponen admin yang dipakai bersama (mis. form + daftar yang dapat diurutkan) **hanya bila** benar-benar mengurangi duplikasi. Jangan over-engineer.
7. Semua mutasi: `requireAdmin()`, zod, `revalidatePath`, toast. Teks bantuan singkat di tiap field yang tidak jelas bagi non-teknis.

## Batasan

- Konten teks admin dirender sebagai teks biasa (tanpa HTML mentah).
- Tidak ada editor rich-text; textarea dengan baris baru dipertahankan sudah cukup.

## Selesai jika

- [ ] Mengubah nomor WA di Pengaturan langsung mengubah semua tombol WA di publik.
- [ ] Banner yang dijadwalkan di masa depan atau sudah lewat tidak tampil di Home.
- [ ] Mengubah jam buka mengubah penanda "buka sekarang" di About.
- [ ] Semua halaman admin dapat dipakai nyaman di layar 375px.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(admin): add content and settings management`
