import { prisma } from "../lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'ai_credit_usage') THEN
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
      END IF;
    END $$;
  `);
  console.log("RLS applied successfully to ai_credit_usage");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error applying RLS:", err);
  process.exit(1);
});
