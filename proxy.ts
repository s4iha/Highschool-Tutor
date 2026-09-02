import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "highschool-tutor-secret-key-for-development-only-12345678";
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Paths that require authentication
  const isProtectedPath =
    pathname.startsWith("/curriculum") ||
    pathname.startsWith("/dashboard");

  if (isProtectedPath) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch (err) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if trying to access auth pages while already logged in
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        await jwtVerify(token, key, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (err) {
        // Token is invalid, let them view the auth page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/curriculum/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
