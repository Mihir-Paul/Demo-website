import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPin } from "@/lib/security";
import { UnlockGiftSchema } from "@/types/gift";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/gifts/[id]/unlock
 * Verify PIN for protected gift
 */
export async function POST(req: Request, { params }: RouteParams) {
  const giftId = params?.id;
  try {
    if (!giftId) {
      return NextResponse.json({ error: "Gift ID parameter is required" }, { status: 400 });
    }
    const body = await req.json();

    const validation = UnlockGiftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "PIN is required" },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      select: {
        id: true,
        pinHash: true,
      },
    });

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }

    if (!gift.pinHash) {
      return NextResponse.json(
        { message: "Gift is not PIN protected", unlocked: true },
        { status: 200 }
      );
    }

    const isValid = await verifyPin(validation.data.pin, gift.pinHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect PIN", unlocked: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "PIN verified successfully",
      unlocked: true,
    });
  } catch (error: any) {
    console.error(`[POST /api/gifts/${giftId || "unknown"}/unlock Error]:`, error);
    return NextResponse.json(
      { error: "Internal server error while unlocking gift" },
      { status: 500 }
    );
  }
}
