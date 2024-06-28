import prisma from "@/lib/prisma";
import { blockType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const sessionExists = req.headers.get('cookie')?.valueOf();

  if (!sessionExists) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Get the search parameters from the request URL
  const searchParams = new URL(req.url).searchParams;
  const blockTypeParam = searchParams.get('blockType');
  console.log(blockTypeParam);
  // Check if blockTypeParam is a valid blockType enum value


  try {
    let result;
    // Determine query based on session and status parameter
    if (blockTypeParam) {
      result = await prisma.contentBlock.findMany({
        where: {
          blockType: blockTypeParam as blockType
        },
        orderBy: {
          position: 'asc'
        }
      }); // Access all when session exists
    } else {
      result = await prisma.contentBlock.findMany({
        orderBy: {
          position: 'asc'
        }
      }); // Access all when session exists
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
