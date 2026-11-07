# Prompt Bertahap — Niken Bakery

Satu tahap = satu sesi AI agent. Memori antar sesi disimpan di file (`docs/PROGRESS.md`, `docs/DECISIONS.md`, git), bukan di kepala agent.

## Persiapan sekali saja

1. Salin isi kit ini ke root project `nikenbakery`: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.env.example`, folder `docs/`.
2. Commit: `chore: add agent context kit`.
3. (Opsional) Cursor/Copilot membaca `AGENTS.md` otomatis. Agent lain: arahkan ke `AGENTS.md` di prompt pertama.

## Prompt pembuka (tempel di AWAL SETIAP SESI BARU)

```
Kamu melanjutkan proyek Niken Bakery. Ikuti AGENTS.md.
1. Baca AGENTS.md, lalu docs/PROGRESS.md.
2. Kerjakan tahap aktif sesuai file di docs/prompts/ yang ditunjuk PROGRESS.md.
3. Lakukan preflight dan wrap-up seperti di AGENTS.md (lint, build, update PROGRESS.md, commit).
4. Berhenti setelah tahap selesai. Jangan lanjut ke tahap berikutnya sebelum aku minta.
Balas dalam Bahasa Indonesia.
```

## Prompt untuk memulai tahap tertentu

```
Kerjakan tahap NN. Baca AGENTS.md, docs/PROGRESS.md, lalu docs/prompts/NN-<nama>.md dan ikuti persis.
```

## Prompt darurat (agent tersesat atau melenceng)

```
Berhenti. Jangan ubah kode dulu.
Baca AGENTS.md dan docs/PROGRESS.md, jalankan git status dan git log -10.
Laporkan: (1) tahap aktif, (2) apa yang sudah ada di repo, (3) apa yang menyimpang dari docs/, (4) rencana perbaikan terkecil.
Tunggu persetujuanku.
```

## Prompt saat sesi putus di tengah tahap

```
Sesi sebelumnya terputus di tengah tahap aktif. Baca AGENTS.md, docs/PROGRESS.md, git status, dan git diff.
Tentukan bagian tahap yang sudah selesai dan yang belum, ringkas dalam 5 baris, lalu lanjutkan dari yang belum.
```

## Daftar tahap

| # | File | Hasil | Bergantung pada |
|---|---|---|---|
| 01 | `01-foundation.md` | Audit, token desain, komponen UI dasar, `/styleguide` | none |
| 02 | `02-database.md` | Skema Drizzle, migrasi, query, seed data contoh | 01 |
| 03 | `03-public-layout-home.md` | Navbar, footer, floating WA, Home | 01, 02 |
| 04 | `04-menu-product-whatsapp.md` | Menu, filter, detail produk, order WA | 03 |
| 05 | `05-about-social.md` | About Us dan Social | 03 |
| 06 | `06-admin-auth.md` | Login admin, sesi, kerangka dashboard | 02 |
| 07 | `07-admin-products.md` | CRUD produk, kategori, upload gambar | 06 |
| 08 | `08-admin-content-settings.md` | Banner, testimoni, social, FAQ, pengaturan | 06, 07 |
| 09 | `09-analytics-dashboard.md` | Event analitik, dashboard ringkasan | 07 |
| 10 | `10-polish-seo-qa.md` | SEO, performa, a11y, state error/loading | 01 sampai 09 |
| 11 | `11-deploy-handoff.md` | Docker, backup, panduan pemilik | 10 |
| 12 | `12-optional-custom-order.md` | Form custom order ke WA (opsional) | 04 |

Tahap 03 sampai 05 (publik) dan 06 sampai 08 (admin) bisa dikerjakan bergantian, tetapi **tetap satu tahap per sesi**.

## Tips

- Pindah sesi bila konteks agent sudah panjang atau jawabannya mulai melenceng. Aman, karena status ada di PROGRESS.md.
- Setelah tiap tahap, buka halaman terkait di HP dan di laptop, lalu beri umpan balik ke agent di sesi yang sama sebelum commit akhir.
- Bila pemilik memberi data asli (logo, warna, nomor WA, foto), minta agent mencatatnya di PROGRESS.md dan menerapkannya lewat admin/settings atau token desain.
