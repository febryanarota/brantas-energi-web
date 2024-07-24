import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function POST(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const length = parseInt(body.get("length") as string);

  let data = [];
  for (let i = 0; i < length; i++) {
    const uuid = shortUUID.generate();
    const title = body.get(`title[${i}]`) as string;
    let link = body.get(`link[${i}]`) ? body.get(`link[${i}]`) as string : null;

    const file = body.get(`file[${i}]`) ?  body.get(`file[${i}]`) as File : null;
    const fileExt = file ? file.name.split(".").pop() : null;

    const image = body.get(`image[${i}]`) as File;
    const imageExt = image.name.split(".").pop();

    const imageUpload = await storage.image.upload(
      `/public/file-image/${uuid}.${imageExt}`,
      image,
    );

    if (!imageUpload) {
      return NextResponse.json(
        { error: "Error image upload" },
        { status: 500 },
      );
    }

    if (file) {
      const fileUpload = await storage.file.upload(
        `/public/file-image/${uuid}.${fileExt}`,
        file,
      );

      if (!fileUpload) {
        return NextResponse.json(
          { error: "Error file upload" },
          { status: 500 },
        );
      }

      link = `public/file-image/${uuid}.${fileExt}`;
    }

    const response = await prisma.fileImage.create({
      data: {
        title: title,
        link: link || undefined,
        image: `public/file-image/${uuid}.${imageExt}`,
      },
    });

    if (!response) {
      await storage.file.delete(`/public/file-image/${uuid}.${imageExt}`);
      return NextResponse.json(
        { error: "Error saving file" },
        { status: 500 },
      );
    }

    data.push(response.id);
  }

  return NextResponse.json(data);
}
