# Quickstart & End-to-End Validation Guide: `008-fix-quiz-workflow-bugs`

**Feature**: End-to-End Quiz Generation & Student Workflow Reliability  
**Spec**: [spec.md](./spec.md) | **Data Model**: [data-model.md](./data-model.md)

---

## 1. Prerequisites & Database Migration

1. Ensure PostgreSQL is running and `.env.local` has valid `DATABASE_URL` and `GEMINI_API_KEY`.
2. Apply pending Prisma migrations to synchronize `admin_config.availableQuestionCounts` and `quiz_sessions.activeQuestionIndex`:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

---

## 2. Automated Verification Commands

Run the full verification suite:

```bash
npm run lint
npm test
npm run build
```

Expected outcome:
- Zero ESLint errors or warnings.
- All unit and integration tests pass, including new tests covering:
  - DepEd DO 015 s. 2026 transmutation parity (`60% raw -> 75% transmuted`).
  - `getLessonsAction` fallback to curated MATATAG syllabus when Gemini fails.
  - `ensureSubjectEnrolledAction` and `getDashboardDataAction` resilience when `AdminConfig` lookup fails.
  - `getSubjectProgressAction` unauthenticated guard.
  - `LessonQuizPage` / `canAccessLesson` 30-day active trial access for Lessons 1–8.

---

## 3. End-to-End Manual Workflow Verification

1. **Account Creation & Onboarding**:
   - Visit `/register` in a fresh browser session and create a new student account.
   - Verify `<OnboardingModal />` opens with `Grade 11`, `Semester 1`, and `STEM Strand` pre-selected.
   - Click **Get Started** without changing dropdowns and verify the dashboard loads immediately with the student's name, `Grade 11 • STEM Strand`, and `0` Enrolled Subjects (no page refresh required).
2. **Choosing a Subject & Viewing a Lesson**:
   - Navigate to `/curriculum`, click **Explore Subject** on any subject (e.g., General Mathematics).
   - Click **View Lesson** on Lesson 1. Verify the lesson modal opens and the subject is now listed under **Enrolled Subjects** on `/dashboard`.
3. **Attempting & Resuming a Quiz (Lessons 1–8 during 30-Day Trial)**:
   - On `/curriculum/g11-s1-genmath`, click **Take Quiz** on Lesson 4, select `10 Qs` and **Study Mode**.
   - Verify the quiz loads without redirecting back to `/curriculum/g11-s1-genmath?upgrade=true` and without any `P2022` database errors.
   - Answer 3 questions, return to `/curriculum/g11-s1-genmath`, and click **Resume Quiz** on the `In-Progress Quiz` banner.
   - Verify the quiz resumes at Question 3/4 with the 3 saved answers intact.
   - Complete and submit the quiz, then verify the transmuted grade matches across the Quiz Results screen, Recent Practice Tests, and Dashboard Overview Mastery Average.
