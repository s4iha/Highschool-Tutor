# Contract: Robots Crawl Directives (`/robots.txt`)

**Endpoint**: `GET /robots.txt`  
**Content-Type**: `text/plain; charset=utf-8`  
**Route Handler**: `app/robots.ts`  
**Domain Module**: `features/seo/utils/metadataBuilders.ts`  

---

## 1. HTTP Specification

### Request
```http
GET /robots.txt HTTP/1.1
Host: highschool-tutor.sgws.tech
User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)
Accept: */*
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, max-age=86400, stale-while-revalidate=604800

User-agent: *
Allow: /
Allow: /tracks
Allow: /tracks/*
Allow: /how-it-works
Allow: /privacy
Allow: /terms
Disallow: /dashboard/
Disallow: /admin/
Disallow: /curriculum/
Disallow: /api/

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
Allow: /
Allow: /tracks
Allow: /tracks/*
Allow: /how-it-works
Disallow: /dashboard/
Disallow: /admin/
Disallow: /curriculum/
Disallow: /api/
Disallow: /privacy
Disallow: /terms

Sitemap: https://highschool-tutor.sgws.tech/sitemap.xml
Host: https://highschool-tutor.sgws.tech
```

---

## 2. Rule Definitions & Security Assertions

| Directive | User Agent | Target Path | Rationale & Security Assessment |
|---|---|---|---|
| **Allow** | `*` | `/` | Public landing page and value proposition |
| **Allow** | `*` | `/tracks` | Public curriculum track directory |
| **Allow** | `*` | `/tracks/*` | Public track detail and competency outlines |
| **Allow** | `*` | `/how-it-works` | Public product walkthrough and DepEd guide |
| **Allow** | `*` | `/privacy` | Public legal and data privacy policy |
| **Allow** | `*` | `/terms` | Public terms of service and acceptable use |
| **Disallow** | `*` | `/dashboard/` | **CRITICAL PRIVACY**: Protected student learning portal and personal data |
| **Disallow** | `*` | `/admin/` | **CRITICAL SECURITY**: School head administrative portal and settings |
| **Disallow** | `*` | `/curriculum/` | **ACADEMIC INTEGRITY**: Active interactive quiz runner and session state |
| **Disallow** | `*` | `/api/` | **API PROTECTION**: Backend mutation endpoints, webhooks, and auth calls |
| **Allow** | AI Bots | Public Content | Enables LLMs to index curriculum tracks for factual educational citations |
| **Disallow** | AI Bots | `/dashboard/`, `/admin/`, etc. | Prevents LLM scrapers from ingesting private student interactions or admin consoles |

---

## 3. Next.js App Router Return Type Contract

The route handler `app/robots.ts` must return an object satisfying `MetadataRoute.Robots`:

```typescript
import { MetadataRoute } from "next";

export interface RobotsRouteResponse {
  rules: Array<{
    userAgent: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
  }>;
  sitemap: string;
  host?: string;
}
```

---

## 4. Verification & Audit Acceptance Criteria

1. Requesting `GET /robots.txt` returns HTTP status `200` with header `content-type: text/plain`.
2. Automated tool `.agents/skills/seo/scripts/robots_checker.py` must pass with 0 errors.
3. Automated path tester `.agents/skills/seo/scripts/robots_path_tester.py` must assert:
   - Path `/dashboard/overview` -> **BLOCKED**
   - Path `/admin/users` -> **BLOCKED**
   - Path `/curriculum/quiz/run` -> **BLOCKED**
   - Path `/api/v1/auth` -> **BLOCKED**
   - Path `/tracks/stem-strand` -> **ALLOWED**
   - Path `/how-it-works` -> **ALLOWED**
