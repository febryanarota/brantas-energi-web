import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const sessionExists = req.headers.get("cookie")?.valueOf();

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the id from the URL and convert it to a number
    const id = parseInt(context.params.id, 10);

    const result = await prisma.qna.findFirst({
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

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const sessionExists = req.headers.get("cookie")?.valueOf();
  const body = await req.json();

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(context.params.id, 10);
    const result = await prisma.qna.update({
      where: {
        id: id,
      },
      data: {
        question: body.question,
        answer: body.answer,
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
