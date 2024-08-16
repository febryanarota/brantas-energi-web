import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const maxDuration = 60;

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verified = await prisma.home.findFirst({
    where: {
      status: "verified",
    },
  });

  const pending = await prisma.home.findFirst({
    where: {
      status: "updatePending",
    },
  });

  if (pending?.logo) {
    const deleteImage = path.join(
      process.cwd(),
      "public",
      pending.logo,
    );
    if (fs.existsSync(deleteImage)) {
      fs.unlinkSync(deleteImage);
    } else {
      console.warn("File not found:", deleteImage);
    }
  }

  const update = await prisma.home.updateMany({
    where: {
      status: "updatePending",
    },
    data: {
      name: verified?.name,
      address: verified?.address,
      phone: verified?.phone,
      email: verified?.email,
      youtube: verified?.youtube,
      facebook: verified?.facebook,
      instagram: verified?.instagram,
      twitter: verified?.twitter,
      linkedin: verified?.linkedin,
      logo: verified?.logo,
    },
  });

  if (!update) {
    return NextResponse.json(
      { error: "Error deleting request section 1" },
      { status: 500 },
    );
  }
  return NextResponse.json(update);
}
