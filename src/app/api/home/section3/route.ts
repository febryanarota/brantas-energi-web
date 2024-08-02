import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function PATCH(req: NextRequest) {
  // handle session
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  const heading = body.get("heading3") as string;
  const subheading = body.get("subheading3") as string;

  if (!heading || !subheading) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // admin -> update both verified and pending
    // user -> update pending
    const updatePending = await prisma.home.updateMany({
      where: {
        status: "updatePending",
      },
      data: {
        heading3: heading,
        subheading3: subheading,
      },
    });

    if (role === "admin") {
      const updateVerified = await prisma.home.updateMany({
        where: {
          status: "verified",
        },
        data: {
          heading3: heading,
          subheading3: subheading,
        },
      });

      return NextResponse.json({ updatePending, updateVerified });
    }

    // return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json(
      { error: "Error acception request section 1" },
      { status: 500 },
    );
  }
}
