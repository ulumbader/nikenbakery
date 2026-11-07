import { db } from "@/db";
import { products, categories, productImages, productVariants } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { SectionHeading } from "@/components/ui";
import { ProductListTable, type AdminProductRow } from "@/components/admin/ProductListTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Produk",
};

export default function AdminProductsPage() {
  const allCategories = db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();

  const allProducts = db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), desc(products.createdAt))
    .all();

  const productRows: AdminProductRow[] = allProducts.map((p) => {
    const variants = db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, p.id))
      .orderBy(asc(productVariants.price))
      .all();

    const cover = db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, p.id))
      .orderBy(desc(productImages.isCover), asc(productImages.sortOrder))
      .get();

    const cat = p.categoryId
      ? db.select().from(categories).where(eq(categories.id, p.categoryId)).get()
      : null;

    const displayPrice = variants.length > 0 ? variants[0].price : p.basePrice;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      displayPrice,
      hasVariants: variants.length > 0,
      status: p.status,
      preorderNote: p.preorderNote,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      categoryId: p.categoryId,
      categoryName: cat?.name,
      categoryColor: cat?.color,
      coverImage: cover?.thumbName || cover?.fileName || null,
    };
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <SectionHeading
        title="Daftar Produk"
        description="Kelola seluruh katalog kue, variasi ukuran dan harga, upload foto, serta ubah status stok secara instan."
      />
      <ProductListTable
        initialProducts={productRows}
        categories={allCategories}
      />
    </div>
  );
}
