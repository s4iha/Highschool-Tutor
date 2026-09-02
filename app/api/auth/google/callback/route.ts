import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  let callbackUrl = "/dashboard";
  let redirectUriFromState = "";

  if (state) {
    try {
      const parsed = JSON.parse(
        Buffer.from(state, "base64").toString("utf-8")
      );
      if (parsed.callbackUrl) callbackUrl = parsed.callbackUrl;
      if (parsed.redirectUri) redirectUriFromState = parsed.redirectUri;
    } catch {}
  }

  if (error || !code) {
    console.error("Google OAuth error from Google redirect:", error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error || "Google auth cancelled")}`,
        origin
      )
    );
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const baseUrl = process.env.NEXTAUTH_URL || origin;
  const redirectUri =
    redirectUriFromState ||
    process.env.GOOGLE_REDIRECT_URI ||
    `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth error: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return NextResponse.redirect(
      new URL("/login?error=Google%20credentials%20missing%20in%20server%20env", origin)
    );
  }

  try {
    // 1. Exchange authorization code for access tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("Token exchange failed:", errText);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Failed to exchange Google token")}`, origin)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google UserInfo
    const userinfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!userinfoResponse.ok) {
      console.error("Userinfo fetch failed:", await userinfoResponse.text());
      return NextResponse.redirect(
        new URL("/login?error=Failed%20to%20fetch%20Google%20profile", origin)
      );
    }

    const googleProfile = await userinfoResponse.json();
    const email = googleProfile.email;
    const name = googleProfile.name || email.split("@")[0];
    const image = googleProfile.picture || null;

    if (!email) {
      return NextResponse.redirect(
        new URL("/login?error=No%20email%20provided%20by%20Google", origin)
      );
    }

    // 3. Upsert user in database
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          profile: {
            create: {
              email,
              fullName: name,
              hasOnboarded: false,
            },
          },
        },
        include: { profile: true },
      });
    } else if (!user.profile) {
      await prisma.profile.create({
        data: {
          id: user.id,
          email,
          fullName: name,
          hasOnboarded: false,
        },
      });
    }

    // 4. Generate JWT session token
    const token = await signToken({
      userId: user.id,
      email: user.email!,
      name: user.name || "",
    });

    // 5. Set session cookie and redirect to destination
    const response = NextResponse.redirect(new URL(callbackUrl, origin));
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "Internal authentication error")}`, origin)
    );
  }
}
