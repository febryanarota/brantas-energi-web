import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const result = await prisma.page.findFirst({
      where: {
        id: context.params.id,
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

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const body = await req.json();
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await prisma.page.update({
      where: {
        id: context.params.id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating data:", error);
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
  const body = await req.json();
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the current positions
    const currentData = await prisma.page.findUnique({
      where: {
        id: context.params.id,
      },
      select: {
        positions: true,
      },
    });

    if (!currentData) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Concatenate the current positions with the new ones
    const newPositions = [...currentData.positions, ...body.positions];

    // Update the page with the new positions array
    const result = await prisma.page.update({
      where: {
        id: context.params.id,
      },
      data: {
        positions: newPositions,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
