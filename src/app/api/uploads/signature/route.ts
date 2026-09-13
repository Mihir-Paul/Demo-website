import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

/**
 * POST /api/uploads/signature
 * Generates signed Cloudinary upload parameters for browser direct upload
 */
export async function POST(req: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error: "Cloudinary credentials not configured",
          configured: false,
          details:
            "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const giftId = body.giftId || "general";
    const subfolder = body.subfolder ? `/${body.subfolder}` : "";
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `birthday-surprises/${giftId}${subfolder}`;

    const paramsToSign = {
      timestamp,
      folder,
    };

    // Generate SHA-256 Cloudinary signature using server-side secret
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      configured: true,
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error: any) {
    console.error("[POST /api/uploads/signature Error]:", error);
    return NextResponse.json(
      { error: "Internal server error while generating upload signature" },
      { status: 500 }
    );
  }
}
