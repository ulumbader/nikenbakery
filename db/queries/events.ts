import {
  and,
  count,
  desc,
  eq,
  gte,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import { first } from "@/db/first";
import { banners, events, productImages, products } from "@/db/schema";
import { getOpeningHours, getSettings } from "@/lib/settings";

export interface AnalyticsSummary {
  stats: {
    activeProducts: number;
    soldOutProducts: number;
    waClicks7d: number;
    waClicks30d: number;
    productViews7d: number;
    productViews30d: number;
  };
  topViewedProducts: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
    coverUrl?: string | null;
  }>;
  topWaClickProducts: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
    coverUrl?: string | null;
  }>;
  chart14Days: Array<{
    dateLabel: string;
    rawDate: string;
    views: number;
    waClicks: number;
  }>;
  checklist: Array<{
    id: string;
    label: string;
    isComplete: boolean;
    hint: string;
    actionUrl: string;
    actionLabel: string;
  }>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400_000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400_000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400_000);

  const [allProducts, statsRows, topViewsRaw, topWaRaw, recentEvents] =
    await Promise.all([
      db
        .select({
          id: products.id,
          isPublished: products.isPublished,
          status: products.status,
        })
        .from(products),
      db
        .select({
          type: events.type,
          total7d: sql<number>`SUM(CASE WHEN ${events.createdAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END)`,
          total30d: sql<number>`SUM(CASE WHEN ${events.createdAt} >= ${thirtyDaysAgo} THEN 1 ELSE 0 END)`,
        })
        .from(events)
        .groupBy(events.type),
      db
        .select({
          productId: events.productId,
          totalViews: count(events.id),
          productName: products.name,
          productSlug: products.slug,
        })
        .from(events)
        .innerJoin(products, eq(events.productId, products.id))
        .where(and(eq(events.type, "product_view"), gte(events.createdAt, thirtyDaysAgo)))
        .groupBy(events.productId, products.name, products.slug)
        .orderBy(desc(count(events.id)))
        .limit(5),
      db
        .select({
          productId: events.productId,
          totalClicks: count(events.id),
          productName: products.name,
          productSlug: products.slug,
        })
        .from(events)
        .innerJoin(products, eq(events.productId, products.id))
        .where(and(eq(events.type, "wa_click"), gte(events.createdAt, thirtyDaysAgo)))
        .groupBy(events.productId, products.name, products.slug)
        .orderBy(desc(count(events.id)))
        .limit(5),
      db
        .select({
          type: events.type,
          dateString: sql<string>`to_char(${events.createdAt} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`,
          total: count(events.id),
        })
        .from(events)
        .where(gte(events.createdAt, fourteenDaysAgo))
        .groupBy(
          events.type,
          sql`to_char(${events.createdAt} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`
        ),
    ]);

  const stats = {
    activeProducts: allProducts.filter((product) => product.isPublished).length,
    soldOutProducts: allProducts.filter((product) => product.status === "soldout")
      .length,
    waClicks7d: 0,
    waClicks30d: 0,
    productViews7d: 0,
    productViews30d: 0,
  };

  for (const row of statsRows) {
    if (row.type === "wa_click") {
      stats.waClicks7d = Number(row.total7d || 0);
      stats.waClicks30d = Number(row.total30d || 0);
    } else {
      stats.productViews7d = Number(row.total7d || 0);
      stats.productViews30d = Number(row.total30d || 0);
    }
  }

  async function withCover(
    item: (typeof topViewsRaw)[number],
    total: number
  ) {
    const cover = await first(
      db
        .select({ thumb: productImages.thumbName, file: productImages.fileName })
        .from(productImages)
        .where(eq(productImages.productId, item.productId!))
        .orderBy(desc(productImages.isCover), productImages.sortOrder)
        .limit(1)
    );
    return {
      id: item.productId!,
      name: item.productName,
      slug: item.productSlug,
      count: total,
      coverUrl: cover?.thumb || cover?.file || null,
    };
  }

  const [topViewedProducts, topWaClickProducts, settings, openingHours] =
    await Promise.all([
      Promise.all(
        topViewsRaw.map((item) => withCover(item, Number(item.totalViews)))
      ),
      Promise.all(
        topWaRaw.map(async (item) => {
          const cover = await first(
            db
              .select({ thumb: productImages.thumbName, file: productImages.fileName })
              .from(productImages)
              .where(eq(productImages.productId, item.productId!))
              .orderBy(desc(productImages.isCover), productImages.sortOrder)
              .limit(1)
          );
          return {
            id: item.productId!,
            name: item.productName,
            slug: item.productSlug,
            count: Number(item.totalClicks),
            coverUrl: cover?.thumb || cover?.file || null,
          };
        })
      ),
      getSettings(),
      getOpeningHours(),
    ]);

  const chart14Days: AnalyticsSummary["chart14Days"] = [];
  for (let daysAgo = 13; daysAgo >= 0; daysAgo -= 1) {
    const date = new Date(now.getTime() - daysAgo * 86400_000);
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const datePart = (type: "year" | "month" | "day") =>
      dateParts.find((part) => part.type === type)?.value ?? "00";
    const year = datePart("year");
    const month = datePart("month");
    const day = datePart("day");
    const rawDate = `${year}-${month}-${day}`;
    const dateLabel = `${day}/${month}`;
    const views = recentEvents.find(
      (event) => event.type === "product_view" && event.dateString === rawDate
    );
    const clicks = recentEvents.find(
      (event) => event.type === "wa_click" && event.dateString === rawDate
    );

    chart14Days.push({
      dateLabel,
      rawDate: `${year}-${month}-${day}`,
      views: Number(views?.total || 0),
      waClicks: Number(clicks?.total || 0),
    });
  }

  const [imageRow, activeBanner] = await Promise.all([
    first(db.select({ id: productImages.id }).from(productImages).limit(1)),
    first(
      db
        .select({ id: banners.id })
        .from(banners)
        .where(
          and(
            eq(banners.isActive, true),
            or(isNull(banners.startsAt), lte(banners.startsAt, now)),
            or(isNull(banners.endsAt), gte(banners.endsAt, now))
          )
        )
        .limit(1)
    ),
  ]);

  const hasWaNumber = Boolean(
    settings.whatsapp_number &&
      settings.whatsapp_number !== "6281234567890" &&
      settings.whatsapp_number.length >= 10
  );
  const hasAddress = Boolean(
    settings.address &&
      !settings.address.toLowerCase().includes("contoh") &&
      settings.address.trim().length > 5
  );
  const hasOpeningHours = Boolean(
    openingHours.length === 7 &&
      openingHours.some((hour) => !hour.closed && hour.open && hour.close)
  );

  const checklist: AnalyticsSummary["checklist"] = [
    {
      id: "whatsapp",
      label: "Nomor WhatsApp Toko",
      isComplete: hasWaNumber,
      hint: hasWaNumber
        ? `Nomor tersimpan: ${settings.whatsapp_number}`
        : "Masih memakai nomor contoh. Ganti dengan nomor WhatsApp aktif UMKM.",
      actionUrl: "/admin/settings",
      actionLabel: "Ubah Nomor WA",
    },
    {
      id: "address",
      label: "Alamat Toko & Peta",
      isComplete: hasAddress,
      hint: hasAddress
        ? "Alamat toko sudah diisi."
        : "Masih memakai alamat contoh. Masukkan alamat asli dan link Google Maps.",
      actionUrl: "/admin/settings",
      actionLabel: "Ubah Alamat",
    },
    {
      id: "product_photo",
      label: "Foto Katalog Produk",
      isComplete: Boolean(imageRow),
      hint: imageRow
        ? "Sudah ada produk yang memiliki foto asli."
        : "Belum ada produk berfoto. Unggah minimal 1 foto kue.",
      actionUrl: "/admin/products",
      actionLabel: "Kelola Produk",
    },
    {
      id: "banner",
      label: "Banner Pengumuman / Promo",
      isComplete: Boolean(activeBanner),
      hint: activeBanner
        ? "Ada banner aktif yang sedang tayang di beranda."
        : "Tidak ada banner aktif. Buat promo atau pengumuman sambutan.",
      actionUrl: "/admin/banners",
      actionLabel: "Atur Banner",
    },
    {
      id: "opening_hours",
      label: "Jadwal Jam Operasional",
      isComplete: hasOpeningHours,
      hint: hasOpeningHours
        ? "Jam buka toko sudah diatur untuk 7 hari."
        : "Atur jam buka operasional toko untuk penanda Buka/Tutup.",
      actionUrl: "/admin/settings",
      actionLabel: "Atur Jam Buka",
    },
  ];

  return {
    stats,
    topViewedProducts,
    topWaClickProducts,
    chart14Days,
    checklist,
  };
}
