# Data Model & Schema Synchronization: End-to-End Quiz Generation & Student Workflow Reliability

**Feature**: `008-fix-quiz-workflow-bugs`  
**Date**: 2026-11-24

---

## 1. Database Schema Synchronization (`prisma/schema.prisma` ↔ PostgreSQL)

No new models are added to `prisma/schema.prisma`; instead, the PostgreSQL database schema is synchronized with the existing `prisma/schema.prisma` definitions via a tracked idempotent migration (`prisma/migrations/20261124130000_sync_admin_config_and_quiz_sessions/migration.sql`).

### 1.1 `AdminConfig` (`@@map("admin_config")`)

| Field | Prisma Type | PostgreSQL Column Type | Default | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String @id` | `TEXT PRIMARY KEY` | `cuid()` / `'default_config'` | Existing |
| `monthlyPricePhp` | `Int` | `INTEGER NOT NULL` | `299` | Existing |
| `annualPricePhp` | `Int` | `INTEGER NOT NULL` | `2499` | Existing |
| `maxTrialSubjects` | `Int` | `INTEGER NOT NULL` | `3` | Existing |
| `maxFreeLessons` | `Int` | `INTEGER NOT NULL` | `3` | Existing |
| `targetLessonsPerSubject` | `Int` | `INTEGER NOT NULL` | `8` | Existing |
| `trialDurationDays` | `Int` | `INTEGER NOT NULL` | `30` | Existing |
| `availableQuestionCounts` | `String` | `TEXT NOT NULL` | `'5, 10, 15, 20'` | **Added by Migration** |
| `enableAiTutorTrial` | `Boolean` | `BOOLEAN NOT NULL` | `true` | Existing |
| `promoDiscountPercent` | `Int` | `INTEGER NOT NULL` | `20` | Existing |
| `updatedAt` | `DateTime` | `TIMESTAMP(3) NOT NULL` | `CURRENT_TIMESTAMP` | Existing |

### 1.2 `QuizSession` (`@@map("quiz_sessions")`)

| Field | Prisma Type | PostgreSQL Column Type | Default | Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `String @id` | `TEXT PRIMARY KEY` | `cuid()` | Existing |
| `userId` | `String?` | `TEXT NULL` | `NULL` | Existing |
| `subjectSlug` | `String` | `TEXT NOT NULL` | — | Existing |
| `lessonNumber` | `Int` | `INTEGER NOT NULL` | — | Existing |
| `lessonTitle` | `String` | `TEXT NOT NULL` | `''` | Existing |
| `mode` | `String` | `TEXT NOT NULL` | `'study'` | Existing |
| `questionCount` | `Int` | `INTEGER NOT NULL` | `10` | Existing |
| `activeQuestionIndex` | `Int` | `INTEGER NOT NULL` | `0` | **Added by Migration** |
| `questions` | `Json` | `JSONB NOT NULL` | — | Existing |
| `userAnswers` | `Json?` | `JSONB NULL` | `NULL` | Existing |
| `score` | `Int?` | `INTEGER NULL` | `NULL` | Existing |
| `total` | `Int?` | `INTEGER NULL` | `NULL` | Existing |
| `completedAt` | `DateTime?` | `TIMESTAMP(3) NULL` | `NULL` | Existing |
| `createdAt` | `DateTime` | `TIMESTAMP(3) NOT NULL` | `CURRENT_TIMESTAMP` | Existing |

**Indexes Synchronized**:
- `quiz_sessions_userId_completedAt_createdAt_idx` ON `"quiz_sessions"("userId", "completedAt", "createdAt")`
- `reminder_notices_userId_kind_idx` ON `"reminder_notices"("userId", "kind")`

---

## 2. Domain State Transitions & Validation Rules

### 2.1 Student Profile Onboarding State (`Profile`)
- **Initial Registration**: `hasOnboarded = false`, `gradeLevel = ""`, `track = ""`, `termPreference = ""`.
- **Onboarding Form Defaults**:
  - When `gradeLevel` is Senior High (`Grade 11` or `Grade 12`), `termPreference` MUST be one of `["Semester 1", "Semester 2"]` (default `"Semester 1"`), and `track` MUST be a valid SHS strand (default `"STEM Strand"`).
  - When `gradeLevel` is Junior High (`Grade 7`–`Grade 10`), `termPreference` MUST be one of `["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]` (default `"Quarter 1"`), and `track` is `"JHS Core"`.
- **Post-Onboarding**: `hasOnboarded = true`, `trial_subjects` remains empty (`0` enrolled subjects) until the student opens a lesson or starts a quiz.

### 2.2 Subject Enrollment Lifecycle (`TrialSubject`)
- **Passive Catalog / Outline Browsing** (`/curriculum` and `/curriculum/[slug]`): Does NOT create a `TrialSubject` record.
- **Active Learning Trigger** (`getLessonMaterialAction` on "View Lesson", `getQuizAction` on "Take Quiz", or `recordQuizAttemptAction` on quiz completion): Invokes `ensureSubjectEnrolledAction(subjectSlug)` which creates the `TrialSubject` record if the student has an active 30-day trial, an active subscription, or remaining trial slots.

### 2.3 DepEd DO 015 s. 2026 Grade Transmutation Domain Model
- **Input**: `score: number` ($0 \le \text{score} \le \text{total}$), `total: number` ($\text{total} > 0$).
- **Raw Percentage**: $P = (\text{score} / \text{total}) \times 100$.
- **Piecewise Transmutation Formula**:
  - If $P \ge 100$: $\text{Transmuted} = 100$
  - If $60 \le P < 100$: $\text{Transmuted} = \text{round}(75 + ((P - 60) \times 25) / 40)$
  - If $0 \le P < 60$: $\text{Transmuted} = \text{round}(60 + (P / 60) \times 14)$
- **Mastery Classification**:
  - $\text{Transmuted} \ge 75$ and $\text{total} \ge 10 \rightarrow$ `"Mastered"`
  - $\text{Transmuted} \ge 75$ and $\text{total} < 10 \rightarrow$ `"Practice Proficient"`
  - $\text{Transmuted} < 75 \rightarrow$ `"Needs Review"`
