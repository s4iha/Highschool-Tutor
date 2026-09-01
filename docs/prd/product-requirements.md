# HighSchool Tutor — Product Requirements Document (PRD)

> **Document Version**: 1.0.0  
> **Status**: Approved / In Development  
> **Target Audience**: Philippine Department of Education (DepEd) & CHED Junior High School and Senior High School STEM Students, Teachers, and School Heads.

---

## 1. Executive Summary & Problem Statement

### 1.1 Background
The implementation of the Philippine Department of Education's **MATATAG K-12 Curriculum** (DepEd Order No. 015, s. 2026) introduced streamlined, competency-based learning standards for Junior High School (Grades 7–10) and specialized Senior High School STEM tracks (Grades 11–12). However, high school students frequently lack on-demand personalized tutoring and step-by-step guidance tailored to their local mother tongue dialects and Philippine classroom syllabi.

### 1.2 The Solution
**HighSchool Tutor** is a full-stack, AI-powered classroom and personalized learning SaaS. It provides:
1. **130+ DepEd-Aligned Subjects** categorized across Junior High School and Senior High School STEM tracks.
2. **Google Gemini Socratic AI Tutor** delivering on-demand step-by-step hints and multi-dialect translations (English, Filipino, Taglish, Cebuano, Ilocano, and more).
3. **Interactive Study & Exam Mode Quizzes** with automatic attempt recording and passing grade (≥ 75%) mastery tracking.
4. **Free Tier Guardrails & Premium Subscriptions** allowing students to trial 3 subjects and lessons 1–3 freely before upgrading to unlimited access (₱199/month or ₱1,499/year via GCash/Maya).
5. **Administrative Control Plane** (`/admin`) for student tracking, active subscription analytics, and SaaS pricing configuration.

---

## 2. User Personas & Roles

| Persona / Role | Description | Primary Needs & Actions |
|---|---|---|
| **Free Tier Student** (`STUDENT`) | JHS/SHS student exploring DepEd subjects. | Access up to 3 trial subjects; practice lessons 1–3 in Study Mode with AI hints; view subject catalog. |
| **Premium Student** (`STUDENT` + `ACTIVE` Sub) | Subscribed high school student mastering entire curriculum. | Unlimited access to all 130+ subjects; access all 12 lessons per subject; unlimited AI tutoring hints and Exam mode drills. |
| **School Head / Admin** (`ADMIN`) | Platform administrator or educator monitor. | Track enrolled students, active subscriptions, revenue metrics, and configure plan pricing / guardrails. |

---

## 3. Product Features & Scope

### 3.1 Curriculum & Subject Catalog
- **Categorization**: Grouped into two primary sections:
  - **Junior High School (Grades 7–10)**: Core subjects (English, Filipino, Math, Science, AP, EsP, MAPEH, TLE).
  - **Senior High School STEM (Grades 11–12)**: Semester-based specialized subjects (General Math, Pre-Calculus, Basic Calculus, General Physics, General Chemistry, General Biology, etc.).
- **Filtering**: Level tabs (All, JHS, SHS) and dynamic Grade filter pills (Grade 7 to Grade 12).
- **Search**: Instant case-insensitive search by subject name or course code.

### 3.2 Socratic AI Tutor & Dialect Engine
- Powered by **Google Gemini 2.5 Flash Lite**.
- Socratic mode guides the student toward finding the answer themselves without immediately revealing solutions.
- **Dialect Translations**: Supports 10 Philippine dialects including English, Filipino (Tagalog), Taglish, Cebuano (Bisaya), Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, and Pangasinense.

### 3.3 Quiz Runner (Study Mode vs. Exam Mode)
- **Study Mode**: Real-time feedback after each question, AI tutor explanations, and Socratic hint expansion.
- **Exam Mode**: Timed, uninterrupted assessment measuring final score against DepEd MATATAG transmutation standards (passing score ≥ 75%).

### 3.4 Tier Guardrails & Billing
- **Free Tier Constraints**:
  - Max 3 enrolled `TrialSubject` records.
  - Accessible lessons per subject: Lessons 1 to 3.
  - Attempting to access lesson 4+ or a 4th subject triggers an `UpgradeModal` with GCash / Maya checkout.
- **Premium Tier**:
  - Monthly Pass: ₱199/month.
  - Annual Pass: ₱1,499/year (37% savings for full school year).

### 3.5 Administrative Portal (`/admin`)
- **Overview Tab**: Live KPI stat cards (Total Students, Active Subscriptions, Revenue in PHP, Pending Verifications).
- **Students & Subscriptions Tab**: Searchable, filterable student table with direct actions to activate or expire subscriptions.
- **Pricing & Guardrails Settings Tab**: Live configuration of subscription prices, trial subject limits, and GCash/Maya receiver details.

---

## 4. Non-Functional Requirements
- **Performance**: Sub-100ms API response time on cached curriculum queries; optimistic mutations with TanStack Query.
- **Security**: PostgreSQL connection pooling, NextAuth v5 session protection, role-based admin routing (`AppRole.ADMIN`).
- **Aesthetics & Theme**: Tailwind CSS v4, dark/light mode toggle with `next-themes`, rich OKLCH status tokens (`--success`, `--warning`, `--info`, `--destructive`).
- **Testing & Quality Assurance**: Jest test suite with 100% pass rate in CI for guardrails, schemas, and curriculum data.
