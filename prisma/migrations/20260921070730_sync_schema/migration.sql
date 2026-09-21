/*
  Warnings:

  - You are about to drop the column `expires_at` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `account` table. All the data in the column will be lost.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailVerified` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubPlan" ADD VALUE 'GRADE_7';
ALTER TYPE "SubPlan" ADD VALUE 'GRADE_8';
ALTER TYPE "SubPlan" ADD VALUE 'GRADE_9';
ALTER TYPE "SubPlan" ADD VALUE 'GRADE_10';
ALTER TYPE "SubPlan" ADD VALUE 'GRADE_11';
ALTER TYPE "SubPlan" ADD VALUE 'GRADE_12';
ALTER TYPE "SubPlan" ADD VALUE 'ALL_LEVELS';

-- DropIndex
DROP INDEX "accounts_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "verification_identifier_idx";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "expires_at",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "account" RENAME CONSTRAINT "accounts_pkey" TO "account_pkey";

-- AlterTable
ALTER TABLE "admin_config" ALTER COLUMN "monthlyPricePhp" SET DEFAULT 300,
ALTER COLUMN "annualPricePhp" SET DEFAULT 2600,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "announcements" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "session" RENAME CONSTRAINT "sessions_pkey" TO "session_pkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "emailVerified" SET NOT NULL;
ALTER TABLE "user" RENAME CONSTRAINT "users_pkey" TO "user_pkey";

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "lesson_materials" (
    "id" TEXT NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "keyTakeaways" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_materials_subjectSlug_lessonNumber_idx" ON "lesson_materials"("subjectSlug", "lessonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_materials_subjectSlug_lessonNumber_key" ON "lesson_materials"("subjectSlug", "lessonNumber");
