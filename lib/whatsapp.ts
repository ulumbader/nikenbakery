/**
 * Normalisasi nomor HP ke format internasional WhatsApp tanpa tanda '+'.
 * Contoh: '08123456789' -> '628123456789', '+62812...' -> '62812...'
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+62")) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("+")) {
    return cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Buat link wa.me dengan nomor dan pesan yang di-encode URI.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const normalized = normalizePhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Pesan umum untuk tombol WhatsApp di Navbar, Footer, atau Floating Button.
 */
export function generalMessage(customMessage?: string): string {
  return (
    customMessage?.trim() ||
    "Halo Niken Bakery! Aku mau tanya-tanya soal kue 🙌"
  );
}

/**
 * Template pesan pesanan produk.
 */
export function orderMessage({
  productName,
  variantLabel,
}: {
  productName: string;
  variantLabel?: string;
}): string {
  const itemLine = variantLabel
    ? `• ${productName} (${variantLabel})`
    : `• ${productName}`;

  return `Halo Niken Bakery! 👋
Aku mau pesan:
${itemLine}
Jumlah: 1
Tanggal ambil/kirim: (isi di sini)
Nama: (isi di sini)`;
}

/**
 * Template pesan tanya ketersediaan untuk produk habis.
 */
export function inquiryMessage({
  productName,
}: {
  productName: string;
}): string {
  return `Halo Niken Bakery! 👋
Aku mau tanya ketersediaan atau jadwal restock untuk:
• ${productName}
Terima kasih!`;
}
