# Prisma Schema & Database Reference

This document provides complete architectural specifications for all Prisma ORM entities, enums, relations, and indexes in the HighSchool Tutor platform.

---

## 1. Entity-Relationship Overview

```
 [User] 1 ──── 1 [Profile]
   │
   ├──── * [Account]
   ├──── * [Session]
   ├──── * [UserRole]
   ├──── * [Subscription] 1 ──── * [Payment]
   ├──── * [TrialSubject]
   ├──── * [QuizAttempt]
   ├──── 1 [NotificationSettings]
   └──── * [ReminderNotice]

 [CachedLesson]  (subjectSlug @unique)
 [CachedQuiz]    (@@unique([subjectSlug, lessonNumber]))
 [WebhookEvent]  (@@unique([provider, eventKey]))
```

---

## 2. Authentication & Core User Models

### 2.1 `User` (`users`)
Core user identity compatible with NextAuth.js v5.
- `id` (String, CUID, Primary Key)
- `name` (String, nullable)
- `email` (String, unique, nullable)
- `emailVerified` (DateTime, nullable)
- `image` (String, nullable)
- `createdAt` (DateTime, default `now()`)
- `updatedAt` (DateTime, auto-updated)

### 2.2 `UserRole` (`user_roles`)
Role assignment (`ADMIN`, `STUDENT`).
- `id` (String, CUID, Primary Key)
- `userId` (String, Foreign Key -> `users.id` on delete Cascade)
- `role` (`AppRole` enum: `ADMIN` | `STUDENT`, default `STUDENT`)
- `createdAt` (DateTime, default `now()`)
- `@@unique([userId, role])`

### 2.3 `Profile` (`profiles`)
Extended Philippine student profile.
- `id` (String, Primary Key -> `users.id` on delete Cascade)
- `fullName` (String, default `""`)
- `email` (String, default `""`)
- `school` (String, default `""`)
- `gradeLevel` (String, default `""`)
- `referralCode` (String, unique, CUID)
- `referrer` (String, default `""`)
- `referredById` (String, nullable, Foreign Key -> `profiles.id`)

---

## 3. Subscriptions & Payments

### 3.1 `Subscription` (`subscriptions`)
Tracks recurring or annual SaaS plan status.
- `id` (String, CUID, Primary Key)
- `userId` (String, Foreign Key -> `users.id` on delete Cascade)
- `plan` (`SubPlan` enum: `MONTHLY` | `ANNUAL`)
- `status` (`SubStatus` enum: `TRIAL` | `PENDING` | `ACTIVE` | `EXPIRED`, default `PENDING`)
- `amountPhp` (Int, e.g. 199 or 1499)
- `startedAt` (DateTime, nullable)
- `expiresAt` (DateTime, nullable)
- `@@index([userId])`

### 3.2 `Payment` (`payments`)
Payment receipts and GCash / Maya reference matching.
- `id` (String, CUID, Primary Key)
- `userId` (String, Foreign Key -> `users.id` on delete Cascade)
- `subscriptionId` (String, nullable, Foreign Key -> `subscriptions.id` on delete SetNull)
- `amountPhp` (Int)
- `method` (String, default `"gcash"`)
- `referenceNo` (String)
- `proofPath` (String, nullable)
- `status` (`PaymentStatus` enum: `PENDING` | `VERIFIED` | `REJECTED`, default `PENDING`)
- `paidAt` (DateTime, default `now()`)
- `verifiedAt` (DateTime, nullable)
- `adminNotes` (String, nullable)
- `@@index([userId])`

---

## 4. Curriculum, Caching & Quiz Engine

### 4.1 `TrialSubject` (`trial_subjects`)
Enforces the Free Tier guardrail constraint (Max 3 trial subjects).
- `id` (String, CUID, Primary Key)
- `userId` (String, Foreign Key -> `users.id` on delete Cascade)
- `subjectSlug` (String)
- `subjectLabel` (String, default `""`)
- `createdAt` (DateTime, default `now()`)
- `@@unique([userId, subjectSlug])`
- `@@index([userId])`

### 4.2 `CachedLesson` (`cached_lessons`)
Caches structured lesson outlines to minimize Google Gemini API token usage.
- `id` (String, CUID, Primary Key)
- `subjectSlug` (String, unique)
- `subjectLabel` (String)
- `lessons` (JSON: array of lesson objects with number, title, summary, keyConcepts)
- `createdAt` (DateTime, default `now()`)

### 4.3 `CachedQuiz` (`cached_quizzes`)
Caches generated multiple-choice quiz questions per subject and lesson.
- `id` (String, CUID, Primary Key)
- `subjectSlug` (String)
- `lessonNumber` (Int)
- `lessonTitle` (String)
- `questions` (JSON: array of 4-option question objects with explanations)
- `createdAt` (DateTime, default `now()`)
- `@@unique([subjectSlug, lessonNumber])`

### 4.4 `QuizAttempt` (`quiz_attempts`)
Persistent learner drill attempt and score records.
- `id` (String, CUID, Primary Key)
- `userId` (String, nullable, Foreign Key -> `users.id` on delete Cascade)
- `subjectSlug` (String)
- `subjectCode` (String, default `""`)
- `lessonNumber` (Int)
- `lessonTitle` (String)
- `score` (Int)
- `total` (Int)
- `mode` (String, default `"study"`, `"exam"`)
- `createdAt` (DateTime, default `now()`)
- `@@index([userId, subjectSlug, lessonNumber])`
- `@@index([subjectSlug, lessonNumber])`
