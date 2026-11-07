import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Ambil semua produk yang dipublikasikan dari database
  const publishedProducts = db
    .select({
      slug: products.slug,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.isPublished, true))
    .all();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/social`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = publishedProducts.map((p) => {
    let lastMod = new Date();
    if (p.updatedAt) {
      lastMod =
        typeof p.updatedAt === "number"
          ? new Date(p.updatedAt * 1000)
          : new Date(p.updatedAt);
    }

    return {
      url: `${siteUrl}/menu/${p.slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...productRoutes];
}
