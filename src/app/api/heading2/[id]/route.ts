import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.heading2.findFirst({
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

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = parseInt(context.params.id, 10);

    const result = await prisma.heading2.delete({
      where: {
        id: id,
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {
    const id = parseInt(context.params.id, 10);
    const result = await prisma.heading2.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    if (role !== "admin") {
      const res = await prisma.contentBlock.update({
        where: {
          id: body.blockId,
        },
        data: {
          status: "updatePending",
        },
      });

      if (!res) {
        return NextResponse.json(
          { error: "Failed to update content block status" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
