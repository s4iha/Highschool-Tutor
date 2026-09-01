# HighSchool Tutor

> **DepEd K-12 & MATATAG Curriculum AI Learning Platform** — Interactive subject quizzes, real-time Socratic AI tutoring powered by Google Gemini 2.5, multi-dialect translation (English, Tagalog, Taglish, Cebuano, Ilocano), and DepEd-aligned curriculum progression tracking for Philippine Junior and Senior High School students.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 + Shadcn UI (Radix Primitives) |
| **Database** | PostgreSQL 15 (Docker) + Prisma ORM 7.9 |
| **Server State** | TanStack Query v5 + Next.js Server Actions |
| **Client State** | Zustand v5 |
| **AI Engine** | Google Gemini 2.5 REST API |
| **Validation** | Zod v4 |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions (GHCR + SSH Deploy) |

---

## 📂 Feature-Driven Architecture (FDA)

```
highschool-tutor/
├── .github/
│   └── workflows/
│       ├── ci.yml                              # Lint, Typecheck, Prisma DB Push & Build
│       └── cd.yml                              # Build & Push to GHCR + Deploy via SSH
├── app/                                        # Next.js App Router (Routing Only)
│   ├── globals.css                             # HSL Design Tokens & Tailwind v4 Theme
│   ├── layout.tsx                              # Root Layout Shell with Navbar & Footer
│   ├── page.tsx                                # Subject Catalog (Home)
│   └── curriculum/
│       └── [slug]/
│           ├── page.tsx                        # Lessons Overview Page
│           └── quiz/
│               └── [lesson]/
│                   └── page.tsx                # Interactive Quiz & AI Tutor Runner
├── features/                                   # Domain Feature Modules (FDA)
│   ├── auth/                                   # Authentication Logic, Forms & Hooks
│   ├── curriculum/                             # DepEd K-12 Catalog, Quizzes & AI Tutor
│   │   ├── actions/                            # Server Actions (getLessons, getQuiz, askTutor)
│   │   ├── api/                                # Gemini 2.5 REST Service
│   │   ├── components/                         # SubjectCatalog, LessonList, QuizRunner, AITutorDrawer
│   │   ├── hooks/                              # Custom React Query Hooks
│   │   ├── schemas/                            # Zod Validation Schemas
│   │   ├── types/                              # TypeScript Domain Models
│   │   └── utils/                              # Curriculum Data & Helpers
│   ├── billing/                                # Subscription & Payment Logic
│   ├── diary/                                  # Class Diary & Notes
│   └── admin/                                  # School Admin Dashboard
├── shared/                                     # Cross-Feature Shared Codebase
│   ├── components/
│   │   ├── ui/                                 # Shadcn UI Components (Button, Card, Sheet, etc.)
│   │   └── layout/                             # Navbar, Footer, Sidebar
│   ├── hooks/                                  # Common Custom Hooks
│   ├── types/                                  # Global TypeScript Definitions
│   └── utils/                                  # Shared Utilities (cn.ts, etc.)
├── providers/                                  # React Context Providers (QueryProvider, ThemeProvider)
├── prisma/                                     # Database Schema & Seed Engine
│   ├── schema.prisma                           # Master Prisma Models & Enum Definitions
│   └── seed.ts                                 # DepEd Curriculum Seed Script
├── lib/
│   └── prisma.ts                               # Pooled Prisma Client (pg.Pool + @prisma/adapter-pg)
├── docker-compose.yml                          # Local PostgreSQL Docker Container
├── docker-compose.prod.yml                     # Production Stack (App, Postgres, Backups, Cron)
├── Dockerfile                                  # Multi-stage Standalone Next.js Build
├── package.json                                # Dependencies & Execution Scripts
└── tsconfig.json                               # TypeScript Path Aliases Config (@/*)
```

---

## 🚀 Local Setup & Installation

Follow these steps to set up and launch HighSchool Tutor in your local development environment:

### 1. Prerequisites
- **Node.js:** `v20.x` or higher
- **Docker Desktop:** Installed and running (for local PostgreSQL database container)
- **NPM** (packaged with Node)
- **Google Gemini API Key:** Obtain from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Clone Repository & Install Dependencies
Navigate to the root project directory and install all npm dependencies:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env.local` file in the root directory (do not commit this file to version control):
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection (Local Docker Postgres)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/highschool_tutor_local?schema=public"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=highschool_tutor_local
POSTGRES_PORT=5432

# Google Gemini AI Service Key
GEMINI_API_KEY="your-gemini-api-key-here"

# NextAuth Authentication Secret (Generate via: openssl rand -base64 32)
AUTH_SECRET="your-32-character-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials (Initial Seeding)
ADMIN_EMAIL="admin@highschooltutor.ph"
```

### 4. Boot Local PostgreSQL Container
Spin up the PostgreSQL database container using Docker Compose:
```bash
docker compose up -d
```
This initializes a PostgreSQL 15 container listening on port `5432`.

### 5. Run Database Migrations & Seed Data
Generate the type-safe Prisma client, push database schemas, and seed initial curriculum records:
```bash
# Generate Prisma Client
npx prisma generate

# Sync schema with local Postgres instance
npx prisma db push

# Seed DepEd JHS & SHS STEM subjects and curriculum data
npx tsx prisma/seed.ts
```

### 6. Launch Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing & Sprint Roadmap

HighSchool Tutor maintains quality assurance using Jest and Playwright testing suites alongside a structured sprint roadmap.

### Run Testing Commands
```bash
# Run Unit Tests (Jest)
npm run test:unit

# Run Integration Tests (Jest)
npm run test:integration

# Run End-to-End Tests (Playwright)
npm run test:e2e

# Run All Test Suites
npm test
```

### Sprint Roadmap
- [x] **Sprint 0 — Project Setup & Architecture:** FDA folder structure, Prisma ORM, Tailwind v4 + Shadcn, Docker setup, CI/CD pipelines, and base shell layout.
- [x] **Sprint 1 — Curriculum & AI Quiz Engine:** DepEd K-12 subject catalog, Gemini AI lesson generation, interactive Quiz Runner (Study/Exam modes), Socratic AI Tutor drawer, multi-dialect translation.
- [ ] **Sprint 2 — Auth & Profile:** NextAuth v5 integration, Google SSO, teacher profile settings, and role management.
- [ ] **Sprint 3 — DepEd MATATAG Grading:** DO 015, s. 2026 transmutation pipeline, grade computation engine, and PDF export.
- [ ] **Sprint 4 — Billing & Subscriptions:** GCash/Xendit payment integration, subscription tiers, and trial subject limits.
- [ ] **Sprint 5 — Admin Dashboard:** School head analytics, teacher management, and system configuration.
- [ ] **Sprint 6 — Production Deployment:** Final Vercel/VPS deployment, database migration, and end-to-end production smoke testing.

---

## 🚢 Production Deployment Guide

HighSchool Tutor is engineered for flexible serverless cloud hosting or Docker container deployment:

### 1. Primary Cloud Deployment (Next.js on Vercel + Serverless PostgreSQL)
Ideal for zero-maintenance serverless scalability:

1. **Frontend & API Hosting (Vercel):**
   - Push your code to GitHub and import the repository into **Vercel**.
   - Set the **Build Command** to:
     ```bash
     npx prisma generate && npm run build
     ```
   - Add environment variables in the Vercel Dashboard: `DATABASE_URL`, `GEMINI_API_KEY`, `AUTH_SECRET`, and `NEXTAUTH_URL`.

2. **Database Hosting (Neon or Supabase):**
   - Create a serverless PostgreSQL instance on **Neon.tech** or **Supabase**.
   - Copy the database connection string and set it as `DATABASE_URL` in Vercel.
   - Run database schema migration:
     ```bash
     npx prisma db push
     npx tsx prisma/seed.ts
     ```

### 2. Alternative Self-Hosted Deployment (Docker Container)
For on-premises institutional servers or private container registries:

1. **Build Container Image:**
   ```bash
   docker build -t highschool-tutor:latest .
   ```
2. **Run Production Container:**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL="postgresql://user:pass@dbhost:5432/highschool_tutor_prod" \
     -e GEMINI_API_KEY="your-gemini-key" \
     -e AUTH_SECRET="your-secret" \
     --name highschool-tutor \
     highschool-tutor:latest
   ```

---

## 🔐 Security & Best Practices

HighSchool Tutor integrates robust application security principles:
- **Hashed Credentials & Tokens:** Passwords and session keys are secured using standard cryptographic hashing via NextAuth v5.
- **Session Cookie Protection:** Authentication tokens reside in HTTP-Only, SameSite-protected cookies to eliminate XSS token theft.
- **Input Validation & Parsing:** All incoming request payloads and AI response outputs are strictly validated using `Zod` schemas.
- **Relational Integrity & Cascade Deletes:** Deleting a parent record cleanly cascades to remove associated child records without leaving orphan entries.
- **AI Rate Limits & Cost Control:** Gemini API calls are cached in PostgreSQL (`cached_lessons`, `cached_quizzes`) to minimize redundant AI requests and control API costs.

---

## 📜 License

**Private / Proprietary (All Rights Reserved)**

This software is the exclusive proprietary property of HighSchool Tutor. Unauthorized copying, redistribution, modification, or public execution of this repository or its source files via any medium is strictly prohibited.
