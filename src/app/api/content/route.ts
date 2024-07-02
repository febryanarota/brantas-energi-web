import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { blockType, status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  // Get the search parameters from the request URL
  const searchParams = new URL(req.url).searchParams;
  const pageParam = searchParams.get("page")?.toLowerCase();
  const statusParam = searchParams.get("status")?.toLowerCase();

  try {
    let query: {
      page?: string;
      status?: status; 
    } = {};

    if (pageParam) {
      query.page = pageParam;
    }

    let result;

    if (statusParam === "all" && sessionExists) {
      result = await prisma.contentBlock.findMany({
        where: query,
        orderBy: {
          position: "asc",
        },
      }); // Access all when session exists
    } else if (statusParam === "all" && !sessionExists) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      query.status = "verified" as status; 
      result = await prisma.contentBlock.findMany({
        where: query,
        orderBy: {
          position: "asc",
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const payload = await decrypt(sessionExists.value);
    const postStatus = payload.role === "admin" ? "verified" : "createPending";

    const result = await prisma.contentBlock.create({
      data: {
        page: body.page,
        blockType: body.blockType as blockType,
        status: postStatus as status,
        position: body.position,
        faqId: body.faqId,
        textId: body.textId,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}