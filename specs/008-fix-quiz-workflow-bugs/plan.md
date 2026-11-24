# Implementation Plan: End-to-End Quiz Generation & Student Workflow Reliability

**Branch**: `008-fix-quiz-workflow-bugs` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/008-fix-quiz-workflow-bugs/spec.md`

---

## Summary

Resolve the root causes of quiz question generation failure (`P2022 ColumnNotFound` on `admin_config.availableQuestionCounts` and `quiz_sessions.activeQuestionIndex`, Gemini output token truncation on 24-question JSON responses, and missing lesson outline fallback) and fix all bugs across the student lifecycle (**Account Creation → Onboarding → Choosing a Subject → Attempting & Resuming a Quiz**).

---

## Technical Context

**Language/Version**: TypeScript 5.x (Strict Mode), Node.js 20+  
**Primary Dependencies**: Next.js 16.3.3 (App Router), React 19.2.8, Prisma ORM 7.9.1 (`@prisma/adapter-pg`), TanStack Query v5, Zustand v5, Zod v4, Tailwind CSS v4, Shadcn UI  
**Storage**: PostgreSQL 15+ (with Row-Level Security policies and tracked SQL migrations in `prisma/migrations/`)  
**Testing**: Jest 30.5.0 with `ts-jest`  
**Target Platform**: Web application (Desktop & Mobile responsive)  
**Project Type**: Feature-Driven Architecture (FDA) Next.js SaaS web application  
**Performance Goals**: 24-question Gemini quiz generation without JSON truncation (`maxOutputTokens: 8192`); instant client cache synchronization on login/register/onboarding (`<100ms` state transition); zero unhandled `P2022` database exceptions  
**Constraints**: Minimum Gemini model `gemini-3.5-flash-lite`; strict DepEd Order No. 015, s. 2026 transmutation compliance (`60% raw = 75% passing`); zero raw SQL outside migrations; no `useEffect` syncing TanStack Query into Zustand  
**Scale/Scope**: 108 distinct DepEd JHS/SHS subjects (228 canonical grade/term slugs), 8 lessons per subject, 24 cached questions per lesson

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Enforcement in This Plan |
| :--- | :--- | :--- |
| **I. Feature-Driven Architecture (FDA) Modularity** | ✅ PASS | All domain logic resides in `features/curriculum/`, `features/auth/`, and `features/dashboard/`. App Router pages in `app/(dashboard)/` only wire route params/guards to feature components. |
| **II. Strict State Management & Unidirectional Flow** | ✅ PASS | Authentication, onboarding, and logout explicitly invalidate/clear TanStack Query keys (`["currentUser"]`, `["student", "dashboard-data"]`) without syncing query results into Zustand. |
| **III. DepEd MATATAG Curriculum Compliance (DO 015, s. 2026)** | ✅ PASS | Unifies all grade transmutations under `features/curriculum/utils/transmutation.ts` (`60% raw -> 75% transmuted`), removing the non-compliant linear formula in `dashboard.actions.ts`. |
| **IV. Socratic AI Tutoring Integrity & Multi-Dialect Accessibility** | ✅ PASS | Maintains `gemini-3.5-flash-lite` minimum baseline, passes the student's saved `tutoringPersona` to `AITutorDrawer`, and enables premium dialects for active subscribers. |
| **V. Zero-Mock Quality Assurance & Production Verification** | ✅ PASS | Synchronizes PostgreSQL schema via a tracked SQL migration (`prisma/migrations/`) and validates all changes via `npm run lint`, `npm test`, and `npm run build`. |

---

## Project Structure

### Documentation (this feature)

```text
specs/008-fix-quiz-workflow-bugs/
├── plan.md                                  # This file (/speckit-plan output)
├── research.md                              # Phase 0 research & root-cause decisions
├── data-model.md                            # Phase 1 schema & state transition model
├── quickstart.md                            # Phase 1 end-to-end validation guide
├── checklists/
│   └── requirements.md                      # Specification quality checklist
└── contracts/
    └── workflow-fixes.contract.md           # Server action, utility & route contracts
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma
└── migrations/
    └── 20261124130000_sync_admin_config_and_quiz_sessions/
        └── migration.sql                    # [NEW] Idempotent migration for availableQuestionCounts, activeQuestionIndex & indexes

app/
└── (dashboard)/
    └── curriculum/
        └── [slug]/
            ├── page.tsx                     # [MODIFY] Pass server-resolved isSubscribed to LessonList
            └── quiz/
                └── [lesson]/
                    └── page.tsx             # [MODIFY] Pass full 30-day trial status to canAccessLesson & accept sessionId/session param

features/
├── auth/
│   └── components/
│       ├── AuthPage.tsx                     # [MODIFY] Invalidate ["currentUser"] & ["student", "dashboard-data"] on login/register
│       └── OnboardingModal.tsx              # [MODIFY] Fix default SHS termPreference ("Semester 1" for Grade 11/12) & invalidate dashboard query
├── curriculum/
│   ├── actions/
│   │   ├── curriculum.actions.ts            # [MODIFY] Resilient AdminConfig lookup, curated MATATAG fallback in getLessonsAction, trialStatus.isExpired in canAccessSubject, auth guard in getSubjectProgressAction, shared DO 015 transmutation
│   │   ├── lesson-material.actions.ts       # [MODIFY] Auto-enroll subject via ensureSubjectEnrolledAction on View Lesson
│   │   └── quiz-session.actions.ts          # [MODIFY] Parse AdminConfig.availableQuestionCounts & resilient config lookup
│   ├── api/
│   │   └── gemini-service.ts                # [MODIFY] Set maxOutputTokens: 8192 for structured JSON generations on gemini-3.5-flash-lite
│   ├── components/
│   │   ├── LessonList.tsx                   # [MODIFY] Derive effective isSubscribed from prop/user & handle ?upgrade=true modal trigger
│   │   ├── LessonReaderModal.tsx            # [MODIFY] Invalidate dashboard enrolled subjects query when lesson material opens
│   │   └── QuizRunner.tsx                   # [MODIFY] Accept session/sessionId param, pass user tutoringPersona to AITutorDrawer, fix isPremiumUser for subscribers, surface specific generation error messages, use shared DO 015 transmutation
│   ├── schemas/
│   │   └── curriculum.schema.ts             # [MODIFY] Allow Quarter 1-4 in subjectSchema.term regex
│   └── utils/
│       └── transmutation.ts                 # [NEW] Shared DepEd DO 015 s. 2026 transmutation & remarks utility
└── dashboard/
    ├── actions/
    │   └── dashboard.actions.ts             # [MODIFY] Resilient AdminConfig lookup & use shared DO 015 calculateDepEdTransmutation
    └── components/
        └── DashboardSidebar.tsx             # [MODIFY] Clear TanStack Query cache on logout
```

**Structure Decision**: Existing Feature-Driven Architecture (FDA) layout is preserved. One new shared curriculum utility (`features/curriculum/utils/transmutation.ts`) and one new Prisma SQL migration (`prisma/migrations/20261124130000_sync_admin_config_and_quiz_sessions/migration.sql`) are added.

---

## Skills Allocation Matrix

| Skill Name | Path | Assigned Responsibility in This Task |
| :--- | :--- | :--- |
| `systematic-debugging` | `C:\Users\Dell\.gemini\skills\systematic-debugging\SKILL.md` | Root-cause isolation of `P2022` missing columns (`availableQuestionCounts`, `activeQuestionIndex`), stale `["currentUser"]` auth cache, and `?sessionId=` vs `?session=` mismatch |
| `senior-backend` | `C:\Users\Dell\.gemini\skills\senior-backend\SKILL.md` | Idempotent PostgreSQL migration, resilient `AdminConfig` server action helpers, Gemini 24-question `maxOutputTokens: 8192` config, and curated MATATAG syllabus fallback |
| `frontend-ui-engineering` | `C:\Users\Dell\.gemini\skills\frontend-ui-engineering\SKILL.md` | TanStack Query cache invalidation in `AuthPage`, `OnboardingModal`, `DashboardSidebar`, `LessonReaderModal`, and actionable error feedback in `QuizRunner` |
| `design-taste-frontend` | `C:\Users\Dell\.gemini\skills\design-taste-frontend\SKILL.md` | Cohesive, anti-slop UI polish on `QuizRunner` error/retry states and `LessonList` upgrade modal transitions |
| `color-theory` | `C:\Users\Dell\.gemini\skills\color-theory\SKILL.md` | Semantic status badge harmony for DepEd DO 015 s. 2026 mastery levels (`Mastered`, `Practice Proficient`, `Needs Review`) |
| `dark-mode-generation` | `C:\Users\Dell\.gemini\skills\dark-mode-generation\SKILL.md` | Accessible light/dark mode contrast preservation on quiz error alerts and diagnostic cards |
| `security-and-hardening` | `C:\Users\Dell\.gemini\skills\security-and-hardening\SKILL.md` | Server-side 30-day trial and subscription entitlement guards in `LessonQuizPage`, `ensureSubjectEnrolledAction`, and unauthenticated query protection in `getSubjectProgressAction` |
| `test-driven-development` | `C:\Users\Dell\.gemini\skills\test-driven-development\SKILL.md` | Red-Green-Refactor unit and contract tests for DO 015 transmutation, trial guardrails, and curriculum/quiz actions |
| `code-review-and-quality` | `C:\Users\Dell\.gemini\skills\code-review-and-quality\SKILL.md` | Five-axis verification (`npm run lint`, `npm test`, `npm run build`) and elimination of duplicated transmutation formulas |

---

## Complexity Tracking

No Constitution violations exist. All fixes simplify and unify existing domain boundaries.
