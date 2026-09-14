# Task 019 - Student Dashboard & Quiz UX Overhaul, AI Credits, Onboarding Tour

**Skills to be used**: task-implementation

## Description

Refactor and enhance the student learning experience, quiz system, and curriculum navigation:
1. Fix 404 errors on track detail pages (`/tracks/[id]`) by adding `gas-strand` and `tvl-track` to `TRACKS_DATA`, create `/tracks` overview page, and map `/curriculum` route to `SubjectCatalog`.
2. Install `driver.js` and build an onboarding tour for sidebar navigations and dashboard features, triggering post-onboarding and saving `hasCompletedTour` on profile.
3. Remove all mock data and hardcoded state ("Resume General Mathematics", "6", "34/48", "94.2%", "18", hardcoded active learning card, mock AI chat) from `StudentDashboardView`.
4. Make the student dashboard completely real-time, sourcing metrics, active subjects, and resume history dynamically from database queries (`QuizAttempt`, `TrialSubject`).
5. Add a friendly empty state ("No practice tests yet" with Lucide icon and CTA) to the Recent Practice Test Transmutations section.
6. Remove redundant question count suffix `(${selectedCount} Qs)` from quiz configuration mode buttons ("Start Study Mode" & "Start Exam Mode").
7. Improve quiz generation loading state with a centered, descriptive AI loading card replacing skeletons.
8. Remove conversational greetings and pleasantries from Gemini quiz generation questions.
9. Permanently remove the mid-quiz Study/Exam mode toggle to prevent cheating, locking the mode from the initial configuration parameter and displaying a static badge.
10. Fix question progression bottleneck caused by rate limits and parallel translations.
11. Restrict dialect access for free-tier users to English and Taglish, gating other dialects for premium subscribers.
12. Fit the quiz runner within the viewport height (`h-[calc(100dvh-...)]`) with pinned footer navigation so students do not need to scroll down to proceed.
13. Implement a daily AI Credits system (20 credits/day for free tier) tracked via Prisma `AiCreditUsage`, add exponential backoff retry on 429, batch translations into a single prompt, and enforce prompt hardening and input sanitization guardrails.
14. Prepare landing page assets for real screenshots and provide comprehensive unit/integration tests.

## Verification Checklist

- [x] Track detail pages (`/tracks/gas-strand`, `/tracks/tvl-track`) render properly without 404.
- [x] `/tracks` and `/curriculum` index routes display tracks and the complete 130+ subject catalog.
- [x] `driver.js` is installed and the interactive onboarding tour functions cleanly with persistence.
- [x] Student dashboard displays real-time calculated metrics with zero mock/placeholder data.
- [x] Recent Practice Test Transmutations renders an empty state when no attempts exist.
- [x] Quiz configuration modal mode buttons display "Start Study Mode" and "Start Exam Mode" cleanly.
- [x] Quiz loading state displays an engaging AI-generating card instead of confusing bare skeletons.
- [x] Generated quiz questions have no conversational greetings or prefixes.
- [x] Mid-quiz mode toggle is removed and mode is locked with a static badge.
- [x] Translation calls are batched into a single prompt, free users are limited to English + Taglish, and 429 retries are implemented.
- [x] Quiz runner layout is constrained to the viewport with pinned Previous/Next navigation.
- [x] `AiCreditUsage` schema is applied, tracking daily credits with enforcement on AI actions.
- [x] AI system prompts are hardened against off-topic/injection prompts and user inputs sanitized.
- [x] Comprehensive unit and integration tests pass cleanly (`npm run test`).
- [x] Build and lint pass cleanly without errors (`npm run build`, `npm run lint`).
