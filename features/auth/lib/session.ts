import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies, headers } from "next/headers";
import { auth } from "./auth";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const customToken = cookieStore.get("auth_token")?.value;
    const betterAuthToken =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    let userId: string | null = null;

    // 1. Check custom JWT token
    if (customToken) {
      const payload = await verifyToken(customToken);
      if (payload?.userId) {
        userId = payload.userId;
      }
    }

    // 2. Check Better Auth session
    if (!userId && betterAuthToken) {
      try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });
        if (session?.user?.id) {
          userId = session.user.id;
        }
      } catch {
        // Direct DB session lookup fallback
        const dbSession = await prisma.session.findUnique({
          where: { token: betterAuthToken },
        });
        if (dbSession && dbSession.expiresAt > new Date()) {
          userId = dbSession.userId;
        }
      }
    }

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user || !user.email) {
      return null;
    }

    const role = user.roles?.[0]?.role || "STUDENT";

    return {
      id: user.id,
      email: user.email,
      name: user.name || "",
      role,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}
