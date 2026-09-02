import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "highschool-tutor-secret-key-for-development-only-12345678";
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const customToken = request.cookies.get("auth_token")?.value;
  const betterAuthToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;
  const hasToken = Boolean(customToken || betterAuthToken);
  const pathname = request.nextUrl.pathname;

  // 1. Admin Portal Protection: Strictly ADMIN role only
  if (pathname.startsWith("/admin")) {
    if (!hasToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    if (customToken) {
      try {
        const { payload } = await jwtVerify(customToken, key, { algorithms: ["HS256"] });
        const role = (payload as unknown as { role?: string }).role;
        if (role !== "ADMIN") {
          // Redirect non-admin students directly to their student dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        if (!betterAuthToken) {
          const url = new URL("/login", request.url);
          url.searchParams.set("callbackUrl", encodeURI(pathname));
          return NextResponse.redirect(url);
        }
      }
    }
    return NextResponse.next();
  }

  // 2. Paths that require authentication (Students & Admins)
  const isProtectedPath =
    pathname.startsWith("/curriculum") ||
    pathname.startsWith("/dashboard");

  if (isProtectedPath) {
    if (!hasToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    if (customToken) {
      try {
        await jwtVerify(customToken, key, { algorithms: ["HS256"] });
      } catch {
        if (!betterAuthToken) {
          const url = new URL("/login", request.url);
          url.searchParams.set("callbackUrl", encodeURI(pathname));
          return NextResponse.redirect(url);
        }
      }
    }

    return NextResponse.next();
  }

  // 3. Redirect to dashboard if trying to access auth pages while already logged in
  if (pathname === "/login" || pathname === "/register") {
    if (hasToken) {
      if (customToken) {
        try {
          await jwtVerify(customToken, key, { algorithms: ["HS256"] });
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch {
          // Token is invalid, check if better auth token is present
        }
      }
      if (betterAuthToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/curriculum/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};

