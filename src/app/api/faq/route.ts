import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let result;
    const sessionExists = req.headers.get('cookie')?.valueOf();
    
    // Get the search parameters from the request URL
    const searchParams = new URL(req.url).searchParams;
    const statusParam = searchParams.get('status')?.toLowerCase();

    // Determine query based on session and status parameter
    if (statusParam === 'all' && sessionExists) {
      result = await prisma.qna.findMany({
        orderBy: {
          position: 'asc'
        }
      }); // Access all when session exists
    } else {
      result = await prisma.qna.findMany({
        where: {
          status: "verified"
        },
        select: {
          question: true,
          answer: true,
          position: true
        },
        orderBy: {
          position: 'asc'
        }
      }); 
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
