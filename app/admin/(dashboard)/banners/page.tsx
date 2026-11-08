import { asc } from "drizzle-orm";
import { db } from "@/db";
import { banners, categories } from "@/db/schema";
import { BannerManager, type BannerItem } from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Banner Promo | Admin Niken Bakery",
};

export default function AdminBannersPage() {
  const allBanners = db
    .select()
    .from(banners)
    .orderBy(asc(banners.sortOrder))
    .all();

  const allCategories = db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder))
    .all();

  return (
    <div className="space-y-6">
      <BannerManager
        initialBanners={allBanners as BannerItem[]}
        categories={allCategories}
      />
    </div>
  );
}
