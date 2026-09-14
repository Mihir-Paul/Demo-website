import { upload } from "@vercel/blob/client";

/**
 * Persistent upload helper using Vercel Blob API.
 * Uploads directly from browser to Vercel Blob storage using Vercel Blob OIDC.
 * Falls back to /api/uploads FormData upload for local dev or fallback.
 * ALWAYS returns a permanent HTTPS Blob URL and NEVER a temporary blob: URL.
 */
export async function uploadFile(file: File): Promise<string> {
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  // 1. Attempt Vercel Blob direct client upload (browser -> Vercel Blob storage)
  try {
    const blob = await upload(`surprises/${sanitizedFilename}`, file, {
      access: "public",
      handleUploadUrl: "/api/uploads",
    });

    if (blob && blob.url && !blob.url.startsWith("blob:")) {
      console.log("[uploadFile Direct Vercel Blob Success]:", blob.url);
      return blob.url;
    }
  } catch (clientUploadErr: any) {
    console.warn(
      "[uploadFile Direct Client Upload Failed, trying FormData API fallback]:",
      clientUploadErr?.message || clientUploadErr
    );
  }

  // 2. Fallback to multipart/form-data upload via /api/uploads route
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "File upload failed. Please try again.");
  }

  if (!data.url || typeof data.url !== "string" || data.url.startsWith("blob:")) {
    throw new Error("File upload failed. Storage returned an invalid or temporary blob URL.");
  }

  return data.url;
}
