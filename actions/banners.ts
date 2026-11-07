"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { banners, COLORS, type TokenColor } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/upload";

function isValidUrlOrPath(url: string): boolean {
  if (!url || url.trim() === "" || url === "#") return true;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return true;
  }
  return false;
}

const bannerSchema = z.object({
  title: z.string().trim().min(1, "Judul banner wajib diisi"),
  subtitle: z.string().trim().optional(),
  color: z.enum(COLORS),
  ctaLabel: z.string().trim().optional(),
  ctaUrl: z
    .string()
    .trim()
    .refine(isValidUrlOrPath, {
      message: "URL tombol harus diawali http://, https://, atau tanda garis miring (/)",
    })
    .optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
});

function parseDateInput(val?: string | null): Date | null {
  if (!val || val.trim() === "") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Buat banner promo baru.
 */
export async function createBannerAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title")?.toString() || "";
  const subtitle = formData.get("subtitle")?.toString() || "";
  const color = (formData.get("color")?.toString() || "pink") as TokenColor;
  const ctaLabel = formData.get("ctaLabel")?.toString() || "";
  const ctaUrl = formData.get("ctaUrl")?.toString() || "";
  const isActive = formData.get("isActive") === "true" || formData.get("isActive") === "on";
  const startsAtRaw = formData.get("startsAt")?.toString();
  const endsAtRaw = formData.get("endsAt")?.toString();

  const validation = bannerSchema.safeParse({
    title,
    subtitle,
    color,
    ctaLabel,
    ctaUrl,
    isActive,
    startsAt: startsAtRaw,
    endsAt: endsAtRaw,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data banner tidak valid" };
  }

  const startsAt = parseDateInput(startsAtRaw);
  const endsAt = parseDateInput(endsAtRaw);

  if (startsAt && endsAt && endsAt.getTime() < startsAt.getTime()) {
    return { error: "Waktu selesai promo tidak boleh lebih awal dari waktu mulai promo" };
  }

  // Handle image upload jika ada
  let imageFileUrl: string | null = null;
  const imageUpload = formData.get("image") as File | null;
  if (imageUpload && imageUpload.size > 0 && imageUpload.name !== "undefined") {
    try {
      const uploadRes = await processAndSaveImage(imageUpload);
      imageFileUrl = uploadRes.largeUrl;
    } catch (err: unknown) {
      return { error: (err as Error).message || "Gagal memproses gambar banner" };
    }
  }

  // Hitung sort order berikutnya
  const lastBanner = db
    .select({ sortOrder: banners.sortOrder })
    .from(banners)
    .orderBy(desc(banners.sortOrder))
    .limit(1)
    .get();

  const nextOrder = (lastBanner?.sortOrder ?? 0) + 1;

  db.insert(banners)
    .values({
      title,
      subtitle: subtitle || null,
      color,
      ctaLabel: ctaLabel || null,
      ctaUrl: ctaUrl || null,
      imageFile: imageFileUrl,
      isActive,
      startsAt,
      endsAt,
      sortOrder: nextOrder,
    })
    .run();

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return { success: true };
}

/**
 * Perbarui banner promo.
 */
export async function updateBannerAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) {
    return { error: "ID banner tidak valid" };
  }

  const existing = db.select().from(banners).where(eq(banners.id, id)).get();
  if (!existing) {
    return { error: "Banner tidak ditemukan" };
  }

  const title = formData.get("title")?.toString() || "";
  const subtitle = formData.get("subtitle")?.toString() || "";
  const color = (formData.get("color")?.toString() || "pink") as TokenColor;
  const ctaLabel = formData.get("ctaLabel")?.toString() || "";
  const ctaUrl = formData.get("ctaUrl")?.toString() || "";
  const isActive = formData.get("isActive") === "true" || formData.get("isActive") === "on";
  const startsAtRaw = formData.get("startsAt")?.toString();
  const endsAtRaw = formData.get("endsAt")?.toString();
  const removeImage = formData.get("removeImage") === "true";

  const validation = bannerSchema.safeParse({
    title,
    subtitle,
    color,
    ctaLabel,
    ctaUrl,
    isActive,
    startsAt: startsAtRaw,
    endsAt: endsAtRaw,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data banner tidak valid" };
  }

  const startsAt = parseDateInput(startsAtRaw);
  const endsAt = parseDateInput(endsAtRaw);

  if (startsAt && endsAt && endsAt.getTime() < startsAt.getTime()) {
    return { error: "Waktu selesai promo tidak boleh lebih awal dari waktu mulai promo" };
  }

  let finalImageFile = existing.imageFile;

  if (removeImage && existing.imageFile) {
    await deleteUploadedFile(existing.imageFile);
    finalImageFile = null;
  }

  const imageUpload = formData.get("image") as File | null;
  if (imageUpload && imageUpload.size > 0 && imageUpload.name !== "undefined") {
    try {
      const uploadRes = await processAndSaveImage(imageUpload);
      if (existing.imageFile) {
        await deleteUploadedFile(existing.imageFile);
      }
      finalImageFile = uploadRes.largeUrl;
    } catch (err: unknown) {
      return { error: (err as Error).message || "Gagal memproses gambar banner" };
    }
  }

  db.update(banners)
    .set({
      title,
      subtitle: subtitle || null,
      color,
      ctaLabel: ctaLabel || null,
      ctaUrl: ctaUrl || null,
      imageFile: finalImageFile,
      isActive,
      startsAt,
      endsAt,
    })
    .where(eq(banners.id, id))
    .run();

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return { success: true };
}

/**
 * Toggle cepat aktif/nonaktif banner.
 */
export async function toggleBannerActiveAction(id: number, isActive: boolean) {
  await requireAdmin();

  db.update(banners)
    .set({ isActive })
    .where(eq(banners.id, id))
    .run();

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return { success: true };
}

/**
 * Ubah urutan banner naik / turun.
 */
export async function reorderBannerAction(id: number, direction: "up" | "down") {
  await requireAdmin();

  const allBanners = db.select().from(banners).orderBy(asc(banners.sortOrder)).all();
  const currentIndex = allBanners.findIndex((b) => b.id === id);
  if (currentIndex === -1) return { error: "Banner tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= allBanners.length) return { success: true };

  const current = allBanners[currentIndex];
  const target = allBanners[targetIndex];

  db.update(banners).set({ sortOrder: target.sortOrder }).where(eq(banners.id, current.id)).run();
  db.update(banners).set({ sortOrder: current.sortOrder }).where(eq(banners.id, target.id)).run();

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return { success: true };
}

/**
 * Hapus banner promo.
 */
export async function deleteBannerAction(id: number) {
  await requireAdmin();

  const existing = db.select().from(banners).where(eq(banners.id, id)).get();
  if (!existing) return { error: "Banner tidak ditemukan" };

  if (existing.imageFile) {
    await deleteUploadedFile(existing.imageFile);
  }

  db.delete(banners).where(eq(banners.id, id)).run();

  revalidatePath("/admin/banners");
  revalidatePath("/");

  return { success: true };
}
