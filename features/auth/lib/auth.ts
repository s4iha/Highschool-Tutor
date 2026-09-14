import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.NEXTAUTH_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      overrideUserInfoOnSignIn: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.profile.upsert({
              where: { id: user.id },
              update: {},
              create: {
                id: user.id,
                email: user.email,
                fullName: user.name || "",
                hasOnboarded: false,
              },
            });
            await prisma.userRole.upsert({
              where: {
                userId_role: {
                  userId: user.id,
                  role: "STUDENT",
                },
              },
              update: {},
              create: {
                userId: user.id,
                role: "STUDENT",
              },
            });
          } catch (err) {
            console.error("Error in Better Auth user.create.after hook:", err);
          }
        },
      },
    },
  },
});
