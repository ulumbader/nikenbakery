import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ─── Timestamp helpers ─── */
const ts = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
};

export const COLORS = ["pink", "butter", "mint", "lavender"] as const;
export type TokenColor = (typeof COLORS)[number];

/* ─── Admin Users ─── */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  ...ts,
});

/* ─── Categories ─── */
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    color: text("color", { enum: COLORS }).notNull().default("butter"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...ts,
  },
  (table) => [index("categories_sort_order_idx").on(table.sortOrder)]
);

/* ─── Products ─── */
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
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
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    shopeeUrl: text("shopee_url"),
    shopeeEnabled: boolean("shopee_enabled").notNull().default(false),
    tokopediaUrl: text("tokopedia_url"),
    tokopediaEnabled: boolean("tokopedia_enabled").notNull().default(false),
    tiktokShopUrl: text("tiktok_shop_url"),
    tiktokShopEnabled: boolean("tiktok_shop_enabled").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...ts,
  },
  (table) => [index("products_category_idx").on(table.categoryId)]
);

/* ─── Product Variants ─── */
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  price: integer("price").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Product Images ─── */
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  thumbName: text("thumb_name").notNull(),
  alt: text("alt").notNull().default(""),
  isCover: boolean("is_cover").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Banners ─── */
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageFile: text("image_file"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  color: text("color", { enum: COLORS }).notNull().default("pink"),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }),
  endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Testimonials ─── */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  handle: text("handle"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Social Posts ─── */
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  platform: text("platform", { enum: ["instagram", "tiktok", "other"] })
    .notNull()
    .default("instagram"),
  imageFile: text("image_file"),
  caption: text("caption").notNull().default(""),
  postUrl: text("post_url").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── FAQs ─── */
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ─── Site Settings ─── */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

/* ─── Events (analytics) ─── */
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    type: text("type", { enum: ["product_view", "wa_click"] }).notNull(),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("events_type_created_idx").on(table.type, table.createdAt)]
);
