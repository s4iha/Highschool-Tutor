# Task 033 - Math Symbol Unicode Rendering & AI Tutor Header Close Button Overlap

**Skills to be used**: task-implementation

## Description

Fix two prominent UI/UX defects in the quiz workflow:
1. **Math Symbol & Escaped Unicode Rendering**:
   - In quiz questions, options, explanations, and tutor context banners, raw escaped unicode sequences (such as `\u2218` in `(f \u2218 g)(x)`) were rendered literally instead of displaying proper mathematical symbols (`∘` / KaTeX LaTeX formatting).
   - Quiz generation prompts lacked explicit mathematical formatting instructions, and strings were not normalized to decode unicode escape sequences before being rendered.
   - The question context preview in `AITutorDrawer` rendered raw plain text without markdown or math support.
2. **AI Tutor Slide Drawer Header Badge Overlap**:
   - The AI Tutor slide drawer (`AITutorDrawer.tsx`) had its credits badge positioned in the header right up against the edge, colliding with the default `absolute right-4 top-4` close (`x`) button from `SheetContent`.
   - Adding `pr-12` to `SheetHeader` provides dedicated clearance so the close button never overlaps the credits badge.

## Verification Checklist

- [x] Utility `formatMathAndUnicode` created with unit tests covering unicode escapes (e.g. `\u2218` -> `∘`, `\u00d7` -> `×`, `\u00b2` -> `²`), edge cases, and LaTeX math.
- [x] Gemini quiz generation prompt updated to enforce clear mathematical notation and post-process strings through `formatMathAndUnicode`.
- [x] `QuizRunner.tsx` passes question text, options, and explanations through `formatMathAndUnicode` before rendering with `MarkdownRenderer`.
- [x] `AITutorDrawer.tsx` uses `formatMathAndUnicode` and `MarkdownRenderer` for the anchored question context quote.
- [x] `AITutorDrawer.tsx` header receives `pr-12` to eliminate close button collision with the credits badge.
- [x] All unit and integration tests pass cleanly (`npm test`).
- [x] ESLint passes cleanly without errors or warnings (`npm run lint`).
- [x] Next.js production build succeeds (`npm run build`).
