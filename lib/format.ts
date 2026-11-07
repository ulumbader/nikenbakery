/**
 * Format angka ke Rupiah. Contoh: 45000 → "Rp45.000"
 */
export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/\s/g, ""); // Hapus spasi antara "Rp" dan angka
}

/**
 * Format tanggal ke format Indonesia. Contoh: "7 November 2026"
 */
export function formatDate(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
