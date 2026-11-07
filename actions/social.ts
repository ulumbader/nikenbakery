"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { socialPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/upload";

const socialPostSchema = z.object({
  platform: z.enum(["instagram", "tiktok", "other"]),
  caption: z.string().trim().default(""),
  postUrl: z
    .string()
    .trim()
    .url("URL postingan harus berupa URL yang valid (diawali http:// atau https://)"),
  isPublished: z.boolean().default(true),
});

/**
 * Buat post social baru.
 */
export async function createSocialPostAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const platform = (formData.get("platform")?.toString() || "instagram") as "instagram" | "tiktok" | "other";
  const caption = formData.get("caption")?.toString() || "";
  const postUrl = formData.get("postUrl")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";

  const validation = socialPostSchema.safeParse({
    platform,
    caption,
    postUrl,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data postingan tidak valid" };
  }

  // Handle gambar jika ada
  let imageFileUrl: string | null = null;
  const imageUpload = formData.get("image") as File | null;
  if (imageUpload && imageUpload.size > 0 && imageUpload.name !== "undefined") {
    try {
      const uploadRes = await processAndSaveImage(imageUpload);
      imageFileUrl = uploadRes.largeUrl;
    } catch (err: unknown) {
      return { error: (err as Error).message || "Gagal memproses gambar postingan" };
    }
  }

  const last = db
    .select({ sortOrder: socialPosts.sortOrder })
    .from(socialPosts)
    .orderBy(desc(socialPosts.sortOrder))
    .limit(1)
    .get();

  const nextOrder = (last?.sortOrder ?? 0) + 1;

  db.insert(socialPosts)
    .values({
      platform,
      caption,
      postUrl,
      imageFile: imageFileUrl,
      isPublished,
      sortOrder: nextOrder,
    })
    .run();

  revalidatePath("/admin/social");
  revalidatePath("/social");
  revalidatePath("/");

  return { success: true };
}

/**
 * Perbarui post social.
 */
export async function updateSocialPostAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { error: "ID postingan tidak valid" };

  const existing = db.select().from(socialPosts).where(eq(socialPosts.id, id)).get();
  if (!existing) return { error: "Postingan tidak ditemukan" };

  const platform = (formData.get("platform")?.toString() || "instagram") as "instagram" | "tiktok" | "other";
  const caption = formData.get("caption")?.toString() || "";
  const postUrl = formData.get("postUrl")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";
  const removeImage = formData.get("removeImage") === "true";

  const validation = socialPostSchema.safeParse({
    platform,
    caption,
    postUrl,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data postingan tidak valid" };
  }

  let finalImage = existing.imageFile;

  if (removeImage && existing.imageFile) {
    await deleteUploadedFile(existing.imageFile);
    finalImage = null;
  }

  const imageUpload = formData.get("image") as File | null;
  if (imageUpload && imageUpload.size > 0 && imageUpload.name !== "undefined") {
    try {
      const uploadRes = await processAndSaveImage(imageUpload);
      if (existing.imageFile) {
        await deleteUploadedFile(existing.imageFile);
      }
      finalImage = uploadRes.largeUrl;
    } catch (err: unknown) {
      return { error: (err as Error).message || "Gagal memproses gambar postingan" };
    }
  }

  db.update(socialPosts)
    .set({
      platform,
      caption,
      postUrl,
      imageFile: finalImage,
      isPublished,
    })
    .where(eq(socialPosts.id, id))
    .run();

  revalidatePath("/admin/social");
  revalidatePath("/social");
  revalidatePath("/");

  return { success: true };
}

/**
 * Toggle cepat publish post social.
 */
export async function toggleSocialPublishAction(id: number, isPublished: boolean) {
  await requireAdmin();

  db.update(socialPosts)
    .set({ isPublished })
    .where(eq(socialPosts.id, id))
    .run();

  revalidatePath("/admin/social");
  revalidatePath("/social");
  revalidatePath("/");

  return { success: true };
}

/**
 * Urutkan post social naik / turun.
 */
export async function reorderSocialPostAction(id: number, direction: "up" | "down") {
  await requireAdmin();

  const all = db.select().from(socialPosts).orderBy(asc(socialPosts.sortOrder)).all();
  const currentIndex = all.findIndex((p) => p.id === id);
  if (currentIndex === -1) return { error: "Postingan tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return { success: true };

  const current = all[currentIndex];
  const target = all[targetIndex];

  db.update(socialPosts).set({ sortOrder: target.sortOrder }).where(eq(socialPosts.id, current.id)).run();
  db.update(socialPosts).set({ sortOrder: current.sortOrder }).where(eq(socialPosts.id, target.id)).run();

  revalidatePath("/admin/social");
  revalidatePath("/social");
  revalidatePath("/");

  return { success: true };
}

/**
 * Hapus post social beserta file gambarnya dari disk.
 */
export async function deleteSocialPostAction(id: number) {
  await requireAdmin();

  const existing = db.select().from(socialPosts).where(eq(socialPosts.id, id)).get();
  if (!existing) return { error: "Postingan tidak ditemukan" };

  if (existing.imageFile) {
    await deleteUploadedFile(existing.imageFile);
  }

  db.delete(socialPosts).where(eq(socialPosts.id, id)).run();

  revalidatePath("/admin/social");
  revalidatePath("/social");
  revalidatePath("/");

  return { success: true };
}
