import { cookies, headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";

const BOT_USER_AGENTS =
  /bot|crawler|spider|crawling|slurp|bingbot|googlebot|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|semrush|ahrefs/i;

/**
 * Deteksi apakah User-Agent adalah crawler atau bot sederhana.
 */
export function isBotUserAgent(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENTS.test(userAgent);
}

/**
 * Catat event product_view secara server-side saat detail produk dibuka.
 * Mengabaikan bot dan melakukan dedupe harian per produk dengan cookie anonim.
 */
export async function recordProductViewServer(productId: number): Promise<{
  recorded: boolean;
  cookieHeaderValue?: string;
}> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    if (isBotUserAgent(userAgent)) {
      return { recorded: false };
    }

    const cookieStore = await cookies();
    const cookieName = "nb_pv";
    const existingCookie = cookieStore.get(cookieName)?.value || "";

    // Format cookie: "ID_TANGGAL,ID_TANGGAL" misal "1_20261107,3_20261107"
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const token = `${productId}_${today}`;

    const viewedList = existingCookie ? existingCookie.split(",") : [];

    // Jika sudah pernah melihat produk ini pada hari yang sama, abaikan (dedupe)
    if (viewedList.includes(token)) {
      return { recorded: false };
    }

    // Catat ke DB
    db.insert(events)
      .values({
        type: "product_view",
        productId,
        createdAt: sql`(unixepoch())`,
      })
      .run();

    // Siapkan daftar baru untuk cookie (batasi maks 50 entri agar cookie tidak terlalu besar)
    const updatedList = [...viewedList.filter((item) => item.endsWith(today)), token].slice(-50);
    const newCookieValue = updatedList.join(",");

    return {
      recorded: true,
      cookieHeaderValue: newCookieValue,
    };
  } catch (err) {
    // Analytics error tidak boleh memblokir render halaman detail produk
    console.error("Gagal mencatat product_view:", err);
    return { recorded: false };
  }
}

