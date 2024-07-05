import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    // Get the id from the URL and convert it to a number
    const id = parseInt(context.params.id, 10);

    const result = await prisma.contentBlock.findFirst({
      where: {
        id: id,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.contentBlock.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
