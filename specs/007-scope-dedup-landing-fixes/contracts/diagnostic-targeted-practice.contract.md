# Contract: Diagnostic Mastery Visibility, Targeted Practice & Mastery-First Framing

**Contract ID**: `CTR-004-DIAGNOSTIC-AND-MASTERY-FIRST`  
**Feature**: `007-scope-dedup-landing-fixes`  
**Target Modules**:
- `features/curriculum/components/SubjectWeakPointsCard.tsx`
- `features/curriculum/actions/curriculum.actions.ts`
- `features/curriculum/utils/quiz-sampler.ts`
- `features/curriculum/components/LessonList.tsx`
- `features/curriculum/components/QuizRunner.tsx`
- `features/dashboard/components/StudentDashboardView.tsx`
- `features/landing/components/PopularSubjectsSection.tsx`
- `features/auth/lib/auth-client.ts`

---

## 1. Functional Scope & Objectives

This contract governs:
1. **Mastery-First Terminology**: Reframing all student-facing copy and badges from pass/fail testing to mastery readiness (`"Mastered"`, `"Practice Proficient"`, `"Mastery Target ≥ 75%"`).
2. **Accurate Diagnostic Visibility**: Hiding the diagnostic card completely for students with 0 attempted lessons (`totalAttemptedLessons === 0`), and responsive mobile wrapping for the diagnostic header and benchmark badge.
3. **Adaptive Targeted Practice Selection**: Prioritizing missed/unanswered questions (Tier 1) and concept-matched items (Tier 2) before generic pool fallback (Tier 3).
4. **Auth Client Log Cleanup**: Eliminating `[Sentinel]` warnings by removing the unused infrastructure plugin.

---

## 2. API & Action Contracts

### 2.1 `getSubjectWeakPointsAction(subjectSlug: string)`

```typescript
export async function getSubjectWeakPointsAction(
  subjectSlug: string
): Promise<SubjectWeakPointsResult>;
```

#### Pre-conditions:
- `subjectSlug` is a valid curriculum subject identifier.

#### Post-conditions:
- Returns `totalAttemptedLessons: number` reflecting the count of unique lessons with at least one recorded `QuizAttempt` by the user in that subject (`latestAttemptByLesson.size`).
- If `sessionUser` is unauthenticated or has zero attempts, returns `totalAttemptedLessons: 0` and `weakPoints: []`.
- Evaluates weak points based on the latest attempt per lesson: transmuted score `< 75` generates a weak point entry.

---

### 2.2 `selectTargetedPracticeQuestions(params)`

```typescript
export function selectTargetedPracticeQuestions(
  params: TargetedPracticeSelectionParams
): QuizQuestion[];
```

#### Assembly Algorithm:
1. **Tier 1 (Missed / Unanswered)**:
   - For each session in `previousSessions` (ordered newest first):
     - For each question `q` at index `idx`:
       - If `userAnswers?.[idx] !== q.answer`, attempt to match `q` to an entry in `pool` by question text.
       - If matched and not already in Tier 1, append to Tier 1.
2. **Tier 2 (Concept-Matched)**:
   - For questions remaining in `pool` (not in Tier 1):
     - Compute keyword match score against `keyConcepts` (case-insensitive substring and tokenized significant words ≥ 4 characters) across `question` and `explanation`.
     - Questions with `score > 0` are sorted descending by score and appended to Tier 2.
3. **Tier 3 (Pool Fallback)**:
   - Remaining questions in `pool` are shuffled using Fisher-Yates and appended to Tier 3.
4. **Return**:
   - `[...tier1, ...tier2, ...tier3].slice(0, count)`.

---

### 2.3 `createTargetedPracticeAction(rawInput: unknown)`

```typescript
export async function createTargetedPracticeAction(
  rawInput: unknown
): Promise<TargetedPracticeActionResult>;
```

#### Pipeline:
- Authenticates session user and verifies lesson access.
- Fetches full question pool via `getQuizAction`.
- Queries the user's prior `QuizSession` records for that lesson (`take: 5`, ordered by `createdAt: "desc"`).
- Fetches the lesson's diagnostic `keyConcepts` via `getLessonsAction`.
- Calls `selectTargetedPracticeQuestions({ pool, count, previousSessions, keyConcepts })`.
- Creates a new `QuizSession` in `mode: "study"` with the assembled questions and returns `redirectUrl`.

---

## 3. UI Component Contracts

### 3.1 `SubjectWeakPointsCard.tsx`
- **Zero-Attempt Invariant**: If `!data || data.totalAttemptedLessons === 0`, component returns `null` (completely unmounted).
- **Mastery Achieved Invariant**: If `data.totalAttemptedLessons > 0 && data.weakPoints.length === 0`:
  - Renders card with header: `"Diagnostic Mastery Achieved"`.
  - Benchmark badge: `"Mastery Target ≥ 75%"` with `shrink-0 whitespace-nowrap`.
  - Header layout: `flex flex-wrap items-center gap-2`.
- **Weak Points Mode**:
  - CardHeader layout: `flex flex-wrap items-start sm:items-center justify-between gap-2`.
  - Badge: `{data.totalWeakPoints} ... Under 75%` with `shrink-0 whitespace-nowrap`.
  - Description: Contains `"Based on your latest attempt per lesson, these topics scored below the 75% mastery benchmark..."`.
  - Targeted Practice Button:
    - Removes `<Sparkles />` icon.
    - Uses `w-full sm:w-auto justify-center` for full-width touch area on mobile screens.

### 3.2 `LessonList.tsx` & `QuizRunner.tsx`
- Header: `"Curriculum Lessons (X)"` row uses `flex flex-wrap items-center justify-between gap-2`.
- Status: Achievement badge renders `"Practice Proficient ({stat.transmutedGrade}%)"` or `"Mastered"`.
- Mode: Replaces `"DO 015 Graded"` with `"Exam Mode (Graded)"`.

### 3.3 `StudentDashboardView.tsx` & `PopularSubjectsSection.tsx`
- Dashboard summary badge: `"Mastery Avg"` (replaces `"DO 015 Transmuted Avg"`).
- Popular subject cards: Remove repetitive `<Badge variant="outline">DepEd DO 015 s. 2026</Badge>`.

---

## 4. Auth Client Contract (`features/auth/lib/auth-client.ts`)

- MUST NOT import `@better-auth/infra/client` or register `sentinelClient()`.
- Exported `authClient` initializes cleanly with `{}`.
- Zero `[Sentinel]` warnings emitted to browser console.
