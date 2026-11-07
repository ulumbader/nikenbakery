# 01 — Project Brief: Niken Bakery

## Ringkasan

Website katalog koleksi kue untuk UMKM **Niken Bakery**. Pengunjung melihat menu, memilih kue, lalu memesan lewat WhatsApp. Pemilik mengelola semua konten sendiri lewat dashboard admin tanpa perlu menyentuh kode.

## Audiens dan konteks pakai

- **Pengunjung (Gen-Z)**: membuka dari HP, sering dari link di Instagram/TikTok/story. Sabar maksimal beberapa detik. Menilai dari foto dan "vibe".
- **Pemilik UMKM**: bukan orang teknis. Admin harus sederhana: tambah kue, ganti foto, tandai habis, ubah promo.

## Scope

**Masuk:** katalog dengan kategori, varian, status stok; order via WhatsApp; halaman Social (galeri kurasi); About Us (cerita, lokasi, jam, FAQ); promo banner; testimoni; dashboard admin; analitik dasar (view produk, klik WA); SEO dasar.

**Tidak masuk (backlog fase 2):** keranjang, checkout, payment gateway, akun pelanggan, stok kuantitatif, multi-role admin, multi-bahasa, dark mode.

## Fitur per halaman

### Home (`/`)
Hero (heading besar, tagline, tombol "Pesan via WhatsApp" dan "Lihat menu") · strip marquee · produk andalan (4 sampai 6, `is_featured`) · banner promo aktif (kalau ada) · Cara Pesan (urutan langkah yang nyata) · testimoni · preview Social · penutup berisi CTA dan info lokasi singkat.

### Menu (`/menu`, `/menu/[slug]`)
- **Daftar**: grid kartu (foto, nama, harga "Mulai dari", badge status), filter kategori (pill), pencarian, empty state.
- **Detail**: galeri foto, harga mengikuti varian terpilih, pilihan varian, status dan lead time pre-order, deskripsi, bahan dan alergen, tombol **Pesan via WhatsApp** (membawa produk + varian), tombol bagikan, produk terkait.

### Social (`/social`)
Galeri kurasi post (gambar + caption + link ke Instagram/TikTok), tombol ikuti akun, dikelola admin. Tanpa embed script pihak ketiga.

### About Us (`/about`)
Cerita brand · nilai (3 poin) · lokasi (alamat, tombol Google Maps, embed opsional) · jam buka dengan penanda "buka sekarang" · kontak · info pengiriman dan ongkir · kebijakan pesanan (DP, pembatalan, lead time) · FAQ · info halal/PIRT (opsional).

### Admin (`/admin`)
Login · ringkasan dan analitik dasar · CRUD produk (varian, multi-foto, toggle cepat status/publish/featured) · kategori · banner promo · testimoni · post Social · FAQ · pengaturan situs (identitas, kontak WA, lokasi, jam buka, sosmed, teks About, kebijakan).

## Alur pesan WhatsApp

Tombol WA di produk membuka `https://wa.me/<nomor>?text=<pesan>` dengan template:

```
Halo Niken Bakery! 👋
Aku mau pesan:
• {nama produk} ({varian})
Jumlah: 1
Tanggal ambil/kirim: (isi di sini)
Nama: (isi di sini)
```

Tombol umum (navbar, footer, floating): `Halo Niken Bakery! Aku mau tanya-tanya soal kue 🙌`.
Nomor dinormalisasi ke format internasional tanpa `+` (mis. `0812...` menjadi `62812...`).
Produk berstatus Habis: tombol berubah menjadi "Tanya via WhatsApp" (tetap bisa dihubungi).

## Tone copywriting

- Santai, ramah, tidak lebay. Pembaca disapa **kamu**, brand menyebut diri **kami**.
- Kalimat pendek, kata kerja aktif, sentence case. Emoji secukupnya (maksimal 1 sampai 2 per blok).
- Tombol menyebut hasil aksinya: "Pesan via WhatsApp", "Simpan perubahan". Bukan "Submit".
- Error dan empty state menjelaskan apa yang terjadi dan apa langkah berikutnya.
- Contoh: empty state menu: "Yah, belum ada kue di kategori ini. Coba kategori lain, yuk." Status: "Ready", "Pre-order H-2", "Habis".

## Data bisnis yang BELUM diketahui

Logo dan warna brand, nomor WA, alamat, jam buka, foto produk, dan cerita brand belum diberikan. Sampai ada, pakai nilai seed bertanda **CONTOH** (lewat `site_settings`) dan `PlaceholderCake` untuk foto. Catat apa pun yang sudah diberikan pengguna di `docs/PROGRESS.md`.

## Kriteria sukses

- Pengunjung bisa dari Home ke pesan WA dalam maksimal 3 ketuk.
- Pemilik bisa menambah satu kue lengkap dengan foto dalam kurang dari 3 menit.
- Mobile Lighthouse: Performance ≥ 85, Accessibility ≥ 95.
