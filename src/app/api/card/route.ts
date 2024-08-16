import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
// import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import shortUUID from "short-uuid";

export const maxDuration = 60;

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

  const imagesDir = path.join(process.cwd(), "public/homeBlock");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const file: File = body.get("image") as File;
  const extension = file.name.split(".").pop();
  const fileName = `${shortUUID.generate()}.${extension}`;
  const filePath = path.join(imagesDir, fileName);
  const title = body.get("title") as string;
  const link = body.get("link") as string;
  const description = body.get("description") as string;

  try {
    // store the image
    const blob = await file.arrayBuffer();
    const buffer = Buffer.from(blob);
    fs.writeFileSync(filePath, buffer);

    // Save the file path to the database (relative to the public folder)
    const relativeFilePath = `/homeBlock/${fileName}`;

    // create the card
    const response = await prisma.card.create({
      data: {
        title: title,
        description: description,
        link: link,
        image: relativeFilePath,
      },
    });

    // store the id in home based on role, admin or user
    const id = response.id;

    // if admin then update both verified and updatePending
    if (role === "admin") {
      const homeAdmin = await prisma.home.findFirst({
        where: { status: "verified" },
      });
      const updateCardsAdmin = [...(homeAdmin?.cards as number[]), id];
      const idResponseAdmin = await prisma.home.updateMany({
        where: {
          status: { in: ["verified", "updatePending"] },
        },
        data: {
          cards: updateCardsAdmin,
        },
      });
      return NextResponse.json(
        {
          message: "Card created and appended successfully",
          data: idResponseAdmin,
        },
        { status: 201 },
      );
    } else {
      const homeUser = await prisma.home.findFirst({
        where: { status: "updatePending" },
      });
      const updateCardsUser = [...(homeUser?.cards as number[]), id];
      const idResponseUser = await prisma.home.updateMany({
        where: {
          status: "updatePending",
        },
        data: {
          cards: updateCardsUser,
        },
      });
      return NextResponse.json(
        {
          message: "Card created and appended successfully",
          data: idResponseUser,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
