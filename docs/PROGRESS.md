# PROGRESS — Dokumen Hidup

> **Agent WAJIB memperbarui file ini di akhir setiap sesi/tahap.** Ini adalah memori proyek antar sesi.
> Dibuat: 2026-11-07. Terakhir diperbarui: 2026-11-07.

## Posisi saat ini

- **Tahap aktif:** 01 — Foundation & setup
- **Status:** selesai ✅
- **Kondisi repo:** token desain diterapkan, font dimuat, semua komponen UI dasar dibuat, halaman `/styleguide` tersedia.
- **Langkah berikutnya:** kerjakan `docs/prompts/02-database.md`.

## Checklist tahap

| Tahap | Prompt | Status |
|---|---|---|
| 01 | Foundation & setup (audit, token, komponen UI dasar, styleguide) | [x] |
| 02 | Database & seed (Drizzle, skema, query, data contoh) | [ ] |
| 03 | Layout publik & Home | [ ] |
| 04 | Menu, detail produk, order WhatsApp | [ ] |
| 05 | About Us & Social | [ ] |
| 06 | Admin: auth & kerangka dashboard | [ ] |
| 07 | Admin: produk, kategori, upload gambar | [ ] |
| 08 | Admin: banner, testimoni, social, FAQ, pengaturan | [ ] |
| 09 | Analitik dasar & dashboard ringkasan | [ ] |
| 10 | Polish: SEO, performa, aksesibilitas, QA | [ ] |
| 11 | Deploy & serah terima | [ ] |
| 12 | (Opsional) Form custom order | [ ] |

Status: `[ ]` belum · `[~]` sedang dikerjakan · `[x]` selesai (lint + build lulus, commit dibuat).

## Kondisi awal proyek (diisi di tahap 01)

- Versi Next.js: 16.4.5 / React: 19.3.0 / Tailwind CSS: v4 (syntax `@theme`)
- Memakai `src/`? **Tidak** — file langsung di root (`app/`, `components/`, `lib/`, dll)
- Alias import: `@/*` → `./*`
- Package manager: npm
- ESLint: flat config (`eslint.config.mjs`), `eslint-config-next` core-web-vitals + typescript
- TypeScript: strict mode aktif

## Data bisnis & input dari pengguna

| Item | Status |
|---|---|
| Logo & warna brand Niken Bakery | Belum ada. Pakai palet default di `03-DESIGN_SYSTEM.md` |
| Nomor WhatsApp | Belum ada. Pakai nilai CONTOH |
| Alamat, jam buka, link Maps | Belum ada. Pakai nilai CONTOH |
| Foto produk | Belum ada. Pakai `PlaceholderCake` |
| Cerita brand (About) | Belum ada. Pakai teks CONTOH |
| Akun Instagram/TikTok | Belum ada. Pakai nilai CONTOH |

Perbarui tabel ini begitu pengguna memberi data asli.

## Blocker & pertanyaan terbuka

- (kosong)

## Ringkasan sesi terakhir

- Tahap 01 selesai. Audit proyek, token desain, font Bricolage + Figtree, 11 komponen UI, halaman `/styleguide`, `lib/format.ts`, folder structure, `.gitignore` diperbarui.

## Log sesi (terbaru di atas)

### 2026-11-07 — Tahap 01
- Dikerjakan: audit proyek, bersihkan boilerplate, set `lang="id"`, metadata title template, font Bricolage Grotesque + Figtree, token warna + shadow di `globals.css` (Tailwind v4 `@theme`), kelas `.glass` + fallback + `-webkit-`, `prefers-reduced-motion`, focus ring. Buat 11 komponen UI (`Button`, `Card`, `Badge`/`Sticker`, `StatusBadge`, `Pill`, `GlassPanel`, `Marquee`, `SectionHeading`, `Input`/`Select`/`Textarea`, `PlaceholderCake`, `EmptyState`). Buat `lib/format.ts` (`formatRupiah`, `formatDate`). Buat halaman `/styleguide` (notFound di prod). Perbarui `.gitignore` (tambah `data/`, perbaiki `.env*`).
- File penting yang diubah/dibuat: `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/styleguide/page.tsx`, `components/ui/*.tsx`, `components/ui/index.ts`, `lib/format.ts`, `.gitignore`
- Keputusan baru: D-012 (proyek tidak memakai `src/`, path disesuaikan)
- Masalah / utang teknis: tidak ada
- Cara verifikasi: `npm run lint` ✅, `npm run build` ✅, buka `/styleguide` di dev (`npm run dev`) dan periksa di 375px dan 1280px
- Berikutnya: tahap 02 (Database & seed)
