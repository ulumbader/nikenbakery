"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Nama pelanggan wajib diisi"),
  handle: z.string().trim().optional(),
  content: z.string().trim().min(1, "Isi testimoni wajib diisi"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isPublished: z.boolean().default(true),
});

/**
 * Buat testimoni baru.
 */
export async function createTestimonialAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString() || "";
  const handle = formData.get("handle")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const rating = Number(formData.get("rating") || 5);
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";

  const validation = testimonialSchema.safeParse({
    name,
    handle,
    content,
    rating,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data testimoni tidak valid" };
  }

  const last = db
    .select({ sortOrder: testimonials.sortOrder })
    .from(testimonials)
    .orderBy(desc(testimonials.sortOrder))
    .limit(1)
    .get();

  const nextOrder = (last?.sortOrder ?? 0) + 1;

  db.insert(testimonials)
    .values({
      name,
      handle: handle ? (handle.startsWith("@") ? handle : `@${handle}`) : null,
      content,
      rating,
      isPublished,
      sortOrder: nextOrder,
    })
    .run();

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Perbarui testimoni.
 */
export async function updateTestimonialAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { error: "ID testimoni tidak valid" };

  const existing = db.select().from(testimonials).where(eq(testimonials.id, id)).get();
  if (!existing) return { error: "Testimoni tidak ditemukan" };

  const name = formData.get("name")?.toString() || "";
  const handle = formData.get("handle")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const rating = Number(formData.get("rating") || 5);
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";

  const validation = testimonialSchema.safeParse({
    name,
    handle,
    content,
    rating,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data testimoni tidak valid" };
  }

  db.update(testimonials)
    .set({
      name,
      handle: handle ? (handle.startsWith("@") ? handle : `@${handle}`) : null,
      content,
      rating,
      isPublished,
    })
    .where(eq(testimonials.id, id))
    .run();

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Toggle cepat publish testimoni.
 */
export async function toggleTestimonialPublishAction(id: number, isPublished: boolean) {
  await requireAdmin();

  db.update(testimonials)
    .set({ isPublished })
    .where(eq(testimonials.id, id))
    .run();

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Urutkan testimoni naik / turun.
 */
export async function reorderTestimonialAction(id: number, direction: "up" | "down") {
  await requireAdmin();

  const all = db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)).all();
  const currentIndex = all.findIndex((t) => t.id === id);
  if (currentIndex === -1) return { error: "Testimoni tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return { success: true };

  const current = all[currentIndex];
  const target = all[targetIndex];

  db.update(testimonials).set({ sortOrder: target.sortOrder }).where(eq(testimonials.id, current.id)).run();
  db.update(testimonials).set({ sortOrder: current.sortOrder }).where(eq(testimonials.id, target.id)).run();

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Hapus testimoni.
 */
export async function deleteTestimonialAction(id: number) {
  await requireAdmin();

  db.delete(testimonials).where(eq(testimonials.id, id)).run();

  revalidatePath("/admin/testimonials");
  revalidatePath("/");

  return { success: true };
}
