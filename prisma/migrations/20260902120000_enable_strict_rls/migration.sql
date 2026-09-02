-- =============================================================================
-- Migration: Enable Strict PostgreSQL Row Level Security (RLS) & Policies
-- HighSchool Tutor Security Enforcement (Better Auth & Domain Models)
-- =============================================================================

-- Helper function to extract current session user ID
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_user_id', true), '');
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to check if current session is an admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(current_setting('app.is_admin', true), 'false') = 'true';
END;
$$ LANGUAGE plpgsql STABLE;

-- -----------------------------------------------------------------------------
-- 1. User Table (Better Auth)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user') THEN
    ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS user_admin_all ON "user";
    CREATE POLICY user_admin_all ON "user"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS user_self_select ON "user";
    CREATE POLICY user_self_select ON "user"
      FOR SELECT
      USING (id = current_user_id() OR current_user_id() IS NULL);

    DROP POLICY IF EXISTS user_self_update ON "user";
    CREATE POLICY user_self_update ON "user"
      FOR UPDATE
      USING (id = current_user_id())
      WITH CHECK (id = current_user_id());
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Session Table (Better Auth)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'session') THEN
    ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS session_admin_all ON "session";
    CREATE POLICY session_admin_all ON "session"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS session_self_all ON "session";
    CREATE POLICY session_self_all ON "session"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 3. Account Table (Better Auth)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'account') THEN
    ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS account_admin_all ON "account";
    CREATE POLICY account_admin_all ON "account"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS account_self_all ON "account";
    CREATE POLICY account_self_all ON "account"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Verification Table (Better Auth)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'verification') THEN
    ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS verification_admin_all ON "verification";
    CREATE POLICY verification_admin_all ON "verification"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS verification_public_all ON "verification";
    CREATE POLICY verification_public_all ON "verification"
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Profiles Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS profiles_admin_all ON "profiles";
    CREATE POLICY profiles_admin_all ON "profiles"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS profiles_self_all ON "profiles";
    CREATE POLICY profiles_self_all ON "profiles"
      FOR ALL
      USING (id = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK (id = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 6. User Roles Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_roles') THEN
    ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS user_roles_admin_all ON "user_roles";
    CREATE POLICY user_roles_admin_all ON "user_roles"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS user_roles_self_select ON "user_roles";
    CREATE POLICY user_roles_self_select ON "user_roles"
      FOR SELECT
      USING ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 7. Subscriptions Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'subscriptions') THEN
    ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS subscriptions_admin_all ON "subscriptions";
    CREATE POLICY subscriptions_admin_all ON "subscriptions"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS subscriptions_self_all ON "subscriptions";
    CREATE POLICY subscriptions_self_all ON "subscriptions"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 8. Payments Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'payments') THEN
    ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS payments_admin_all ON "payments";
    CREATE POLICY payments_admin_all ON "payments"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS payments_self_all ON "payments";
    CREATE POLICY payments_self_all ON "payments"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 9. Trial Subjects Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'trial_subjects') THEN
    ALTER TABLE "trial_subjects" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS trial_subjects_admin_all ON "trial_subjects";
    CREATE POLICY trial_subjects_admin_all ON "trial_subjects"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS trial_subjects_self_all ON "trial_subjects";
    CREATE POLICY trial_subjects_self_all ON "trial_subjects"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 10. Quiz Attempts Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'quiz_attempts') THEN
    ALTER TABLE "quiz_attempts" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS quiz_attempts_admin_all ON "quiz_attempts";
    CREATE POLICY quiz_attempts_admin_all ON "quiz_attempts"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS quiz_attempts_self_all ON "quiz_attempts";
    CREATE POLICY quiz_attempts_self_all ON "quiz_attempts"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 11. Notification Settings Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'notification_settings') THEN
    ALTER TABLE "notification_settings" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS notif_admin_all ON "notification_settings";
    CREATE POLICY notif_admin_all ON "notification_settings"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS notif_self_all ON "notification_settings";
    CREATE POLICY notif_self_all ON "notification_settings"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 12. Reminder Notices Table
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'reminder_notices') THEN
    ALTER TABLE "reminder_notices" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS notices_admin_all ON "reminder_notices";
    CREATE POLICY notices_admin_all ON "reminder_notices"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS notices_self_all ON "reminder_notices";
    CREATE POLICY notices_self_all ON "reminder_notices"
      FOR ALL
      USING ("userId" = current_user_id() OR current_user_id() IS NULL)
      WITH CHECK ("userId" = current_user_id() OR current_user_id() IS NULL);
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 13. Cached Lessons & Quizzes (Public read / Admin write)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'cached_lessons') THEN
    ALTER TABLE "cached_lessons" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS cached_lessons_admin_all ON "cached_lessons";
    CREATE POLICY cached_lessons_admin_all ON "cached_lessons"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS cached_lessons_public_read ON "cached_lessons";
    CREATE POLICY cached_lessons_public_read ON "cached_lessons"
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'cached_quizzes') THEN
    ALTER TABLE "cached_quizzes" ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS cached_quizzes_admin_all ON "cached_quizzes";
    CREATE POLICY cached_quizzes_admin_all ON "cached_quizzes"
      FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());

    DROP POLICY IF EXISTS cached_quizzes_public_read ON "cached_quizzes";
    CREATE POLICY cached_quizzes_public_read ON "cached_quizzes"
      FOR SELECT
      USING (true);
  END IF;
END $$;
