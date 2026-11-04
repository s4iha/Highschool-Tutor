# Phase 0 Research: Authentic Filipino Hero Imagery, Frictionless Subscription Availment, DepEd MATATAG Scope Pages & Expanded Curriculum Catalog

**Feature**: `006-filipino-hero-subscription-scope-catalog`  
**Date**: 2026-11-03  
**Status**: Completed  
**Author**: Antigravity (Advanced Agentic Coding)

---

## 1. Architectural Decisions & Trade-Off Analysis

### Decision 1: Auth Intercept Architecture (Client Pre-Flight vs. Server 401 Intercept)

#### Context & Problem
When an unauthenticated visitor clicks "Start Monthly Subscription" or "Get Annual Unlimited Pass" from pricing cards or within `CheckoutModal.tsx`, the application currently fires `checkoutMutation.mutate(...)`. Because the user is unauthenticated (`user === null`), this invokes `POST /api/v1/billing/checkout/create-session` without an active session token. The API endpoint returns an HTTP 401 Unauthorized status, triggering a Sonner toast error:
> *"Checkout Initialization Failed: Unauthorized: Please log in to initiate checkout"*

This creates severe conversion friction, scaring away high-intent prospective subscribers and presenting a system failure rather than an invitation to sign up.

#### Options Evaluated
1. **Option A: Server 401 Global Axios/Fetch Interceptor**  
   Catch 401 responses globally in TanStack Query or a fetch wrapper, inspect if the request was to `/api/v1/billing/checkout/create-session`, suppress the error toast, and show an auth modal.  
   - *Drawback*: Unnecessary network round-trips, fragile global exception masking, violation of the Constitution principle prohibiting swallowing exceptions and masking errors in network layers.
2. **Option B: Client-Side Pre-Flight Auth Intercept in `CheckoutModal.tsx` and Action Buttons (Selected)**  
   Inspect the client session state via `useUser()` before invoking the checkout mutation.  
   - If `!user`:
     - Do NOT fire the unauthenticated network request.
     - Transition the UI to an **Auth Intercept State** within the modal (or open the dedicated `AuthInterceptModal`), highlighting the user's selected plan, price, and domestic payment options.
     - Save the **Return Intent** (`planId`, `referralCode`, `sourceUrl`, `timestamp`) into `sessionStorage` under key `hst_return_intent`.
     - Offer direct sign-in routes: "Continue with Google" (Better Auth social sign-in) or "Sign In with Email / Create Account" (`/login?callbackUrl=...`).
     - Provide a query parameter fallback (`?returnToCheckout=1&plan=...`) if `sessionStorage` is blocked by strict browser privacy settings.
   - Post-Login Intent Resumption:
     - Mount a reactive intent resumption hook (`useCheckoutReturnIntent`) inside the authenticated layout / user session listener.
     - When `user` transitions from `null` to authenticated, check `sessionStorage` for `hst_return_intent`.
     - If found and valid (< 2 hours old), clear the stored intent to prevent loops, display a reassurance toast ("Resuming your subscription checkout..."), invoke `createCheckoutSessionApi`, and redirect directly to PayMongo.
   - *Benefits*: Zero 401 errors, zero network waste, silky smooth UX, 100% preservation of affiliate attribution and plan selection.

---

### Decision 2: Public DepEd MATATAG Scope Pages Routing & Data Pipeline (`/subjects` & `/subjects/[slug]`)

#### Context & Problem
Philippine high school students, parents, and educators actively search Google for official DepEd subject requirements (e.g., "General Mathematics Grade 11 MATATAG curriculum", "Earth and Life Science SHS time allotment", "Basic Calculus prerequisites"). HighSchool Tutor currently houses its curriculum data internally, preventing search engines from indexing individual course requirements and missing out on organic search traffic.

#### Architecture & Pipeline
1. **Catalog Route: `app/subjects/page.tsx`**  
   - Publicly accessible catalog showcasing all Junior High School and Senior High School subjects.
   - Server Component that renders the page skeleton and embeds Schema.org `BreadcrumbList`.
   - Delegates client-side interactive filtering and searching to `features/curriculum/components/PublicSubjectCatalog.tsx`.
   - Supports instant multi-dimension filtering:
     - Academic Level: `All`, `Junior High School`, `Senior High School`.
     - Track / Strand: `All`, `Core`, `Applied`, `STEM`, `ABM`, `HUMSS`, `GAS`, `TVL`, `Arts & Design`, `Sports`.
     - Grade Level: `All`, `Grade 7`, `Grade 8`, `Grade 9`, `Grade 10`, `Grade 11`, `Grade 12`.
     - Real-time text search across subject names and codes.

2. **Scope Route: `app/subjects/[slug]/page.tsx`**  
   - Public dynamic route accepting Next.js 16 asynchronous params: `params: Promise<{ slug: string }>`.
   - Pre-rendered at build time using `generateStaticParams()`:
     - Enumerates all canonical subject slugs from `SUBJECTS` in `curriculum-data.ts` (e.g., `g11-s1-genmath`, `g11-s1-oralcomm`, `g7-q1-math`).
     - Build-time generation guarantees sub-50ms static edge response times and 100% search engine indexability with zero database load during crawls.
   - `generateMetadata({ params })`:
     - Generates canonical OpenGraph tags, meta descriptions highlighting time allotment and DepEd DO 015 s. 2026 alignment.
     - Emits `noIndex: true` with 404 metadata if slug is invalid.
   - Page Rendering:
     - Invokes `notFound()` if slug does not resolve to a verified subject.
     - Renders `SubjectScopeView.tsx` from `features/curriculum/components/SubjectScopeView.tsx`:
       - DepEd Subject Name, Code, Grade Level, Semester/Quarter badges.
       - Official Time Allotment (e.g., 80 hours/semester, 20 hours for PEH, 160–640 hours for TVL).
       - Prerequisites & Corequisites breakdown (badges with clear links or "No prerequisites required").
       - Official DepEd Course Description from `docs/resources/shs-subjects.md`.
       - Key Learning Competencies aligned with DO 015 s. 2026.
       - Socratic AI Practice CTA ("Practice with Socratic AI Tutor") leading into the platform with pre-selected subject context.
   - Structured Data:
     - Injects Schema.org `Course` JSON-LD via `buildSubjectCourseSchema(subject)` in `features/seo/utils/schemaBuilders.ts`.
     - Injects Schema.org `BreadcrumbList` (`Home` > `Subjects` > `[Subject Name]`).

3. **Sitemap Integration: `app/sitemap.ts` & `features/seo/utils/sitemapBuilder.ts`**  
   - Dynamically appends `/subjects` (`priority: 0.9`, `changeFrequency: "daily"`).
   - Dynamically appends all canonical `/subjects/[slug]` entries (`priority: 0.8`, `changeFrequency: "weekly"`).
   - Expands platform indexed URLs from ~12 to 85+ canonical pages.

---

### Decision 3: Subject Catalog Expansion Architecture (Arts & Design, Sports, TVL)

#### Context & Problem
The current `SHS_SUBJECT_CATALOG` in `curriculum-data.ts` and `TRACKS_DATA` in `TrackDetail.tsx` only support Academic Strands (STEM, ABM, HUMSS, GAS) and a partial TVL list. Official DepEd curriculum rules (`docs/resources/shs-subjects.md`) specify:
- **Arts and Design Track**: 6 general subjects + 5 specialization streams (Media/Visual Arts, Literary Arts, Dance, Music, Theater) + Apprenticeship (160h).
- **Sports Track**: 9 specialized subjects (Safety & First Aid, Human Movement, Fundamentals of Coaching, Sports Officiating, Fitness Leadership, Psychosocial Aspects, Fitness Testing, Practicum, Apprenticeship).
- **Core TVL Sectors**: Agri-Fishery Arts (AFA), Industrial Arts (IA), Home Economics (HE), and Information and Communications Technology (ICT) with distinct TESDA NC hours (160h, 320h, 640h) and prerequisite chains.

#### Data Structure Updates
1. **Extend Type Definitions**:
   - In `features/curriculum/types/curriculum.types.ts`:
     - Update `CatalogShsStrand`: add `"Arts & Design"` and `"Sports"`.
   - In `features/curriculum/utils/curriculum-data.ts`:
     - Update `ShsSubjectDefinition["strand"]`: add `"Arts & Design"` and `"Sports"`.
2. **Add Complete Course Catalog in `SHS_SUBJECT_CATALOG`**:
   - Arts & Design (6 general subjects + specializations):
     - `AD-CI1`: Creative Industries I: Arts and Design Appreciation and Production (80h)
     - `AD-CI2`: Creative Industries II: Performing Arts (80h)
     - `AD-PPD`: Physical and Personal Development in the Arts (80h)
     - `AD-DFI`: Developing Filipino Identity in the Arts (80h)
     - `AD-IEP`: Integrating the Elements and Principles of Organization in the Arts (80h)
     - `AD-LM`: Leadership and Management in Different Arts Fields (80h)
     - Specialization streams: Media & Visual Arts, Literary Arts, Dance, Music, Theater (160h Apprenticeship + Culminating Production).
   - Sports Track (9 specialized subjects):
     - `SP-SFA`: Safety and First Aid (80h, Red Cross certification)
     - `SP-HM`: Human Movement (80h)
     - `SP-FC`: Fundamentals of Coaching (80h)
     - `SP-SOAM`: Sports Officiating and Activity Management (80h, NSA/TESDA certification)
     - `SP-FSRL`: Fitness, Sports, and Recreation Leadership (80h)
     - `SP-PASE`: Psychosocial Aspects of Sports and Exercise (80h)
     - `SP-FTEP`: Fitness Testing and Exercise Programming (80h)
     - `SP-PRAC`: Practicum (in-campus) (80h)
     - `SP-APPR`: Apprenticeship (off-campus) (80h)
   - Core TVL Specializations:
     - AFA: Agricultural Crops NC II (640h), Animal Production NC II (320h), Aquaculture NC II (640h), Food Processing NC II (640h), Organic Agriculture NC II (320h).
     - IA: Automotive Servicing NC I & II (640h), SMAW NC I & II (320h), Electrical Installation and Maintenance NC II (640h), Electronic Products Assembly and Servicing NC II (640h), Carpentry NC II (640h), DOMRAC NC II (640h).
     - HE: Caregiving NC II (640h), Cookery NC II (320h), Bread and Pastry Production NC II (160h), Food and Beverage Services NC II (160h), Front Office Services NC II (160h), Housekeeping NC II (160h), Tourism Promotion Services NC II (160h).
     - ICT: Computer Systems Servicing NC II (640h), Animation NC II (320h), Computer Programming NC III (320h), Technical Drafting NC II (320h).
3. **Register in `TRACKS_DATA` (`features/landing/components/TrackDetail.tsx`)**:
   - Register `arts-design-track` with `Palette` icon from `lucide-react`, tailored learning goals, 8-module featured subjects, career pathways, and AI tutor capabilities.
   - Register `sports-track` with `Trophy` icon from `lucide-react`, tailored learning goals, 8-module featured subjects, career pathways, and AI tutor capabilities.
   - Update `tvl-track` to detail all 4 core sectors.
   - Automatically supports public detail routes `/tracks/arts-design-track` and `/tracks/sports-track` via existing App Router track page.
4. **Update Unit Tests**:
   - Update `tests/unit/tracks-data.test.ts` to assert 9 total tracks, verifying data integrity, 8-module standardization, and required properties.

---

### Decision 4: Hero Visual Strategy & Cultural Grounding

#### Context & Problem
The hero section (`HeroSection.tsx`) represents the student's first emotional impression. A foreign stock image fails to connect with Filipino high school learners, parents, and public school teachers. HighSchool Tutor is hyper-localized to the Philippine DepEd K-12 MATATAG system.

#### Image & Layout Strategy
1. **Authentic Photographic Asset**:
   - Use an authentic photographic asset depicting a local Filipino high school student in a standard Philippine secondary school uniform (clean white uniform polo shirt / tie) actively studying with textbooks and a laptop in a well-lit, contemporary environment.
   - Preserved in `public/images/hero-student.jpg` (or referenced as `filipino-student-writing.jpg` / updated asset).
2. **Container Framing & Dimensions**:
   - Frame container strictly in a 4:5 vertical portrait aspect ratio: `aspect-[4/5]`.
   - Tailwind styling: `w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-visible mx-auto relative`.
   - Inner image component:
     ```tsx
     <Image
       src="/images/hero-student.jpg"
       alt="Filipino high school student studying DepEd MATATAG curriculum with HighSchool Tutor"
       fill
       priority
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
       className="object-cover object-top hover:scale-105 transition-transform duration-500 rounded-3xl"
     />
     ```
3. **Lighting & UI Harmony**:
   - Maintain the soft radial backlight glow (`bg-gradient-to-tr from-primary/30 via-teal-500/20 to-transparent blur-2xl`).
   - Retain the 3 floating interactive preview cards (General Mathematics 75% progress, Socratic AI Taglish assistant, Upcoming exam alert) arranged so their floating animations do not obscure the student's face on mobile (360px) or desktop viewports.
4. **Core Web Vitals & LCP**:
   - `priority` flag ensures immediate pre-loading in the HTML `<head>`.
   - Explicit `sizes` property prevents oversized image payload delivery across mobile and desktop.
   - Target LCP < 2.0s.

---

## 2. Summary of Decisions

| Area | Final Decision | Justification |
| :--- | :--- | :--- |
| **Auth Intercept** | Client-side preflight check in `CheckoutModal.tsx` + `sessionStorage` return intent (`hst_return_intent`) + reactive resumption hook | Zero 401 unauthorized errors, seamless post-login redirect to PayMongo, zero lost conversions. |
| **Public Scope Pages** | Public routes `app/subjects/page.tsx` (catalog) and `app/subjects/[slug]/page.tsx` (static pre-rendering via `generateStaticParams()`) | Instantaneous static page delivery (<50ms), zero DB strain, high organic Google search ranking for DepEd MATATAG queries. |
| **SEO Schemas** | Schema.org `Course` and `BreadcrumbList` JSON-LD embedded via `JsonLd.tsx` + dynamic sitemap enumeration in `features/seo` | Maximizes search engine rich snippet eligibility; increases indexed URLs to 85+. |
| **Catalog Expansion** | Add Arts & Design, Sports, and TVL specializations to `curriculum-data.ts`, `TRACKS_DATA`, and update `tracks-data.test.ts` | 100% DepEd MATATAG coverage across all tracks defined in `docs/resources/shs-subjects.md`. |
| **Hero Imagery** | 4:5 vertical portrait aspect ratio with authentic Filipino student in uniform, `priority` loading, and non-occluding floating cards | Immediate cultural grounding, DepEd trust, high conversion aesthetics, and optimal LCP. |
