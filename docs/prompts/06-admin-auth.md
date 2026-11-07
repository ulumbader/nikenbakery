# Tahap 06 — Admin: Auth & Kerangka Dashboard

Ikuti ritual di `AGENTS.md` §3. Prasyarat: tahap 02 selesai. Baca dulu: `docs/02-ARCHITECTURE.md` (bagian Keamanan, Rute), `docs/03-DESIGN_SYSTEM.md` (admin: solid, tanpa glass).

## Tujuan

Login admin yang aman dan kerangka dashboard yang akan diisi tahap 07 sampai 09.

## Tugas

1. Pasang `jose` dan `bcryptjs` (periksa apakah paket tipe diperlukan).
2. `lib/auth/password.ts` (hash dan verifikasi), `lib/auth/session.ts` (buat/baca/hapus sesi: JWT HS256, cookie `httpOnly`, `sameSite=lax`, `secure` di production, 7 hari; gagal start di production bila `SESSION_SECRET` kosong atau < 32 karakter), `lib/auth/require-admin.ts` (`requireAdmin()` mengarahkan ke `/admin/login`; versi yang melempar error untuk route handler).
3. Script `npm run admin:create`: membaca `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dari env, membuat atau memperbarui admin (ini juga cara ganti password). Tolak password < 10 karakter.
4. `/admin/login`: form (Server Action + zod + `useActionState`), pesan error generik, pembatasan percobaan (mis. 5 kali per 15 menit per IP+username, in-memory), redirect ke `/admin` setelah sukses. Action `logout`.
5. Proteksi lapis ganda: pengecekan optimistis di `middleware.ts` atau `proxy.ts` (sesuai versi Next) hanya untuk mengarahkan ke login, **dan** `requireAdmin()` di `admin/(dashboard)/layout.tsx`. Aturan ke depan: setiap Server Action admin memanggil `requireAdmin()` sendiri.
6. Kerangka dashboard `admin/(dashboard)/layout.tsx`: sidebar di desktop, drawer atau bottom-nav di mobile, header dengan nama dan tombol keluar; tautan ke semua modul (halaman yang belum ada boleh berupa stub "Segera hadir"). Gaya admin: neo-brutal bersih, tanpa glass.
7. Semua halaman admin `noindex` (metadata). Tambahkan `robots.ts` yang me-disallow `/admin`.

## Batasan

- Jangan menyimpan password atau token di log atau di repo.
- Jangan membuat registrasi publik. Admin hanya dibuat lewat script.
- Jangan mengandalkan middleware/proxy sebagai satu-satunya proteksi.

## Selesai jika

- [ ] Tanpa login, `/admin` dan semua sub-rute mengarah ke `/admin/login`.
- [ ] Login salah memberi pesan generik; percobaan berlebihan ditahan sementara.
- [ ] Cookie sesi memiliki flag yang benar; logout menghapusnya.
- [ ] `requireAdmin()` teruji dari layout dan dari contoh Server Action.
- [ ] Lint dan build lulus; PROGRESS.md diperbarui (termasuk cara membuat admin pertama).

Commit: `feat(admin): add authentication and dashboard shell`
