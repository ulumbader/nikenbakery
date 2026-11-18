import sharp, { type Metadata } from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { deleteMediaObjects, uploadMediaObject } from "@/lib/supabase-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif"]);

export function getUploadDir(): string {
  if (process.env.NODE_ENV === "test" && process.env.UPLOAD_DIR) {
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

  if (process.env.NODE_ENV === "test" && process.env.UPLOAD_DIR) {
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

  const largeUrl = await uploadMediaObject(largeFileName, largeBuffer);
  try {
    const thumbUrl = await uploadMediaObject(thumbFileName, thumbBuffer);
    return { largeFileName, thumbFileName, largeUrl, thumbUrl };
  } catch (error) {
    await deleteMediaObjects([largeUrl]).catch(() => undefined);
    throw error;
  }
}

export async function deleteUploadedFile(fileNameOrUrl: string): Promise<void> {
  if (!fileNameOrUrl) return;
  if (process.env.NODE_ENV === "test" && process.env.UPLOAD_DIR) {
    const fileName = path.basename(fileNameOrUrl.split("?")[0]);
    if (!fileName || fileName === "." || fileName === "..") return;
    await fs.unlink(path.join(getUploadDir(), fileName)).catch(() => undefined);
    return;
  }
  await deleteMediaObjects([fileNameOrUrl]);
}
