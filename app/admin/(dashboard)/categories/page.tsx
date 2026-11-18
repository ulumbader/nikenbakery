import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, count } from "drizzle-orm";
import { SectionHeading } from "@/components/ui";
import { CategoryManager, type CategoryWithCount } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Kategori",
};

export default async function AdminCategoriesPage() {
  const [allCategories, counts] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
    db.select({ categoryId: products.categoryId, count: count() })
      .from(products)
      .groupBy(products.categoryId),
  ]);
  const countsByCategory = new Map(
    counts.flatMap((row) => row.categoryId === null ? [] : [[row.categoryId, Number(row.count)] as const])
  );

  const categoriesWithCount: CategoryWithCount[] = allCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color,
    sortOrder: cat.sortOrder,
    productCount: countsByCategory.get(cat.id) ?? 0,
  }));

  return (
    <div className="space-y-8 max-w-5xl">
      <SectionHeading
        title="Manajemen Kategori"
        description="Kelola kategori kue, tentukan warna identitas token, dan atur urutan tampilan di menu publik."
      />
      <CategoryManager categories={categoriesWithCount} />
    </div>
  );
}
