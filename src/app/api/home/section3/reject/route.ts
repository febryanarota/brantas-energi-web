import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { subtractArrays } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {
    // get both verified and pending data
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

    // remove = pending cards - verified cards
    const removeCard = subtractArrays(
      pending?.cards as number[],
      verified?.cards as number[],
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
    });

    // delete the cards instance
    await prisma.card.deleteMany({
      where: {
        id: {
          in: removeCard,
        },
      },
    });

    // update the pending data = verified data
    const result = await prisma.home.updateMany({
      where: {
        status: "updatePending",
      },
      data: {
        heading3: verified?.heading3,
        subheading3: verified?.subheading3,
        cards: verified?.cards,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error accepting data" },
      { status: 500 },
    );
  }
}
