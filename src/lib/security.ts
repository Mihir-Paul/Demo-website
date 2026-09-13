import bcrypt from "bcryptjs";
import { cryptoNativeRandomString } from "./utils";

/**
 * Hashes a numeric or string PIN securely using bcrypt.
 */
export async function hashPin(pin: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}

/**
 * Verifies an entered PIN against a stored bcrypt hash.
 */
export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return bcrypt.compare(pin, pinHash);
}

/**
 * Generates a clean, URL-friendly unique slug for gifts.
 */
export function generateSlug(recipientName?: string): string {
  const cleanName = recipientName
    ? recipientName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 15)
    : "surprise";

  const randomSuffix = cryptoNativeRandomString(8);
  return `${cleanName}-${randomSuffix}`;
}
