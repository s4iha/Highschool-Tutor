# Server Action Contracts: Quiz Session Auto-Persistence & Resumption

**Feature**: `002-ui-and-learning-enhancements`  
**File**: `features/curriculum/actions/quiz-session.actions.ts`  
**Purpose**: Defines typed Next.js Server Actions for auto-persisting quiz progress, checking for incomplete sessions, resuming sessions seamlessly, and discarding abandoned sessions.  

---

## 1. Action: `saveQuizProgressAction`

Incremental auto-save called as the student interacts with quiz questions (answering questions, changing options, or navigating between questions).

### Signature
```typescript
export async function saveQuizProgressAction(
  input: SaveQuizProgressInput
): Promise<SaveQuizProgressResult>
```

### Input Schema (Zod)
```typescript
import { z } from "zod";

export const saveQuizProgressInputSchema = z.object({
  sessionId: z.string().cuid(),
  activeQuestionIndex: z.number().int().min(0),
  userAnswers: z.record(
    z.string().regex(/^\d+$/), // stringified question index key
    z.enum(["A", "B", "C", "D"])
  ),
});

export type SaveQuizProgressInput = z.infer<typeof saveQuizProgressInputSchema>;
```

### Output Schema
```typescript
export interface SaveQuizProgressResult {
  success: boolean;
  savedAnswersCount?: number;
  lastSavedAt?: Date;
  error?: string;
}
```

### Invariants & Business Logic
1. **Ownership Enforcement**: If `session.userId` is present, `currentUser.id` must match `session.userId`.
2. **State Protection**: If `session.completedAt` is not null (session already submitted), reject update with `ALREADY_COMPLETED`.
3. **Database Mutation**: Updates `userAnswers` (as `Prisma.InputJsonValue`) and `activeQuestionIndex` in `QuizSession`.
4. **Client Calling Strategy**: Debounced by 300ms on option selection; triggered immediately on next/previous navigation or page unload.

---

## 2. Action: `getActiveQuizSessionAction`

Surfaces active incomplete quiz sessions on the Student Dashboard (`/dashboard`) and Subject Curriculum page (`/curriculum/[slug]`).

### Signature
```typescript
export async function getActiveQuizSessionAction(
  subjectSlug?: string
): Promise<GetActiveQuizSessionResult>
```

### Input Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `subjectSlug` | `string` | No | If provided, scopes the search to incomplete sessions for this specific subject. If omitted, searches across all subjects for the user. |

### Output Schema
```typescript
export interface ActiveQuizSessionSummary {
  sessionId: string;
  subjectSlug: string;
  subjectCode: string;
  subjectName: string;
  lessonNumber: number;
  lessonTitle: string;
  mode: "study" | "exam";
  questionCount: number;
  answeredCount: number;
  activeQuestionIndex: number;
  createdAt: Date;
  resumeUrl: string;
}

export interface GetActiveQuizSessionResult {
  success: boolean;
  hasActiveSession: boolean;
  session?: ActiveQuizSessionSummary;
  error?: string;
}
```

### Invariants & Business Logic
1. **User Requirement**: Requires authenticated session (`getCurrentUser()`). Returns `{ success: true, hasActiveSession: false }` for unauthenticated guests.
2. **Session Selection Query**:
   ```typescript
   const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
   const session = await prisma.quizSession.findFirst({
     where: {
       userId: sessionUser.id,
       completedAt: null,
       createdAt: { gte: fourteenDaysAgo },
       ...(subjectSlug ? { subjectSlug } : {}),
     },
     orderBy: { createdAt: "desc" },
   });
   ```
3. **Answer Count Computation**: Reads `session.userAnswers` JSON map, counting keys with valid option values (`"A" | "B" | "C" | "D"`).
4. **Resume URL Construction**: Generates `/curriculum/${session.subjectSlug}/quiz/${session.lessonNumber}?sessionId=${session.id}&mode=${session.mode}`.

---

## 3. Action: `discardQuizSessionAction`

Allows the student to cancel and discard an incomplete quiz session from the resumption banner so they can configure a fresh attempt.

### Signature
```typescript
export async function discardQuizSessionAction(
  sessionId: string
): Promise<{ success: boolean; error?: string }>
```

### Invariants & Business Logic
1. **Ownership Enforcement**: Verifies `session.userId === currentUser.id`.
2. **Session Cleanup**: Marks `completedAt: new Date()` or deletes the incomplete record to remove it from active session queries.
3. **Cache Invalidation**: Query keys `["active-quiz-session"]` and `["student-dashboard-data"]` are invalidated.

---

## 4. Updated Action: `getQuizSessionAction`

Updated to return `userAnswers` and `activeQuestionIndex` so `QuizRunner` can restore state on load.

### Signature
```typescript
export async function getQuizSessionAction(sessionId: string): Promise<{
  success: boolean;
  session?: {
    id: string;
    subjectSlug: string;
    lessonNumber: number;
    lessonTitle: string;
    mode: "study" | "exam";
    questionCount: number;
    questions: QuizQuestion[];
    userAnswers: Record<number, "A" | "B" | "C" | "D">;
    activeQuestionIndex: number;
    completedAt: Date | null;
    score: number | null;
    total: number | null;
  };
  error?: string;
}>
```

### Exam Mode Security Invariant
In `exam` mode with `completedAt === null`:
- `questions` returned have `answer: ""` and `explanation: ""` to prevent devtools inspection.
- `userAnswers` contains the student's previously selected options.
- `activeQuestionIndex` points to the restored question cursor.
