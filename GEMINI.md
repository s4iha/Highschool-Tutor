# Highschool Tutor — Workspace Agent Rules & Project Guide

> **Project**: Highschool Tutor — Classroom Management SaaS for DepEd & CHED Teachers and School Heads
> **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma ORM 7.9, PostgreSQL, Custom Session, jsPDF, PapaParse, Zustand.

---

## 📚 Single Source of Truth Documentation (`docs/`)

All agent interactions, feature implementations, and architecture queries MUST reference the project documentation in `docs/`:

- 📋 **PRD & Product Specs**: [product-requirements.md](`docs/prd/product-requirements.md`)
- 🏛️ **System Architecture**: [system-architecture.md](`docs/architecture/system-architecture.md`)
- 🗄️ **Database Schema Reference**: [prisma-schema-reference.md](`docs/database-schema/prisma-schema-reference.md`)
- 🌐 **API Endpoints Reference**: [api-endpoints.md](`docs/api-reference/api-endpoints.md`)
- 📐 **DepEd DO 015 s. 2026 MATATAG Pipeline**: [deped-matatag-transmutation-pipeline.md](`docs/pipelines/deped-matatag-transmutation-pipeline.md`)
- 🖨️ **PDF Export Pipeline**: [pdf-export-pipeline.md](`docs/pipelines/pdf-export-pipeline.md`)
- 🔐 **Parent Share Link Pipeline**: [parent-share-link-pipeline.md](`docs/pipelines/parent-share-link-pipeline.md`)
- 📜 **DepEd DO 015 s. 2026 Guidelines**: [deped-do015-s2026-guidelines.md](`docs/resources/deped-do015-s2026-guidelines.md`)
- 🔐 **Security & Auth Controls**: [security-and-auth.md](`docs/security/security-and-auth.md`)
- 🏃 **MVP Sprint Roadmap**: [TASK-001-educore-mvp-sprints.md](`docs/tasks/TASK-001-educore-mvp-sprints.md`)
- 📜 **Project Change Log & Backlog**: [backlog.md](`docs/backlog.md`)

---

## 🏗️ Architecture Declaration

**Architecture Pattern**: Feature-Driven Architecture (FDA)

All new code MUST be organized according to the FDA structure:

- **`features/<domain>/`** — Domain-scoped modules: `{actions, api, components, hooks, schemas, types, utils}`
- **`shared/`** — Cross-feature shared code: `{components/ui, components/layout, hooks, types, utils}`
- **`providers/`** — React Context providers (QueryProvider, ThemeProvider, etc.)
- **`app/`** — Next.js App Router handles routing ONLY (`page.tsx`, `layout.tsx`). No business logic in `app/`.

---

## 🛠️ Mandatory Tech Stack & State Management Architecture

The agent **MUST** strictly implement all features using the approved tech stack listed below. Introducing unapproved alternatives without explicit user approval is **strictly prohibited**.

### Approved Stack

| Layer             | Technology                   | Version Constraint                                     |
| ----------------- | ---------------------------- | ------------------------------------------------------ |
| **Framework**     | Next.js (App Router)         | v16+                                                   |
| **Language**      | TypeScript                   | Strict mode                                            |
| **UI Runtime**    | React                        | v19+                                                   |
| **Styling**       | Tailwind CSS                 | v4+                                                    |
| **UI Components** | Shadcn UI (Radix Primitives) | Latest (in `shared/components/ui/`)                    |
| **Database ORM**  | Prisma ORM                   | v7+ (with `@prisma/adapter-pg` and `pg.Pool`)          |
| **Database**      | PostgreSQL                   | v15+ (Docker local instance)                           |
| **Validation**    | Zod                          | v4+ (all Server Actions, API routes, and form schemas) |
| **Server State**  | TanStack Query (React Query) | v5+                                                    |
| **Client State**  | Zustand                      | v5+                                                    |
| **AI Provider**   | Google Gemini                | 3.5-flash-lite                                         |
| **Icons**         | Lucide React                 | Latest                                                 |
| **Notifications** | Sonner                       | Latest                                                 |

### State Management Boundaries

- **TanStack Query v5** — Use for **all server/async state**: API data fetching (`useQuery`), mutations (`useMutation`), cache invalidation (`queryClient.invalidateQueries`), optimistic updates, and infinite scrolling. TanStack Query is the **single source of truth** for all data originating from the server or any external API.
- **Zustand** — Use **exclusively** for pure **client-side ephemeral state**: modal open/close toggles, drawer visibility, sidebar collapse state, form wizard step tracking, theme preferences, and other transient UI state that has **no server-side origin**.
- **Zod** — Use for **all input validation**: Server Action payloads, API route request bodies, form field schemas, and AI response parsing/validation.

### Prohibited Patterns (Project-Specific)

1. **NEVER sync TanStack Query results into Zustand via `useEffect`.** TanStack Query must remain the single source of truth for API/server responses. Components should pull network data directly from custom `useQuery` hooks and local/UI states from Zustand stores. Merging them via `useEffect` creates stale data, race conditions, and unnecessary re-renders.
2. **NEVER substitute Redux, Recoil, Jotai, or MobX** in place of Zustand for client state management.
3. **NEVER substitute SWR** in place of TanStack Query for server state management.
4. **NEVER use raw `fetch` or `axios` wrappers** that bypass TanStack Query for data fetching in client components. All client-side data fetching must go through `useQuery`/`useMutation` hooks.
5. **NEVER use raw SQL queries** bypassing Prisma ORM unless the user explicitly approves it for a specific performance-critical operation.
6. **NEVER introduce a CSS framework** (e.g., Bootstrap, Chakra UI, Ant Design, DaisyUI) that conflicts with or replaces Tailwind CSS v4 + Shadcn UI.

---

## ⚙️ Core Agent Rules & Workflow Discipline

### 1. Environment & Secret Boundaries

- **Strict Guard**: Do NOT read or write `.env`, `.env.local`, `.env.production`, or any secret environment file without explicit user approval.

### 2. Task Tracking & Kebab-Case Naming

- **Mandatory Task Files**: For non-trivial coding tasks, create a dedicated task file in `docs/tasks/`.
- **Naming Pattern**: Task filenames MUST follow kebab-case: `TASK-XXX-<feature-name-in-kebab-case>.md` (e.g., `TASK-001-educore-mvp-sprints.md`).
- **Completion**: Append a summary to `docs/backlog.md` upon completion.

### 3. DepEd Grading Compliance

- **DepEd Order No. 015, s. 2026**: Always apply DO 015, s. 2026 MATATAG guidelines for Philippine K-12 grading calculations. Legacy DepEd Order No. 8, s. 2015 is officially repealed.

### 4. Quality Assurance & Verification

- **Verification**: Run `compile_applet` / `lint_applet` before declaring work complete.
- **Zero Mock Code**: Use real data pipelines and Prisma ORM schemas.
