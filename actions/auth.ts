"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { first } from "@/db/first";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

// In-memory rate limiting: 5 percobaan gagal per 15 menit per IP+username
type AttemptRecord = {
  count: number;
  firstAttemptAt: number;
};

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit

function cleanupOldAttempts(now: number) {
  for (const [key, record] of loginAttempts.entries()) {
    if (now - record.firstAttemptAt > WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
}

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginState = {
  error?: string;
  fieldErrors?: {
    username?: string[];
    password?: string[];
  };
};

/**
 * Server Action untuk memproses login admin.
 */
export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  const rawUsername = formData.get("username");
  const rawPassword = formData.get("password");

  const validation = loginSchema.safeParse({
    username: rawUsername,
    password: rawPassword,
  });

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      error: "Mohon isi semua data dengan benar.",
    };
  }

  const { username, password } = validation.data;
  const now = Date.now();
  cleanupOldAttempts(now);

  const attemptKey = `${clientIp}_${username.toLowerCase()}`;
  const attempt = loginAttempts.get(attemptKey);

  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    const remainingMinutes = Math.max(
      1,
      Math.ceil((attempt.firstAttemptAt + WINDOW_MS - now) / 60000)
    );
    return {
      error: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`,
    };
  }

  // Cari user di database
  const user = await first(db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1));

  const isPasswordValid = user
    ? await verifyPassword(password, user.passwordHash)
    : false;

  if (!user || !isPasswordValid) {
    // Catat percobaan gagal
    if (!attempt) {
      loginAttempts.set(attemptKey, { count: 1, firstAttemptAt: now });
    } else {
      attempt.count += 1;
    }

    return {
      error: "Username atau password salah.",
    };
  }

  // Berhasil login: reset percobaan gagal
  loginAttempts.delete(attemptKey);

  // Buat sesi JWT dalam cookie httpOnly
  await createSession({
    userId: user.id,
    username: user.username,
  });

  redirect("/admin");
}

/**
 * Server Action untuk logout admin.
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
