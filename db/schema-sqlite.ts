import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

/* ─── Timestamp helpers ─── */
const ts = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const COLORS = ["pink", "butter", "mint", "lavender"] as const;
export type TokenColor = (typeof COLORS)[number];

/* ─── Admin Users ─── */
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  ...ts,
});

/* ─── Categories ─── */
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color", { enum: COLORS }).notNull().default("butter"),
  sortOrder: integer("sort_order").notNull().default(0),
  ...ts,
});

/* ─── Products ─── */
export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull().default(""),
    basePrice: integer("base_price").notNull(),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    status: text("status", { enum: ["ready", "preorder", "soldout"] })
      .notNull()
      .default("ready"),
    preorderNote: text("preorder_note"),
    ingredients: text("ingredients"),
    allergens: text("allergens"),
    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(true),
    shopeeUrl: text("shopee_url"),
    shopeeEnabled: integer("shopee_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    tokopediaUrl: text("tokopedia_url"),
    tokopediaEnabled: integer("tokopedia_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    tiktokShopUrl: text("tiktok_shop_url"),
    tiktokShopEnabled: integer("tiktok_shop_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...ts,
  },
  (t) => [index("products_category_idx").on(t.categoryId)]
);

/* ─── Product Variants ─── */
export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  price: integer("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Product Images ─── */
export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  thumbName: text("thumb_name").notNull(),
  alt: text("alt").notNull().default(""),
  isCover: integer("is_cover", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Banners ─── */
export const banners = sqliteTable("banners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageFile: text("image_file"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  color: text("color", { enum: COLORS }).notNull().default("pink"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Testimonials ─── */
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Social Posts ─── */
export const socialPosts = sqliteTable("social_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform", { enum: ["instagram", "tiktok", "other"] })
    .notNull()
    .default("instagram"),
  imageFile: text("image_file"),
  caption: text("caption").notNull().default(""),
  postUrl: text("post_url").notNull(),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── FAQs ─── */
export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Site Settings ─── */
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/* ─── Events (analytics) ─── */
export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: ["product_view", "wa_click"] }).notNull(),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("events_type_created_idx").on(t.type, t.createdAt)]
);

