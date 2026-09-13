import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly with clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random alphanumeric string for slugs or IDs.
 */
export function cryptoNativeRandomString(length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Formats a date cleanly for presentation.
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Safely fetches an API endpoint and parses JSON, with robust Content-Type checking
 * to prevent "Unexpected token '<'" syntax errors if a non-JSON response is returned.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error(
      `[API Error] Non-JSON Content-Type "${contentType}" from ${url} (${res.status}):`,
      text.slice(0, 500)
    );
    throw new Error(
      `Server request failed (${res.status}). Please check network/server logs.`
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error || data.message || `Request failed with status ${res.status}`
    );
  }

  return data;
}
