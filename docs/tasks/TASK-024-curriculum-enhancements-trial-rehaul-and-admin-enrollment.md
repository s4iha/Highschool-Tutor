# Task 024 - Curriculum Enhancements, 30-Day Free Trial Rehaul, JHS Quarters & Super Admin Enrollment

**Skills to be used**: frontend-ui-engineering, design-taste-frontend, senior-backend, security-and-hardening, test-driven-development, atomic-commit

## Description

Implement the requirements for TASK-024:
1. **Frontend Curriculum Card Enhancement**:
   - Refactor `features/curriculum/components/SubjectCatalog.tsx` to prevent coverage badge and metadata clutter on larger screens (tablet, desktop, widescreen).
   - Display clear metadata badges (Grade, Quarter/Semester, Lesson Count).
   - Display dynamic/configured lesson count instead of hardcoded 12.
2. **Admin Config for Lessons/Topics per Subject**:
   - Add `targetLessonsPerSubject Int @default(8)` to `AdminConfig` in `prisma/schema.prisma`.
   - Update `AdminSettingsPage.tsx` and admin schemas to configure this value.
   - Dynamically display the configured/real count of lessons on curriculum cards.
3. **SHS Subject Structure & Semester Designation**:
   - Strict semester mapping (`Semester 1` vs `Semester 2`) for Senior High School subjects with clear tags and tab filtering.
4. **Update Subjects per Track/Strand from `docs/resources/shs-subjects.md`**:
   - Integrate complete DepEd SHS curriculum for Core, Applied, and Specialized strands (STEM, ABM, HUMSS, GAS, TVL-ICT, TVL-HE).
5. **Landing Page In-Depth Instructions & 30-Day Trial Reminder**:
   - Add dedicated "How to Use Highschool Tutor" visual interactive workflow section.
   - Add dedicated "30-Day All-Access Free Trial" notice section highlighting full lesson access and membership transition.
6. **Junior High School DepEd 4 Quarters Alignment**:
   - Remove Semester/Trimester options for Junior High School users (Grades 7–10).
   - Standardize to DepEd's 4 Quarters (Quarter 1, Quarter 2, Quarter 3, Quarter 4) in `OnboardingModal.tsx`, `GradeTermPicker.tsx`, and `curriculum-data.ts`.
7. **Super Admin Manual Student Enrollment**:
   - Add an "Enroll Student" modal in `AdminStudentsPage.tsx` allowing super admins to manually enroll a student via email.
   - Create route handler `POST /api/v1/admin/students/enroll` to auto-provision accounts and grant Active Monthly, Annual, or 30-Day Trial subscriptions.
8. **30-Day Full-Access Free Trial Model**:
   - Replace the legacy 3-lesson/3-subject restriction with a 30-day all-access trial for new registrations.
   - Update `tier-guardrails.ts` to grant unrestricted access during the 30-day window and prompt upgrade upon expiration.
9. **Student Dashboard Trial Countdown Widget**:
   - Add a trial countdown widget in `StudentDashboardView.tsx` showing days remaining, progress indicator, and upgrade CTA.

## Verification Checklist

- [x] Add `targetLessonsPerSubject` to `AdminConfig` in `prisma/schema.prisma` and push schema
- [x] Update `AdminSettingsPage.tsx` and admin schemas for target lessons per subject
- [x] Implement 30-day full-access trial in `features/curriculum/utils/tier-guardrails.ts`
- [x] Build student dashboard `<TrialCountdownWidget />` with remaining days and progress bar
- [x] Update JHS term preferences to 4 Quarters (Q1–Q4) and remove semester option for JHS
- [x] Integrate comprehensive DepEd SHS Core, Applied, and Specialized track subjects from `shs-subjects.md`
- [x] Redesign curriculum card layout in `SubjectCatalog.tsx` with clean responsive layout for large and small viewports
- [x] Add "How to Use Highschool Tutor" and "30-Day All-Access Trial" sections to the landing page
- [x] Implement Super Admin manual enrollment modal and API endpoint `POST /api/v1/admin/students/enroll`
- [x] Add unit tests for 30-day trial logic, admin manual enrollment, and admin schemas
- [x] Run full verification checks: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`
