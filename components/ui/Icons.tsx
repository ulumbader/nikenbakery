import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// ─── 1. BAKERY & MAKANAN ───

/** Ikon Cupcake — Simbol utama brand Niken Bakery */
export function IconCupcake({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Cherry on top */}
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path d="M12 2 C13 1, 15 1, 16 2" />
      {/* Frosting swirl */}
      <path d="M6 10 C5 9, 5 7, 7 6 C9 5, 11 6, 12 6 C13 6, 15 5, 17 6 C19 7, 19 9, 18 10 C19 11, 19 12, 17.5 13 C16 14, 8 14, 6.5 13 C5 12, 5 11, 6 10 Z" />
      {/* Cup base */}
      <path d="M6 13 L7.5 21 C7.8 22, 8.2 22, 9 22 H15 C15.8 22, 16.2 22, 16.5 21 L18 13" />
      {/* Fluted lines on cup */}
      <path d="M10 14 L10.5 21" />
      <path d="M14 14 L13.5 21" />
    </svg>
  );
}

/** Ikon Kue Ulang Tahun / Kue Bertingkat (Cake) */
export function IconCake({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Candles with flames */}
      <path d="M8 8 V5" />
      <path d="M12 8 V4" />
      <path d="M16 8 V5" />
      <circle cx="8" cy="3" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="3" r="1" fill="currentColor" stroke="none" />
      {/* Top tier */}
      <path d="M5 8 H19 V12 C19 13, 17 13.5, 16 12.5 C15 11.5, 13 11.5, 12 12.5 C11 13.5, 9 13.5, 8 12.5 C7 11.5, 5 12, 5 12 V8 Z" />
      {/* Bottom tier / platter */}
      <path d="M4 13 H20 V20 H4 Z" />
      <path d="M2 20 H22" />
      <path d="M7 16 H17" />
    </svg>
  );
}

/** Ikon Potongan Kue (Cake Slice) */
export function IconCakeSlice({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Cherry on top */}
      <circle cx="8" cy="4" r="1.5" fill="currentColor" />
      {/* Wedge shape */}
      <path d="M2 18 L21 11 L13 5 L2 18 Z" />
      {/* Bottom side */}
      <path d="M2 18 V20 C2 20.5, 2.5 21, 3 21 H21 C21.5 21, 22 20.5, 22 20 V11 L21 11" />
      {/* Delicious filling layer */}
      <path d="M2 14.5 L21 8.5" />
      <path d="M8 12 L8 16" />
      <path d="M14 10 L14 14" />
    </svg>
  );
}

/** Ikon Sparkle / Bintang 4 Titik (Kilau / Fresh) */
export function IconSparkle({
  className = "w-5 h-5",
  size,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1 C12 7, 7 12, 1 12 C7 12, 12 17, 12 23 C12 17, 17 12, 23 12 C17 12, 12 7, 12 1 Z" />
    </svg>
  );
}

/** Ikon Daun / Bahan Segar Alami */
export function IconLeaf({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21 C3 14, 6 3, 21 3 C21 18, 10 21, 3 21 Z" />
      <path d="M3 21 C9 15, 14 10, 21 3" />
    </svg>
  );
}

/** Ikon Gandum / Bahan Pilihan (Wheat) */
export function IconWheat({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 22 L20 6" />
      <path d="M8 14 C7 11, 9 9, 12 10 C11 13, 9 15, 8 14 Z" />
      <path d="M12 10 C11 7, 13 5, 16 6 C15 9, 13 11, 12 10 Z" />
      <path d="M10 18 C9 15, 11 13, 14 14 C13 17, 11 19, 10 18 Z" />
      <path d="M14 14 C13 11, 15 9, 18 10 C17 13, 15 15, 14 14 Z" />
      <path d="M17 5 L20 2 L22 5" />
    </svg>
  );
}

// ─── 2. KOMUNIKASI & SOSIAL ───

/** Ikon WhatsApp / Chat Bubble Ceria */
export function IconWhatsApp({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 11.5 C21 16.2, 17.2 20, 12.5 20 C10.9 20, 9.4 19.5, 8.1 18.7 L3 20.5 L4.8 15.6 C3.7 14.3, 3 12.7, 3 11 C3 6.3, 6.8 2.5, 11.5 2.5 C16.2 2.5, 20.5 6.3, 21 11.5 Z" />
      {/* Cute phone handset inside */}
      <path
        d="M9.5 8.5 C9.2 8, 8.8 8, 8.4 8 C8 8, 7.5 8.3, 7.3 8.7 C7 9.2, 7 10.5, 8.2 12.5 C9.4 14.5, 10.8 15.2, 12 15.2 C12.7 15.2, 13.5 14.7, 13.8 14.2 L14.5 13.2 C14.7 12.9, 14.6 12.5, 14.2 12.3 L12.8 11.6 C12.5 11.4, 12.1 11.5, 11.9 11.8 L11.4 12.4 C10.6 12, 10 11.3, 9.6 10.5 L10.1 10 C10.4 9.8, 10.5 9.4, 10.3 9.1 L9.5 8.5 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** Ikon Instagram (Kamera Retro Neo-Brutal) */
export function IconInstagram({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Ikon TikTok (Notasi Nada Musik) */
export function IconTikTok({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12 A4 4 0 1 0 13 16 V4 C14.5 6.5, 17 8, 20 8" />
    </svg>
  );
}

/** Ikon Email / Surat */
export function IconMail({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  );
}

/** Ikon Link / Tautan Berbagi */
export function IconLink({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13 A5 5 0 0 0 17 13 L19 11 A5 5 0 0 0 12 4 L10 6" />
      <path d="M14 11 A5 5 0 0 0 7 11 L5 13 A5 5 0 0 0 12 20 L14 18" />
    </svg>
  );
}

// ─── 3. LOKASI, WAKTU & PENGIRIMAN ───

/** Ikon Pin Lokasi (Map Pin) */
export function IconMapPin({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21 C12 21, 19 14.5, 19 9.5 C19 5.5, 15.9 2.5, 12 2.5 C8.1 2.5, 5 5.5, 5 9.5 C5 14.5, 12 21, 12 21 Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** Ikon Jam / Waktu Operasional */
export function IconClock({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5 V12 L16 14.5" />
    </svg>
  );
}

/** Ikon Peta Lipat (Map) */
export function IconMap({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

/** Ikon Kotak Paket / Pre-Order */
export function IconPackage({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3 L21 7.5 V16.5 L12 21 L3 16.5 V7.5 L12 3 Z" />
      <path d="M12 12 L21 7.5" />
      <path d="M12 12 V21" />
      <path d="M12 12 L3 7.5" />
      <path d="M7.5 5.2 L16.5 9.8" />
    </svg>
  );
}

/** Ikon Kurir / Motor Pengiriman */
export function IconMotorcycle({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Wheels */}
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      {/* Frame & Seat */}
      <path d="M12 18 V12 L16 8 H19" />
      <path d="M12 12 H7 L5 18" />
      <path d="M10 7 H14" />
      {/* Delivery box on back */}
      <rect x="7" y="7" width="5" height="5" rx="1" />
    </svg>
  );
}

// ─── 4. UI, STATUS & AKSI ───

/** Ikon Cari (Search) */
export function IconSearch({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7.5" />
      <path d="M21 21 L16.5 16.5" />
    </svg>
  );
}

/** Ikon Silang (Close / Cancel / Delete) */
export function IconClose({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 L6 18" />
      <path d="M6 6 L18 18" />
    </svg>
  );
}

/** Ikon Centang (Check / Success) */
export function IconCheck({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12 L9 17 L20 6" />
    </svg>
  );
}

/** Ikon Plus / Tambah */
export function IconPlus({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5 V19" />
      <path d="M5 12 H19" />
    </svg>
  );
}

/** Ikon Bintang (Star) — Mendukung filled dan outlined */
export function IconStar({
  className = "w-5 h-5",
  size,
  filled = true,
  strokeWidth = 2,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** Ikon Hati / Cinta (Heart) */
export function IconHeart({
  className = "w-5 h-5",
  size,
  filled = true,
  strokeWidth = 2,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61 A5.5 5.5 0 0 0 13 4.61 L12 5.67 L11 4.61 A5.5 5.5 0 0 0 3.16 12.39 L12 21.23 L20.84 12.39 A5.5 5.5 0 0 0 20.84 4.61 Z" />
    </svg>
  );
}

/** Ikon Peringatan / Bahaya (Alert / Warning) */
export function IconAlert({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.29 3.86 L1.82 18 A2 2 0 0 0 3.55 21 H20.45 A2 2 0 0 0 22.18 18 L13.71 3.86 A2 2 0 0 0 10.29 3.86 Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/** Ikon Papan Catatan / Formulir Pesanan (Clipboard) */
export function IconClipboard({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 4 H18 A2 2 0 0 1 20 6 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 V6 A2 2 0 0 1 6 4 H8" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M8 12 H16" />
      <path d="M8 16 H13" />
    </svg>
  );
}

/** Ikon Berjabat Tangan / Keramahan (Handshake) */
export function IconHandshake({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 15 L8 12 L2 18 L7 23 L13 17" />
      <path d="M13 15 L16 12 L22 18 L17 23 L11 17" />
      <path d="M8 12 L12 8 L16 12" />
      <path d="M12 2 L8 6 L12 10 L16 6 Z" />
    </svg>
  );
}

/** Ikon Beranda / Rumah (Home) */
export function IconHome({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9 L12 2 L21 9 V20 A2 2 0 0 1 19 22 H5 A2 2 0 0 1 3 20 Z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/** Ikon Muat Ulang / Coba Lagi (Reload / Refresh) */
export function IconReload({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M23 4 V10 H17" />
      <path d="M1 20 V14 H7" />
      <path d="M3.51 9 A9 9 0 0 1 20.49 15" />
      <path d="M20.49 15 A9 9 0 0 1 3.51 9" />
    </svg>
  );
}

/** Ikon Terompet Pesta / Perayaan (Party Popper) */
export function IconParty({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 22 L7.5 13.5 L10.5 16.5 L2 22 Z" />
      <path d="M6 15 C10 17, 13 14, 15 12 C17 10, 20 13, 22 9" />
      <circle cx="17" cy="4" r="1" fill="currentColor" />
      <circle cx="21" cy="6" r="1" fill="currentColor" />
      <circle cx="14" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

/** Ikon Tunjuk Kanan (Pointer / Arrow Right) */
export function IconArrowRight({
  className = "w-4 h-4",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/** Ikon Panah Kiri (Back / Arrow Left) */
export function IconArrowLeft({
  className = "w-4 h-4",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

// ─── 5. ADMIN & PENGELOLAAN ───

/** Ikon Gembok (Lock / Keamanan) */
export function IconLock({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="11" rx="2" />
      <path d="M7 11 V7 A5 5 0 0 1 17 7 V11" />
    </svg>
  );
}

/** Ikon Label Kategori (Tag) */
export function IconTag({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.59 13.41 L13.42 20.58 A2 2 0 0 1 12 21.17 A2 2 0 0 1 10.59 20.58 L2 12 V2 H12 L20.59 10.59 A2 2 0 0 1 20.59 13.41 Z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Ikon Megafon (Banner Pengumuman / Promo) */
export function IconMegaphone({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11 V9 A2 2 0 0 1 5 7 H7 L16 3 V17 L7 13 H5 A2 2 0 0 1 3 11 Z" />
      <path d="M8 13 V18 A2 2 0 0 0 10 20 H11" />
      <path d="M19 8 C20.5 9, 21 10.5, 21 12 C21 13.5, 20.5 15, 19 16" />
    </svg>
  );
}

/** Ikon Roda Gigi (Settings / Pengaturan) */
export function IconSettings({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15 A1.65 1.65 0 0 0 19.73 16.82 L20.08 17.17 A2 2 0 0 1 17.25 20 L16.9 19.65 A1.65 1.65 0 0 0 15.08 19.32 A1.65 1.65 0 0 0 14 20.87 V21.37 A2 2 0 0 1 10 21.37 V20.87 A1.65 1.65 0 0 0 8.92 19.32 A1.65 1.65 0 0 0 7.1 19.65 L6.75 20 A2 2 0 0 1 3.92 17.17 L4.27 16.82 A1.65 1.65 0 0 0 4.6 15 A1.65 1.65 0 0 0 3.05 13.92 H2.55 A2 2 0 0 1 2.55 9.92 H3.05 A1.65 1.65 0 0 0 4.6 8.84 A1.65 1.65 0 0 0 4.27 7.02 L3.92 6.67 A2 2 0 0 1 6.75 3.84 L7.1 4.19 A1.65 1.65 0 0 0 8.92 4.52 A1.65 1.65 0 0 0 10 2.97 V2.47 A2 2 0 0 1 14 2.47 V2.97 A1.65 1.65 0 0 0 15.08 4.52 A1.65 1.65 0 0 0 16.9 4.19 L17.25 3.84 A2 2 0 0 1 20.08 6.67 L19.73 7.02 A1.65 1.65 0 0 0 19.4 8.84 A1.65 1.65 0 0 0 20.95 9.92 H21.45 A2 2 0 0 1 21.45 13.92 H20.95 A1.65 1.65 0 0 0 19.4 15 Z" />
    </svg>
  );
}

/** Ikon Grafik / Analitik (Chart) */
export function IconChart({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  );
}

/** Ikon Tanda Tanya (FAQ / Pertanyaan) */
export function IconQuestion({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.09 9 A3 3 0 0 1 12 6 A3 3 0 0 1 15 9 C15 11, 12 12, 12 14" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/** Ikon Mata (Preview / Views) */
export function IconEye({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M1 12 C1 12, 5 4, 12 4 C19 4, 23 12, 23 12 C23 12, 19 20, 12 20 C5 20, 1 12, 1 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Ikon Disket Simpan (Save) */
export function IconSave({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 H16 L21 8 V19 A2 2 0 0 1 19 21 Z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

/** Ikon Globe / Website */
export function IconGlobe({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3 C14.5 6.5, 16 9.5, 16 12 C16 14.5, 14.5 17.5, 12 21 C9.5 17.5, 8 14.5, 8 12 C8 9.5, 9.5 6.5, 12 3 Z" />
    </svg>
  );
}

/** Ikon Keluar / Logout */
export function IconLogout({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 H9" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/** Ikon Penggaris Ukuran / Varian (Ruler) */
export function IconRuler({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21.3 8.7 L15.3 2.7 C14.9 2.3, 14.3 2.3, 13.9 2.7 L2.7 13.9 C2.3 14.3, 2.3 14.9, 2.7 15.3 L8.7 21.3 C9.1 21.7, 9.7 21.7, 10.1 21.3 L21.3 10.1 C21.7 9.7, 21.7 9.1, 21.3 8.7 Z" />
      <line x1="14.5" y1="5.5" x2="12" y2="8" />
      <line x1="11.5" y1="8.5" x2="10" y2="10" />
      <line x1="8.5" y1="11.5" x2="6" y2="14" />
    </svg>
  );
}

/** Ikon Pensil / Tulis (Edit) */
export function IconEdit({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20 H21" />
      <path d="M16.5 3.5 A2.12 2.12 0 0 1 19.5 6.5 L7 19 L3 20 L4 16 L16.5 3.5 Z" />
    </svg>
  );
}

/** Ikon Kamera (Foto) */
export function IconCamera({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M23 19 A2 2 0 0 1 21 21 H3 A2 2 0 0 1 1 19 V8 A2 2 0 0 1 3 6 H7 L9 3 H15 L17 6 H21 A2 2 0 0 1 23 8 Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/** Ikon Folder / Dokumen */
export function IconFolder({
  className = "w-5 h-5",
  size,
  strokeWidth = 2.5,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20 H20 A2 2 0 0 0 22 18 V8 A2 2 0 0 0 20 6 H12 L10 4 H4 A2 2 0 0 0 2 6 V18 A2 2 0 0 0 4 20 Z" />
    </svg>
  );
}
