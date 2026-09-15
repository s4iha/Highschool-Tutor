# Task 021 - AI Chatbot Hardening, UX Fixes, and Quiz Security

**Skills to be used**: task-implementation, atomic-commit

## Description

Implement comprehensive improvements across the AI Socratic Tutor, user authentication, quiz security architecture, and page layouts:
1. **AI Response LaTeX & Markdown Parsing**: Render mathematical formulas (`$...$`, `$$...$$`) and markdown formatting in AI responses using KaTeX and a safe Markdown renderer.
2. **Curriculum Page Padding Reduction**: Reduce excessive stacked padding on `/curriculum` page wrapper (`py-6 sm:py-8` -> `py-2 sm:py-3`).
3. **Chatbot Guardrails, Error Handling & Prompt Injection Protection**: Expand injection regex patterns, add educational content moderation, provide structured error responses, harden system prompt against role escape, and fix dashboard chat history mapping bug.
4. **Logout Confirmation**: Introduce a confirmation dialog before signing out to prevent accidental session termination.
5. **Disposable Email Detection**: Add blocklist for 100+ temporary email domains during registration.
6. **AI Credits Visibility in Chatbot**: Display real-time remaining AI credits in both `AITutorDrawer` and the dashboard AI Tutor space.
7. **AI Greeting Suppression**: Update AI system prompt to stop generating conversational greetings like "Kumusta!" or "Hello!" while preserving client-side initial welcome messages.
8. **Quiz Generation Spinner Icon**: Replace rotating `Sparkles` with standard `Loader2` spinner.
9. **Quiz URL Security & Server-Side Sessions**: Implement server-side `QuizSession` model in PostgreSQL with migration, enforce server-side lesson access checks, lock quiz mode and question count at session creation, and verify quiz scores server-side.
11. **Language Switching Behavior**: Keep chat history when switching languages but append a system message notifying the user, and instruct AI to switch language for future replies.
12. **AI Credits Recharge Cadence**: Confirm and enforce daily (20 credits/day) recharge cadence logic and UI messaging.
13. **AI Persona UI & Prompt**: Strengthen persona system prompt, fix hardcoded "Socratic" labels in UI to reflect active persona, and add a persona switcher dropdown directly inside the chat UI.
14. **Chat Auto-Scroll**: Fix auto-scroll-on-open bug in `AITutorDrawer` and implement auto-scroll-to-bottom for the AI Tutor tab in `StudentDashboardView`.

## Verification Checklist

- [x] Install `react-markdown`, `remark-math`, `rehype-katex`, `katex` (and types) for AI math rendering
- [x] Create `MarkdownRenderer.tsx` and integrate into `AITutorDrawer`, `StudentDashboardView`, and `QuizRunner`
- [x] Reduce top padding in `app/(dashboard)/curriculum/page.tsx`
- [x] Expand prompt injection filters and add `isEducationalQuery` guardrails in `ai-credits.ts`
- [x] Harden Gemini system prompt and suppress greetings in `gemini-service.ts`
- [x] Fix dashboard chat history serialization bug in `StudentDashboardView.tsx`
- [x] Create `LogoutConfirmDialog.tsx` with Shadcn AlertDialog and connect to `DashboardSidebar.tsx`
- [x] Create `disposable-domains.ts` and enforce rejection in `/api/auth/register`
- [x] Display remaining AI credits badge in `AITutorDrawer` header and dashboard chat
- [x] Replace `Sparkles` loading spinner with `Loader2` in `QuizRunner.tsx`
- [x] Add `QuizSession` and `tutoringPersona` to `prisma/schema.prisma` and create standard PostgreSQL migration with RLS
- [x] Implement `quiz-session.actions.ts` with server-side validation, session locking, and answer grading
- [x] Update `QuizRunner.tsx`, `LessonList.tsx`, and quiz page to leverage server-side sessions
- [x] Wire persona selection in `StudentDashboardView.tsx` settings and Gemini prompt generation
- [x] Add unit tests for prompt injection, disposable email, quiz session, and persona prompt logic
- [x] Language switching: append system message and prompt instruction
- [x] AI Credits: verify daily reset logic and UI messaging
- [x] Persona UI: add switcher in chat, fix hardcoded labels, strengthen prompt
- [x] Auto-scroll: fix in `AITutorDrawer` and add to `StudentDashboardView`
- [x] Build and unit tests pass cleanly without errors (`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`)


## Follow-up fix (Non-Educational Query Bug)
- [x] Fix Zod validation error by adding nswer: '' in StudentDashboardView
- [x] Catch ZodErrors and display standard text string error
- [x] Add prompt instruction for friendly AI refusal of non-educational topics
- [x] Build and unit tests pass cleanly without errors

