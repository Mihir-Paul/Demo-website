import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPin } from "@/lib/security";
import { CreateGiftSchema } from "@/types/gift";

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
  try {
    const { id } = params;

    const gift = await prisma.gift.findUnique({
      where: { id },
      include: {
        photos: { orderBy: { order: "asc" } },
        wishes: { orderBy: { order: "asc" } },
      },
    });

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    // Do not return actual pinHash to client
    const { pinHash, ...safeGift } = gift;

    return NextResponse.json({
      gift: {
        ...safeGift,
        hasPin: Boolean(pinHash),
      },
    });
  } catch (error) {
    console.error(`[GET /api/gifts/${params.id} Error]:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching gift" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/gifts/[id]
 * Update an existing gift draft
 */
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await req.json();

    const existingGift = await prisma.gift.findUnique({
      where: { id },
    });

    if (!existingGift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    const validation = CreateGiftSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { recipientName, message, letter, theme, pin, photos, wishes } =
      validation.data;

    let pinHash = existingGift.pinHash;
    if (pin !== undefined) {
      pinHash = pin ? await hashPin(pin) : null;
    }

    // Transaction to update gift and replace photos/wishes if provided
    const updatedGift = await prisma.$transaction(async (tx) => {
      if (photos) {
        await tx.photo.deleteMany({ where: { giftId: id } });
      }
      if (wishes) {
        await tx.wish.deleteMany({ where: { giftId: id } });
      }

      return tx.gift.update({
        where: { id },
        data: {
          ...(recipientName && { recipientName }),
          ...(message && { message }),
          ...(letter !== undefined && { letter }),
          ...(theme && { theme }),
          pinHash,
          photos: photos?.length
            ? {
                create: photos.map((p, idx) => ({
                  url: p.url,
                  caption: p.caption || null,
                  order: p.order ?? idx,
                })),
              }
            : undefined,
          wishes: wishes?.length
            ? {
                create: wishes.map((w, idx) => ({
                  text: w.text,
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
    });

    const { pinHash: _, ...safeGift } = updatedGift;

    return NextResponse.json({
      message: "Gift updated successfully",
      gift: {
        ...safeGift,
        hasPin: Boolean(updatedGift.pinHash),
      },
    });
  } catch (error) {
    console.error(`[PUT /api/gifts/${params.id} Error]:`, error);
    return NextResponse.json(
      { error: "Internal server error while updating gift" },
      { status: 500 }
    );
  }
}
