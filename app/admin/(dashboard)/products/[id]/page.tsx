import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { products, productVariants, productImages, categories } from "@/db/schema";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId || isNaN(productId)) {
    return { title: "Edit Produk | Admin Niken Bakery" };
  }

  const product = db
    .select({ name: products.name })
    .from(products)
    .where(eq(products.id, productId))
    .get();

  return {
    title: product ? `Edit ${product.name} | Admin Niken Bakery` : "Edit Produk | Admin Niken Bakery",
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!productId || isNaN(productId)) {
    notFound();
  }

  const product = db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .get();

  if (!product) {
    notFound();
  }

  const variants = db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder))
    .all();

  const images = db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.sortOrder))
    .all();

  const categoryList = db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();

  const initialProduct: ProductFormData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    basePrice: product.basePrice,
    status: product.status as "ready" | "preorder" | "soldout",
    preorderNote: product.preorderNote,
    description: product.description,
    ingredients: product.ingredients,
    allergens: product.allergens,
    isFeatured: Boolean(product.isFeatured),
    isPublished: Boolean(product.isPublished),
    variants: variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: v.price,
      sortOrder: v.sortOrder,
    })),
    images: images.map((img) => ({
      id: img.id,
      fileName: img.fileName,
      thumbName: img.thumbName,
      alt: img.alt,
      isCover: Boolean(img.isCover),
      sortOrder: img.sortOrder,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="border-b-3 border-ink pb-4">
        <h1 className="font-heading text-2xl font-black uppercase text-ink md:text-3xl">
          Edit Produk: {product.name}
        </h1>
        <p className="mt-1 font-body text-sm text-ink/70">
          Ubah detail produk, atur varian harga, kelola foto, atau perbarui ketersediaan.
        </p>
      </div>

      <ProductForm initialProduct={initialProduct} categories={categoryList} />
    </div>
  );
}
