// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token)
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!token.role || token.role !== "COACH") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Otherwise, allow access
  return NextResponse.next();
}

// Match the exact route or paths you want to protect
export const config = {
  matcher: ["/dashboard/:path*"],
};