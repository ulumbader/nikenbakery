import { db } from "@/db";
import { products, categories, productImages, productVariants } from "@/db/schema";
import { asc, desc, inArray } from "drizzle-orm";
import { SectionHeading } from "@/components/ui";
import { ProductListTable, type AdminProductRow } from "@/components/admin/ProductListTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Produk",
};

export default async function AdminProductsPage() {
  const [allCategories, allProducts] = await Promise.all([db
    .select({ id: categories.id, name: categories.name, color: categories.color })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name)), db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), desc(products.createdAt))]);

  const productIds = allProducts.map((product) => product.id);
  const [allVariants, allImages] = productIds.length
    ? await Promise.all([
        db.select().from(productVariants)
          .where(inArray(productVariants.productId, productIds))
          .orderBy(asc(productVariants.price)),
        db.select().from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(desc(productImages.isCover), asc(productImages.sortOrder)),
      ])
    : [[], []];

  const variantsByProduct = new Map<number, typeof allVariants>();
  for (const variant of allVariants) {
    const variants = variantsByProduct.get(variant.productId) ?? [];
    variants.push(variant);
    variantsByProduct.set(variant.productId, variants);
  }

  const imageByProduct = new Map<number, (typeof allImages)[number]>();
  for (const image of allImages) {
    if (!imageByProduct.has(image.productId)) imageByProduct.set(image.productId, image);
  }

  const categoryById = new Map(allCategories.map((category) => [category.id, category]));
  const productRows: AdminProductRow[] = allProducts.map((p) => {
    const variants = variantsByProduct.get(p.id) ?? [];
    const cover = imageByProduct.get(p.id);
    const cat = p.categoryId ? categoryById.get(p.categoryId) : null;

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
