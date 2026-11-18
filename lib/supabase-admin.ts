import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "nikenbakery-media";

let adminClient: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur untuk mengelola gambar."
    );
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

export async function ensureMediaBucket(): Promise<void> {
  const storage = getSupabaseAdmin().storage;
  const { data, error } = await storage.getBucket(MEDIA_BUCKET);
  if (data) {
    if (!data.public) {
      throw new Error(`Bucket ${MEDIA_BUCKET} harus dapat dibaca publik untuk gambar katalog.`);
    }
    return;
  }
  if (error && !error.message.toLowerCase().includes("not found")) {
    throw new Error(`Tidak dapat memeriksa bucket gambar: ${error.message}`);
  }

  const { error: createError } = await storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/webp"],
  });
  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(`Tidak dapat membuat bucket gambar: ${createError.message}`);
  }
}

export async function uploadMediaObject(
  key: string,
  content: Buffer | Uint8Array,
  contentType = "image/webp"
): Promise<string> {
  await ensureMediaBucket();
  const { error } = await getSupabaseAdmin()
    .storage.from(MEDIA_BUCKET)
    .upload(key, content, {
      cacheControl: "31536000",
      contentType,
      upsert: true,
    });
  if (error) throw new Error(`Gagal mengunggah gambar ke Supabase: ${error.message}`);

  return getSupabaseAdmin().storage.from(MEDIA_BUCKET).getPublicUrl(key).data.publicUrl;
}

export function getMediaObjectKey(value: string): string | null {
  if (!value) return null;
  if (value.startsWith("/media/")) return value.slice("/media/".length);

  try {
    const url = new URL(value);
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function deleteMediaObjects(values: string[]): Promise<void> {
  const keys = Array.from(
    new Set(values.map(getMediaObjectKey).filter((key): key is string => Boolean(key)))
  );
  if (keys.length === 0) return;

  const { error } = await getSupabaseAdmin().storage.from(MEDIA_BUCKET).remove(keys);
  if (error) throw new Error(`Gagal menghapus gambar dari Supabase: ${error.message}`);
}
