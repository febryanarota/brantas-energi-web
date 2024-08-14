import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import shortUUID from "short-uuid";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.image.findFirst({
      where: {
        id: id,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.image.delete({
      where: {
        id: id,
      },
    });

    if (result) {
      // delete the file
      const filePath = path.join(process.cwd(), "public", result.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn("File not found:", filePath);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error," },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;
  const body = await req.formData();
  const blockId = parseInt(body.get("blockId") as string, 10);
  const file = body.get("file") as File;

  try {
    const id = parseInt(context.params.id, 10);
    const oldImage = await prisma.image.findFirst({
      where: {
        id: id,
      },
    });

    if (!oldImage) {
      return NextResponse.json({ error: "deleted file not found" });
    }

    // remove the old image
    const oldPath = path.join(process.cwd(), "public", oldImage.image);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    } else {
      console.warn("File not found:", oldPath);
    }

    // save the new image
    const imagesDir = path.join(process.cwd(), "public/imageBlock");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const fileName = `${shortUUID.generate()}.${file.type.split("/")[1]}`;
    const filePath = path.join(imagesDir, fileName);

    // save the image to the local 
    const blob = await file.arrayBuffer(); 
    const buffer = Buffer.from(blob); 
    fs.writeFileSync(filePath, buffer); 

    const relativeFilePath = `/imageBlock/${fileName}`;

    const result = await prisma.image.update({
      where: {
        id: id,
      },
      data: {
        image: relativeFilePath,
        alt: body.get("alt") as string,
      },
    });


    if (role !== "admin") {
      const res = await prisma.contentBlock.update({
        where: {
          id: blockId,
        },
        data: {
          status: "updatePending",
        },
      });

      if (!res) {
        return NextResponse.json(
          { error: "Failed to update content block status" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
