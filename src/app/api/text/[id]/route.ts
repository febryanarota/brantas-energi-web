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

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } },
// ) {
//   const sessionExists = req.headers.get("cookie")?.valueOf();
//   const body = await req.json();

//   if (!sessionExists) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const id = parseInt(context.params.id, 10);
//     console.log(id);
//     const result = await prisma.qna.update({
//       where: {
//         id: id,
//       },
//       data: {
//         question: body.question,
//         answer: body.answer,
//       },
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
