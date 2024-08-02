import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

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

  let path = "public/logo/" + (pending?.logo as string).split("/").pop();
  await storage.image.delete(path).catch((error) => {
    console.error("Error deleting image:", error);
    throw new Error("Error deleting image");
  });

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
