import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const maxDuration = 60;

export async function PUT(req: NextRequest) {
  // handle session
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pending = await prisma.home.findFirst({
      where: {
        status: "updatePending",
      },
    });

    const verified = await prisma.home.findFirst({
      where: {
        status: "verified",
      },
    });

    if (pending?.logo !== verified?.logo) {
      if (verified?.logo) {
        const deleteImage = path.join(
          process.cwd(),
          "public",
          verified.logo,
        );
        if (fs.existsSync(deleteImage)) {
          fs.unlinkSync(deleteImage);
        } else {
          console.warn("File not found:", deleteImage);
        }
      }
    }

    const update = await prisma.home.updateMany({
      where: {
        status: "verified",
      },
      data: {
        name: pending?.name,
        address: pending?.address,
        phone: pending?.phone,
        email: pending?.email,
        youtube: pending?.youtube,
        facebook: pending?.facebook,
        instagram: pending?.instagram,
        twitter: pending?.twitter,
        linkedin: pending?.linkedin,
        logo: pending?.logo,
      },
    });

    if (!update) {
      return NextResponse.json(
        { error: "Error updating image" },
        { status: 500 },
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json(
      { error: "Error acception request section 4" },
      { status: 500 },
    );
  }
}
