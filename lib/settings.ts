import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

const DEFAULTS: Record<string, string> = {
  business_name: "Niken Bakery",
  tagline: "Kue lezat untuk setiap momen spesialmu",
  timezone: "Asia/Jakarta",
  whatsapp_number: "6281234567890",
  wa_default_message: "Halo Niken Bakery! Aku mau tanya-tanya soal kue 🙌",
  email: "contoh@nikenbakery.id",
  address: "Alamat CONTOH, Jl. Contoh No. 1, Kota Contoh",
  maps_url: "https://maps.google.com",
  maps_embed_url: "",
  opening_hours: JSON.stringify([
    { day: "Senin", open: "08:00", close: "20:00", closed: false },
    { day: "Selasa", open: "08:00", close: "20:00", closed: false },
    { day: "Rabu", open: "08:00", close: "20:00", closed: false },
    { day: "Kamis", open: "08:00", close: "20:00", closed: false },
    { day: "Jumat", open: "08:00", close: "20:00", closed: false },
    { day: "Sabtu", open: "09:00", close: "21:00", closed: false },
    { day: "Minggu", open: "09:00", close: "21:00", closed: false },
  ]),
  instagram_url: "https://instagram.com/nikenbakery_contoh",
  tiktok_url: "https://tiktok.com/@nikenbakery_contoh",
  about_story:
    "Niken Bakery lahir dari dapur kecil di rumah Niken pada tahun 2020. Berawal dari hobi, kini kami melayani ratusan pelanggan setiap bulan dengan kue-kue yang dibuat dari bahan pilihan.",
  about_values: JSON.stringify([
    "Bahan berkualitas premium tanpa pengawet",
    "Dibuat fresh setiap hari dengan cinta",
    "Harga ramah untuk semua kalangan",
  ]),
  about_image: "",
  delivery_info:
    "Kami melayani pengiriman di area Kota Contoh dan sekitarnya. Ongkir dihitung berdasarkan jarak.",
  order_policy:
    "DP 50% saat pemesanan, pelunasan saat pengambilan/pengiriman. Pembatalan maksimal H-2.",
  halal_info: "Semua produk Niken Bakery menggunakan bahan halal.",
  custom_order_enabled: "false",
  custom_order_min_days: "3",
};

export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type SiteSettingsMap = typeof DEFAULTS;

export async function getSettings(): Promise<SiteSettingsMap> {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function getSetting(key: string): Promise<string> {
  const [row] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  const raw = (await getSettings()).opening_hours;
  try {
    return JSON.parse(raw) as OpeningHour[];
  } catch {
    return [];
  }
}

export async function getAboutValues(): Promise<string[]> {
  const raw = (await getSettings()).about_values;
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
