import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 hari

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || secret.length < 32) {
      throw new Error(
        "FATAL: SESSION_SECRET must be at least 32 characters in production."
      );
    }
  }

  // Fallback dev secret if unset in development
  const safeSecret =
    secret || "default_development_secret_key_at_least_32_characters_long";
  return new TextEncoder().encode(safeSecret);
}

export interface AdminSessionPayload {
  userId: number;
  username: string;
}

/**
 * Buat sesi admin JWT dan simpan dalam cookie httpOnly.
 */
export async function createSession(payload: AdminSessionPayload): Promise<void> {
  const key = getSecretKey();
  const token = await new SignJWT({
    userId: payload.userId,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Baca dan verifikasi sesi admin dari cookie.
 */
export async function getSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (typeof payload.userId === "number" && typeof payload.username === "string") {
      return {
        userId: payload.userId,
        username: payload.username,
      };
    }
    return null;
  } catch {
    // Token tidak valid atau kedaluwarsa
    return null;
  }
}

/**
 * Hapus cookie sesi admin (logout).
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
