import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

/**
 * POST /api/uploads
 * Dual-mode endpoint for Vercel Blob persistent uploads:
 * 1. JSON requests: Authorizes direct browser-to-Vercel-Blob client uploads via OIDC.
 * 2. FormData requests: Handles server-side put() or local dev disk fallback.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  // Mode A: Vercel Blob Client Upload Authorization (application/json)
  if (contentType.includes("application/json")) {
    try {
      const body = (await req.json()) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          return {
            allowedContentTypes: [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
              "audio/mpeg",
              "audio/mp3",
              "audio/wav",
              "audio/x-wav",
              "audio/m4a",
              "audio/x-m4a",
              "audio/ogg",
              "audio/aac",
              "audio/flac",
              "application/octet-stream",
            ],
            maximumSizeInBytes: 50 * 1024 * 1024, // 50MB max limit
            tokenPayload: JSON.stringify({}),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log("[POST /api/uploads Vercel Blob Client Upload Completed]:", blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (handleErr: any) {
      console.error("[POST /api/uploads handleUpload Error]:", handleErr);
      return NextResponse.json(
        { error: handleErr?.message || "Failed to authorize client Blob upload." },
        { status: 400 }
      );
    }
  }

  // Mode B: Multipart Form-Data Upload (FormData fallback)
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload." },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/");
    const isAudio =
      file.type.startsWith("audio/") ||
      file.type.startsWith("video/mp4") ||
      file.type.startsWith("video/ogg") ||
      file.type === "application/octet-stream" ||
      file.type === "" ||
      /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: `Invalid file format (${file.type || "unknown"}). Please upload an image or audio file.` },
        { status: 400 }
      );
    }

    const maxSizeBytes = isAudio ? 35 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const limitMb = isAudio ? 35 : 10;
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${limitMb}MB.` },
        { status: 400 }
      );
    }

    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    try {
      const options: { access: "public"; addRandomSuffix: boolean; token?: string } = {
        access: "public",
        addRandomSuffix: true,
      };

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
