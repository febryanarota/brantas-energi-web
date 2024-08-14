import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

export const maxDuration = 60;

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
    const imagesDir = path.join(process.cwd(), "public/fileBlock");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const file: File = body.get("file") as File;
    const display = body.get("display");

    const fileExtension = file.name.split(".").pop();
    const fileName = `${shortUUID.generate()}.${fileExtension}`; 
    const filePath = path.join(imagesDir, fileName); 

    const blob = await file.arrayBuffer(); 
    const buffer = Buffer.from(blob); 
    fs.writeFileSync(filePath, buffer);

    try {
      const result = await prisma.file.create({
        data: {
          link: `/fileBlock/${fileName}`,
          display: display as string,
          isFile: true,
        },
      });

      if (!result) {
        fs.unlinkSync(filePath);
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
