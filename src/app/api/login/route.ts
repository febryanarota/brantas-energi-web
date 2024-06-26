import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers"; // next/headers provides cookie handling in API routes
import { encrypt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  try {
    const user = await prisma.account.findFirst({
      where: {
        username: formData.get("username") as string,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 401 },
      );
    }

    // Check password
    if (user.password !== formData.get("password")) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const role = user.role;

    // Create session
    const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    const session = await encrypt({ role, expires });

    // Set session in the cookie
    cookies().set("session", session, { expires, httpOnly: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
