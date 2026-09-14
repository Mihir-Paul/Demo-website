import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPin } from "@/lib/security";
import { CreateGiftSchema, UpdateGiftSchema } from "@/types/gift";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/gifts/[id]
 * Fetch gift details by ID for builder / preview
 */
export async function GET(req: Request, { params }: RouteParams) {
  const giftId = params?.id;
  try {
    if (!giftId) {
      return NextResponse.json({ error: "Gift ID parameter is required" }, { status: 400 });
    }

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      include: {
        photos: { orderBy: { order: "asc" } },
        wishes: { orderBy: { order: "asc" } },
      },
    });

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    const { pinHash, ...safeGift } = gift;

    return NextResponse.json({
      gift: {
        ...safeGift,
        hasPin: Boolean(pinHash),
      },
    });
  } catch (error: any) {
    console.error(`[GET /api/gifts/${giftId || "unknown"} Error]:`, error);
    return NextResponse.json(
      {
        error: "Internal server error while fetching gift",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/gifts/[id]
 * Update an existing gift draft
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const giftId = params?.id;
  try {
    if (!giftId) {
      return NextResponse.json({ error: "Gift ID parameter is required" }, { status: 400 });
    }
    const body = await req.json();
    console.log("[PUT /api/gifts/[id]] Request body:", JSON.stringify(body, null, 2));

    const existingGift = await prisma.gift.findUnique({
      where: { id: giftId },
    });

    if (!existingGift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    const validation = UpdateGiftSchema.safeParse(body);
    if (!validation.success) {
      console.error("[PUT /api/gifts/[id]] Validation failed:", validation.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { recipientName, message, letter, theme, pin, pinHint, musicUrl, musicName, photos, wishes } =
      validation.data;

    let pinHash = existingGift.pinHash;
    if (pin !== undefined) {
      pinHash = pin ? await hashPin(pin) : null;
    }

    // Filter valid non-empty wishes and photos
    const validWishes = wishes
      ? wishes
          .map((w: any) => (typeof w === "string" ? { text: w } : w))
          .filter((w: any) => w && typeof w.text === "string" && w.text.trim().length > 0)
      : [];
    const validPhotos = photos?.filter((p) => p.url && p.url.trim().length > 0) || [];

    // Transaction to update gift and replace photos/wishes if provided
    const updatedGift = await prisma.$transaction(async (tx) => {
      if (photos !== undefined) {
        await tx.photo.deleteMany({ where: { giftId: giftId } });
      }
      if (wishes !== undefined) {
        await tx.wish.deleteMany({ where: { giftId: giftId } });
      }

      return tx.gift.update({
        where: { id: giftId },
        data: {
          ...(recipientName !== undefined && { recipientName }),
          ...(message !== undefined && { message }),
          ...(letter !== undefined && { letter }),
          ...(theme !== undefined && { theme }),
          ...(pin !== undefined && { pinHash }),
          ...(pinHint !== undefined && { pinHint }),
          ...(musicUrl !== undefined && { musicUrl }),
          ...(musicName !== undefined && { musicName }),
          photos: validPhotos.length
            ? {
                create: validPhotos.map((p, idx) => ({
                  url: p.url.trim(),
                  caption: p.caption ? p.caption.trim() : null,
                  order: p.order ?? idx,
                })),
              }
            : undefined,
          wishes: validWishes.length
            ? {
                create: validWishes.map((w, idx) => ({
                  text: w.text.trim(),
                  order: w.order ?? idx,
                })),
              }
            : undefined,
        },
        include: {
          photos: { orderBy: { order: "asc" } },
          wishes: { orderBy: { order: "asc" } },
        },
      });
    }, {
      maxWait: 10000,
      timeout: 30000,
    });

    const { pinHash: _, ...safeGift } = updatedGift;

    return NextResponse.json({
      message: "Gift updated successfully",
      gift: {
        ...safeGift,
        hasPin: Boolean(updatedGift.pinHash),
      },
    });
  } catch (error: any) {
    console.error(`================ [PUT /api/gifts/${giftId || "unknown"} FAILED] ================`);
    console.error("GIFT ID:", giftId);
    console.error("ERROR NAME:", error?.name);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("PRISMA CODE:", error?.code);
    console.error("PRISMA META:", error?.meta);
    console.error("ERROR STACK:", error?.stack);
    console.error("========================================================================");
    return NextResponse.json(
      {
        error: "Internal server error while updating gift",
        details: error?.message || String(error),
        code: error?.code,
        meta: error?.meta,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}
