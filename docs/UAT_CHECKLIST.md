# Checklist UAT (User Acceptance Testing) Manual — Niken Bakery

Dokumen ini melengkapi pengujian otomatis Playwright (A3) dan Vitest. Fokus pengujian manual ini adalah skenario pada perangkat fisik sesungguhnya, sensasi interaksi sentuhan (touch feel), kinerja jaringan seluler riil, dan penilaian kecocokan estetika neo-brutalism + glass terhadap target pasar Gen-Z.

---

## Panduan Pengujian

1. **Jalankan aplikasi di mode lokal atau staging:**
   - Akses dari smartphone pada jaringan Wi-Fi lokal yang sama dengan laptop (misal: `http://<IP-LAPTOP>:3000`).
2. **Perangkat yang Disarankan:**
   - HP Android (Chrome browser)
   - HP iOS / iPhone (Safari browser)
   - Desktop / Laptop (Firefox atau Safari bila ada)
3. **Beri tanda:**
   - `[x]` jika LULUS (Bekerja sesuai harapan tanpa kendala)
   - `[ ]` jika GAGAL atau Belum Diuji (tuliskan kendala di kolom Catatan)

---

## 1. Integrasi Nyata Aplikasi WhatsApp di Smartphone Asli

| ID | Skenario Uji | Perangkat | Hasil | Catatan / Hasil Pengamatan |
|---|---|---|:---:|---|
| UAT-WA-01 | **Klik CTA Hero Beranda**: Membuka langsung aplikasi WhatsApp asli di HP (bukan browser web fallback) dengan nomor toko dan pesan sapaan umum terisi otomatis. | HP Android / iOS | [ ] | Pastikan aplikasi WhatsApp langsung launch tanpa dialog error URL scheme. |
| UAT-WA-02 | **Pesan Detail Kue (Single Variant)**: Membuka aplikasi WhatsApp dengan pesan terisi rapi memuat nama kue, harga, format nama pemesan, dan alamat pengiriman. | HP Android / iOS | [ ] | Periksa apakah baris baru (`\n`) dan emoji tampil rapi di form chat WA. |
| UAT-WA-03 | **Pesan Detail Kue (Ganti Varian)**: Pilih varian ukuran lain (mis. Diameter 20 cm), klik "Pesan via WhatsApp". Pesan WA harus memuat label varian yang baru dipilih. | HP Android / iOS | [ ] | Cek kesesuaian nama varian pada draft teks. |
| UAT-WA-04 | **Produk Habis (Stok Kosong)**: Tombol berubah jadi "Tanya via WhatsApp". Saat ditekan, WA terbuka menanyakan ketersediaan kembali kue tersebut. | HP Android / iOS | [ ] | Pastikan tidak terjadi kebingungan order produk habis. |
| UAT-WA-05 | **Floating WhatsApp Button**: Menekan tombol melayang di pojok kanan bawah membuka chat umum ke toko. | HP Android / iOS | [ ] | Pastikan tombol mudah dijangkau jempol (ergonomis) dan tidak menutupi tombol penting. |

---

## 2. Kinerja & Responsivitas di Jaringan Seluler (4G / 3G Lambat)

| ID | Skenario Uji | Perangkat | Hasil | Catatan / Hasil Pengamatan |
|---|---|---|:---:|---|
| UAT-NET-01 | **Initial Page Load di 4G**: Buka halaman utama pertama kali di jaringan 4G. Waktu tampil konten bermakna (FCP) cepat dan layout tidak melompat (no CLS). | HP (Koneksi Seluler) | [ ] | Gambar terkompresi WebP termuat mulus. |
| UAT-NET-02 | **Navigasi Drawer Menu**: Membuka drawer hamburger navigasi di mobile terasa instan dan tidak patah-patah / lag saat animasi buka-tutup. | HP Android / iOS | [ ] | Responsivitas tap target dan animasi CSS. |
| UAT-NET-03 | **Pencarian Katalog Menu (Debounce)**: Mengetik nama kue di search bar menu dengan koneksi seluler tidak menyebabkan form freeze. | HP Android / iOS | [ ] | Debounce 300ms terasa nyaman saat mengetik di keyboard virtual. |

---

## 3. Alur Pengelolaan Admin dari Layar Sentuh Smartphone

| ID | Skenario Uji | Perangkat | Hasil | Catatan / Hasil Pengamatan |
|---|---|---|:---:|---|
| UAT-ADM-01 | **Login Dashboard via HP**: Memasukkan username dan password admin dari keyboard smartphone, auto-fill dan tombol submit bekerja nyaman. | HP Android / iOS | [ ] | Form tidak zoom otomatis berlebihan di Safari iOS (`font-size >= 16px`). |
| UAT-ADM-02 | **Tambah Kue Lengkap dari Kamera HP**: Masuk `/admin/products/new`, ambil foto langsung dari kamera HP atau galeri, isi 2 varian harga, simpan. | HP Android / iOS | [ ] | Foto terunggah dan otomatis terkompresi ke WebP; produk langsung tayang di `/menu`. |
| UAT-ADM-03 | **Quick Toggle Status Stok**: Di daftar produk `/admin/products`, ubah dropdown status kue dari "Ready" ke "Habis" menggunakan jempol. | HP Android / iOS | [ ] | Dropdown mudah disentuh; perubahan tersimpan secara optimis seketika. |
| UAT-ADM-04 | **Drawer Navigasi Admin**: Menu admin diakses lewat tombol hamburger atas di mobile, semua link sub-halaman dapat dibuka lancar. | HP Android / iOS | [ ] | Drawer menutup setelah link diklik. |

---

## 4. Kompatibilitas Lintas Browser (Safari iOS & Firefox Desktop)

| ID | Skenario Uji | Browser & Platform | Hasil | Catatan / Hasil Pengamatan |
|---|---|---|:---:|---|
| UAT-BRW-01 | **Safari iOS (WebKit Engine)**: Efek `backdrop-blur` (frosted glass) pada navbar, floating WA, dan mobile sticky bar ter-render tajam tanpa artifak visual. | Safari di iPhone / iPad | [ ] | Safari mendukung `-webkit-backdrop-filter`. |
| UAT-BRW-02 | **Firefox Desktop**: Efek bayangan tegas neo-brutalism (`shadow-[var(--shadow-brutal)]`) dan border 3px tampil presisi tanpa blur bocor. | Mozilla Firefox Desktop | [ ] | Periksa border radius dan shadow offset. |
| UAT-BRW-03 | **Safe Area Inset (Notch / Dynamic Island)**: Pada iPhone ber-notch, floating WA dan sticky action bar tidak tertutup garis gesture bar di bawah layar. | iPhone ber-notch (iOS) | [ ] | CSS `env(safe-area-inset-bottom)` berfungsi baik. |

---

## 5. Uji Kesan Estetika & "Vibe" Gen-Z (Feedback Kualitatif Target Pasar)

| ID | Parameter Evaluasi | Responden / Penilai | Hasil (Skala 1-5) | Catatan & Komentar Calon Pelanggan |
|---|---|---|:---:|---|
| UAT-VIBE-01 | **Daya Tarik Visual Neo-Brutalism**: Apakah kombinasi warna pastel (cream, butter, pink, mint) dan outline tebal terasa seru, estetik, dan tidak kaku/membosankan? | Target Gen-Z (18-26 thn) | [ ] / 5 | Komentar umum: |
| UAT-VIBE-02 | **Kejelasan & Kecepatan Pesan**: Apakah calon pembeli memahami bahwa pemesanan dilakukan via WhatsApp dan merasa alur 3-ketukan sangat praktis? | Calon Pembeli Kue | [ ] / 5 | Komentar umum: |
| UAT-VIBE-03 | **Kepercayaan & Brand UMKM**: Apakah tampilan foto, testimoni, status buka/tutup toko, dan alamat peta memberikan rasa percaya untuk membeli? | Calon Pembeli Kue | [ ] / 5 | Komentar umum: |

---

## Ringkasan Hasil UAT

- **Tanggal Pengujian:** ____________________
- **Penguji / Pemilik Toko:** ____________________
- **Status Akhir:** `[ ] SIAP DEPLOY KE PRODUKSI` / `[ ] PERLU PERBAIKAN MINOR`
- **Tindak Lanjut Tambahan:**
  - 

