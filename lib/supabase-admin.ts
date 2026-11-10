import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as unknown as {
  supabaseAdmin?: SupabaseClient;
};

export function getSupabaseStorageConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return {
    url,
    serviceRoleKey,
    bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "nikenbakery-media",
  };
}

export function isSupabaseStorageConfigured(): boolean {
  return getSupabaseStorageConfig() !== null;
}

export function getSupabaseAdmin(): SupabaseClient {
  const config = getSupabaseStorageConfig();
  if (!config) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi untuk menyimpan gambar."
    );
  }

  if (globalForSupabase.supabaseAdmin) return globalForSupabase.supabaseAdmin;

  const client = createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForSupabase.supabaseAdmin = client;
  }

  return client;
}
