# API Endpoints & Server Actions Reference

This document outlines all Next.js App Router Route Handlers (`app/api/...`) and Server Actions (`features/*/actions/...`) available in the HighSchool Tutor system.

---

## 1. Administrative Route Handlers (API v1)

### 1.1 `GET /api/v1/admin/metrics`
Retrieves aggregated platform KPI metrics and student activity summary.
- **Access**: `ADMIN` role
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalStudents": 1240,
      "activeSubscriptions": 382,
      "revenuePhp": 284500,
      "pendingPayments": 14,
      "totalQuizAttempts": 8920,
      "conversionRate": "30.8%",
      "monthlyGrowth": "+18.4%"
    }
  }
  ```

### 1.2 `GET /api/v1/admin/students`
Fetches paginated student subscriber records with optional search and status filters.
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string, student name or email)
  - `status` (string: `all` | `ACTIVE` | `TRIAL` | `PENDING` | `EXPIRED`)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "students": [
        {
          "id": "usr_01",
          "name": "Juan Dela Cruz",
          "email": "juan.delacruz@manilashs.edu.ph",
          "gradeLevel": "Grade 11 STEM",
          "school": "Manila Science High School",
          "subscriptionStatus": "ACTIVE",
          "plan": "ANNUAL",
          "trialSubjectsCount": 8,
          "quizAttemptsCount": 42,
          "joinedAt": "2026-08-15T08:30:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    }
  }
  ```

### 1.3 `PATCH /api/v1/admin/students`
Updates a student's subscription status.
- **Payload**:
  ```json
  {
    "userId": "usr_01",
    "status": "ACTIVE",
    "plan": "ANNUAL"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Subscription status updated to ACTIVE for user usr_01"
  }
  ```

### 1.4 `GET /api/v1/admin/settings` & `PATCH /api/v1/admin/settings`
Reads or updates SaaS pricing and free tier guardrail limits.
- **Payload (PATCH)**:
  ```json
  {
    "monthlyPricePhp": 199,
    "annualPricePhp": 1499,
    "maxTrialSubjects": 3,
    "maxFreeLessons": 3,
    "gcashReceiverNumber": "0917-888-4321",
    "mayaReceiverNumber": "0918-999-8765"
  }
  ```

---

## 2. Curriculum Server Actions (`curriculum.actions.ts`)

| Action | Parameters | Description |
|---|---|---|
| `getLessonsAction(subjectSlug)` | `subjectSlug: string` | Fetches cached lesson outline or generates via Gemini AI fallback. |
| `getQuizQuestionsAction(subjectSlug, lessonNumber)` | `subjectSlug: string, lessonNumber: number` | Fetches 4-option quiz questions with explanations. |
| `getSubjectProgressAction(subjectSlug)` | `subjectSlug: string` | Aggregates learner attempt scores and passing mastery status. |
| `recordQuizAttemptAction(input)` | `RecordAttemptInput` | Records score, total questions, and mode (`study` \| `exam`). |
| `askGeminiTutorAction(input)` | `AskTutorInput` | Socratic AI tutor streaming / chat in English, Filipino, Taglish, Cebuano, etc. |
| `translateExplanationAction(input)` | `TranslateInput` | Multi-dialect translation for lesson summaries and quiz explanations. |

---

## 3. Tier Guardrail Rules & Enforcements

| Rule | Free Tier Limit | Premium Tier |
|---|---|---|
| Trial Subjects | Up to 3 subjects (`TrialSubject` table) | Unlimited 130+ subjects |
| Lesson Access | Lessons 1, 2, and 3 | All lessons (1 through 12) |
| Locked Interception | Triggers `UpgradeModal` + Sonner warning toast | Direct access granted |
