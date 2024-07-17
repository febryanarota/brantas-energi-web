import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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
    return NextResponse.json({
        verified,
        pending,
    });
    
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
