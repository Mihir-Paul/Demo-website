import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/gifts/[id]/publish
 * Transition gift status from DRAFT to PUBLISHED and return share URL
 */
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const gift = await prisma.gift.findUnique({
      where: { id },
    });

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    const updatedGift = await prisma.gift.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    return NextResponse.json({
      message: "Gift published successfully!",
      gift: {
        id: updatedGift.id,
        slug: updatedGift.slug,
        status: updatedGift.status,
        shareUrl: `/g/${updatedGift.slug}`,
      },
    });
  } catch (error) {
    console.error(`[POST /api/gifts/${params.id}/publish Error]:`, error);
    return NextResponse.json(
      { error: "Internal server error while publishing gift" },
      { status: 500 }
    );
  }
}
