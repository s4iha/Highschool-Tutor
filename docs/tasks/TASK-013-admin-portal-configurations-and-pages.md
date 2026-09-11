# Task 013 - Admin Portal Full Configuration and Multi-Page Control Plane

**Skills to be used**: task-implementation, database modeling, API routing, UI component generation

## Description

Expand the HighSchool Tutor administrative control plane from a single 3-tab monolithic component into a multi-page, persistent sidebar-navigated, PostgreSQL-persisted administration portal adhering to Feature-Driven Architecture (FDA).

The implementation includes:
1. **Database Schema & Migrations**:
   - `AdminConfig` model for persistent pricing, trial guardrails, and GCash/Maya merchant details (replacing volatile in-memory storage).
   - `Announcement` model with `AnnouncementType` and `AudienceType` enums for platform notifications and system broadcasts.
   - Proper PostgreSQL migration SQL script enabling RLS and policies for admin models.
2. **Admin Sidebar & Shell Layout**:
   - `app/(admin)/layout.tsx` providing a unified `AdminSidebarLayout`.
   - Desktop collapsible sidebar (240px ↔ 64px icon mode) with `useAdminSidebarStore` (Zustand + `localStorage` persistence).
   - Mobile responsive sheet drawer with hamburger toggle.
   - Dedicated navigation links to `/admin`, `/admin/students`, `/admin/quiz-config`, `/admin/announcements`, `/admin/settings`.
3. **Dedicated Admin Pages & Domain Components**:
   - `/admin` (Dashboard): 4 KPI stat cards, Recent Activity feed (last 5 payments and subscriptions), and quick-action navigation.
   - `/admin/students` (Students & Subscriptions): Searchable, filterable, sortable student table with pagination controls and "View Details" sheet drawer.
   - `/admin/quiz-config` (Curriculum Quiz Configuration): Searchable subject selector, lesson selector (1–12), and interactive question CRUD bank editor (options A–D, correct answer, explanation).
   - `/admin/announcements` (Broadcasts & Notifications): Announcements data table with status toggling (`isActive`) and create/edit modal dialog.
   - `/admin/settings` (Pricing & Guardrails): Live configuration form for monthly/annual pricing, trial subject limits, max free lessons, and GCash/Maya merchant details backed by `AdminConfig`.
4. **API Endpoints & Validation**:
   - REST API endpoints under `/api/v1/admin/` for metrics, activity, students, announcements, quiz-config, and settings.
   - Strict Zod validation schemas for all mutations.
   - Admin session verification and PostgreSQL RLS compatibility using `runAsAdmin`.

## Verification Checklist

- [x] Prisma schema updated with `AdminConfig`, `Announcement`, and enums
- [x] Database migration SQL created and applied with RLS policies
- [x] Zustand `useAdminSidebarStore` implemented with persistence
- [x] `AdminSidebarLayout` and `app/(admin)/layout.tsx` scaffolded
- [x] `/admin` root dashboard refactored with KPIs and recent activity feed
- [x] `/admin/students` implemented with search, filtering, pagination, and detail drawer
- [x] `/admin/quiz-config` implemented with subject/lesson selector and question bank editor
- [x] `/admin/announcements` implemented with list, create, edit, and toggle active status
- [x] `/admin/settings` refactored to read/write persistent `AdminConfig` from PostgreSQL
- [x] Zod validation schemas added for all admin payload mutations
- [x] REST API routes created and tested (`/api/v1/admin/activity`, `/announcements`, `/quiz-config`, `/settings`)
- [x] Zero TypeScript errors (`npx tsc --noEmit`)
- [x] ESLint passes cleanly (`npm run lint`)
- [x] Unit tests pass cleanly (`npm test` 26/26 passed)
- [x] Production build passes cleanly (`npm run build`)
