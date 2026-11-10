import sharp, { type Metadata } from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  getSupabaseAdmin,
  getSupabaseStorageConfig,
  isSupabaseStorageConfigured,
} from "@/lib/supabase-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif"]);

export function getUploadDir(): string {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  return path.join(process.cwd(), "data", "uploads");
}

export interface ProcessedImageResult {
  largeFileName: string;
  thumbFileName: string;
  largeUrl: string;
  thumbUrl: string;
}

/** Convert uploaded images to WebP and persist them to Supabase Storage. */
export async function processAndSaveImage(
  file: File | Blob
): Promise<ProcessedImageResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file gambar maksimal 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let metadata: Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new Error("File yang diunggah rusak atau bukan format gambar valid.");
  }

  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format.toLowerCase())) {
    throw new Error(
      "Format gambar harus JPEG, PNG, WebP, atau AVIF. Format SVG tidak diizinkan demi keamanan."
    );
  }

  const fileId = crypto.randomUUID();
  const largeFileName = `${fileId}-1200w.webp`;
  const thumbFileName = `${fileId}-480w.webp`;
  const [largeBuffer, thumbBuffer] = await Promise.all([
    sharp(buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer(),
    sharp(buffer)
      .rotate()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer(),
  ]);

  if (isSupabaseStorageConfigured()) {
    const config = getSupabaseStorageConfig();
    if (!config) throw new Error("Konfigurasi Supabase Storage tidak lengkap.");

    const supabase = getSupabaseAdmin();
    const largePath = `products/${largeFileName}`;
    const thumbPath = `products/${thumbFileName}`;
    const uploadedPaths: string[] = [];

    try {
      for (const [objectPath, imageBuffer] of [
        [largePath, largeBuffer],
        [thumbPath, thumbBuffer],
      ] as const) {
        const { error } = await supabase.storage
          .from(config.bucket)
          .upload(objectPath, imageBuffer, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: false,
          });

        if (error) throw error;
        uploadedPaths.push(objectPath);
      }
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(config.bucket).remove(uploadedPaths);
      }
      throw new Error(
        `Gagal menyimpan gambar ke Supabase Storage: ${error instanceof Error ? error.message : "kesalahan tidak diketahui"}`
      );
    }

    const largeUrl = supabase.storage.from(config.bucket).getPublicUrl(largePath)
      .data.publicUrl;
    const thumbUrl = supabase.storage.from(config.bucket).getPublicUrl(thumbPath)
      .data.publicUrl;

    return { largeFileName: largePath, thumbFileName: thumbPath, largeUrl, thumbUrl };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Supabase Storage harus dikonfigurasi di production; filesystem Vercel tidak persisten."
    );
  }

  const uploadDir = getUploadDir();
  await fs.mkdir(uploadDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(uploadDir, largeFileName), largeBuffer),
    fs.writeFile(path.join(uploadDir, thumbFileName), thumbBuffer),
  ]);

  return {
    largeFileName,
    thumbFileName,
    largeUrl: `/media/${largeFileName}`,
    thumbUrl: `/media/${thumbFileName}`,
  };
}

/** Delete either a Supabase object URL/key or a legacy local upload. */
export async function deleteUploadedFile(fileNameOrUrl: string): Promise<void> {
  if (!fileNameOrUrl) return;

  if (/^https?:\/\//i.test(fileNameOrUrl)) {
    const config = getSupabaseStorageConfig();
    if (!config) return;

    try {
      const url = new URL(fileNameOrUrl);
      const publicPrefix = `/storage/v1/object/public/${config.bucket}/`;
      if (!url.pathname.includes(publicPrefix)) return;

      const objectPath = decodeURIComponent(url.pathname.split(publicPrefix)[1]);
      if (!objectPath) return;

      const { error } = await getSupabaseAdmin()
        .storage.from(config.bucket)
        .remove([objectPath]);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid URL")) return;
      throw error;
    }
    return;
  }

  const cleanName = path.basename(fileNameOrUrl);
  if (!cleanName || cleanName === "." || cleanName === "..") return;

  const uploadDir = getUploadDir();
  const filePath = path.join(/*turbopackIgnore: true*/ uploadDir, cleanName);
  if (!filePath.startsWith(uploadDir)) return;

  try {
    await fs.unlink(filePath);
  } catch {
    // Abaikan file lokal lama yang sudah tidak tersedia.
  }
}
