import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  banners,
  categories,
  faqs,
  productImages,
  products,
  productVariants,
  siteSettings,
  socialPosts,
  testimonials,
} from "@/db/schema";

export {
  getSettings,
  getSetting,
  getOpeningHours,
  getAboutValues,
} from "@/lib/settings";

export async function getAllSettings() {
  return db.select().from(siteSettings);
}

export async function listCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

type ListProductsOpts = {
  categorySlug?: string;
  q?: string;
  status?: "ready" | "preorder" | "soldout";
};

async function attachProductDetails(
  rows: (typeof products.$inferSelect)[],
  options: { imageOrder?: "cover" | "sort" } = {}
) {
  if (rows.length === 0) return [];

  const ids = rows.map((product) => product.id);
  const [variants, images, categoryRows] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, ids))
      .orderBy(asc(productVariants.price)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, ids))
      .orderBy(
        options.imageOrder === "cover"
          ? desc(productImages.isCover)
          : asc(productImages.sortOrder),
        asc(productImages.sortOrder)
      ),
    db
      .select()
      .from(categories)
      .where(
        inArray(
          categories.id,
          rows.flatMap((product) =>
            product.categoryId === null ? [] : [product.categoryId]
          )
        )
      ),
  ]);

  const variantsByProduct = new Map<number, typeof variants>();
  for (const variant of variants) {
    const items = variantsByProduct.get(variant.productId) ?? [];
    items.push(variant);
    variantsByProduct.set(variant.productId, items);
  }

  const imagesByProduct = new Map<number, typeof images>();
  for (const image of images) {
    const items = imagesByProduct.get(image.productId) ?? [];
    items.push(image);
    imagesByProduct.set(image.productId, items);
  }

  const categoryById = new Map(categoryRows.map((category) => [category.id, category]));

  return rows.map((product) => {
    const productVariants = variantsByProduct.get(product.id) ?? [];
    const productImages = imagesByProduct.get(product.id) ?? [];
    const cover = productImages.find((image) => image.isCover);
    const firstImage = options.imageOrder === "cover" ? productImages[0] : cover;

    return {
      ...product,
      displayPrice: productVariants[0]?.price ?? product.basePrice,
      hasVariants: productVariants.length > 0,
      coverImage: firstImage ?? productImages[0] ?? null,
      category:
        product.categoryId === null
          ? null
          : (categoryById.get(product.categoryId) ?? null),
    };
  });
}

export async function listProducts(opts: ListProductsOpts = {}) {
  const conditions = [eq(products.isPublished, true)];

  if (opts.status) conditions.push(eq(products.status, opts.status));

  if (opts.categorySlug) {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, opts.categorySlug))
      .limit(1);
    if (!category) return [];
    conditions.push(eq(products.categoryId, category.id));
  }

  if (opts.q) {
    const search = `%${opts.q}%`;
    conditions.push(
      or(ilike(products.name, search), ilike(products.description, search))!
    );
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.sortOrder), desc(products.createdAt));

  return attachProductDetails(rows, { imageOrder: "cover" });
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
    .limit(1);
  if (!product) return null;

  const [variants, images, category] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id))
      .orderBy(asc(productVariants.sortOrder)),
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder)),
    product.categoryId === null
      ? Promise.resolve([])
      : db
          .select()
          .from(categories)
          .where(eq(categories.id, product.categoryId))
          .limit(1),
  ]);

  return { ...product, variants, images, category: category[0] ?? null };
}

export async function listFeaturedProducts(limit = 6) {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isPublished, true), eq(products.isFeatured, true)))
    .orderBy(asc(products.sortOrder))
    .limit(limit);

  return attachProductDetails(rows, { imageOrder: "cover" });
}

export async function listRelatedProducts(productId: number, limit = 4) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return [];

  const conditions = [
    eq(products.isPublished, true),
    ne(products.id, productId),
  ];
  if (product.categoryId !== null) {
    conditions.push(eq(products.categoryId, product.categoryId));
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(sql`random()`)
    .limit(limit);

  return attachProductDetails(rows, { imageOrder: "cover" });
}

export async function listActiveBanners() {
  const now = new Date();
  return db
    .select()
    .from(banners)
    .where(
      and(
        eq(banners.isActive, true),
        or(sql`${banners.startsAt} IS NULL`, sql`${banners.startsAt} <= ${now}`),
        or(sql`${banners.endsAt} IS NULL`, sql`${banners.endsAt} >= ${now}`)
      )
    )
    .orderBy(asc(banners.sortOrder));
}

export async function listTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder));
}

export async function listSocialPosts(limit?: number) {
  const query = db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.isPublished, true))
    .orderBy(asc(socialPosts.sortOrder));

  return limit ? query.limit(limit) : query;
}

export async function listFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isPublished, true))
    .orderBy(asc(faqs.sortOrder));
}

export { getAnalyticsSummary, type AnalyticsSummary } from "./events";
