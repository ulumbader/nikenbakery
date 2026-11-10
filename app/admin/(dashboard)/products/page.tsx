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
  const [allCategories, allProducts] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name, color: categories.color })
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name)),
    db
      .select()
      .from(products)
      .orderBy(asc(products.sortOrder), desc(products.createdAt)),
  ]);

  const productIds = allProducts.map((product) => product.id);
  const [allVariants, allImages] =
    productIds.length > 0
      ? await Promise.all([
        db
          .select()
          .from(productVariants)
          .where(inArray(productVariants.productId, productIds))
          .orderBy(asc(productVariants.productId), asc(productVariants.price)),
        db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(
            asc(productImages.productId),
            desc(productImages.isCover),
            asc(productImages.sortOrder)
          ),
        ])
      : [[], []];
  const categoriesById = new Map(allCategories.map((category) => [category.id, category]));
  const variantsByProductId = new Map<number, typeof allVariants>();
  const imagesByProductId = new Map<number, (typeof allImages)[number]>();

  for (const variant of allVariants) {
    const productVariantsList = variantsByProductId.get(variant.productId) ?? [];
    productVariantsList.push(variant);
    variantsByProductId.set(variant.productId, productVariantsList);
  }
  for (const image of allImages) {
    if (!imagesByProductId.has(image.productId)) {
      imagesByProductId.set(image.productId, image);
    }
  }

  const productRows: AdminProductRow[] = allProducts.map((product) => {
    const variants = variantsByProductId.get(product.id) ?? [];
    const cover = imagesByProductId.get(product.id);
    const category = product.categoryId ? categoriesById.get(product.categoryId) : undefined;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: product.basePrice,
      displayPrice: variants[0]?.price ?? product.basePrice,
      hasVariants: variants.length > 0,
      status: product.status,
      preorderNote: product.preorderNote,
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      categoryId: product.categoryId,
      categoryName: category?.name,
      categoryColor: category?.color,
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
