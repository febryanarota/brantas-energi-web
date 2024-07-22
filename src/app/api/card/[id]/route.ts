import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import * as path from 'path';

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {
    const id = parseInt(context.params.id, 10);

    if (role === "admin") {
      const result = await prisma.card.delete({
        where: {
          id: id,
        },
      });

      // remove the image cards in storage

      await storage.image.delete(result.image as string).catch((error) => {
        console.error("Error deleting image:", error);
        throw new Error("Error deleting image");
      });

      // remove the id in array of cards in home
      const home = await prisma.home.findFirst({
        where: {
          status: "verified",
        },
      });

      const cards = home?.cards as number[];
      // append the id to the cards array
      const index = cards.indexOf(id);
      if (index > -1) {
        cards.splice(index, 1);
      }

      await prisma.home.updateMany({
        where: {
          status: { in: ["verified", "updatePending"] },
        },
        data: {
          cards: cards,
        },
      });

      return NextResponse.json(result);
    } else {
      const home = await prisma.home.findFirst({
        where: {
          status: "updatePending",
        },
      });

      const cards = home?.cards as number[];
      const index = cards.indexOf(id);
      if (index > -1) {
        cards.splice(index, 1);
      }

      const result = await prisma.home.updateMany({
        where: {
          status: "updatePending",
        },
        data: {
          cards: cards,
        },
      });
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error," },
      { status: 500 },
    );
  }
}
