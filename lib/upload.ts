import sharp, { type Metadata } from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
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

/**
 * Validasi dan proses upload gambar ke WebP (large 1200w & thumb 480w).
 * EXIF dibuang otomatis oleh Sharp untuk privasi dan efisiensi.
 */
export async function processAndSaveImage(
  file: File | Blob
): Promise<ProcessedImageResult> {
  // 1. Cek ukuran file
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran file gambar maksimal 5 MB.");
  }

  // 2. Baca isi buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Verifikasi isi file lewat Sharp (bukan sekadar ekstensi atau mime type klien)
  let metadata: Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new Error("File yang diunggah rusak atau bukan format gambar valid.");
  }

  // Tolak SVG dan format yang tidak diizinkan
  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format.toLowerCase())) {
    throw new Error(
      "Format gambar harus JPEG, PNG, WebP, atau AVIF. Format SVG tidak diizinkan demi keamanan."
    );
  }

  // 4. Pastikan direktori penyimpanan ada
  const uploadDir = getUploadDir();
  await fs.mkdir(uploadDir, { recursive: true });

  const fileId = crypto.randomUUID();
  const largeFileName = `${fileId}-1200w.webp`;
  const thumbFileName = `${fileId}-480w.webp`;

  const largePath = path.join(uploadDir, largeFileName);
  const thumbPath = path.join(uploadDir, thumbFileName);

  // 5. Generate Large (1200px lebar, WebP, EXIF dihapus)
  await sharp(buffer)
    .rotate() // Mengikuti orientasi EXIF sebelum di-strip
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(largePath);

  // 6. Generate Thumbnail (480px lebar, WebP, EXIF dihapus)
  await sharp(buffer)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  return {
    largeFileName,
    thumbFileName,
    largeUrl: `/media/${largeFileName}`,
    thumbUrl: `/media/${thumbFileName}`,
  };
}

/**
 * Hapus file gambar fisik dari direktori upload secara aman.
 */
export async function deleteUploadedFile(fileNameOrUrl: string): Promise<void> {
  if (!fileNameOrUrl) return;

  // Bersihkan prefix /media/ jika ada
  const cleanName = path.basename(fileNameOrUrl);
  if (!cleanName || cleanName === "." || cleanName === "..") return;

  const uploadDir = getUploadDir();
  const filePath = path.join(/*turbopackIgnore: true*/ uploadDir, cleanName);

  // Pastikan tetap berada di dalam uploadDir
  if (!filePath.startsWith(uploadDir)) return;

  try {
    await fs.unlink(filePath);
  } catch {
    // Abaikan jika file sudah tidak ada
  }
}
