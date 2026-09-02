# Task 004 - Toast Integration, Tier Guardrails, Auth System Alignment, Admin Portal, Testing & Documentation

**Skills to be used**: `task-implementation`, `frontend-ui-engineering`, `test-driven-development`

## Description
Implement the fourth sprint consisting of Sonner toast integration with OKLCH status tokens, free vs. premium tier guardrails, design system and logo alignment for the AuthPage, categorized subject catalog with grade level headings and filters, unified Admin Portal powered by TanStack Query for metrics, subscriptions, and pricing configuration, Jest test suite setup for CI, landing page screenshot specifications, and complete project documentation.

## Verification Checklist
- [x] Add OKLCH status tokens (--destructive, --success, --warning, --info) to `globals.css` and mount Sonner `<Toaster />` in `app/layout.tsx`.
- [x] Align `AuthPage` colors with global CSS tokens and replace placeholder icon with official brand logo.
- [x] Refactor `SubjectCatalog` to categorize subjects with distinct Junior & Senior High School headings and grade level filter tabs.
- [x] Implement free tier vs. premium tier guardrails (max 3 trial subjects, first 3 lessons accessible per subject) with UpgradeModal and Sonner alerts.
- [x] Create Unified Admin Portal (`/admin`) with TanStack Query hooks and versioned App Router Route Handlers (`app/api/v1/admin/metrics`, `students`, `settings`).
- [x] Configure Jest testing framework with `ts-jest` and create unit test suites for tier guardrails, curriculum data, and auth validation (16/16 tests passing).
- [x] Create landing page screenshot specifications in `docs/resources/landing-page-screenshots.md`.
- [x] Populate comprehensive PRD, Database Schema, and API Endpoints documentation in `docs/`.
- [x] Verify build, linting, and tests pass cleanly with zero errors.
