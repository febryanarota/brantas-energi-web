import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {

  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.text.findFirst({
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

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const idCOnver = parseInt(context.params.id, 10);

    const result = await prisma.text.delete({
      where: {
        id: idCOnver,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error," },
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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const id = parseInt(context.params.id, 10);
    const result = await prisma.text.update({
      where: {
        id: id,
      },
      data: {
        content: body.content,
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
