import prisma from "@/lib/prisma";
import { subtractArrays } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

      if (deleteCard?.image) {
        let deleteImage = path.join(process.cwd(), "public", deleteCard?.image);
        if (fs.existsSync(deleteImage)) {
          fs.unlinkSync(deleteImage);
        } else {
          console.warn("File not found:", deleteImage);
        }
      }
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
