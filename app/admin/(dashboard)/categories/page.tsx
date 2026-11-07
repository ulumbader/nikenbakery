import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, eq, count } from "drizzle-orm";
import { SectionHeading } from "@/components/ui";
import { CategoryManager, type CategoryWithCount } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Kategori",
};

export default function AdminCategoriesPage() {
  const allCategories = db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();

  const categoriesWithCount: CategoryWithCount[] = allCategories.map((cat) => {
    const productCount =
      db
        .select({ count: count() })
        .from(products)
        .where(eq(products.categoryId, cat.id))
        .get()?.count ?? 0;

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      sortOrder: cat.sortOrder,
      productCount,
    };
  });

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
