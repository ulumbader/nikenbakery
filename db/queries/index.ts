import { eq, and, asc, desc, like, sql, or, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  products,
  productVariants,
  productImages,
  banners,
  testimonials,
  socialPosts,
  faqs,
  siteSettings,
} from "@/db/schema";

/* ─── Settings ─── */

export {
  getSettings,
  getSetting,
  getOpeningHours,
  getAboutValues,
} from "@/lib/settings";

export function getAllSettings() {
  return db.select().from(siteSettings).all();
}

/* ─── Categories ─── */

export function listCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();
}

/* ─── Products ─── */

type ListProductsOpts = {
  categorySlug?: string;
  q?: string;
  status?: "ready" | "preorder" | "soldout";
};

export function listProducts(opts: ListProductsOpts = {}) {
  const conditions = [eq(products.isPublished, true)];

  if (opts.status) {
    conditions.push(eq(products.status, opts.status));
  }

  // Build query with optional category join
  if (opts.categorySlug) {
    const category = db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, opts.categorySlug))
      .get();
    if (category) {
      conditions.push(eq(products.categoryId, category.id));
    } else {
      return []; // category not found
    }
  }

  if (opts.q) {
    const search = `%${opts.q}%`;
    conditions.push(
      or(like(products.name, search), like(products.description, search))!
    );
  }

  const result = db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.sortOrder), desc(products.createdAt))
    .all();

  // Attach variants (lowest price) and cover image for each product
  return result.map((p) => {
    const variants = db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, p.id))
      .orderBy(asc(productVariants.price))
      .all();

    const cover = db
      .select()
      .from(productImages)
      .where(
        and(eq(productImages.productId, p.id), eq(productImages.isCover, true))
      )
      .get();

    const firstImage = cover
      ? cover
      : db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, p.id))
          .orderBy(asc(productImages.sortOrder))
          .get();

    const displayPrice =
      variants.length > 0 ? variants[0].price : p.basePrice;

    const category = p.categoryId
      ? db
          .select()
          .from(categories)
          .where(eq(categories.id, p.categoryId))
          .get()
      : null;

    return {
      ...p,
      displayPrice,
      hasVariants: variants.length > 0,
      coverImage: firstImage ?? null,
      category,
    };
  });
}

export function getProductBySlug(slug: string) {
  const product = db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
    .get();

  if (!product) return null;

  const variants = db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, product.id))
    .orderBy(asc(productVariants.sortOrder))
    .all();

  const images = db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(asc(productImages.sortOrder))
    .all();

  const category = product.categoryId
    ? db
        .select()
        .from(categories)
        .where(eq(categories.id, product.categoryId))
        .get()
    : null;

  return {
    ...product,
    variants,
    images,
    category,
  };
}

export function listFeaturedProducts(limit = 6) {
  const result = db
    .select()
    .from(products)
    .where(
      and(eq(products.isPublished, true), eq(products.isFeatured, true))
    )
    .orderBy(asc(products.sortOrder))
    .limit(limit)
    .all();

  return result.map((p) => {
    const variants = db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, p.id))
      .orderBy(asc(productVariants.price))
      .all();

    const cover = db
      .select()
      .from(productImages)
      .where(
        and(eq(productImages.productId, p.id), eq(productImages.isCover, true))
      )
      .get();

    const firstImage = cover
      ? cover
      : db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, p.id))
          .orderBy(asc(productImages.sortOrder))
          .get();

    const category = p.categoryId
      ? db
          .select()
          .from(categories)
          .where(eq(categories.id, p.categoryId))
          .get()
      : null;

    return {
      ...p,
      displayPrice: variants.length > 0 ? variants[0].price : p.basePrice,
      hasVariants: variants.length > 0,
      coverImage: firstImage ?? null,
      category,
    };
  });
}

export function listRelatedProducts(productId: number, limit = 4) {
  const product = db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .get();

  if (!product) return [];

  const conditions = [
    eq(products.isPublished, true),
    ne(products.id, productId),
  ];

  if (product.categoryId) {
    conditions.push(eq(products.categoryId, product.categoryId));
  }

  const result = db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(limit)
    .all();

  return result.map((p) => {
    const variants = db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, p.id))
      .orderBy(asc(productVariants.price))
      .all();

    const cover = db
      .select()
      .from(productImages)
      .where(
        and(eq(productImages.productId, p.id), eq(productImages.isCover, true))
      )
      .get();

    const firstImage = cover
      ? cover
      : db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, p.id))
          .orderBy(asc(productImages.sortOrder))
          .get();

    const category = p.categoryId
      ? db
          .select()
          .from(categories)
          .where(eq(categories.id, p.categoryId))
          .get()
      : null;

    return {
      ...p,
      displayPrice: variants.length > 0 ? variants[0].price : p.basePrice,
      hasVariants: variants.length > 0,
      coverImage: firstImage ?? null,
      category,
    };
  });
}

/* ─── Banners ─── */

export function listActiveBanners() {
  const now = Math.floor(Date.now() / 1000);
  return db
    .select()
    .from(banners)
    .where(
      and(
        eq(banners.isActive, true),
        or(
          sql`${banners.startsAt} IS NULL`,
          sql`${banners.startsAt} <= ${now}`
        ),
        or(
          sql`${banners.endsAt} IS NULL`,
          sql`${banners.endsAt} >= ${now}`
        )
      )
    )
    .orderBy(asc(banners.sortOrder))
    .all();
}

/* ─── Testimonials ─── */

export function listTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder))
    .all();
}

/* ─── Social Posts ─── */

export function listSocialPosts(limit?: number) {
  const query = db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.isPublished, true))
    .orderBy(asc(socialPosts.sortOrder));

  if (limit) {
    return query.limit(limit).all();
  }
  return query.all();
}

/* ─── FAQs ─── */

export function listFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isPublished, true))
    .orderBy(asc(faqs.sortOrder))
    .all();
}

/* ─── Analytics & Events ─── */
export { getAnalyticsSummary, type AnalyticsSummary } from "./events";


