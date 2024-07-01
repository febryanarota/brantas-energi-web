import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionExists = req.headers.get('cookie')?.valueOf();

  // Get the search parameters from the request URL
  const searchParams = new URL(req.url).searchParams;
  const statusParam = searchParams.get('status')?.toLowerCase();
  
  try {
    let result;
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

export async function PATCH(req: NextRequest) {
  const sessionExists = req.headers.get('cookie')?.valueOf();
  const body = await req.json();

  if (!sessionExists) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.qna.update({
      where: {
        id: body.id
      },
      data: {
        status: body.status
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const sessionExists = req.headers.get('cookie')?.valueOf();
  const body = await req.json();

  if (!sessionExists) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.qna.delete({
      where: {
        id: body.id
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const sessionExists = req.headers.get('cookie')?.valueOf();
  const body = await req.json();

  if (!sessionExists) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.qna.create({
      data: {
        question: body.question,
        answer: body.answer,
        //TO DO: verified if session is admi, else pending
        status: "verified"
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}