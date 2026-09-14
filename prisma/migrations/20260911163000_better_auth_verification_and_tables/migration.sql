-- =============================================================================
-- Migration: Ensure Better Auth Models (Verification, User, Session, Account)
-- Fixes P2021 & P3009: Clean migration with strict column & index ordering
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table Renames (NextAuth plural -> Better Auth singular) if applicable
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user') THEN
    ALTER TABLE "users" RENAME TO "user";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sessions') AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'session') THEN
    ALTER TABLE "sessions" RENAME TO "session";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'accounts') AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'account') THEN
    ALTER TABLE "accounts" RENAME TO "account";
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. User Table: Ensure existence and Better Auth columns
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'passwordHash'
  ) THEN
    ALTER TABLE "user" ADD COLUMN "passwordHash" TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'emailVerified' AND data_type LIKE '%timestamp%'
  ) THEN
    ALTER TABLE "user" ALTER COLUMN "emailVerified" TYPE BOOLEAN USING ("emailVerified" IS NOT NULL);
    ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user"("email");

-- -----------------------------------------------------------------------------
-- 3. Session Table: Column adjustments, creation, and indexes
-- -----------------------------------------------------------------------------
-- First rename columns if the table already existed as "sessions"
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'session' AND column_name = 'sessionToken'
  ) THEN
    ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "token";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'session' AND column_name = 'expires'
  ) THEN
    ALTER TABLE "session" RENAME COLUMN "expires" TO "expiresAt";
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'session' AND column_name = 'ipAddress'
  ) THEN
    ALTER TABLE "session" ADD COLUMN "ipAddress" TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'session' AND column_name = 'userAgent'
  ) THEN
    ALTER TABLE "session" ADD COLUMN "userAgent" TEXT;
  END IF;
END $$;

-- If session table didn't exist at all, create it with all columns
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- Index created strictly AFTER the column "token" is guaranteed to exist
CREATE UNIQUE INDEX IF NOT EXISTS "session_token_key" ON "session"("token");

-- Foreign key for session -> user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'session_userId_fkey'
  ) THEN
    ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Account Table: Column adjustments, creation, and foreign key
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'providerAccountId'
  ) THEN
    ALTER TABLE "account" RENAME COLUMN "providerAccountId" TO "accountId";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'provider'
  ) THEN
    ALTER TABLE "account" RENAME COLUMN "provider" TO "providerId";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'access_token'
  ) THEN
    ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'refresh_token'
  ) THEN
    ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'id_token'
  ) THEN
    ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'password'
  ) THEN
    ALTER TABLE "account" ADD COLUMN "password" TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'issuer'
  ) THEN
    ALTER TABLE "account" ADD COLUMN "issuer" TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'accessTokenExpiresAt'
  ) THEN
    ALTER TABLE "account" ADD COLUMN "accessTokenExpiresAt" TIMESTAMP(3);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'refreshTokenExpiresAt'
  ) THEN
    ALTER TABLE "account" ADD COLUMN "refreshTokenExpiresAt" TIMESTAMP(3);
  END IF;
END $$;

-- Fix legacy NextAuth NOT NULL constraint on "type" column if present
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'type'
  ) THEN
    ALTER TABLE "account" ALTER COLUMN "type" DROP NOT NULL;
    ALTER TABLE "account" ALTER COLUMN "type" SET DEFAULT 'oauth';
  END IF;
END $$;

-- If account table didn't exist at all, create it
CREATE TABLE IF NOT EXISTS "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuer" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- Foreign key for account -> user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_userId_fkey'
  ) THEN
    ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 5. Verification Table (Missing in production)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification"("identifier");

-- Drop obsolete legacy verification_tokens table if present
DROP TABLE IF EXISTS "verification_tokens";

-- -----------------------------------------------------------------------------
-- 6. Row Level Security (RLS) & Policies
-- -----------------------------------------------------------------------------
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- Verification policies
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

-- User policies
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

-- Session policies
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

-- Account policies
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
