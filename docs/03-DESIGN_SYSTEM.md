# 03 — Design System: Neo-brutalism + Frosted Glass

Kesepakatan (D-002): **neo-brutalism = tulang punggung**, **frosted glass = lapisan sekunder**. Dua gaya ini bertolak belakang, jadi aturan peran di bawah wajib diikuti.

## Prinsip

1. **Bagi peran dengan tegas.** Neo-brutal untuk struktur dan komponen utama (kartu, tombol, badge, tipografi, layout). Glass hanya untuk lapisan yang melayang di atas konten (navbar, panel ringkasan di detail produk, floating WA, dialog).
2. **Jembatan antar gaya.** Panel glass tetap memakai border tebal berwarna ink dan hard shadow, supaya terlihat satu keluarga dengan elemen neo-brutal.
3. **Foto kue adalah bintang.** Jangan menutup foto dengan glass atau dekorasi. Beri border tebal dan shadow, itu cukup.
4. **Gunakan keberanian di satu tempat: hero.** Heading raksasa + satu stiker miring adalah momen yang diingat. Section lain tenang dan disiplin.
5. **Struktur visual harus bermakna.** Border, nomor, dan label hanya dipakai bila menyampaikan informasi. Nomor langkah hanya di "Cara Pesan" (urutan nyata).
6. **Hindari tanda-tanda desain generik:** eyebrow ALL-CAPS di atas setiap heading, menonjolkan satu kata di heading dengan warna beda, tanda `→` di setiap link, animasi fade-slide-up di tiap section, satu radius dan satu shadow untuk semua elemen, gradient sebagai dekorasi.

## Token

Palet default (ganti dengan warna brand bila pemilik punya logo; catat di DECISIONS.md):

| Token | Hex | Pakai untuk |
|---|---|---|
| `cream` | `#FFF4E0` | Background halaman |
| `ink` | `#2B1B17` | Teks, border, shadow (cokelat tua, bukan hitam murni) |
| `pink` | `#FF8FAB` | Aksen strawberry |
| `butter` | `#FFD93D` | Aksen utama, tombol utama |
| `mint` | `#8EE3C8` | Aksen, status Ready |
| `lavender` | `#C9B6FF` | Aksen sekunder |
| `wa` | `#25D366` | Tombol WhatsApp |
| `danger` | `#FF5A4E` | Habis, hapus, error |

Border: `3px solid ink` (elemen kecil boleh `2px`). Hard shadow tanpa blur: `sm 3px 3px`, `md 5px 5px`, `lg 8px 8px`.
Radius **bertingkat**: kecil 8px (input, badge), sedang 14px (kartu), pill 999px (tombol, filter). Stiker boleh 0.

Tailwind v4 (`globals.css`), sesuaikan bila memakai v3:

```css
@import "tailwindcss";

@theme {
  --color-cream: #FFF4E0;
  --color-ink: #2B1B17;
  --color-pink: #FF8FAB;
  --color-butter: #FFD93D;
  --color-mint: #8EE3C8;
  --color-lavender: #C9B6FF;
  --color-wa: #25D366;
  --color-danger: #FF5A4E;
  --shadow-brutal-sm: 3px 3px 0 #2B1B17;
  --shadow-brutal: 5px 5px 0 #2B1B17;
  --shadow-brutal-lg: 8px 8px 0 #2B1B17;
}

@theme inline {
  --font-heading: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
}

body { background: var(--color-cream); color: var(--color-ink); font-family: var(--font-body); }
h1, h2, h3 { font-family: var(--font-heading); font-weight: 800; line-height: 1.05; }

.glass {
  background: rgb(255 255 255 / 0.6);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  border: 3px solid var(--color-ink);
  box-shadow: var(--shadow-brutal);
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: rgb(255 255 255 / 0.95); } }

@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation: none !important; transition: none !important; } }
```

## Tipografi

- **Heading**: Bricolage Grotesque (700 sampai 800). **Body**: Figtree (400 sampai 700). Muat dengan `next/font/google`, `display: "swap"`, ekspos sebagai `--font-bricolage` dan `--font-figtree`.
- Skala: hero `clamp(3rem, 10vw, 7rem)`, h2 `clamp(2rem, 5vw, 3.5rem)`, h3 `1.5rem`, body `1rem` (jangan di bawah 16px untuk teks utama).
- Panjang baris maksimal sekitar 70 karakter. Sentence case; hindari ALL-CAPS untuk label.
- Angka harga: `font-variant-numeric: tabular-nums`.

## Aturan frosted glass

- Maksimal **2 sampai 3 elemen glass dalam satu viewport**. Jangan di dalam grid kartu produk.
- Blur maksimal 16px; jangan menganimasikan blur. Opacity latar minimal 0.55 dengan teks `ink`.
- Glass hanya berguna jika ada warna atau foto di belakangnya: beri blok warna atau foto pada section di bawah elemen glass.
- Wajib punya fallback `@supports not (backdrop-filter...)` dan prefix `-webkit-`.
- Kartu produk, tombol, badge, footer, dan seluruh admin: **solid**, bukan glass.

## Komponen (di `components/ui/`)

| Komponen | Spesifikasi |
|---|---|
| `Button` | Varian `primary` (butter), `wa` (hijau), `ghost`, `danger`; pill, border + shadow-brutal; hover: geser 2px dan shadow mengecil; active: geser penuh, shadow 0; min-height 44px; focus ring tebal (3px offset 2px) |
| `Card` | Putih, border 3px, radius 14px, shadow-brutal. Varian `interactive` (hover geser) |
| `Badge` / `Sticker` | Kecil, border 2px, warna dari token; `Sticker` boleh miring (`-2deg`) |
| `StatusBadge` | Ready = mint, Pre-order = butter (+ lead time), Habis = danger |
| `Pill` | Filter kategori; aktif = warna kategori terisi, tidak aktif = putih |
| `GlassPanel` | Kelas `.glass` + radius 14px |
| `Marquee` | Teks berjalan, pemisah berupa ikon kecil atau stiker, sentence case. **Berhenti** saat `prefers-reduced-motion` |
| `SectionHeading` | h2 + deskripsi singkat opsional, tanpa eyebrow |
| `Input` / `Select` / `Textarea` | Border 3px, radius 8px, label terlihat, error teks di bawah dengan warna `danger` dan ikon |
| `PlaceholderCake` | Blok warna token + pola sederhana (CSS/SVG) sebagai pengganti foto. Menerima `color` |
| `ProductCard` | Solid. Foto rasio 4:3 (border), nama, harga, StatusBadge, tombol "Pesan via WhatsApp" ringkas |
| Checkout pesanan | Ringkasan bill dan form pemesan solid dengan border tebal + hard shadow; subtotal dan keterangan ongkir harus terbaca jelas, kontrol jumlah minimal 44×44px |
| `WhatsAppButton` / `FloatingWhatsApp` | Hijau `wa`; floating memakai wadah glass kecil, aman dari safe-area iOS |
| `Dialog` | Panel glass di atas overlay gelap transparan, tutup dengan Esc dan klik overlay, fokus terkunci |
| `EmptyState` | Ilustrasi sederhana + kalimat arahan + tombol aksi |
| `DataTable` (admin) | Solid, padat, pada mobile berubah menjadi daftar kartu |

## Panduan per bagian halaman

| Bagian | Gaya |
|---|---|
| Navbar sticky | Glass, border bawah tebal, logo seperti stiker; menu hamburger di mobile |
| Hero | Heading raksasa, blok warna flat, satu stiker miring, foto kue ber-border + hard shadow, marquee di bawahnya |
| Produk andalan | Grid `ProductCard` solid |
| Banner promo | Blok warna penuh dari token, teks besar, CTA jelas |
| Cara Pesan | Langkah bernomor (urutan nyata), kartu solid |
| Testimoni | Kartu solid dengan warna berselang-seling dan rotasi kecil |
| Social | Grid kartu solid; boleh kolom bergaya masonry |
| Detail produk | Galeri berborder; panel ringkasan harga + CTA sebagai glass sticky di bawah pada mobile (1 elemen glass); tombol marketplace neo-brutal tampil hanya untuk kanal aktif |
| Footer | Blok warna solid besar |
| Admin | Neo-brutal bersih: putih, border tegas, tanpa glass, padat dan cepat dipakai |

## Layout dan responsif

- Mobile-first. Uji di 360, 390, 768, 1024, 1440 px. **Tidak boleh ada scroll horizontal.**
- Container maksimal `max-w-6xl`, padding horizontal 16px (mobile) dan 24px (desktop). Jarak antar section konsisten (mis. 64px mobile, 96px desktop).
- Grid produk: 1 kolom (≤ 400px) atau 2 kolom (mobile), 3 (tablet), 4 (desktop).
- Floating WA dan sticky panel tidak boleh menutupi konten penting atau tombol lain; hormati `env(safe-area-inset-bottom)`.

## Gerak

- Gerak tetap singkat dan punya respons langsung pada aksi pengguna: hover/tekan, fokus form, pembukaan dialog, dan disclosure FAQ.
- Perpindahan halaman memakai satu splash SVG kue acak, lalu konten muncul dari blur dengan efek kedalaman yang mereda. Jangan menambahkan animasi masuk terpisah pada setiap section.
- Jika `prefers-reduced-motion: reduce` aktif, tampilkan halaman tanpa splash dan tanpa gerak dekoratif.
- Marquee menjadi satu-satunya gerak otomatis yang terus berjalan; splash hanya muncul singkat saat halaman dibuka atau navigasi. Keduanya mati saat reduced motion.

## Aksesibilitas

Kontras teks minimal 4.5:1 (ink di atas semua warna aksen sudah memenuhi; periksa teks di atas glass). Focus ring selalu terlihat. Semua tombol ikon punya `aria-label`. Gambar punya `alt`. Elemen interaktif minimal 44×44px.

## Copy UI

Ikuti bagian "Tone copywriting" di `01-PROJECT_BRIEF.md`. Satu aksi memakai nama yang sama di seluruh alur (tombol "Simpan perubahan" memunculkan toast "Perubahan disimpan").
