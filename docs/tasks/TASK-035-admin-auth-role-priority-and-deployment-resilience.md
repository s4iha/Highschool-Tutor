# Task 035 - Admin Auth Role Priority, Server Action Version Skew Resilience & Safe Admin Seeding

**Skills to be used**: task-implementation, atomic-commit

## Description

Address production login issues for administrator accounts and resolve the runtime error `Failed to find Server Action "...". This request might be from an older or newer deployment`:

1. **Role Priority Hardening in Auth & Session Pipelines**:
   - Update `app/api/auth/login/route.ts`, `features/auth/lib/session.ts`, `app/api/user/me/route.ts`, and `app/api/auth/register/route.ts` to ensure that any user possessing the `ADMIN` role in `user_roles` is always resolved as `role: "ADMIN"`, preventing non-deterministic PostgreSQL role query ordering (`user.roles[0]`) from demoting admins to `STUDENT` and triggering redirection loops in `proxy.ts`.

2. **Next.js App Router Error Boundaries & Version Skew Recovery**:
   - Implement `app/error.tsx` and `app/global-error.tsx` to detect `Failed to find Server Action` or `older or newer deployment` exceptions caused by stale cached client bundles after container deployments.
   - Automatically trigger a clean browser reload (`window.location.reload()`) to pull the new deployment manifest and chunks, preventing the application from breaking when users have open tabs during a deployment.

3. **Safe & Idempotent Admin Provisioning Utility**:
   - Provide a safe CLI script `scripts/ensure-admin.ts` (and npm script `npm run ensure:admin`) that guarantees an administrative account exists in PostgreSQL without wiping data or resetting custom configurations.

4. **Testing & Verification**:
   - Add unit tests in `tests/unit/admin-auth.test.ts` to verify multi-role resolution and role prioritization.
   - Run full test suite, linter, and production build.

## Verification Checklist

- [x] `app/api/auth/login/route.ts` sets `role: "ADMIN"` if `user.roles` contains `ADMIN`
- [x] `features/auth/lib/session.ts` sets `role: "ADMIN"` if `user.roles` contains `ADMIN`
- [x] `app/api/user/me/route.ts` sets `role: "ADMIN"` if `user.roles` contains `ADMIN`
- [x] `app/error.tsx` and `app/global-error.tsx` detect Server Action version skew and reload gracefully
- [x] `scripts/ensure-admin.ts` safely provisions/verifies admin account
- [x] Unit tests pass in `tests/unit/admin-auth.test.ts`
- [x] `npm test`, `npm run lint`, and `npm run build` pass cleanly
