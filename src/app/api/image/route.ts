import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function GET(req: NextRequest) {
  const sessionExists = req.cookies.get("session");
  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await prisma.image.findMany();
    return NextResponse.json(result);
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

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const uuid = shortUUID.generate();

  const file: File = body.get("file") as File;
  const alt = body.get("alt");
  const fileExtension = file.name.split(".").pop();

  try {
    const image = await storage.image.upload(
      `/public/${uuid}.${fileExtension}`,
      file,
    );
    if (!image) {
      return NextResponse.json(
        { error: "Error uploading image" },
        { status: 500 },
      );
    }

    const result = await prisma.image.create({
      data: {
        shadowId: `/public/${uuid}.${fileExtension}`,
        alt: alt as string,
      },
    });

    if (!result) {
      await storage.image.delete(`/public/${uuid}.${fileExtension}`);
      return NextResponse.json(
        { error: "Error saving image" },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 },
    );
  }
}
