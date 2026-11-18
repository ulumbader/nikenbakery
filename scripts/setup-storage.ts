import { ensureMediaBucket, MEDIA_BUCKET } from "../lib/supabase-admin";

ensureMediaBucket()
  .then(() => {
    console.log(`✅ Bucket publik ${MEDIA_BUCKET} siap untuk gambar WebP.`);
  })
  .catch((error: unknown) => {
    console.error(
      "❌ Gagal menyiapkan Supabase Storage:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exitCode = 1;
  });
