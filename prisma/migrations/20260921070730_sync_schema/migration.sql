-- =============================================================================
-- Migration: 20260921070730_sync_schema (Defensive & Idempotent)
-- =============================================================================

-- 1. Safely add missing SubPlan enum values
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_7';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_8';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_9';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_10';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_11';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'GRADE_12';
ALTER TYPE "SubPlan" ADD VALUE IF NOT EXISTS 'ALL_LEVELS';

-- 2. Safely drop legacy indexes if present
DROP INDEX IF EXISTS "accounts_provider_providerAccountId_key";
DROP INDEX IF EXISTS "verification_identifier_idx";

-- 3. Safely ensure "account.type" exists and clean up legacy NextAuth columns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'type'
  ) THEN
    ALTER TABLE "account" ADD COLUMN "type" TEXT;
  ELSE
    ALTER TABLE "account" ALTER COLUMN "type" DROP DEFAULT;
  END IF;
END $$;

ALTER TABLE "account" DROP COLUMN IF EXISTS "expires_at";
ALTER TABLE "account" DROP COLUMN IF EXISTS "session_state";
ALTER TABLE "account" DROP COLUMN IF EXISTS "token_type";

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'accounts_pkey') 
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_pkey') THEN
    ALTER TABLE "account" RENAME CONSTRAINT "accounts_pkey" TO "account_pkey";
  END IF;
END $$;

-- 4. Admin config pricing defaults
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_config' AND column_name = 'monthlyPricePhp') THEN
    ALTER TABLE "admin_config" ALTER COLUMN "monthlyPricePhp" SET DEFAULT 300;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_config' AND column_name = 'annualPricePhp') THEN
    ALTER TABLE "admin_config" ALTER COLUMN "annualPricePhp" SET DEFAULT 2600;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_config' AND column_name = 'updatedAt') THEN
    ALTER TABLE "admin_config" ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- 5. Announcements timestamps
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'updatedAt') THEN
    ALTER TABLE "announcements" ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- 6. Session constraint safety
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_pkey') 
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
    ALTER TABLE "session" RENAME CONSTRAINT "sessions_pkey" TO "session_pkey";
  END IF;
END $$;

-- 7. User table constraints and non-null enforcement
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'name') THEN
    UPDATE "user" SET "name" = '' WHERE "name" IS NULL;
    ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'email') THEN
    ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'emailVerified') THEN
    UPDATE "user" SET "emailVerified" = false WHERE "emailVerified" IS NULL;
    ALTER TABLE "user" ALTER COLUMN "emailVerified" SET NOT NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey') 
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_pkey') THEN
    ALTER TABLE "user" RENAME CONSTRAINT "users_pkey" TO "user_pkey";
  END IF;
END $$;

-- 8. Verification table timestamp
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'verification' AND column_name = 'updatedAt') THEN
    ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- 9. Lesson materials table and indexes
CREATE TABLE IF NOT EXISTS "lesson_materials" (
    "id" TEXT NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "keyTakeaways" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_materials_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "lesson_materials_subjectSlug_lessonNumber_idx" ON "lesson_materials"("subjectSlug", "lessonNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "lesson_materials_subjectSlug_lessonNumber_key" ON "lesson_materials"("subjectSlug", "lessonNumber");
