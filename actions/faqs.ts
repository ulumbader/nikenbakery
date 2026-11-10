"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { first } from "@/db/first";
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

  const last = await first(db
    .select({ sortOrder: faqs.sortOrder })
    .from(faqs)
    .orderBy(desc(faqs.sortOrder))
    .limit(1));

  const nextOrder = (last?.sortOrder ?? 0) + 1;

  await db.insert(faqs)
    .values({
      question,
      answer,
      isPublished,
      sortOrder: nextOrder,
    });

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

  const existing = await first(
    db.select().from(faqs).where(eq(faqs.id, id)).limit(1)
  );
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

  await db.update(faqs)
    .set({
      question,
      answer,
      isPublished,
    })
    .where(eq(faqs.id, id));

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Toggle cepat publish FAQ.
 */
export async function toggleFaqPublishAction(id: number, isPublished: boolean) {
  await requireAdmin();

  await db.update(faqs)
    .set({ isPublished })
    .where(eq(faqs.id, id));

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Urutkan FAQ naik / turun.
 */
export async function reorderFaqAction(id: number, direction: "up" | "down") {
  await requireAdmin();

  const all = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  const currentIndex = all.findIndex((f) => f.id === id);
  if (currentIndex === -1) return { error: "FAQ tidak ditemukan" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= all.length) return { success: true };

  const current = all[currentIndex];
  const target = all[targetIndex];

  await Promise.all([
    db.update(faqs).set({ sortOrder: target.sortOrder }).where(eq(faqs.id, current.id)),
    db.update(faqs).set({ sortOrder: current.sortOrder }).where(eq(faqs.id, target.id)),
  ]);

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}

/**
 * Hapus FAQ.
 */
export async function deleteFaqAction(id: number) {
  await requireAdmin();

  await db.delete(faqs).where(eq(faqs.id, id));

  revalidatePath("/admin/faqs");
  revalidatePath("/about");

  return { success: true };
}
