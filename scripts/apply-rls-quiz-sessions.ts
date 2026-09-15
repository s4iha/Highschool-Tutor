import { prisma } from "../lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'quiz_sessions') THEN
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
      END IF;
    END $$;
  `);
  console.log("RLS applied successfully to quiz_sessions");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error applying RLS to quiz_sessions:", err);
  process.exit(1);
});
