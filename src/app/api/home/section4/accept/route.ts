import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

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
      let path = "public/logo/" + (verified?.logo as string).split("/").pop();
      await storage.image.delete(path).catch((error) => {
        console.error("Error deleting image:", error);
        throw new Error("Error deleting image");
      });
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
