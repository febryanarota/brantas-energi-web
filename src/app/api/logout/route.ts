import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    // remove session from the cookie
    cookies().set('session', '', {expires: new Date(0)});
    return NextResponse.json({ success: true });
}