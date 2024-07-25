import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { subtractArrays } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // accept the request
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const verified = await prisma.home.findFirst({
      where: {
        status: "verified",
      },
    });

    const pending = await prisma.home.findFirst({
      where: {
        status: "updatePending",
      },
    });

    // remove = verified cards - pending cards
    const removeCard = subtractArrays(
      verified?.cards as number[],
      pending?.cards as number[],
    );

    // remove the image cards in storage
    removeCard.map(async (card) => {
      let deleteCard = await prisma.card.findFirst({
        where: {
          id: card,
        },
      });

      let path =
        "public/card/" + (deleteCard?.image as string).split("/").pop();
      storage.image.delete(path).catch((error) => {
        console.error("Error deleting image:", error);
        throw new Error("Error deleting image");
      });
      // delete the cards instance
      await prisma.card.delete({
        where: {
          id: card,
        },
      });
    });

    // update the verified data = pending data
    const result = await prisma.home.updateMany({
      where: {
        status: "verified",
      },
      data: {
        heading3: pending?.heading3,
        subheading3: pending?.subheading3,
        cards: pending?.cards,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating section 1" },
      { status: 500 },
    );
  }
}
