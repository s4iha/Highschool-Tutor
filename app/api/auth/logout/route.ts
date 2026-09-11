import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  const betterAuthToken =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  if (betterAuthToken) {
    try {
      await prisma.session.deleteMany({
        where: { token: betterAuthToken },
      });
    } catch (e) {
      console.warn("Failed to delete session from DB during logout:", e);
    }
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  response.cookies.set("auth_token", "", cookieOptions);
  response.cookies.set("better-auth.session_token", "", cookieOptions);
  response.cookies.set("__Secure-better-auth.session_token", "", cookieOptions);
  response.cookies.set("better-auth.session_data", "", cookieOptions);

  return response;
}
