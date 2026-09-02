import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { z } from "zod";

const googleAuthSchema = z.object({
  credential: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = googleAuthSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Missing Google credential" },
        { status: 400 }
      );
    }

    let email = "";
    let name = "";
    let image = "";

    const raw = validated.data.credential;

    // Check if it's a JWT (3 dot-separated parts)
    const tokenParts = raw.split(".");
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString("utf-8")
        );
        email = payload.email || "";
        name = payload.name || "";
        image = payload.picture || "";
      } catch (err) {
        console.error("JWT parse error:", err);
      }
    } else {
      // Allow JSON payload for direct/demo authorization
      try {
        const parsed = JSON.parse(raw);
        email = parsed.email || "";
        name = parsed.name || "";
        image = parsed.image || "";
      } catch {
        email = raw;
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Could not retrieve email from Google credential" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          image,
          profile: {
            create: {
              email,
              fullName: name || email.split("@")[0],
              hasOnboarded: false,
            },
          },
        },
        include: { profile: true },
      });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email!,
      name: user.name || "",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasOnboarded: user.profile?.hasOnboarded || false,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
