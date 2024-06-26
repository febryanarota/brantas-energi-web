import { updateSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // If updateSession returned a response, return it
  if (response) {
    return response;
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}
