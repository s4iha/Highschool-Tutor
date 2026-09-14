-- =============================================================================
-- Migration: Ensure missing Profile columns & AI Credit Usage table
-- Fixes P2022 ColumnNotFound: profiles.track, hasOnboarded, hasCompletedTour
-- =============================================================================

-- 1. Ensure all Profile columns exist
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "track" TEXT NOT NULL DEFAULT '';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "hasOnboarded" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "hasCompletedTour" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "termPreference" TEXT DEFAULT '';

-- 2. Ensure ai_credit_usage table exists
CREATE TABLE IF NOT EXISTS "ai_credit_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_credit_usage_pkey" PRIMARY KEY ("id")
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS "ai_credit_usage_userId_createdAt_idx" ON "ai_credit_usage"("userId", "createdAt");

-- 4. Foreign key relation: ai_credit_usage -> user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_credit_usage_userId_fkey'
  ) THEN
    ALTER TABLE "ai_credit_usage" ADD CONSTRAINT "ai_credit_usage_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 5. Row Level Security (RLS) policies for ai_credit_usage
ALTER TABLE "ai_credit_usage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_credit_admin_all ON "ai_credit_usage";
CREATE POLICY ai_credit_admin_all ON "ai_credit_usage"
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS ai_credit_self_all ON "ai_credit_usage";
CREATE POLICY ai_credit_self_all ON "ai_credit_usage"
  FOR ALL
  USING ("userId" = current_user_id() OR current_user_id() IS NULL)
  WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
