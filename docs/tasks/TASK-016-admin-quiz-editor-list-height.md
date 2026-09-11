# Task 016 - Constrain Question List Height in Admin Editor

**Skills to be used**: task-implementation

## Description

The user requested that the list of questions in the Admin Quiz Editor have a fixed height with a scrollbar, mirroring the behavior of the curriculum lessons list on the left side of the page. This prevents the admin from having to scroll all the way down the page in order to edit the questions or access the action header if it scrolls out of view.

Changes implemented:
- Added `max-h-[600px]`, `overflow-y-auto`, `pr-2`, and `scrollbar-thin` classes to the `div` containing the `localQuestions` map in `AdminQuizConfigPage.tsx` (`QuizBankEditor` component).

## Verification Checklist

- [x] Verified that `AdminQuizConfigPage.tsx` contains the correct Tailwind classes on the questions list container.
- [x] Build and unit tests pass cleanly without errors
