/**
 * Persistent upload helper using Vercel Blob API (/api/uploads)
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || "File upload failed. Please try again."
    );
  }

  if (!data.url) {
    throw new Error("File upload failed. Storage did not return a valid URL.");
  }

  return data.url;
}
