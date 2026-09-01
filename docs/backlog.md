# Project Backlog & Change Log

## [2026-09-01]
### Task 004 - Toast Integration, Tier Guardrails, Auth System Alignment, Admin Portal, Testing & Documentation
- Configured Sonner toast system with OKLCH status tokens (`--success`, `--warning`, `--info`, `--destructive`) across light and dark modes in `app/globals.css` and mounted `<Toaster />` globally.
- Aligned `AuthPage` design system with global theme tokens (`bg-primary`, `text-primary-foreground`) and integrated official logo (`/logo/highschool-tutor-bg-removed.png`).
- Reorganized `SubjectCatalog` with structured category headings for Junior High School (Grades 7–10) and Senior High School STEM (Grades 11–12) with grade level filter tabs.
- Implemented Free Tier vs. Premium Tier guardrails (max 3 trial subjects, first 3 lessons accessible) with `<UpgradeModal />` and Sonner toast triggers in `LessonList`.
- Built Unified Admin Portal (`/admin`) powered by TanStack Query (`useAdminPortal.ts`) and versioned Next.js App Router Route Handlers (`app/api/v1/admin/metrics`, `students`, `settings`).
- Setup Jest testing suite with `ts-jest` for CI with 16 unit test cases covering tier guardrails, curriculum data, and schema validation.
- Created landing page screenshot specifications in `docs/resources/landing-page-screenshots.md` and completed PRD, Database Schema, and API Endpoints documentation in `docs/`.
- Verified TypeScript compilation (`npx tsc --noEmit`), ESLint linting (`npm run lint`), Jest tests (`npm run test`), and Next.js production build (`npm run build`) pass with 0 errors.

### Task 003 - Pagination, Auth UI, Hybrid Lessons, and Dark Mode
- Added `next-themes` and `ThemeToggle` for dark mode support.
- Refactored `AITutorDrawer` trigger into a Floating Action Button in `QuizRunner`.
- Built split-screen `AuthPage` for `/login` and `/register` based on premium design.
- Implemented pagination for 130 subjects in `SubjectCatalog`.
- Configured TanStack `QueryProvider` and `ThemeProvider` in root layout.
- Cleaned up `Navbar` (added new logo, removed badges).
- Verified Hybrid Lesson population strategy in `curriculum.actions.ts`.

### Task 002 - Transfer Curriculum, Lesson Viewer, and AI Quiz Engine
- Transferred DepEd Philippine K-12 and MATATAG curriculum metadata, course codes, and schemas for Junior High School (Grades 7–10) and Senior High School STEM (Grades 11–12) into `features/curriculum/`.
- Integrated Google Gemini 2.5 AI REST service (`gemini-service.ts`) for on-demand quiz question generation, lesson outlines, real-time Socratic AI tutoring, and multi-dialect translation (English, Filipino, Taglish, Cebuano, Ilocano).
- Built Next.js Server Actions (`curriculum.actions.ts`) with PostgreSQL Prisma caching layer (`cached_lessons` and `cached_quizzes`) and persistent attempt recording (`quiz_attempts`).
- Installed and styled core Shadcn UI component primitives in `shared/components/ui/` with modern HSL tokens and Tailwind CSS v4.
- Implemented rich, responsive frontend components: `SubjectCatalog`, `LessonList`, `QuizRunner`, `AITutorDrawer`, `TranslationControls`, `Navbar`, and `CurriculumGuard`.
- Configured dynamic App Router pages: `app/page.tsx`, `app/curriculum/[slug]/page.tsx`, and `app/curriculum/[slug]/quiz/[lesson]/page.tsx`.
- Verified TypeScript compilation (`npx tsc --noEmit`), ESLint linting (`npm run lint`), and Next.js production build (`npm run build`) pass cleanly with 0 errors.

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
