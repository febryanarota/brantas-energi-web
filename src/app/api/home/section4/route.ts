import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

export const maxDuration = 60;

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }


  const image = body.get("logo") as File;
  const imagesDir = path.join(process.cwd(), "public/homeBlock");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  const extension = image.name.split(".").pop();
  const fileName = `${shortUUID.generate()}.${extension}`;
  const filePath = path.join(imagesDir, fileName);

  const name = body.get("name") as string;
  const address = body.get("address") as string;
  const phone = body.get("phone") as string;
  const email = body.get("email") as string;

  const youtube = body.get("youtube") as string;
  const facebook = body.get("facebook") as string;
  const instagram = body.get("instagram") as string;
  const twitter = body.get("twitter") as string;
  const linkedin = body.get("linkedin") as string;

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {
    if (role === "admin") {
      const currData = await prisma.home.findFirst({
        where: {
          status: "verified",
        },
      });
      if (currData?.logo) {
        const deleteImage = path.join(process.cwd(), "public", currData.logo);
        if (fs.existsSync(deleteImage)) {
          fs.unlinkSync(deleteImage);
        } else {
          console.warn("File not found:", deleteImage);
        }
      }
    }

    const blob = await image.arrayBuffer();
    const buffer = Buffer.from(blob);
    fs.writeFileSync(filePath, buffer);

    const relativeFilePath = `/homeBlock/${fileName}`;

    let result;
    if (role === "admin") {
      result = await prisma.home.updateMany({
        where: {
          status: {
            in: ["verified", "updatePending"],
          },
        },
        data: {
          logo: relativeFilePath,
          name: name,
          address: address,
          email: email,
          phone: phone,
          youtube: youtube,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
          linkedin: linkedin,
        },
      });
    } else {
      result = await prisma.home.updateMany({
        where: {
          status: "updatePending",
        },
        data: {
          logo: relativeFilePath,
          name: name,
          address: address,
          email: email,
          phone: phone,
          youtube: youtube,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
          linkedin: linkedin,
        },
      });
    }

    if (!result) {
      return NextResponse.json(
        { error: "Error updating image" },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating section 1" },
      { status: 500 },
    );
  }
}
