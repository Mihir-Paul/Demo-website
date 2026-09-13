/**
 * Direct browser-to-Cloudinary upload helper
 */
export async function uploadFileToCloudinary(
  file: File,
  giftId?: string,
  options?: { subfolder?: string; resourceType?: "image" | "video" | "auto" }
): Promise<string> {
  const resourceType = options?.resourceType || "auto";
  const subfolder = options?.subfolder;

  // 1. Get signed params from server API
  const sigRes = await fetch("/api/uploads/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ giftId, subfolder }),
  });

  const sigData = await sigRes.json();

  if (!sigRes.ok || !sigData.configured) {
    throw new Error(
      sigData.details ||
        sigData.error ||
        "Cloudinary configuration missing on server."
    );
  }

  // 2. Prepare FormData for direct Cloudinary upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sigData.apiKey);
  formData.append("timestamp", sigData.timestamp.toString());
  formData.append("signature", sigData.signature);
  formData.append("folder", sigData.folder);

  // 3. Upload directly to Cloudinary (using auto resource type for images and audio/video)
  const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${resourceType}/upload`;

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const uploadData = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(
      uploadData.error?.message || "Failed to upload media file to Cloudinary"
    );
  }

  return uploadData.secure_url;
}
