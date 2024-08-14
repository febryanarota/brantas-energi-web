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

  const file: File = body.get("file") as File;
  const alt = body.get("alt") as string;


  // create image folder if not existed
  const imagesDir = path.join(process.cwd(), "public/imageBlock");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }


  // Generate a unique filename
  const extension = file.name.split(".").pop();
  const fileName = `${shortUUID.generate()}.${extension}`; 
  const filePath = path.join(imagesDir, fileName); 

  // save the image to the local 
  const blob = await file.arrayBuffer(); 
  const buffer = Buffer.from(blob); 
  fs.writeFileSync(filePath, buffer); 

  // Save the file path to the database (relative to the public folder)
  const relativeFilePath = `/imageBlock/${fileName}`;

  try {
    const result = await prisma.image.create({
      data: {
        image: relativeFilePath,
        alt: alt,
        mime: file.type,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 },
    );
  }
}
