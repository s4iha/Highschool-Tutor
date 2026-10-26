<!--
# Sync Impact Report
- Version change: Uninitialized Template (0.0.0) → 1.0.0
- List of modified principles:
  - Principle 1: Initialized as "I. Feature-Driven Architecture (FDA) Modularity"
  - Principle 2: Initialized as "II. Strict State Management & Unidirectional Flow"
  - Principle 3: Initialized as "III. DepEd MATATAG Curriculum Compliance (DepEd DO 015, s. 2026)"
  - Principle 4: Initialized as "IV. Socratic AI Tutoring Integrity & Multi-Dialect Accessibility"
  - Principle 5: Initialized as "V. Zero-Mock Quality Assurance & Production Verification"
- Added sections:
  - Technology Stack & Architectural Constraints
  - Development Workflow & Quality Gates
  - Governance
- Removed sections: None
- Follow-up TODOs: None
-->

# HighSchool Tutor Constitution

## Core Principles

### I. Feature-Driven Architecture (FDA) Modularity
All application capabilities MUST be organized within domain modules under `features/<domain>/` containing dedicated subdirectories: `actions/`, `api/`, `components/`, `hooks/`, `schemas/`, `types/`, and `utils/`. Cross-domain components and layout primitives MUST reside in `shared/`. The `app/` directory MUST remain strictly responsible for App Router file routing (`page.tsx`, `layout.tsx`, and route handlers) and MUST NOT contain domain or business logic. Cross-feature circular dependencies are strictly forbidden.

### II. Strict State Management & Unidirectional Flow
TanStack Query v5 is the sole, authoritative source of truth for all server-originating asynchronous state. Zustand v5 is strictly reserved for ephemeral, non-persistent client-side UI states (such as modal open/close toggles, drawer state, and multi-step wizard indices). Developers MUST NOT synchronize TanStack Query state into Zustand stores via `useEffect`. Client components MUST NOT execute raw `fetch` or `axios` calls directly; all client data access MUST be mediated through typed query hooks or Next.js Server Actions with Zod validation.

### III. DepEd MATATAG Curriculum Compliance (DepEd DO 015, s. 2026)
All academic structures, learning competency alignments, scoring algorithms, and quarterly grade transmutations MUST strictly comply with Department of Education Order No. 015, s. 2026 (DepEd MATATAG K-12 Curriculum standards). Legacy DepEd Order No. 8, s. 2015 is officially repealed and MUST NOT be used in calculations. Passing thresholds (transmuted grade ≥ 75%) and competency mastery criteria MUST be strictly verified and immutable across quiz runners and reporting pipelines.

### IV. Socratic AI Tutoring Integrity & Multi-Dialect Accessibility
The AI tutoring engine (powered by Google Gemini 3.5 Flash Lite) MUST adhere to Socratic pedagogy: it MUST guide students through step-by-step reasoning, hints, and conceptual scaffolding, and MUST NOT directly disclose quiz answers. All AI prompts and responses MUST be strictly validated using Zod schemas. Multi-dialect localization (English, Filipino, Taglish, Cebuano, Ilocano, and regional Philippine dialects) MUST maintain educational accuracy, respectful tone, and cultural appropriateness.

### V. Zero-Mock Quality Assurance & Production Verification
Code quality MUST be verified against real typed interfaces and production Prisma schemas. Swallowing exceptions, introducing dummy fallback mock values, commenting out assertions, or bypassing TypeScript strict checks is strictly prohibited. Every non-trivial implementation MUST pass type checks (`tsc --noEmit`), linting (`npm run lint`), and unit/integration test suites (`npm test`) before being considered complete.

## Technology Stack & Architectural Constraints

The platform enforces a standardized, non-negotiable tech stack to maintain long-term stability and high velocity:

- **Framework & Runtime**: Next.js 16+ (App Router), React 19+, TypeScript in strict mode.
- **Styling & Design System**: Tailwind CSS v4 with HSL design tokens, Radix UI primitives, and Shadcn UI. Competing CSS libraries (Bootstrap, Chakra UI, DaisyUI) are forbidden.
- **Database & Persistence**: PostgreSQL 15+ running via Docker and Prisma ORM 7.9+ utilizing `@prisma/adapter-pg` with connection pooling. Raw SQL queries are prohibited unless explicitly approved for specific performance optimization.
- **Data Validation**: Zod v4+ applied across all Server Action payloads, API route inputs, and AI response payloads.
- **Authentication & Security**: Better Auth session management with role-based access control (`STUDENT`, `ADMIN`), Google OAuth provisioning, and strict secret file isolation (never exposing `.env*` secrets).

## Development Workflow & Quality Gates

Development execution within the HighSchool Tutor workspace must follow disciplined operational gates:

1. **Task Tracking Discipline**: Every non-trivial task MUST have a dedicated kebab-case task file in `docs/tasks/` (e.g., `TASK-XXX-<feature-name>.md`) and MUST be logged upon completion in `docs/backlog.md`.
2. **Specification-Driven Lifecycle**: Architecture and feature evolution MUST adhere to the Spec-Kit pipeline (`speckit-specify` → `speckit-clarify` → `speckit-plan` → `speckit-tasks` → `speckit-implement`).
3. **Atomic Version Control**: Git operations must maintain clean, logical, atomic commits adhering to conventional commit specifications (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`). Destructive git operations require explicit confirmation.
4. **Automated Verification**: CI/CD pipelines require zero build errors, clean linting passes, and successful Jest test execution before deployment.

## Governance

This constitution serves as the foundational agreement and supreme operational guideline for HighSchool Tutor development.

- **Supremacy**: The principles and architectural rules defined herein supersede informal guidelines and local workspace shortcuts.
- **Amendment Process**: Amendments require formal proposal, documented impact analysis via the Sync Impact Report, explicit approval, and appropriate semantic version increments:
  - **MAJOR**: Breaking governance alterations or removal/redefinition of core principles.
  - **MINOR**: Addition of new principles, structural sections, or material architectural expansions.
  - **PATCH**: Clarifications, grammatical refinements, or non-semantic wording updates.
- **Compliance Auditing**: Automated agents, developers, and code reviewers MUST audit all PRs, tasks, and system modifications against this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Last Amended**: 2026-10-26
