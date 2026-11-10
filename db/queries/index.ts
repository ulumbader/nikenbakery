import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lte,
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
  productVariants,
  products,
  siteSettings,
  socialPosts,
  testimonials,
} from "@/db/schema";
import { first } from "@/db/first";

/* ─── Settings ─── */

export {
  getSettings,
  getSetting,
  getOpeningHours,
  getAboutValues,
} from "@/lib/settings";

export async function getAllSettings() {
  return db.select().from(siteSettings);
}

/* ─── Categories ─── */

export async function listCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));
}

/* ─── Products ─── */

type ListProductsOpts = {
  categorySlug?: string;
  q?: string;
  status?: "ready" | "preorder" | "soldout";
};

export async function listProducts(opts: ListProductsOpts = {}) {
  const conditions = [eq(products.isPublished, true)];

  if (opts.status) conditions.push(eq(products.status, opts.status));

  if (opts.categorySlug) {
    const category = await first(
      db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, opts.categorySlug))
        .limit(1)
    );
    if (!category) return [];
    conditions.push(eq(products.categoryId, category.id));
  }

  if (opts.q) {
    const search = `%${opts.q}%`;
    conditions.push(
      or(ilike(products.name, search), ilike(products.description, search))!
    );
  }

  const result = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.sortOrder), desc(products.createdAt));

  return Promise.all(
    result.map(async (product) => {
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, product.id))
        .orderBy(asc(productVariants.price));

      const cover = await first(
        db
          .select()
          .from(productImages)
          .where(
            and(
              eq(productImages.productId, product.id),
              eq(productImages.isCover, true)
            )
          )
          .limit(1)
      );

      const firstImage =
        cover ??
        (await first(
          db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, product.id))
            .orderBy(asc(productImages.sortOrder))
            .limit(1)
        ));

      const category = product.categoryId
        ? await first(
            db
              .select()
              .from(categories)
              .where(eq(categories.id, product.categoryId))
              .limit(1)
          )
        : null;

      return {
        ...product,
        displayPrice:
          variants.length > 0 ? variants[0].price : product.basePrice,
        hasVariants: variants.length > 0,
        coverImage: firstImage ?? null,
        category: category ?? null,
      };
    })
  );
}

export async function getProductBySlug(slug: string) {
  const product = await first(
    db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isPublished, true)))
      .limit(1)
  );

  if (!product) return null;

  const [variants, images] = await Promise.all([
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
  ]);

  const category = product.categoryId
    ? await first(
        db
          .select()
          .from(categories)
          .where(eq(categories.id, product.categoryId))
          .limit(1)
      )
    : null;

  return { ...product, variants, images, category: category ?? null };
}

export async function listFeaturedProducts(limit = 6) {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.isPublished, true), eq(products.isFeatured, true)))
    .orderBy(asc(products.sortOrder))
    .limit(limit);

  return Promise.all(
    result.map(async (product) => {
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, product.id))
        .orderBy(asc(productVariants.price));

      const cover = await first(
        db
          .select()
          .from(productImages)
          .where(
            and(
              eq(productImages.productId, product.id),
              eq(productImages.isCover, true)
            )
          )
          .limit(1)
      );
      const firstImage =
        cover ??
        (await first(
          db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, product.id))
            .orderBy(asc(productImages.sortOrder))
            .limit(1)
        ));
      const category = product.categoryId
        ? await first(
            db
              .select()
              .from(categories)
              .where(eq(categories.id, product.categoryId))
              .limit(1)
          )
        : null;

      return {
        ...product,
        displayPrice:
          variants.length > 0 ? variants[0].price : product.basePrice,
        hasVariants: variants.length > 0,
        coverImage: firstImage ?? null,
        category: category ?? null,
      };
    })
  );
}

export async function listRelatedProducts(productId: number, limit = 4) {
  const product = await first(
    db.select().from(products).where(eq(products.id, productId)).limit(1)
  );
  if (!product) return [];

  const conditions = [eq(products.isPublished, true), ne(products.id, productId)];
  if (product.categoryId) {
    conditions.push(eq(products.categoryId, product.categoryId));
  }

  const result = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return Promise.all(
    result.map(async (relatedProduct) => {
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, relatedProduct.id))
        .orderBy(asc(productVariants.price));

      const cover = await first(
        db
          .select()
          .from(productImages)
          .where(
            and(
              eq(productImages.productId, relatedProduct.id),
              eq(productImages.isCover, true)
            )
          )
          .limit(1)
      );
      const firstImage =
        cover ??
        (await first(
          db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, relatedProduct.id))
            .orderBy(asc(productImages.sortOrder))
            .limit(1)
        ));
      const category = relatedProduct.categoryId
        ? await first(
            db
              .select()
              .from(categories)
              .where(eq(categories.id, relatedProduct.categoryId))
              .limit(1)
          )
        : null;

      return {
        ...relatedProduct,
        displayPrice:
          variants.length > 0 ? variants[0].price : relatedProduct.basePrice,
        hasVariants: variants.length > 0,
        coverImage: firstImage ?? null,
        category: category ?? null,
      };
    })
  );
}

/* ─── Banners ─── */

export async function listActiveBanners() {
  const now = new Date();
  return db
    .select()
    .from(banners)
    .where(
      and(
        eq(banners.isActive, true),
        or(isNull(banners.startsAt), lte(banners.startsAt, now)),
        or(isNull(banners.endsAt), gte(banners.endsAt, now))
      )
    )
    .orderBy(asc(banners.sortOrder));
}

/* ─── Testimonials ─── */

export async function listTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.sortOrder));
}

/* ─── Social Posts ─── */

export async function listSocialPosts(limit?: number) {
  const query = db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.isPublished, true))
    .orderBy(asc(socialPosts.sortOrder));

  return limit ? query.limit(limit) : query;
}

/* ─── FAQs ─── */

export async function listFaqs() {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.isPublished, true))
    .orderBy(asc(faqs.sortOrder));
}

/* ─── Analytics & Events ─── */
export { getAnalyticsSummary, type AnalyticsSummary } from "./events";
