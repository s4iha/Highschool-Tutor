-- =============================================================================
-- Migration: Add Admin Portal Models (AdminConfig, Announcement) & RLS Policies
-- Task 013: HighSchool Tutor Administrative Control Plane
-- =============================================================================

-- 1. Create Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AnnouncementType') THEN
    CREATE TYPE "AnnouncementType" AS ENUM ('INFO', 'WARNING', 'PROMO', 'MAINTENANCE');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AudienceType') THEN
    CREATE TYPE "AudienceType" AS ENUM ('ALL', 'PREMIUM', 'TRIAL');
  END IF;
END $$;

-- 2. Create Table: admin_config
CREATE TABLE IF NOT EXISTS "admin_config" (
    "id" TEXT NOT NULL,
    "monthlyPricePhp" INTEGER NOT NULL DEFAULT 199,
    "annualPricePhp" INTEGER NOT NULL DEFAULT 1499,
    "maxTrialSubjects" INTEGER NOT NULL DEFAULT 3,
    "maxFreeLessons" INTEGER NOT NULL DEFAULT 3,
    "gcashReceiverNumber" TEXT NOT NULL DEFAULT '0917-888-4321',
    "gcashAccountName" TEXT NOT NULL DEFAULT 'HIGHSCHOOL TUTOR PH',
    "mayaReceiverNumber" TEXT NOT NULL DEFAULT '0918-999-8765',
    "mayaAccountName" TEXT NOT NULL DEFAULT 'HIGHSCHOOL TUTOR PH',
    "enableAiTutorTrial" BOOLEAN NOT NULL DEFAULT true,
    "promoDiscountPercent" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_config_pkey" PRIMARY KEY ("id")
);

-- 3. Create Table: announcements
CREATE TABLE IF NOT EXISTS "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'INFO',
    "targetAudience" "AudienceType" NOT NULL DEFAULT 'ALL',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS "announcements_isActive_targetAudience_idx" 
ON "announcements"("isActive", "targetAudience");

-- 5. Seed default admin_config record if not already present
INSERT INTO "admin_config" (
    "id",
    "monthlyPricePhp",
    "annualPricePhp",
    "maxTrialSubjects",
    "maxFreeLessons",
    "gcashReceiverNumber",
    "gcashAccountName",
    "mayaReceiverNumber",
    "mayaAccountName",
    "enableAiTutorTrial",
    "promoDiscountPercent",
    "updatedAt"
)
VALUES (
    'default_config',
    199,
    1499,
    3,
    3,
    '0917-888-4321',
    'HIGHSCHOOL TUTOR PH',
    '0918-999-8765',
    'HIGHSCHOOL TUTOR PH',
    true,
    20,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- 6. PostgreSQL Row Level Security (RLS) Policies
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'admin_config') THEN
    ALTER TABLE "admin_config" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS admin_config_admin_all ON "admin_config";
    CREATE POLICY admin_config_admin_all ON "admin_config"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS admin_config_public_read ON "admin_config";
    CREATE POLICY admin_config_public_read ON "admin_config"
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'announcements') THEN
    ALTER TABLE "announcements" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS announcements_admin_all ON "announcements";
    CREATE POLICY announcements_admin_all ON "announcements"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS announcements_active_read ON "announcements";
    CREATE POLICY announcements_active_read ON "announcements"
      FOR SELECT
      USING ("isActive" = true);
  END IF;
END $$;
