-- =============================================================================
-- Migration: Add tutoringPersona to Profile & Create QuizSession table
-- =============================================================================

-- 1. Add tutoringPersona column to profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "tutoringPersona" TEXT NOT NULL DEFAULT 'socratic';

-- 2. Create quiz_sessions table
CREATE TABLE IF NOT EXISTS "quiz_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "subjectSlug" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL DEFAULT '',
    "mode" TEXT NOT NULL DEFAULT 'study',
    "questionCount" INTEGER NOT NULL DEFAULT 10,
    "questions" JSONB NOT NULL,
    "userAnswers" JSONB,
    "score" INTEGER,
    "total" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- 3. Indexes for quiz_sessions
CREATE INDEX IF NOT EXISTS "quiz_sessions_userId_createdAt_idx" ON "quiz_sessions"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "quiz_sessions_subjectSlug_lessonNumber_idx" ON "quiz_sessions"("subjectSlug", "lessonNumber");

-- 4. Foreign key relation: quiz_sessions -> user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quiz_sessions_userId_fkey'
  ) THEN
    ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 5. Row Level Security (RLS) policies for quiz_sessions
ALTER TABLE "quiz_sessions" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quiz_session_admin_all ON "quiz_sessions";
CREATE POLICY quiz_session_admin_all ON "quiz_sessions"
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS quiz_session_self_all ON "quiz_sessions";
CREATE POLICY quiz_session_self_all ON "quiz_sessions"
  FOR ALL
  USING ("userId" = current_user_id() OR "userId" IS NULL OR current_user_id() IS NULL)
  WITH CHECK ("userId" = current_user_id() OR "userId" IS NULL OR current_user_id() IS NULL);
