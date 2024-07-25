import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const id = context.params.id;
  const fileImage = await prisma.fileImage.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!fileImage) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(fileImage);
}
