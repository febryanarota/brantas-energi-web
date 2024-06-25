import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import { redirect } from "next/navigation";

// TODO: move the key to the env
const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10 day from now')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function login (formData: FormData) {
    try {
        const user = await prisma.account.findFirst({
            where: {
                username: formData.get('username') as string,
            }
        })

        if (!user) {
            throw new Error('Username not found');
        }

        // check password
        if (user.password !== formData.get('password')) {
            throw new Error('Invalid password');
        }

        const role = user.role;

        // create session
        const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
        const session = await encrypt({role, expires})

        // set session in the cookie
        cookies().set('session', session, {expires, httpOnly: true});
        return;

    } catch (error) {
        return NextResponse.json({error: error}, {status: 401});
    }
}

export async function logout() {
    // remove session from the cookie
    cookies().set('session', '', {expires: new Date(0)});
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // refresh the session expiration time
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    const updatedSession = await encrypt(parsed);

    const response = NextResponse.next();
    response.cookies.set('session', updatedSession, {
      httpOnly: true,
      expires: parsed.expires,
    });
  
    return response;
}