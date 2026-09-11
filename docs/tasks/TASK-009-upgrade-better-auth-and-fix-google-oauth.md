# Task 009 - Upgrade Better Auth to 1.7.4 and Fix Google OAuth Database Adapter

**Skills to be used**: task-implementation

## Description

Fix Google OAuth authentication issues causing 502 Bad Gateway and 500 Internal Server errors:
1. Missing Prisma database adapter in `features/auth/lib/auth.ts`.
2. Upgrade `better-auth` from 1.7.2 to 1.7.4 to resolve the breaking/buggy `issuer` argument requirement that was introduced in 1.7.0–1.7.2 and reverted in 1.7.3+.
3. Regenerate Prisma Client and verify database sync.

## Verification Checklist

- [x] Configure Prisma adapter in `features/auth/lib/auth.ts`
- [x] Sync database schema with `prisma db push` and `prisma generate`
- [x] Upgrade `better-auth` to 1.7.4 in `package.json`
- [x] Verify build / type check cleanly without errors
- [x] Verify Google Sign-In flow initiates and handles callback successfully
