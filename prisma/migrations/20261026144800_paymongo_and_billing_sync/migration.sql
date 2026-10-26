-- =============================================================================
-- Migration: 20261026144800_paymongo_and_billing_sync (Defensive & Idempotent)
-- =============================================================================

-- 1. Safely add missing PaymentStatus enum values for automated PayMongo checkout
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PAID';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'FAILED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'REFUNDED';

-- 2. Safely add missing curriculum scope & trial duration columns to admin_config
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_config' AND column_name = 'targetLessonsPerSubject'
  ) THEN
    ALTER TABLE "admin_config" ADD COLUMN "targetLessonsPerSubject" INTEGER NOT NULL DEFAULT 8;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_config' AND column_name = 'trialDurationDays'
  ) THEN
    ALTER TABLE "admin_config" ADD COLUMN "trialDurationDays" INTEGER NOT NULL DEFAULT 30;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_config' AND column_name = 'annualPricePhp'
  ) THEN
    ALTER TABLE "admin_config" ALTER COLUMN "annualPricePhp" SET DEFAULT 2499;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_config' AND column_name = 'monthlyPricePhp'
  ) THEN
    ALTER TABLE "admin_config" ALTER COLUMN "monthlyPricePhp" SET DEFAULT 299;
  END IF;
END $$;

-- 3. Create payment_transactions table for PayMongo Hosted Checkout Sessions & SGWS Attribution
CREATE TABLE IF NOT EXISTS "payment_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "paymongoSessionId" TEXT NOT NULL,
    "paymongoPaymentId" TEXT,
    "referenceNumber" TEXT NOT NULL,
    "referralCode" TEXT,
    "productSlug" TEXT NOT NULL DEFAULT 'highschool-tutor',
    "plan" "SubPlan" NOT NULL DEFAULT 'MONTHLY',
    "amountCentavos" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "rawWebhookPayload" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- 4. Create Unique Constraints & Lookup Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "payment_transactions_paymongoSessionId_key" ON "payment_transactions"("paymongoSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "payment_transactions_referenceNumber_key" ON "payment_transactions"("referenceNumber");

CREATE INDEX IF NOT EXISTS "payment_transactions_userId_idx" ON "payment_transactions"("userId");
CREATE INDEX IF NOT EXISTS "payment_transactions_subscriptionId_idx" ON "payment_transactions"("subscriptionId");
CREATE INDEX IF NOT EXISTS "payment_transactions_referenceNumber_idx" ON "payment_transactions"("referenceNumber");
CREATE INDEX IF NOT EXISTS "payment_transactions_paymongoSessionId_idx" ON "payment_transactions"("paymongoSessionId");
CREATE INDEX IF NOT EXISTS "payment_transactions_referralCode_idx" ON "payment_transactions"("referralCode");
CREATE INDEX IF NOT EXISTS "payment_transactions_status_idx" ON "payment_transactions"("status");

-- 5. Foreign Key Constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_transactions_userId_fkey'
  ) THEN
    ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_transactions_subscriptionId_fkey'
  ) THEN
    ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscriptionId_fkey" 
      FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 6. Row Level Security (RLS) Policies
ALTER TABLE "payment_transactions" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'payment_transactions_admin_all'
  ) THEN
    CREATE POLICY "payment_transactions_admin_all" ON "payment_transactions"
      FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'payment_transactions_self_all'
  ) THEN
    CREATE POLICY "payment_transactions_self_all" ON "payment_transactions"
      FOR ALL USING (("userId" = current_user_id()) OR (current_user_id() IS NULL))
      WITH CHECK (("userId" = current_user_id()) OR (current_user_id() IS NULL));
  END IF;
END $$;
