import { formatRupiah } from "@/lib/format";

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
 * Bill ringkas untuk pesanan satu produk yang dikirim dari halaman checkout.
 */
export function checkoutOrderMessage({
  productName,
  variantLabel,
  quantity,
  unitPrice,
  buyerName,
  buyerPhone,
  fulfillment,
  pickupDate,
  deliveryAddress,
  note,
}: {
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  buyerName: string;
  buyerPhone: string;
  fulfillment: "pickup" | "delivery";
  pickupDate: string;
  deliveryAddress?: string;
  note?: string;
}): string {
  const cleanLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
  const subtotal = unitPrice * quantity;
  const date = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${pickupDate}T00:00:00Z`));
  const itemDescription = variantLabel
    ? `${productName} — ${variantLabel}`
    : productName;
  const lines = [
    "Halo Niken Bakery!",
    "Saya ingin memesan:",
    `1. ${cleanLine(itemDescription)}`,
    `   ${quantity} pcs × ${formatRupiah(unitPrice)} = ${formatRupiah(subtotal)}`,
    "",
    `Nama pemesan: ${cleanLine(buyerName)}`,
    `No. WhatsApp: ${cleanLine(buyerPhone)}`,
    `Metode: ${fulfillment === "pickup" ? "Ambil di toko" : "Pengiriman"}`,
    `Tanggal ambil/kirim: ${date}`,
  ];

  if (fulfillment === "delivery" && deliveryAddress) {
    lines.push(`Alamat pengiriman: ${cleanLine(deliveryAddress)}`);
  }
  if (note?.trim()) lines.push(`Catatan: ${cleanLine(note)}`);

  lines.push(
    "",
    `Subtotal produk: ${formatRupiah(subtotal)}`,
    `Ongkir: ${fulfillment === "delivery" ? "Dikonfirmasi via WhatsApp" : formatRupiah(0)}`,
    `TOTAL SEMENTARA: ${formatRupiah(subtotal)}`,
    "(Ongkir pengiriman belum termasuk total sementara.)",
    "",
    "Mohon konfirmasi pesanan dan ketersediaannya. Terima kasih!"
  );

  return lines.join("\n");
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
