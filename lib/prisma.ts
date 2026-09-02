import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/highschool_tutor_local?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Execute Prisma operations within a PostgreSQL RLS-scoped transaction for a given user.
 */
export async function runWithUser<T>(
  userId: string,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    // Set PostgreSQL session variables for RLS policies
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.current_user_id', $1, true)`,
      userId
    );
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.is_admin', 'false', true)`
    );
    return await fn(tx as unknown as PrismaClient);
  });
}

/**
 * Execute Prisma operations with full ADMIN bypass privileges for RLS.
 */
export async function runAsAdmin<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.is_admin', 'true', true)`
    );
    return await fn(tx as unknown as PrismaClient);
  });
}

export default prisma;

