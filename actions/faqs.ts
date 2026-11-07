"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";

const faqSchema = z.object({
  question: z.string().trim().min(1, "Pertanyaan FAQ wajib diisi"),
  answer: z.string().trim().min(1, "Jawaban FAQ wajib diisi"),
  isPublished: z.boolean().default(true),
});

/**
 * Buat FAQ baru.
 */
export async function createFaqAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const question = formData.get("question")?.toString() || "";
  const answer = formData.get("answer")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";

  const validation = faqSchema.safeParse({
    question,
    answer,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data FAQ tidak valid" };
  }

  const last = db
    .select({ sortOrder: faqs.sortOrder })
    .from(faqs)
    .orderBy(desc(faqs.sortOrder))
    .limit(1)
    .get();

  const nextOrder = (last?.sortOrder ?? 0) + 1;

  db.insert(faqs)
    .values({
      question,
      answer,
      isPublished,
      sortOrder: nextOrder,
    })
    .run();

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Perbarui FAQ.
 */
export async function updateFaqAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { error: "ID FAQ tidak valid" };

  const existing = db.select().from(faqs).where(eq(faqs.id, id)).get();
  if (!existing) return { error: "FAQ tidak ditemukan" };

  const question = formData.get("question")?.toString() || "";
  const answer = formData.get("answer")?.toString() || "";
  const isPublished = formData.get("isPublished") === "true" || formData.get("isPublished") === "on";

  const validation = faqSchema.safeParse({
    question,
    answer,
    isPublished,
  });

  if (!validation.success) {
    const issues = validation.error.issues.map((i) => i.message).join(", ");
    return { error: issues || "Data FAQ tidak valid" };
  }

  db.update(faqs)
    .set({
      question,
      answer,
      isPublished,
    })
    .where(eq(faqs.id, id))
    .run();

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Toggle cepat publish FAQ.
 */
export async function toggleFaqPublishAction(id: number, isPublished: boolean) {
  await requireAdmin();

  db.update(faqs)
    .set({ isPublished })
    .where(eq(faqs.id, id))
    .run();

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Urutkan FAQ naik / turun.
 */
export async function reorderFaqAction(id: number, direction: "up" | "down") {
  await requireAdmin();

  const all = db.select().from(faqs).orderBy(asc(faqs.sortOrder)).all();
  const currentIndex = all.findIndex((f) => f.id === id);
  if (currentIndex === -1) return { error: "FAQ tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return { success: true };

  const current = all[currentIndex];
  const target = all[targetIndex];

  db.update(faqs).set({ sortOrder: target.sortOrder }).where(eq(faqs.id, current.id)).run();
  db.update(faqs).set({ sortOrder: current.sortOrder }).where(eq(faqs.id, target.id)).run();

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Hapus FAQ.
 */
export async function deleteFaqAction(id: number) {
  await requireAdmin();

  db.delete(faqs).where(eq(faqs.id, id)).run();

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}
