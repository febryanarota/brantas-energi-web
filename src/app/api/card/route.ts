import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function GET(req: NextRequest) {
  try {
    const response = await prisma.card.findMany();
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;
  const body = await req.formData();
  const uuid = shortUUID.generate();

  const file: File = body.get("image") as File;
  const fileExtension = file.name.split(".").pop();
  const title = body.get("title") as string;
  const link = body.get("link") as string;
  const description = body.get("description") as string;

  const imagePath = `/public/${uuid}.${fileExtension}`;

  try {
    // store the image
    const image = await storage.image.upload(imagePath, file);

    if (!image) {
      throw new Error("Image upload failed");
    }

    // create the card
    const response = await prisma.card.create({
      data: {
        title: title,
        description: description,
        link: link,
        image: imagePath,
      },
    });

    // store the id in home based on role, admin or user
    const id = response.id;
    const editStatus: "verified" | "updatePending" =
      role === "admin" ? "verified" : "updatePending";

    // Fetch the existing cards array
    const home = await prisma.home.findFirst({
      where: { status: editStatus },
    });

    if (!home) {
      throw new Error("Home entry not found");
    }

    const updatedCards = [...home.cards, id];
    const idResponse = await prisma.home.updateMany({
      where: {
        status: editStatus,
      },
      data: {
        cards: updatedCards,
      },
    });

    return NextResponse.json({ message: "Card created and appended successfully", data: idResponse }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
