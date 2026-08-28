# Project Backlog & Change Log

## [2026-08-28]
### Task 001 - Scaffold Feature-Driven Architecture, CI/CD, and Prisma Schema
- Scaffolded strict Feature-Driven Architecture directory structure (`features/` and `shared/`) modeled after `educore-app`.
- Adapted and integrated Docker containerization and CI/CD pipelines from `vms-sdc` (`Dockerfile`, `docker-compose.yml`, `docker-compose.prod.yml`, `.dockerignore`, `.env.example`, `.github/workflows/ci.yml`, and `.github/workflows/cd.yml`).
- Initialized a brand new, unified `prisma/schema.prisma` with NextAuth v5 models and full domain entities ported from the legacy Supabase migrations (profiles, user roles, subscriptions, payments, trial subjects, cached lessons/quizzes, reminder notices, notification settings, webhook events).
- Configured Prisma 7 setup (`prisma.config.ts`, `lib/prisma.ts` with connection pooling and `@prisma/adapter-pg`).
- Configured Next.js 16 standalone output in `next.config.ts` and standard middleware pass-through in `proxy.ts`.
- Configured database scripts and seed execution in `package.json` and created `prisma/seed.ts`.
- Initialized workspace documentation standard folders under `docs/`.
- Verified TypeScript compilation (`npx tsc --noEmit`), ESLint linting (`npm run lint`), and Next.js standalone build (`npm run build`) pass cleanly with zero errors and zero warnings.
