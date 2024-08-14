import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

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
        const filePath = path.join(process.cwd(), "public", result.link);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn("File not found:", filePath);
        }
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
  const display = body.get("display") as string;
  const newIsFile =
    body.get("isFile")?.toString().toLowerCase() === "true" ? true : false;

  try {
    const id = parseInt(context.params.id, 10);
    const fileTarget = await prisma.file.findFirst({
      where: {
        id: id,
      },
    });

    const oldIsFile = fileTarget?.isFile;

    if (oldIsFile) {
      // remove the file in storage
      if (fileTarget.link) {
        const filePath = path.join(process.cwd(), "public", fileTarget.link);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn("File not found:", filePath);
        }
      }
    }

    let link;
    if (newIsFile) {
      const file = body.get("file") as File;

      // create image folder if not existed
      const fileDir = path.join(process.cwd(), "public/fileBlock");
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      // Generate a unique filename
      const fileExtension = file.name.split(".").pop();
      const fileName = `${shortUUID.generate()}.${fileExtension}`;
      const filePath = path.join(fileDir, fileName);

      // save the image to the local
      const blob = await file.arrayBuffer();
      const buffer = Buffer.from(blob);
      fs.writeFileSync(filePath, buffer);

      link = `/fileBlock/${fileName}`;

    } else {
      link = body.get("link") as string;
    }

    const result = await prisma.file.update({
      where: {
        id: id,
      },
      data: {
        link: link,
        display: display,
        isFile: newIsFile,
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

    if (!result) {
      return NextResponse.json(
        { error: "Failed to update file" },
        { status: 500 },
      );
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
