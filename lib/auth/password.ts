import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash password menggunakan bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifikasi password terhadap hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
