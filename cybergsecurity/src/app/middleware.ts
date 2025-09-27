// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./utils/auth";

export function middleware(req: NextRequest) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = decodeToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
