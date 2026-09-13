import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug, hashPin } from "@/lib/security";
import { CreateGiftSchema } from "@/types/gift";

/**
 * GET /api/gifts?slug=xyz
 * Fetch gift details by public slug for recipient view
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug query parameter is required" },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.findUnique({
      where: { slug },
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
    console.error("[GET /api/gifts Error]:", error);
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
 * POST /api/gifts
 * Create a new gift draft
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = CreateGiftSchema.safeParse(body);

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

    const slug = generateSlug(recipientName);
    const pinHash = pin ? await hashPin(pin) : null;

    const gift = await prisma.gift.create({
      data: {
        slug,
        recipientName,
        message,
        letter: letter || null,
        theme: theme || "sunset-glow",
        pinHash,
        status: "DRAFT",
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
        photos: true,
        wishes: true,
      },
    });

    return NextResponse.json(
      {
        message: "Gift draft created successfully",
        gift: {
          id: gift.id,
          slug: gift.slug,
          recipientName: gift.recipientName,
          status: gift.status,
          theme: gift.theme,
          hasPin: Boolean(gift.pinHash),
          createdAt: gift.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/gifts Error]:", error);
    return NextResponse.json(
      {
        error: "Internal server error while creating gift draft",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
