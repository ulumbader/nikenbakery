"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, ne, count } from "drizzle-orm";
import { db } from "@/db";
import { first } from "@/db/first";
import { categories, products, COLORS, type TokenColor } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Nama kategori wajib diisi"),
  color: z.enum(COLORS),
});

/**
 * Tambah kategori baru.
 */
export async function createCategoryAction(
  _prevState: unknown,
  formData: FormData
) {
  await requireAdmin();

  const name = formData.get("name")?.toString() || "";
  const color = formData.get("color")?.toString() as TokenColor;

  const validation = categorySchema.safeParse({ name, color });
  if (!validation.success) {
    return {
      error: validation.error.flatten().fieldErrors.name?.[0] || "Data tidak valid",
    };
  }

  // Hitung sort_order berikutnya
  const allCats = await db
    .select({ slug: categories.slug, sortOrder: categories.sortOrder })
    .from(categories)
    .orderBy(asc(categories.sortOrder));

  const baseSlug = generateSlug(validation.data.name);
  const existingSlugs = allCats.map((c) => c.slug);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);

  const maxOrder = allCats.reduce((max, c) => Math.max(max, c.sortOrder), 0);

  await db.insert(categories)
    .values({
      name: validation.data.name,
      slug,
      color: validation.data.color,
      sortOrder: maxOrder + 1,
    });

  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

/**
 * Perbarui kategori yang sudah ada.
 */
export async function updateCategoryAction(
  _prevState: unknown,
  formData: FormData
) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const name = formData.get("name")?.toString() || "";
  const color = formData.get("color")?.toString() as TokenColor;

  if (!id) return { error: "ID kategori tidak ditemukan" };

  const validation = categorySchema.safeParse({ name, color });
  if (!validation.success) {
    return {
      error: validation.error.flatten().fieldErrors.name?.[0] || "Data tidak valid",
    };
  }

  const existing = await first(db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1));

  if (!existing) return { error: "Kategori tidak ditemukan" };

  let slug = existing.slug;
  if (existing.name !== validation.data.name) {
    const allSlugs = (await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(ne(categories.id, id))
    ).map((c) => c.slug);

    slug = ensureUniqueSlug(generateSlug(validation.data.name), allSlugs);
  }

  await db.update(categories)
    .set({
      name: validation.data.name,
      slug,
      color: validation.data.color,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

/**
 * Pindahkan urutan kategori naik atau turun.
 */
export async function reorderCategoryAction(
  id: number,
  direction: "up" | "down"
) {
  await requireAdmin();

  const allCats = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  const currentIndex = allCats.findIndex((c) => c.id === id);
  if (currentIndex === -1) return { error: "Kategori tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= allCats.length) {
    return { success: true }; // Sudah di posisi paling atas/bawah
  }

  const currentCat = allCats[currentIndex];
  const targetCat = allCats[targetIndex];

  // Tukar sortOrder
  await Promise.all([
    db
      .update(categories)
      .set({ sortOrder: targetCat.sortOrder })
      .where(eq(categories.id, currentCat.id)),
    db
      .update(categories)
      .set({ sortOrder: currentCat.sortOrder })
      .where(eq(categories.id, targetCat.id)),
  ]);

  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

/**
 * Hapus kategori. Jika masih dipakai produk, wajib tentukan kategori pengganti.
 */
export async function deleteCategoryAction(
  id: number,
  replacementCategoryId?: number
) {
  await requireAdmin();

  // Hitung jumlah produk yang memakai kategori ini
  const productUsageRow = await first(db
    .select({ count: count() })
    .from(products)
    .where(eq(products.categoryId, id))
    .limit(1));
  const productUsage = Number(productUsageRow?.count ?? 0);

  if (productUsage > 0 && !replacementCategoryId) {
    return {
      error: `Kategori ini masih digunakan oleh ${productUsage} produk. Mohon pilih kategori pengganti sebelum menghapus.`,
      needsReplacement: true,
      productCount: productUsage,
    };
  }

  // Pindahkan produk ke kategori pengganti jika ditentukan
  if (replacementCategoryId) {
    await db.update(products)
      .set({ categoryId: replacementCategoryId })
      .where(eq(products.categoryId, id));
  }

  // Hapus kategori
  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}
