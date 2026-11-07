# Tahap 07 — Admin: Produk, Kategori, Upload Gambar

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 06 selesai. Baca dulu: `docs/02-ARCHITECTURE.md` (skema, aturan data, keamanan upload, caching), `docs/03-DESIGN_SYSTEM.md` (admin, DataTable, Input).

## Tujuan

Pemilik bisa mengelola seluruh katalog sendiri: kategori, produk, varian, foto, dan status cepat.

## Tugas

1. **Pipeline upload** `lib/upload.ts`: terima file, validasi tipe (JPEG/PNG/WebP/AVIF) dan ukuran (≤ 5 MB), verifikasi isi lewat `sharp`, `rotate()` otomatis, hasilkan **large 1200px** dan **thumb 480px** WebP (kualitas sekitar 80, tanpa EXIF), nama file acak (`crypto.randomUUID()`), simpan ke `UPLOAD_DIR`; fungsi hapus file. Tolak SVG.
2. **Route `/media/[...path]`**: sajikan file dari `UPLOAD_DIR`, blok path traversal (normalisasi dan pastikan tetap di dalam `UPLOAD_DIR`), `Content-Type` benar, `Cache-Control` panjang dan immutable. Gambar dari `/media` ditampilkan dengan `next/image` `unoptimized` (sudah dioptimasi saat upload), atau `<img>` dengan `width`/`height` eksplisit.
3. **Kategori** (`/admin/categories`): tambah, ubah nama/warna token, ubah urutan (tombol naik/turun), hapus. Jika kategori masih dipakai produk, tampilkan jumlah produk dan minta pilih kategori pengganti sebelum menghapus.
4. **Daftar produk** (`/admin/products`): `DataTable` (di mobile berupa daftar kartu), pencarian, filter kategori dan status, **toggle cepat inline** untuk status (Ready/Pre-order/Habis), publish, dan featured; tombol ubah dan hapus (dengan konfirmasi dialog).
5. **Form produk** (`/admin/products/new` dan `/[id]`): nama, slug otomatis (bisa diedit; tangani duplikat), kategori, deskripsi, harga dasar, status + catatan pre-order, bahan, alergen, featured, published; **varian** (daftar dinamis: label, harga, urutan); **galeri** (multi-upload, pratinjau, jadikan cover, ubah `alt`, urutkan dengan tombol naik/turun, hapus).
6. Semua mutasi: Server Action, `requireAdmin()` di tiap action, zod di server, `revalidatePath` untuk halaman publik terkait, toast hasil ("Produk disimpan", dll.). Tombol submit nonaktif dan menampilkan status saat memproses.
7. Saat produk atau gambar dihapus, hapus pula file fisiknya dari `UPLOAD_DIR`.

## Batasan

- Tidak memakai library UI besar tambahan untuk drag-and-drop; tombol naik/turun cukup.
- Jangan menyimpan file di `public/`.
- Jangan percaya `Content-Type` atau ekstensi dari klien.

## Selesai jika

- [ ] Menambah produk lengkap (3 foto, 2 varian) dari HP dapat dilakukan, dan langsung tampil benar di `/menu` dan detailnya.
- [ ] Toggle cepat status/publish/featured langsung berlaku di publik.
- [ ] Upload file bukan gambar, > 5 MB, atau SVG ditolak dengan pesan jelas.
- [ ] Menghapus produk menghapus file di disk; `/media/../..` ditolak.
- [ ] Setiap action admin memeriksa sesi (uji tanpa login: ditolak).
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `feat(admin): add product, category and image management`
