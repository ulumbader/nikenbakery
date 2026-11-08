import { describe, it, expect, beforeEach, afterEach } from "vitest";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { processAndSaveImage, deleteUploadedFile } from "@/lib/upload";

describe("Pengujian Siklus Hidup Upload, Edit, Hapus Foto & Tampilan", () => {
  let tempUploadDir: string;
  let originalUploadDirEnv: string | undefined;
  let sqlite: InstanceType<typeof Database>;
  let db: ReturnType<typeof drizzle>;

  beforeEach(async () => {
    // 1. Buat direktori upload isolasi di temp OS
    tempUploadDir = path.join(os.tmpdir(), `test-uploads-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.mkdirSync(tempUploadDir, { recursive: true });

    originalUploadDirEnv = process.env.UPLOAD_DIR;
    process.env.UPLOAD_DIR = tempUploadDir;

    // 2. Setup SQLite memory
    sqlite = new Database(":memory:");
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    db = drizzle(sqlite, { schema });
    migrate(db, { migrationsFolder: "./db/migrations" });
  });

  afterEach(async () => {
    // Kembalikan env dan bersihkan direktori tes
    process.env.UPLOAD_DIR = originalUploadDirEnv;
    sqlite.close();

    try {
      if (fs.existsSync(tempUploadDir)) {
        fs.rmSync(tempUploadDir, { recursive: true, force: true });
      }
    } catch {
      // Abaikan jika pembersihan gagal
    }
  });

  // Helper untuk membuat buffer gambar PNG tiruan yang valid
  async function createMockImageFile(name: string, width = 600, height = 400): Promise<File> {
    const pngBuffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 105, b: 180, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    return new File([pngBuffer], name, { type: "image/png" });
  }

  it("1. Foto Produk: upload, simpan fisik ke disk, ganti, hapus individual, dan hapus dengan produk", async () => {
    // A. Buat kategori & produk
    const cat = db
      .insert(schema.categories)
      .values({ name: "Cake", slug: "cake", color: "pink", sortOrder: 1 })
      .returning()
      .get();

    const prod = db
      .insert(schema.products)
      .values({
        name: "Strawberry Shortcake",
        slug: "strawberry-shortcake",
        description: "Kue lezat",
        basePrice: 150000,
        categoryId: cat.id,
        status: "ready",
        isPublished: true,
        sortOrder: 1,
      })
      .returning()
      .get();

    // B. Upload Foto 1
    const file1 = await createMockImageFile("cake1.png");
    const result1 = await processAndSaveImage(file1);

    expect(result1.largeUrl).toMatch(/^\/media\/.*-1200w\.webp$/);
    expect(result1.thumbUrl).toMatch(/^\/media\/.*-480w\.webp$/);

    // Pastikan berkas fisik benar-benar ada di disk
    const largePath1 = path.join(tempUploadDir, result1.largeFileName);
    const thumbPath1 = path.join(tempUploadDir, result1.thumbFileName);
    expect(fs.existsSync(largePath1)).toBe(true);
    expect(fs.existsSync(thumbPath1)).toBe(true);

    // Simpan ke DB
    const imgRecord1 = db
      .insert(schema.productImages)
      .values({
        productId: prod.id,
        fileName: result1.largeUrl,
        thumbName: result1.thumbUrl,
        alt: "Foto 1",
        isCover: true,
        sortOrder: 1,
      })
      .returning()
      .get();

    // C. Upload Foto 2 (Tambahan)
    const file2 = await createMockImageFile("cake2.png");
    const result2 = await processAndSaveImage(file2);
    const largePath2 = path.join(tempUploadDir, result2.largeFileName);
    const thumbPath2 = path.join(tempUploadDir, result2.thumbFileName);
    expect(fs.existsSync(largePath2)).toBe(true);
    expect(fs.existsSync(thumbPath2)).toBe(true);

    const imgRecord2 = db
      .insert(schema.productImages)
      .values({
        productId: prod.id,
        fileName: result2.largeUrl,
        thumbName: result2.thumbUrl,
        alt: "Foto 2",
        isCover: false,
        sortOrder: 2,
      })
      .returning()
      .get();

    // D. Uji Hapus Foto 1 secara individual (Edit Produk)
    await deleteUploadedFile(imgRecord1.fileName);
    await deleteUploadedFile(imgRecord1.thumbName);
    db.delete(schema.productImages).where(eq(schema.productImages.id, imgRecord1.id)).run();

    // Pastikan berkas Foto 1 telah terhapus dari disk
    expect(fs.existsSync(largePath1)).toBe(false);
    expect(fs.existsSync(thumbPath1)).toBe(false);

    // Pastikan Foto 2 tetap aman di disk dan di DB
    expect(fs.existsSync(largePath2)).toBe(true);
    expect(fs.existsSync(thumbPath2)).toBe(true);
    const remainingImages = db
      .select()
      .from(schema.productImages)
      .where(eq(schema.productImages.productId, prod.id))
      .all();
    expect(remainingImages.length).toBe(1);
    expect(remainingImages[0].id).toBe(imgRecord2.id);

    // E. Uji Hapus Seluruh Produk: Semua foto tersisa harus ikut terhapus dari disk
    for (const img of remainingImages) {
      await deleteUploadedFile(img.fileName);
      await deleteUploadedFile(img.thumbName);
    }
    db.delete(schema.products).where(eq(schema.products.id, prod.id)).run();

    expect(fs.existsSync(largePath2)).toBe(false);
    expect(fs.existsSync(thumbPath2)).toBe(false);
  });

  it("2. Foto Postingan Sosial: upload, simpan fisik ke disk, ganti foto baru, dan hapus foto", async () => {
    // A. Buat Post Baru dengan Upload Foto
    const postFile1 = await createMockImageFile("social1.png");
    const postUpload1 = await processAndSaveImage(postFile1);

    const postPath1 = path.join(tempUploadDir, postUpload1.largeFileName);
    expect(fs.existsSync(postPath1)).toBe(true);

    const post = db
      .insert(schema.socialPosts)
      .values({
        platform: "instagram",
        caption: "Suasana pagi di dapur Niken Bakery",
        postUrl: "https://instagram.com/p/test1",
        imageFile: postUpload1.largeUrl,
        isPublished: true,
        sortOrder: 1,
      })
      .returning()
      .get();

    expect(post.imageFile).toBe(postUpload1.largeUrl);

    // B. Edit Post: Ganti dengan Foto Baru (Foto lama harus dihapus dari disk)
    const postFile2 = await createMockImageFile("social2.png");
    const postUpload2 = await processAndSaveImage(postFile2);
    const postPath2 = path.join(tempUploadDir, postUpload2.largeFileName);
    expect(fs.existsSync(postPath2)).toBe(true);

    // Hapus foto lama & perbarui DB
    await deleteUploadedFile(post.imageFile!);
    expect(fs.existsSync(postPath1)).toBe(false); // Foto 1 terhapus dari disk!

    db.update(schema.socialPosts)
      .set({ imageFile: postUpload2.largeUrl })
      .where(eq(schema.socialPosts.id, post.id))
      .run();

    // C. Edit Post: Hapus Foto (Jadikan teks saja tanpa foto)
    await deleteUploadedFile(postUpload2.largeUrl);
    expect(fs.existsSync(postPath2)).toBe(false); // Foto 2 terhapus dari disk!

    db.update(schema.socialPosts)
      .set({ imageFile: null })
      .where(eq(schema.socialPosts.id, post.id))
      .run();

    const updatedPost = db
      .select()
      .from(schema.socialPosts)
      .where(eq(schema.socialPosts.id, post.id))
      .get();

    expect(updatedPost?.imageFile).toBeNull();
  });

  it("3. Foto Tentang Kami (Settings): upload, simpan ke disk, ganti foto, dan hapus foto", async () => {
    // A. Upload Foto Profil Toko (About Image)
    const aboutFile1 = await createMockImageFile("about1.png");
    const uploadRes1 = await processAndSaveImage(aboutFile1);
    const aboutPath1 = path.join(tempUploadDir, uploadRes1.largeFileName);

    expect(fs.existsSync(aboutPath1)).toBe(true);

    db.insert(schema.siteSettings)
      .values({ key: "about_image", value: uploadRes1.largeUrl })
      .run();

    let setting = db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "about_image"))
      .get();
    expect(setting?.value).toBe(uploadRes1.largeUrl);

    // B. Ganti Foto Profil Toko
    const aboutFile2 = await createMockImageFile("about2.png");
    const uploadRes2 = await processAndSaveImage(aboutFile2);
    const aboutPath2 = path.join(tempUploadDir, uploadRes2.largeFileName);

    // Hapus foto lama dari disk
    await deleteUploadedFile(setting!.value);
    expect(fs.existsSync(aboutPath1)).toBe(false); // Berkas fisik lama terhapus!
    expect(fs.existsSync(aboutPath2)).toBe(true);  // Berkas fisik baru ada!

    db.update(schema.siteSettings)
      .set({ value: uploadRes2.largeUrl })
      .where(eq(schema.siteSettings.key, "about_image"))
      .run();

    // C. Hapus Foto Profil Toko (Kembalikan ke tanpa foto)
    await deleteUploadedFile(uploadRes2.largeUrl);
    expect(fs.existsSync(aboutPath2)).toBe(false); // Berkas terhapus bersih!

    db.update(schema.siteSettings)
      .set({ value: "" })
      .where(eq(schema.siteSettings.key, "about_image"))
      .run();

    setting = db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "about_image"))
      .get();
    expect(setting?.value).toBe("");
  });
});
