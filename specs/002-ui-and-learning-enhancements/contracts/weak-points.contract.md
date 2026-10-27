# Server Action Contracts: Diagnostic Weak Points by Topic

**Feature**: `002-ui-and-learning-enhancements`  
**File**: `features/curriculum/actions/curriculum.actions.ts`  
**Purpose**: Defines typed Server Actions for calculating subject topic-level weak points under DepEd DO 015 s. 2026 standards using the Latest Attempt Rule, surfacing sub-topic Key Concept tags, and launching 1-click targeted remedial practice.  

---

## 1. Action: `getSubjectWeakPointsAction`

Evaluates the student's most recent quiz attempt for each lesson topic in the given subject, identifying topics where the transmuted score is below the DepEd passing threshold (< 75%).

### Signature
```typescript
export async function getSubjectWeakPointsAction(
  subjectSlug: string
): Promise<GetSubjectWeakPointsResult>
```

### Input Schema (Zod)
```typescript
import { z } from "zod";

export const getSubjectWeakPointsInputSchema = z.object({
  subjectSlug: z.string().min(1),
});
```

### Output Schema
```typescript
export interface WeakPointTopic {
  lessonNumber: number;
  lessonTitle: string;
  latestScore: number;
  totalQuestions: number;
  rawPercentage: number;
  transmutedScore: number;
  status: "Needs Review";
  attemptedAt: Date;
  keyConcepts: string[];
  practiceUrl: string;
}

export interface GetSubjectWeakPointsResult {
  success: boolean;
  hasWeakPoints: boolean;
  totalTopicsAnalyzed: number;
  weakTopics: WeakPointTopic[];
  masteredTopicsCount: number;
  error?: string;
}
```

### Invariants & Business Logic

1. **Authentication Requirement**:
   - Queries `getCurrentUser()`. If unauthenticated, returns `{ success: true, hasWeakPoints: false, totalTopicsAnalyzed: 0, weakTopics: [], masteredTopicsCount: 0 }`.

2. **Latest Attempt Rule (Clarification 4)**:
   - Query all `QuizAttempt` records for the user and subject, ordered by `createdAt: "desc"`:
     ```typescript
     const attempts = await prisma.quizAttempt.findMany({
       where: {
         userId: sessionUser.id,
         subjectSlug,
       },
       orderBy: { createdAt: "desc" },
     });
     ```
   - Deduplicate by `lessonNumber`, keeping only the first record encountered (the student's **most recent attempt**).

3. **DepEd DO 015 s. 2026 Transmutation Standard**:
   - For each latest attempt:
     ```typescript
     const percentage = a.total > 0 ? (a.score / a.total) * 100 : 0;
     let transmuted = 60;
     if (percentage >= 100) {
       transmuted = 100;
     } else if (percentage >= 60) {
       transmuted = Math.round(75 + ((percentage - 60) * 25) / 40);
     } else {
       transmuted = Math.round(60 + (percentage / 60) * 14);
     }
     ```
   - **Passing Threshold**: `transmuted >= 75` represents DepEd passing mastery.
   - **Weak Point Condition**: If `transmuted < 75`, the topic is classified as an active Weak Point.
   - **Retake Resolution**: If the student retakes the quiz and achieves `transmuted >= 75`, that latest attempt immediately clears the lesson topic from the Weak Points list.

4. **Key Concepts Extraction**:
   - For weak topics, retrieve sub-topic `keyConcepts` from `CachedLesson` in PostgreSQL (or curriculum generator):
     ```typescript
     const cached = await prisma.cachedLesson.findUnique({ where: { subjectSlug } });
     // Find lesson by number and extract keyConcepts array (e.g. ["Mole Concept", "Stoichiometry", "Molar Mass"])
     ```

5. **Practice URL Target**:
   - Constructs direct 1-click launch URL: `/curriculum/${subjectSlug}/quiz/${lessonNumber}?mode=study&count=10&ref=weak_point`.

---

## 2. Action: `createTargetedPracticeAction`

1-click action to initialize an immediate, dedicated remedial practice session for a flagged weak topic.

### Signature
```typescript
export async function createTargetedPracticeAction(
  subjectSlug: string,
  lessonNumber: number
): Promise<{ success: boolean; sessionId?: string; practiceUrl?: string; error?: string }>
```

### Invariants & Business Logic
1. Creates a `QuizSession` configured specifically for targeted remediation:
   - `mode: "study"`
   - `questionCount: 10`
   - Filtered or sampled from questions matching the weak lesson topic.
2. Returns direct `sessionId` and `practiceUrl` for seamless client navigation without modal friction.
