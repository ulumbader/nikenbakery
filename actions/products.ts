"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, productVariants, productImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/upload";

/**
 * Toggle cepat status stok (ready / preorder / soldout).
 */
export async function toggleProductStatusAction(
  productId: number,
  status: "ready" | "preorder" | "soldout"
) {
  await requireAdmin();

  db.update(products)
    .set({
      status,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, productId))
    .run();

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

/**
 * Toggle cepat status publish (publikasi ke katalog publik).
 */
export async function toggleProductPublishAction(
  productId: number,
  isPublished: boolean
) {
  await requireAdmin();

  db.update(products)
    .set({
      isPublished,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, productId))
    .run();

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

/**
 * Toggle cepat status featured (tampil di produk andalan Home).
 */
export async function toggleProductFeaturedAction(
  productId: number,
  isFeatured: boolean
) {
  await requireAdmin();

  db.update(products)
    .set({
      isFeatured,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, productId))
    .run();

  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

/**
 * Hapus produk beserta seluruh varian, gambar, dan file fisik di disk.
 */
export async function deleteProductAction(productId: number) {
  await requireAdmin();

  // 1. Ambil semua file gambar produk ini untuk dihapus dari disk
  const images = db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .all();

  for (const img of images) {
    await deleteUploadedFile(img.fileName);
    await deleteUploadedFile(img.thumbName);
  }

  // 2. Hapus produk dari database (cascade menghapus productVariants & productImages)
  db.delete(products).where(eq(products.id, productId)).run();

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/menu");
  revalidatePath("/");

  return { success: true };
}

const productFormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  slug: z.string().trim().optional(),
  categoryId: z.coerce.number().nullable().optional(),
  basePrice: z.coerce.number().min(0, "Harga dasar harus bernilai 0 atau lebih"),
  status: z.enum(["ready", "preorder", "soldout"]),
  preorderNote: z.string().trim().nullable().optional(),
  description: z.string().trim().default(""),
  ingredients: z.string().trim().nullable().optional(),
  allergens: z.string().trim().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

/**
 * Simpan atau perbarui produk lengkap dengan varian dan galeri multi-foto.
 */
export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : undefined;

  const rawData = {
    id,
    name: formData.get("name")?.toString(),
    slug: formData.get("slug")?.toString(),
    categoryId: formData.get("categoryId")
      ? Number(formData.get("categoryId"))
      : null,
    basePrice: Number(formData.get("basePrice") ?? 0),
    status: formData.get("status")?.toString(),
    preorderNote: formData.get("preorderNote")?.toString() || null,
    description: formData.get("description")?.toString() || "",
    ingredients: formData.get("ingredients")?.toString() || null,
    allergens: formData.get("allergens")?.toString() || null,
    isFeatured: formData.get("isFeatured") === "true",
    isPublished: formData.get("isPublished") === "true",
  };

  const validation = productFormSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg =
      Object.values(validation.error.flatten().fieldErrors)[0]?.[0] ||
      "Mohon isi data produk dengan benar.";
    return { error: errorMsg };
  }

  const data = validation.data;

  // 1. Tangani slug (otomatis dari nama bila kosong, cek duplikat)
  const baseSlug = generateSlug(data.slug || data.name);
  const otherSlugs = db
    .select({ slug: products.slug })
    .from(products)
    .where(id ? sql`${products.id} != ${id}` : undefined)
    .all()
    .map((p) => p.slug);
  const finalSlug = ensureUniqueSlug(baseSlug, otherSlugs);

  let targetProductId = id;

  if (targetProductId) {
    // UPDATE
    db.update(products)
      .set({
        name: data.name,
        slug: finalSlug,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        status: data.status,
        preorderNote: data.preorderNote,
        description: data.description,
        ingredients: data.ingredients,
        allergens: data.allergens,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(products.id, targetProductId))
      .run();
  } else {
    // CREATE
    const inserted = db
      .insert(products)
      .values({
        name: data.name,
        slug: finalSlug,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        status: data.status,
        preorderNote: data.preorderNote,
        description: data.description,
        ingredients: data.ingredients,
        allergens: data.allergens,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished,
      })
      .returning({ id: products.id })
      .get();

    targetProductId = inserted.id;
  }

  // 2. Tangani Varian
  const variantsRaw = formData.get("variants")?.toString();
  if (variantsRaw) {
    try {
      const parsedVariants = JSON.parse(variantsRaw) as Array<{
        label: string;
        price: number;
        sortOrder: number;
      }>;

      // Hapus varian lama produk ini
      db.delete(productVariants)
        .where(eq(productVariants.productId, targetProductId))
        .run();

      // Masukkan varian baru
      for (const [idx, v] of parsedVariants.entries()) {
        if (v.label.trim()) {
          db.insert(productVariants)
            .values({
              productId: targetProductId,
              label: v.label.trim(),
              price: Number(v.price) || 0,
              sortOrder: idx + 1,
            })
            .run();
        }
      }
    } catch {
      // Abaikan jika parsing varian gagal
    }
  }

  // 3. Tangani Penghapusan Gambar Lama
  const deletedImageIdsRaw = formData.get("deletedImageIds")?.toString();
  if (deletedImageIdsRaw) {
    try {
      const deletedIds = JSON.parse(deletedImageIdsRaw) as number[];
      for (const imgId of deletedIds) {
        const img = db
          .select()
          .from(productImages)
          .where(
            and(
              eq(productImages.id, imgId),
              eq(productImages.productId, targetProductId)
            )
          )
          .get();

        if (img) {
          await deleteUploadedFile(img.fileName);
          await deleteUploadedFile(img.thumbName);
          db.delete(productImages).where(eq(productImages.id, imgId)).run();
        }
      }
    } catch {
      // Abaikan jika parsing gagal
    }
  }

  // 4. Tangani Pembaruan Urutan / Cover Gambar Lama
  const existingImagesMetaRaw = formData.get("existingImagesMeta")?.toString();
  if (existingImagesMetaRaw) {
    try {
      const existingMeta = JSON.parse(existingImagesMetaRaw) as Array<{
        id: number;
        alt: string;
        isCover: boolean;
        sortOrder: number;
      }>;

      for (const meta of existingMeta) {
        db.update(productImages)
          .set({
            alt: meta.alt || "",
            isCover: Boolean(meta.isCover),
            sortOrder: meta.sortOrder || 0,
          })
          .where(
            and(
              eq(productImages.id, meta.id),
              eq(productImages.productId, targetProductId)
            )
          )
          .run();
      }
    } catch {
      // Abaikan jika parsing gagal
    }
  }

  // 5. Tangani Upload File Gambar Baru
  const newFiles = formData.getAll("newImages") as File[];
  const validFiles = newFiles.filter(
    (f) => f && typeof f.size === "number" && f.size > 0
  );

  if (validFiles.length > 0) {
    // Ambil gambar yang sudah ada untuk menentukan urutan berikutnya
    const currentImages = db
      .select({ count: sql<number>`count(*)` })
      .from(productImages)
      .where(eq(productImages.productId, targetProductId))
      .get()?.count ?? 0;

    let hasCoverAlready = Boolean(
      db
        .select()
        .from(productImages)
        .where(
          and(
            eq(productImages.productId, targetProductId),
            eq(productImages.isCover, true)
          )
        )
        .get()
    );

    for (const [idx, file] of validFiles.entries()) {
      try {
        const processed = await processAndSaveImage(file);
        const shouldBeCover = !hasCoverAlready && idx === 0;
        if (shouldBeCover) hasCoverAlready = true;

        db.insert(productImages)
          .values({
            productId: targetProductId,
            fileName: processed.largeUrl,
            thumbName: processed.thumbUrl,
            alt: data.name,
            isCover: shouldBeCover,
            sortOrder: currentImages + idx + 1,
          })
          .run();
      } catch (err) {
        return {
          error: `Gagal memproses gambar '${file.name}': ${(err as Error).message}`,
        };
      }
    }
  }

  // 6. Pastikan tepat satu cover aktif jika produk memiliki gambar
  const allImages = db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, targetProductId))
    .orderBy(productImages.sortOrder)
    .all();

  if (allImages.length > 0) {
    const hasCover = allImages.some((img) => img.isCover);
    if (!hasCover) {
      db.update(productImages)
        .set({ isCover: true })
        .where(eq(productImages.id, allImages[0].id))
        .run();
    }
  }

  // 7. Revalidasi halaman
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${targetProductId}`);
  revalidatePath("/menu");
  revalidatePath(`/menu/${finalSlug}`);
  revalidatePath("/");

  return { success: true, productId: targetProductId };
}
