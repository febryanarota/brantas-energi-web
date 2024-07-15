import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.file.findFirst({
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

    const result = await prisma.file.delete({
      where: {
        id: id,
      },
    });

    if (result.isFile) {
      if (result.link) {
        const file = "public/" + result.link.split('/').pop();
        await storage.file.delete(file as string).catch((error) => {
          console.error("Error deleting file:", error);
          throw new Error("Error deleting file");
        })
      } else {
        throw new Error("Link not found");
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
  const fileExtension = file.name.split(".").pop();
  const uuid = shortUUID.generate();


  try {
    const id = parseInt(context.params.id, 10);
    const fileName = await prisma.image.findFirst({
      where: {
        id: id,
      },
    });
    
    const deleteImage = "public/" + fileName?.shadowId.split('/').pop();
    await storage.image.delete(deleteImage).catch((error) => {
      console.error("Error deleting image:", error);
      throw new Error("Error deleting image");
    })

    const result = await prisma.image.update({
      where: {
        id: id,
      },
      data: {
        shadowId : `/public/${uuid}.${fileExtension}`,
        alt: body.get("alt") as string,
      },
    });


    await storage.image.upload(`/public/${uuid}.${fileExtension}`, file).catch((error) => {
      console.error("Error uploading image:", error);
      throw new Error("Error uploading image");
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
