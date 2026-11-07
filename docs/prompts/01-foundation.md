# Tahap 01 — Foundation & Setup

Ikuti ritual di `AGENTS.md` §3. Baca dulu: `AGENTS.md`, `docs/02-ARCHITECTURE.md` (stack, folder), `docs/03-DESIGN_SYSTEM.md` (seluruhnya).

## Tujuan

Proyek Next.js default menjadi fondasi siap pakai: token desain, font, komponen UI dasar, dan halaman `/styleguide` untuk memverifikasi tampilan. Belum ada database atau fitur.

## Tugas

1. **Audit proyek** (jangan ubah apa pun dulu): versi Next.js, React, Tailwind; memakai `src/` atau tidak; alias import; package manager; ESLint. Tulis hasilnya di PROGRESS.md bagian "Kondisi awal". Jika struktur berbeda dari `02-ARCHITECTURE.md`, sesuaikan path dan catat sebagai keputusan baru.
2. Bersihkan boilerplate `create-next-app` (halaman default, aset bawaan). Set `<html lang="id">`, metadata dasar dengan title template "%s | Niken Bakery".
3. Muat font Bricolage Grotesque dan Figtree dengan `next/font/google`; ekspos sebagai variabel CSS `--font-bricolage` dan `--font-figtree`.
4. Terapkan token (warna, shadow brutal, kelas `.glass`, reduced-motion) di `globals.css` sesuai `03-DESIGN_SYSTEM.md`. Sesuaikan sintaks dengan versi Tailwind terpasang (v4 `@theme` atau v3 `tailwind.config`).
5. Buat struktur folder sesuai arsitektur (hanya folder yang dibutuhkan sekarang).
6. Bangun komponen di `components/ui/`: `Button`, `Card`, `Badge`/`Sticker`, `StatusBadge`, `Pill`, `GlassPanel`, `Marquee`, `SectionHeading`, `Input`/`Select`/`Textarea`, `PlaceholderCake`, `EmptyState`. Spesifikasi di tabel Komponen. Semuanya server-compatible kecuali yang memang butuh state.
7. Buat `lib/format.ts`: `formatRupiah(n)` (mis. `Rp45.000`, locale `id-ID`) dan `formatDate`.
8. Buat halaman `/styleguide` yang menampilkan palet, tipografi, semua komponen dan variannya, serta satu demo glass di atas blok warna. Di production halaman ini memanggil `notFound()`.
9. Buat `.gitignore` (tambahkan `data/`, `.env*` kecuali `.env.example`) dan pastikan `.env.example` ada. Pastikan script npm `lint` dan `build` berjalan.

## Batasan

- Jangan memasang dependency runtime baru (DB/auth datang di tahap berikutnya).
- Jangan menambah halaman publik selain `/styleguide`.
- Jangan memakai glass pada Card/ProductCard.

## Selesai jika

- [ ] `npm run lint` dan `npm run build` lulus.
- [ ] `/styleguide` menampilkan semua komponen; tidak ada scroll horizontal di 375px.
- [ ] Font termuat; kelas `.glass` punya fallback dan prefix `-webkit-`.
- [ ] Fokus keyboard terlihat jelas di semua komponen interaktif.
- [ ] PROGRESS.md berisi kondisi awal proyek dan tahap 01 dicentang.

Commit: `feat(ui): add design tokens and base components`
