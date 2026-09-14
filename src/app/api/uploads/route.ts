import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

/**
 * POST /api/uploads
 * Uploads a file (photo or music) to Vercel Blob persistent storage.
 * Falls back to Data URL encoding in local dev if BLOB_READ_WRITE_TOKEN is not configured.
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

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const isTokenConfigured =
      token &&
      token.trim().length > 0 &&
      !token.includes("vercel_blob_rw_token_example");

    const isVercelProduction = Boolean(
      process.env.VERCEL || process.env.VERCEL_ENV || process.env.NODE_ENV === "production"
    );

    if (isTokenConfigured) {
      // Persistent Vercel Blob Storage Path
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blob = await put(`surprises/${sanitizedFilename}`, file, {
        access: "public",
        addRandomSuffix: true,
        token: token.trim(),
      });

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      });
    } else if (isVercelProduction) {
      // In Vercel serverless production environment, return an explicit error
      // instead of attempting to write to the read-only filesystem!
      console.error("[POST /api/uploads Error]: BLOB_READ_WRITE_TOKEN environment variable is missing in Vercel project settings.");
      return NextResponse.json(
        {
          error: "Vercel Blob Storage token (BLOB_READ_WRITE_TOKEN) is not configured in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    } else {
      // Local development fallback: Save to public/uploads directory on local disk
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const sanitizedFilename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = path.join(uploadsDir, sanitizedFilename);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/uploads/${sanitizedFilename}`,
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
