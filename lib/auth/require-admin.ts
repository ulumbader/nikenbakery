import { redirect } from "next/navigation";
import { getSession, type AdminSessionPayload } from "./session";

/**
 * Wajibkan sesi admin untuk Server Components dan Server Actions.
 * Mengarahkan ke /admin/login bila tidak terautentikasi.
 */
export async function requireAdmin(): Promise<AdminSessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Wajibkan sesi admin untuk Route Handler (API).
 * Melempar error bila tidak terautentikasi.
 */
export async function requireAdminOrThrow(): Promise<AdminSessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Sesi admin tidak valid atau telah berakhir.");
  }
  return session;
}
