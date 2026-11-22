import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
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
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

  const [allProducts, statsRows, topViewsRaw, topWaRaw, settings, openingHours] =
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
          total7d: sql<number>`COALESCE(SUM(CASE WHEN ${events.createdAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END), 0)`,
          total30d: sql<number>`COALESCE(SUM(CASE WHEN ${events.createdAt} >= ${thirtyDaysAgo} THEN 1 ELSE 0 END), 0)`,
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
        .where(and(eq(events.type, "product_view"), sql`${events.createdAt} >= ${thirtyDaysAgo}`))
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
        .where(and(eq(events.type, "wa_click"), sql`${events.createdAt} >= ${thirtyDaysAgo}`))
        .groupBy(events.productId, products.name, products.slug)
        .orderBy(desc(count(events.id)))
        .limit(5),
      getSettings(),
      getOpeningHours(),
    ]);

  let waClicks7d = 0;
  let waClicks30d = 0;
  let productViews7d = 0;
  let productViews30d = 0;
  for (const row of statsRows) {
    if (row.type === "wa_click") {
      waClicks7d = Number(row.total7d);
      waClicks30d = Number(row.total30d);
    } else {
      productViews7d = Number(row.total7d);
      productViews30d = Number(row.total30d);
    }
  }

  const imageProductIds = [
    ...topViewsRaw.map((row) => row.productId),
    ...topWaRaw.map((row) => row.productId),
  ].filter((id): id is number => id !== null);
  const covers = imageProductIds.length
    ? await db
        .select({
          productId: productImages.productId,
          thumb: productImages.thumbName,
          file: productImages.fileName,
          isCover: productImages.isCover,
          sortOrder: productImages.sortOrder,
        })
        .from(productImages)
        .where(inArray(productImages.productId, imageProductIds))
        .orderBy(desc(productImages.isCover), productImages.sortOrder)
    : [];
  const coverByProduct = new Map<number, string>();
  for (const cover of covers) {
    if (!coverByProduct.has(cover.productId)) {
      coverByProduct.set(cover.productId, cover.thumb || cover.file);
    }
  }

  const mapTopProducts = (rows: typeof topViewsRaw | typeof topWaRaw) =>
    rows.flatMap((item) =>
      item.productId === null
        ? []
        : [
            {
              id: item.productId,
              name: item.productName,
              slug: item.productSlug,
              count: Number(
                "totalViews" in item ? item.totalViews : item.totalClicks
              ),
              coverUrl: coverByProduct.get(item.productId) ?? null,
            },
          ]
    );

  const timezone = settings.timezone || "Asia/Jakarta";
  const recentEventDays = db
    .select({
      type: events.type,
      eventId: events.id,
      dateString: sql<string>`to_char(${events.createdAt} AT TIME ZONE ${timezone}, 'YYYY-MM-DD')`.as("date_string"),
    })
    .from(events)
    .where(sql`${events.createdAt} >= ${fourteenDaysAgo}`)
    .as("recent_event_days");
  const recentEvents = await db
    .select({
      type: recentEventDays.type,
      dateString: recentEventDays.dateString,
      count: count(recentEventDays.eventId),
    })
    .from(recentEventDays)
    .groupBy(recentEventDays.type, recentEventDays.dateString);

  const chart14Days: AnalyticsSummary["chart14Days"] = [];
  const currentDate = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateKey = `${yyyy}-${mm}-${dd}`;
    chart14Days.push({
      dateLabel: `${dd}/${mm}`,
      rawDate: dateKey,
      views: Number(
        recentEvents.find((event) => event.type === "product_view" && event.dateString === dateKey)?.count ?? 0
      ),
      waClicks: Number(
        recentEvents.find((event) => event.type === "wa_click" && event.dateString === dateKey)?.count ?? 0
      ),
    });
  }

  const [imageRows, activeBannerRows] = await Promise.all([
    db.select({ id: productImages.id }).from(productImages).limit(1),
    db
      .select({ id: banners.id })
      .from(banners)
      .where(
        and(
          eq(banners.isActive, true),
          sql`(${banners.startsAt} IS NULL OR ${banners.startsAt} <= ${now})`,
          sql`(${banners.endsAt} IS NULL OR ${banners.endsAt} >= ${now})`
        )
      )
      .limit(1),
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
  const hasOpeningHours =
    openingHours.length === 7 &&
    openingHours.some((hour) => !hour.closed && hour.open && hour.close);
  const hasProductWithImage = imageRows.length > 0;
  const hasActiveBanner = activeBannerRows.length > 0;

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
      isComplete: hasProductWithImage,
      hint: hasProductWithImage
        ? "Sudah ada produk yang memiliki foto asli."
        : "Belum ada produk berfoto. Unggah minimal 1 foto kue.",
      actionUrl: "/admin/products",
      actionLabel: "Kelola Produk",
    },
    {
      id: "banner",
      label: "Banner Pengumuman / Promo",
      isComplete: hasActiveBanner,
      hint: hasActiveBanner
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
    stats: {
      activeProducts: allProducts.filter((product) => product.isPublished).length,
      soldOutProducts: allProducts.filter((product) => product.status === "soldout").length,
      waClicks7d,
      waClicks30d,
      productViews7d,
      productViews30d,
    },
    topViewedProducts: mapTopProducts(topViewsRaw),
    topWaClickProducts: mapTopProducts(topWaRaw),
    chart14Days,
    checklist,
  };
}
