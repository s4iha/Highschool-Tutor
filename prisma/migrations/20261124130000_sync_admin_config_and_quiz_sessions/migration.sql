-- AlterTable
ALTER TABLE "admin_config" ADD COLUMN IF NOT EXISTS "availableQuestionCounts" TEXT NOT NULL DEFAULT '5, 10, 15, 20';

-- AlterTable
ALTER TABLE "quiz_sessions" ADD COLUMN IF NOT EXISTS "activeQuestionIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "quiz_sessions_userId_completedAt_createdAt_idx" ON "quiz_sessions"("userId", "completedAt", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reminder_notices_userId_kind_idx" ON "reminder_notices"("userId", "kind");
