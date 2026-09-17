# Task 022 - Pricing Updates, AI Chatbot Removal, Pre-configured Prompt Modal, Lesson Directory & Mobile Subject Cards

**Skills to be used**: task-implementation, prompt-engineer, atomic-commit

## Description

Implement the requirements for TASK-022:
1. **Pricing Updates**:
   - Monthly subscription price updated to ₱300 / month.
   - Upgrade option to Annual Pass for existing subscribers at ₱2,600 / year (save ₱1,000 / year compared to 12 months).
   - Update `AdminConfig` defaults, database seed, Admin Pricing Settings page, and `UpgradeModal.tsx`.
   - Update `UpgradeModal` to show Monthly (₱300) for new subscribers and Annual Upgrade (₱2,600) for existing/active subscribers.
2. **Remove AI Chatbot & AI Credits Functionality**:
   - Keep existing database tables (`AiCreditUsage`, `aiCredits`) intact for historical audit logs per user preference.
   - Remove AI Chatbot floating drawer, AI Tutor dashboard tab, AI Chatbot quick prompts, thinking states, and persona switcher from the student UI.
   - Remove AI credit badges, counters, deductions, and rate limits that gate students from taking quizzes or generating quizzes.
   - Clean up navigation items and references to the chatbot.
3. **Pre-configured Prompt "Help" Modal**:
   - Create an accessible, interactive "Help" modal (`AiPromptsHelpModal.tsx`) with copyable prompt templates based on the provided article:
     - Step 1: Download your AI tool (ChatGPT, Claude, Gemini, Copilot).
     - Step 2: How to write great prompts (Give it a role, Be specific, Set constraints).
     - Step 3: 10 sample prompts to copy and paste with one-click copy buttons and dynamic topic substitution.
   - Add a Floating Action Button (FAB) on the bottom right of the Student Dashboard and Quiz pages.
4. **Short Lesson Before Quiz & Admin Lesson Directory**:
   - Add a database model `LessonMaterial` in `prisma/schema.prisma` linking `subjectSlug`, `lessonNumber`, `title`, `content` (Markdown), and timestamps.
   - Run Prisma migration / push to PostgreSQL.
   - Admin Lesson Directory (`app/(admin)/admin/lessons/page.tsx` & feature components):
     - Browse all DepEd curriculum subjects and lessons.
     - View, create, and edit lesson content in a Markdown editor.
     - "Auto-Generate with AI" button that calls Gemini to draft a concise, high-yield lesson for that competency.
   - Student Lesson Card UX:
     - On the lesson card, provide two distinct buttons: "View Lesson" (opens the lesson material modal/reader) and "Take Quiz".
5. **Subject & Lesson Card UI Overhaul for Mobile**:
   - Redesign subject and lesson cards in `features/curriculum/components/SubjectCatalog.tsx` and `LessonList.tsx` for mobile viewports (`< 640px` and tablets).
   - Resolve clutter, reduce text density, improve typography, badges, and button hierarchy.
6. **Xendit Payment Gateway Approval Checklist**:
   - Author a comprehensive, actionable checklist in `docs/xendit-approval-checklist.md` covering legal, technical, webhook, business verification, and UI/UX compliance for Xendit Philippines live mode.

## Verification Checklist

- [x] Update `AdminConfig` defaults in `prisma/schema.prisma` (`monthlyPricePhp` = 300, `annualPricePhp` = 2600) and `prisma/seed.ts`
- [x] Update `AdminSettingsPage.tsx` and `adminSchemas.ts` for ₱300 / ₱2600 pricing rules
- [x] Update `UpgradeModal.tsx` to handle Monthly (₱300) for new subscribers and Annual Upgrade (₱2600) for existing subscribers
- [x] Remove AI Chatbot tab, drawer, logs, and credits visibility from `StudentDashboardView.tsx` and curriculum pages
- [x] Remove AI credits check blocking quiz generation/session creation in server actions and API routes
- [x] Build `AiPromptsHelpModal.tsx` with the 3 steps, 10 copyable prompts, and clipboard toast
- [x] Add floating "Help" action button (FAB) on bottom-right of Student Dashboard and Quiz pages
- [x] Add `LessonMaterial` model to `prisma/schema.prisma` and push schema to DB
- [x] Create Admin Lesson Directory page and components (`AdminLessonDirectory.tsx`, `LessonEditorModal.tsx`) with AI auto-generation
- [x] Add lesson API/actions (`getLessonMaterial`, `saveLessonMaterial`, `generateLessonWithAi`)
- [x] Update Student `LessonList.tsx` to offer "View Lesson" and "Take Quiz" buttons, plus a sleek `LessonReaderModal.tsx`
- [x] Overhaul Subject & Lesson card UI for mobile responsiveness (clean spacing, badges, touch-friendly buttons)
- [x] Author `docs/xendit-approval-checklist.md`
- [x] Update `docs/backlog.md` with Task 022 summary
- [x] Run quality checks: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
