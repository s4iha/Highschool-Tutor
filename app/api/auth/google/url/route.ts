import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("Google OAuth error: GOOGLE_CLIENT_ID is missing in environment variables.");
    return NextResponse.json(
      { error: "Google Client ID is not configured in environment variables." },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL || origin;
  // Default to /api/auth/google/callback or custom override
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

  const state = Buffer.from(
    JSON.stringify({ callbackUrl, redirectUri })
  ).toString("base64");

  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("access_type", "offline");
  googleUrl.searchParams.set("prompt", "select_account");
  googleUrl.searchParams.set("state", state);

  return NextResponse.redirect(googleUrl.toString());
}
