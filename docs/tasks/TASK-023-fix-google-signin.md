# Task 023 - Fix Google Sign-in Internal Server Error

**Skills to be used**: task-implementation, grill-me

## Description

Fix the internal server error occurring during Google Sign-in in production. The error reported is `The column account.type does not exist in the current database.` This is caused by a missing database migration after adding the `type` field to the `Account` model in `schema.prisma`.

Additionally, the Next.js Server Action mismatch error (`Error: The Server Reference ID did not match the expected format. Received "x"`) will be handled by the user clearing the `.next` build cache during deployment.

## Verification Checklist

- [x] Identify the missing column `account.type`.
- [x] Generate the missing Prisma migration to synchronize the database with `schema.prisma`.
- [x] Harden `20260921070730_sync_schema` with defensive idempotent SQL (`IF EXISTS`, `IF NOT EXISTS`, safe column addition) to resolve P3009 deployment failure.
- [x] Verify no TypeScript compiler errors.
- [x] Verify Next.js production build succeeds.
