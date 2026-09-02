# Task 002 - Transfer Curriculum, Lesson Viewer, and AI Quiz Engine

**Skills to be used**: `task-implementation`, `antigravity-guide`

## Description
Transfer the core learning features from the prototype (`C:\Users\Dell\Desktop\old-highscool`) into the Next.js Feature-Driven Architecture. This includes updating `prisma/schema.prisma` with `QuizAttempt`, setting up Shadcn UI component primitives in `shared/components/ui/`, porting the DepEd curriculum catalog and schema, implementing the Google Gemini AI tutor and translation service, creating Next.js Server Actions for lessons and quizzes, building the interactive Quiz Runner and AI Tutor Drawer components in `features/curriculum/`, and creating the App Router pages (`/`, `/curriculum/[slug]`, and `/curriculum/[slug]/quiz/[lesson]`).

## Verification Checklist
- [x] Add `QuizAttempt` model to `prisma/schema.prisma` and regenerate Prisma client
- [x] Install `clsx`, `tailwind-merge`, `lucide-react`, `zod`, and Radix UI primitives
- [x] Create `shared/utils/cn.ts` and core Shadcn UI components in `shared/components/ui/`
- [x] Port curriculum metadata, types, and validation to `features/curriculum/`
- [x] Implement Google Gemini API REST service for quiz generation, lesson outlines, multi-language translation, and Socratic tutoring
- [x] Implement Next.js Server Actions in `features/curriculum/actions/curriculum.actions.ts`
- [x] Build interactive UI components (`SubjectCatalog`, `LessonList`, `QuizRunner`, `AITutorDrawer`, `TranslationControls`)
- [x] Create Next.js App Router pages: `/`, `/curriculum/[slug]`, `/curriculum/[slug]/quiz/[lesson]`
- [x] Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` to verify clean compilation with 0 errors
