# 01 — Project Brief: Niken Bakery

## Ringkasan

Website katalog koleksi kue untuk UMKM **Niken Bakery**. Pengunjung melihat menu, memilih kue, lalu memesan lewat WhatsApp. Pemilik mengelola semua konten sendiri lewat dashboard admin tanpa perlu menyentuh kode.

## Audiens dan konteks pakai

- **Pengunjung (Gen-Z)**: membuka dari HP, sering dari link di Instagram/TikTok/story. Sabar maksimal beberapa detik. Menilai dari foto dan "vibe".
- **Pemilik UMKM**: bukan orang teknis. Admin harus sederhana: tambah kue, ganti foto, tandai habis, ubah promo.

## Scope

**Masuk:** katalog dengan kategori, varian, status stok; checkout ringkas satu produk dengan jumlah pcs, data pemesan, subtotal, dan bill WhatsApp; halaman Social (galeri kurasi); About Us (cerita, lokasi, jam, FAQ); promo banner; testimoni; dashboard admin; analitik dasar (view produk, klik WA); SEO dasar.

**Tidak masuk (backlog fase 2):** keranjang multi-produk, penyimpanan order di website, payment gateway, akun pelanggan, stok kuantitatif, multi-role admin, multi-bahasa, dark mode.

## Fitur per halaman

### Home (`/`)
Hero (heading besar, tagline, tombol "Pesan via WhatsApp" dan "Lihat menu") · strip marquee · produk andalan (4 sampai 6, `is_featured`) · banner promo aktif (kalau ada) · Cara Pesan (urutan langkah yang nyata) · testimoni · preview Social · penutup berisi CTA dan info lokasi singkat.

### Menu (`/menu`, `/menu/[slug]`)
- **Daftar**: grid kartu (foto, nama, harga "Mulai dari", badge status), filter kategori (pill), pencarian, empty state.
- **Detail**: galeri foto, harga mengikuti varian terpilih, pilihan varian, jumlah pcs, status dan lead time pre-order, deskripsi, bahan dan alergen, tombol **Pesan via WhatsApp** menuju checkout, tombol bagikan, produk terkait.

### Checkout (`/checkout`)
- Checkout hanya memuat satu produk dari detail yang dipilih; harga dan varian diverifikasi ulang dari katalog.
- Tampilkan produk, varian, jumlah, subtotal, dan total sementara. Ongkir pengiriman belum termasuk dan dikonfirmasi admin lewat WhatsApp.
- Minta nama lengkap, nomor WhatsApp, tanggal ambil/kirim, metode pemenuhan, alamat bila dikirim, dan catatan opsional.
- Tombol **Beli sekarang** membuka WhatsApp dengan bill berformat rapi. Data pemesan tidak disimpan oleh website.

### Social (`/social`)
Galeri kurasi post (gambar + caption + link ke Instagram/TikTok), tombol ikuti akun, dikelola admin. Tanpa embed script pihak ketiga.

### About Us (`/about`)
Cerita brand · nilai (3 poin) · lokasi (alamat, tombol Google Maps, embed opsional) · jam buka dengan penanda "buka sekarang" · kontak · info pengiriman dan ongkir · kebijakan pesanan (DP, pembatalan, lead time) · FAQ · info halal/PIRT (opsional).

### Admin (`/admin`)
Login · ringkasan dan analitik dasar · CRUD produk (varian, multi-foto, toggle cepat status/publish/featured) · kategori · banner promo · testimoni · post Social · FAQ · pengaturan situs (identitas, kontak WA, lokasi, jam buka, sosmed, teks About, kebijakan).

## Alur pesan WhatsApp

Di detail, tombol **Pesan via WhatsApp** membuka `/checkout` dengan produk, varian, dan jumlah. Tombol **Beli sekarang** pada checkout menyusun lalu membuka `https://wa.me/<nomor>?text=<bill>` dengan format:

```
Halo Niken Bakery! 👋
Saya ingin memesan:
1. {nama produk} — {varian}
   {jumlah} pcs × {harga satuan} = {subtotal}

Nama pemesan: {nama}
No. WhatsApp: {nomor}
Metode: {ambil di toko / pengiriman}
Tanggal ambil/kirim: {tanggal}
Alamat pengiriman: {alamat bila dikirim}

Subtotal produk: {subtotal}
Ongkir: {dikonfirmasi via WhatsApp bila dikirim}
TOTAL SEMENTARA: {subtotal}
```

Checkout tidak membuat keranjang, menyimpan order, atau memproses pembayaran. Produk habis tetap membuka WhatsApp untuk pertanyaan ketersediaan.

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
