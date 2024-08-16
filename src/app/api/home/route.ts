import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let verified = await prisma.home.findFirst({
      where: {
        status: "verified",
      },
    });

    if (!verified) {
      verified = await prisma.home.create({
        data: {
          status: "verified",
        },
      });
    }


    let pending = await prisma.home.findFirst({
      where: {
        status: "updatePending",
      },
    });

    if (!pending) {
      pending = await prisma.home.create({
        data: {
          status: "updatePending",
        },
      });
    }

    const response = NextResponse.json({ verified, pending });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    const response = NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
    response.headers.set("Content-Type", "application/json");
    return response;
  }
}
