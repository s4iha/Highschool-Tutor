# Task 001 - Scaffold Feature-Driven Architecture, CI/CD, and Prisma Schema

**Skills to be used**: `task-implementation`, `antigravity-guide`

## Description
Scaffold the `highschool-tutor` project with a strict Feature-Driven Architecture (FDA) modeled after `educore-app`. Adapt the Docker and CI/CD configuration files from `vms-sdc` (`Dockerfile`, `docker-compose.yml`, `docker-compose.prod.yml`, `.dockerignore`, `.env.example`, `.github/workflows/ci.yml`, and `cd.yml`). Design and write a complete `schema.prisma` file capturing the core domain entities from the previous prototype (profiles, user roles, subscriptions, payments, trial subjects, cached lessons/quizzes, reminder notices, notification settings, webhook events) alongside NextAuth models. Configure Next.js standalone build in `next.config.ts` and set up the directory layout for features and shared components.

## Verification Checklist
- [x] Initialize standard `docs/` subdirectories per workspace standard
- [x] Scaffold Feature-Driven Architecture folders (`features/` and `shared/`) mirroring `educore-app`
- [x] Adapt and populate `Dockerfile`, `docker-compose.yml`, `docker-compose.prod.yml`, `.dockerignore`, and `.env.example`
- [x] Adapt and populate `.github/workflows/ci.yml` and `.github/workflows/cd.yml`
- [x] Configure `next.config.ts` with standalone output
- [x] Design and create complete `prisma/schema.prisma` with all entities and Prisma client configuration
- [x] Provide Prisma client singleton in `lib/prisma.ts`
- [x] Build and unit tests pass cleanly without errors (`npm run build`)
