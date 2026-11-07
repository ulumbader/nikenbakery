import { sql, eq, and, desc, count } from "drizzle-orm";
import { db } from "@/db";
import { events, products, productImages, banners } from "@/db/schema";
import { getSettings, getOpeningHours } from "@/lib/settings";

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

/**
 * Mengambil ringkasan analitik dan kelengkapan konten untuk dashboard admin.
 */
export function getAnalyticsSummary(): AnalyticsSummary {
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - 7 * 86400;
  const thirtyDaysAgo = now - 30 * 86400;

  // 1. Produk Aktif & Sold Out
  const allProducts = db
    .select({
      id: products.id,
      isPublished: products.isPublished,
      status: products.status,
    })
    .from(products)
    .all();

  const activeProducts = allProducts.filter((p) => p.isPublished).length;
  const soldOutProducts = allProducts.filter((p) => p.status === "soldout").length;

  // 2. Event Counts (7 hari & 30 hari)
  const statsRows = db
    .select({
      type: events.type,
      total7d: sql<number>`SUM(CASE WHEN ${events.createdAt} >= ${sevenDaysAgo} THEN 1 ELSE 0 END)`,
      total30d: sql<number>`SUM(CASE WHEN ${events.createdAt} >= ${thirtyDaysAgo} THEN 1 ELSE 0 END)`,
    })
    .from(events)
    .groupBy(events.type)
    .all();

  let waClicks7d = 0;
  let waClicks30d = 0;
  let productViews7d = 0;
  let productViews30d = 0;

  for (const row of statsRows) {
    if (row.type === "wa_click") {
      waClicks7d = Number(row.total7d || 0);
      waClicks30d = Number(row.total30d || 0);
    } else if (row.type === "product_view") {
      productViews7d = Number(row.total7d || 0);
      productViews30d = Number(row.total30d || 0);
    }
  }

  // 3. Top 5 Produk Berdasarkan View (30 hari terakhir)
  const topViewsRaw = db
    .select({
      productId: events.productId,
      totalViews: count(events.id),
      productName: products.name,
      productSlug: products.slug,
    })
    .from(events)
    .innerJoin(products, eq(events.productId, products.id))
    .where(
      and(
        eq(events.type, "product_view"),
        sql`${events.createdAt} >= ${thirtyDaysAgo}`
      )
    )
    .groupBy(events.productId)
    .orderBy(desc(count(events.id)))
    .limit(5)
    .all();

  const topViewedProducts = topViewsRaw.map((item) => {
    const cover = db
      .select({ thumb: productImages.thumbName, file: productImages.fileName })
      .from(productImages)
      .where(eq(productImages.productId, item.productId!))
      .orderBy(desc(productImages.isCover), productImages.sortOrder)
      .limit(1)
      .get();

    return {
      id: item.productId!,
      name: item.productName,
      slug: item.productSlug,
      count: Number(item.totalViews),
      coverUrl: cover?.thumb || cover?.file || null,
    };
  });

  // 4. Top 5 Produk Berdasarkan Klik WA (30 hari terakhir)
  const topWaRaw = db
    .select({
      productId: events.productId,
      totalClicks: count(events.id),
      productName: products.name,
      productSlug: products.slug,
    })
    .from(events)
    .innerJoin(products, eq(events.productId, products.id))
    .where(
      and(
        eq(events.type, "wa_click"),
        sql`${events.createdAt} >= ${thirtyDaysAgo}`
      )
    )
    .groupBy(events.productId)
    .orderBy(desc(count(events.id)))
    .limit(5)
    .all();

  const topWaClickProducts = topWaRaw.map((item) => {
    const cover = db
      .select({ thumb: productImages.thumbName, file: productImages.fileName })
      .from(productImages)
      .where(eq(productImages.productId, item.productId!))
      .orderBy(desc(productImages.isCover), productImages.sortOrder)
      .limit(1)
      .get();

    return {
      id: item.productId!,
      name: item.productName,
      slug: item.productSlug,
      count: Number(item.totalClicks),
      coverUrl: cover?.thumb || cover?.file || null,
    };
  });

  // 5. Grafik Batang 14 Hari (Time-series)
  const fourteenDaysAgo = now - 14 * 86400;
  const recentEvents = db
    .select({
      type: events.type,
      dateString: sql<string>`DATE(${events.createdAt}, 'unixepoch', 'localtime')`,
      count: count(events.id),
    })
    .from(events)
    .where(sql`${events.createdAt} >= ${fourteenDaysAgo}`)
    .groupBy(events.type, sql`DATE(${events.createdAt}, 'unixepoch', 'localtime')`)
    .all();

  // Susun peta tanggal 14 hari ke belakang
  const chart14Days: AnalyticsSummary["chart14Days"] = [];
  const currentDate = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dateKey = `${yyyy}-${mm}-${dd}`;
    const dateLabel = `${dd}/${mm}`;

    const viewMatch = recentEvents.find(
      (e) => e.type === "product_view" && e.dateString === dateKey
    );
    const waMatch = recentEvents.find(
      (e) => e.type === "wa_click" && e.dateString === dateKey
    );

    chart14Days.push({
      dateLabel,
      rawDate: dateKey,
      views: Number(viewMatch?.count || 0),
      waClicks: Number(waMatch?.count || 0),
    });
  }

  // 6. Checklist Kelengkapan Konten
  const settings = getSettings();
  const openingHours = getOpeningHours();

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

  const hasProductWithImage = Boolean(
    db
      .select({ id: productImages.id })
      .from(productImages)
      .limit(1)
      .get()
  );

  const hasActiveBanner = Boolean(
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
      .limit(1)
      .get()
  );

  const hasOpeningHours = Boolean(
    openingHours.length === 7 &&
      openingHours.some((h) => !h.closed && h.open && h.close)
  );

  const checklist = [
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
      activeProducts,
      soldOutProducts,
      waClicks7d,
      waClicks30d,
      productViews7d,
      productViews30d,
    },
    topViewedProducts,
    topWaClickProducts,
    chart14Days,
    checklist,
  };
}
