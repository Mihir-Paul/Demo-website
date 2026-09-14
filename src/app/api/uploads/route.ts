import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

/**
 * POST /api/uploads
 * Uploads a file (photo or music) to Vercel Blob persistent storage.
 * Uses Vercel Blob OIDC / automatic environment authentication on Vercel.
 * Falls back to local disk storage in local dev if Vercel Blob is unconfigured/fails.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload." },
        { status: 400 }
      );
    }

    // Validate type: images or audio
    const isImage = file.type.startsWith("image/");
    const isAudio =
      file.type.startsWith("audio/") ||
      file.type.startsWith("video/mp4") ||
      file.type.startsWith("video/ogg") ||
      /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload an image or audio file." },
        { status: 400 }
      );
    }

    // Size limit: 10MB for photos, 35MB for audio
    const maxSizeBytes = isAudio ? 35 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const limitMb = isAudio ? 35 : 10;
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${limitMb}MB.` },
        { status: 400 }
      );
    }

    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Try Vercel Blob put() directly (uses Vercel OIDC or BLOB_READ_WRITE_TOKEN natively)
    try {
      const options: { access: "public"; addRandomSuffix: boolean; token?: string } = {
        access: "public",
        addRandomSuffix: true,
      };

      // Only supply token if explicitly configured in env (e.g. manual token override)
      if (
        process.env.BLOB_READ_WRITE_TOKEN &&
        process.env.BLOB_READ_WRITE_TOKEN.trim().length > 0 &&
        !process.env.BLOB_READ_WRITE_TOKEN.includes("example")
      ) {
        options.token = process.env.BLOB_READ_WRITE_TOKEN.trim();
      }

      const blob = await put(`surprises/${sanitizedFilename}`, file, options);

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      });
    } catch (blobError: any) {
      const isVercel = Boolean(
        process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === "production"
      );

      // On Vercel (production), fail immediately and return the exact Vercel Blob / OIDC error message
      if (isVercel) {
        console.error("[POST /api/uploads Vercel Blob Error]:", blobError);
        return NextResponse.json(
          { error: blobError?.message || "Vercel Blob upload failed." },
          { status: 500 }
        );
      }

      // Local development fallback: Save to public/uploads directory on local disk
      console.warn(
        "[POST /api/uploads Local Dev Fallback]: Vercel Blob unconfigured locally, saving to local disk.",
        blobError?.message
      );
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const localFilename = `${Date.now()}_${sanitizedFilename}`;
      const filePath = path.join(uploadsDir, localFilename);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/uploads/${localFilename}`,
        filename: file.name,
        contentType: file.type || (isAudio ? "audio/mpeg" : "image/jpeg"),
        isDevFallback: true,
      });
    }
  } catch (error: any) {
    console.error("[POST /api/uploads Error]:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}

