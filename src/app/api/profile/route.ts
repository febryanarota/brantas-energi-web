import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sessionExists = req.headers.get('cookie')?.valueOf();
    
    if (!sessionExists) {
        return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
        );
    }
    
    try {
        const result = await prisma.profile.findMany();
        return NextResponse.json(result);

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}

// export async function PATCH(req: NextRequest) {
//   const sessionExists = req.headers.get('cookie')?.valueOf();
//   const body = await req.json();

//   if (!sessionExists) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   try {
//     const result = await prisma.qna.update({
//       where: {
//         id: body.id
//       },
//       data: {
//         status: body.status
//       }
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   const sessionExists = req.headers.get('cookie')?.valueOf();
//   const body = await req.json();

//   if (!sessionExists) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   try {
//     const result = await prisma.qna.delete({
//       where: {
//         id: body.id
//       }
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error deleting data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }