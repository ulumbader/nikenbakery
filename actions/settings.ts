"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { normalizePhone } from "@/lib/whatsapp";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/upload";

/**
 * Simpan atau perbarui kumpulan pengaturan situs.
 */
export async function updateSettingsAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const updates: Record<string, string> = {};

  // 1. Identitas
  if (formData.has("business_name")) {
    const val = formData.get("business_name")?.toString().trim();
    if (val) updates["business_name"] = val;
  }
  if (formData.has("tagline")) {
    updates["tagline"] = formData.get("tagline")?.toString().trim() ?? "";
  }
  if (formData.has("timezone")) {
    updates["timezone"] = formData.get("timezone")?.toString().trim() || "Asia/Jakarta";
  }

  // 2. Kontak & WhatsApp
  if (formData.has("whatsapp_number")) {
    const rawWa = formData.get("whatsapp_number")?.toString().trim() || "";
    updates["whatsapp_number"] = normalizePhone(rawWa);
  }
  if (formData.has("wa_default_message")) {
    updates["wa_default_message"] = formData.get("wa_default_message")?.toString().trim() ?? "";
  }
  if (formData.has("email")) {
    updates["email"] = formData.get("email")?.toString().trim() ?? "";
  }

  // 3. Lokasi
  if (formData.has("address")) {
    updates["address"] = formData.get("address")?.toString().trim() ?? "";
  }
  if (formData.has("maps_url")) {
    updates["maps_url"] = formData.get("maps_url")?.toString().trim() ?? "";
  }
  if (formData.has("maps_embed_url")) {
    updates["maps_embed_url"] = formData.get("maps_embed_url")?.toString().trim() ?? "";
  }

  // 4. Jam Buka (opening_hours JSON)
  if (formData.has("opening_hours_json")) {
    try {
      const rawJson = formData.get("opening_hours_json")?.toString() || "[]";
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed)) {
        updates["opening_hours"] = JSON.stringify(parsed);
      }
    } catch {
      return { error: "Format data jam buka tidak valid" };
    }
  }

  // 5. Sosmed
  if (formData.has("instagram_url")) {
    updates["instagram_url"] = formData.get("instagram_url")?.toString().trim() ?? "";
  }
  if (formData.has("tiktok_url")) {
    updates["tiktok_url"] = formData.get("tiktok_url")?.toString().trim() ?? "";
  }

  // 6. Konten Brand (About, Kebijakan, Pengiriman, Halal)
  if (formData.has("about_story")) {
    updates["about_story"] = formData.get("about_story")?.toString().trim() ?? "";
  }
  if (formData.has("about_value_1") || formData.has("about_value_2") || formData.has("about_value_3")) {
    const v1 = formData.get("about_value_1")?.toString().trim() || "";
    const v2 = formData.get("about_value_2")?.toString().trim() || "";
    const v3 = formData.get("about_value_3")?.toString().trim() || "";
    const valuesArray = [v1, v2, v3].filter(Boolean);
    updates["about_values"] = JSON.stringify(valuesArray);
  }
  if (formData.has("delivery_info")) {
    updates["delivery_info"] = formData.get("delivery_info")?.toString().trim() ?? "";
  }
  if (formData.has("order_policy")) {
    updates["order_policy"] = formData.get("order_policy")?.toString().trim() ?? "";
  }
  if (formData.has("halal_info")) {
    updates["halal_info"] = formData.get("halal_info")?.toString().trim() ?? "";
  }

  // 7. Custom Order
  if (formData.has("custom_order_enabled")) {
    const isEnabled = formData.get("custom_order_enabled") === "true";
    updates["custom_order_enabled"] = isEnabled ? "true" : "false";
  }
  if (formData.has("custom_order_min_days")) {
    updates["custom_order_min_days"] = formData.get("custom_order_min_days")?.toString().trim() || "3";
  }

  // 8. Upload Foto About jika ada
  const removeAboutImage = formData.get("remove_about_image") === "true";
  if (removeAboutImage) {
    const current = db.select().from(siteSettings).where(eq(siteSettings.key, "about_image")).get();
    if (current?.value) {
      await deleteUploadedFile(current.value);
    }
    updates["about_image"] = "";
  }

  const aboutImageFile = formData.get("about_image") as File | null;
  if (aboutImageFile && aboutImageFile.size > 0 && aboutImageFile.name !== "undefined") {
    try {
      const uploadRes = await processAndSaveImage(aboutImageFile);
      const current = db.select().from(siteSettings).where(eq(siteSettings.key, "about_image")).get();
      if (current?.value) {
        await deleteUploadedFile(current.value);
      }
      updates["about_image"] = uploadRes.largeUrl;
    } catch (err: unknown) {
      return { error: (err as Error).message || "Gagal mengunggah foto profil toko" };
    }
  }

  // Tulis semua update ke DB
  for (const [key, value] of Object.entries(updates)) {
    db.insert(siteSettings)
      .values({
        key,
        value,
        updatedAt: sql`(unixepoch())`,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value,
          updatedAt: sql`(unixepoch())`,
        },
      })
      .run();
  }

  // Revalidasi seluruh rute publik terkait
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/menu/[slug]", "page");
  revalidatePath("/about");
  revalidatePath("/social");

  return { success: true };
}
