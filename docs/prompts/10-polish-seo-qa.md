# Tahap 10 — Polish: SEO, Performa, Aksesibilitas, QA

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 01 sampai 09 selesai. Baca dulu: `docs/03-DESIGN_SYSTEM.md` (aturan glass, gerak, aksesibilitas), `docs/01-PROJECT_BRIEF.md` (kriteria sukses).

## Tujuan

Situs siap dipublikasikan: mudah ditemukan, cepat di HP kelas menengah, aksesibel, dan tidak ada tampilan rusak.

## Tugas

1. **SEO**: metadata lengkap per halaman (title, description, canonical, Open Graph, Twitter), gambar OG default dan per produk, `sitemap.ts` (halaman statis + produk published), `robots.ts`, JSON-LD `Bakery`/`LocalBusiness` (Home/About) dan `Product` dengan `offers` (detail produk), favicon dan manifest dasar, `NEXT_PUBLIC_SITE_URL` sebagai basis URL.
2. **Performa**: `priority` hanya untuk gambar LCP (hero), lazy-load sisanya, `sizes` benar, tidak ada layout shift (dimensi gambar), audit hasil `next build` (kurangi `"use client"` yang tidak perlu), pastikan jumlah elemen glass sesuai aturan, tidak ada animasi blur.
3. **Aksesibilitas**: skip link, urutan fokus, focus ring, kontras (termasuk teks di atas glass dan di atas tiap warna aksen), `alt`, `aria-label` tombol ikon, label form, dialog menjebak fokus dan menutup dengan Esc, `prefers-reduced-motion` mematikan marquee.
4. **State**: `loading.tsx`, `error.tsx`, `not-found.tsx` bergaya brand dengan kalimat yang menjelaskan apa yang terjadi dan langkah berikutnya; empty state di semua daftar.
5. **QA responsif**: 360, 390, 768, 1024, 1440 px; tanpa scroll horizontal; safe-area iOS untuk floating WA dan panel sticky.
6. **Opsional (hanya jika performa tetap terjaga):** quick-view modal produk dengan intercepting route; catat di DECISIONS.md bila dikerjakan.
7. Susun daftar temuan yang tidak sempat diperbaiki di PROGRESS.md sebagai utang teknis.

## Batasan

- Jangan menambah fitur baru; fokus memperbaiki kualitas.
- Jangan mengubah skema DB.

## Selesai jika

- [ ] Lighthouse mobile (bila bisa dijalankan): Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95 pada Home, Menu, dan satu detail produk. Bila tidak bisa dijalankan, tulis halaman yang perlu diuji pengguna.
- [ ] `sitemap.xml` dan `robots.txt` valid; `/admin` tidak terindeks.
- [ ] Navigasi hanya dengan keyboard memungkinkan memesan satu kue.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui.

Commit: `chore: polish seo, performance and accessibility`
