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
    const result = await prisma.file.findMany();
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

  const isFile = body.get("isFile");

  if (isFile === "true") {
    const uuid = shortUUID.generate();
    const file: File = body.get("file") as File;
    const display = body.get("display");
    const fileExtension = file.name.split(".").pop();

    try {
      const fileUpload = await storage.file.upload(
        `/public/${uuid}.${fileExtension}`,
        file,
      );
      if (!fileUpload) {
        return NextResponse.json(
          { error: "Error file upload" },
          { status: 500 },
        );
      }

      const result = await prisma.file.create({
        data: {
          link: `/public/${uuid}.${fileExtension}`,
          display: display as string,
          isFile: true,
        },
      });

      if (!result) {
        await storage.file.delete(`/public/${uuid}.${fileExtension}`);
        return NextResponse.json(
          { error: "Error saving file" },
          { status: 500 },
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Error uploading file" },
        { status: 500 },
      );
    }
  } else {
    try {
      const display = body.get("display");
      const link = body.get("link");
      const result = await prisma.file.create({
        data: {
          link: link as string,
          display: display as string,
          isFile: false,
        },
      });

      if (!result) {
        return NextResponse.json(
          { error: "Error saving file" },
          { status: 500 },
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Error uploading link file" },
        { status: 500 },
      );
    }
  }
}
