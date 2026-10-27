# Contract: Dynamic XML Sitemap (`/sitemap.xml`)

**Endpoint**: `GET /sitemap.xml`  
**Content-Type**: `application/xml; charset=utf-8`  
**Route Handler**: `app/sitemap.ts`  
**Domain Module**: `features/seo/utils/metadataBuilders.ts`  

---

## 1. HTTP Specification

### Request
```http
GET /sitemap.xml HTTP/1.1
Host: highschool-tutor.sgws.tech
Accept: application/xml, text/xml, */*
```

### Response
```http
HTTP/1.1 200 OK
Content-Type: application/xml; charset=utf-8
Cache-Control: public, max-age=86400, stale-while-revalidate=604800

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>https://highschool-tutor.sgws.tech</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/how-it-works</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/privacy</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/terms</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Dynamic Curriculum Tracks (from TRACKS_DATA) -->
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/junior-high-core</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/stem-strand</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/abm-strand</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/humss-strand</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/shs-core</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/gas-strand</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://highschool-tutor.sgws.tech/tracks/tvl-track</loc>
    <lastmod>2026-10-27T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 2. Route Manifest & Priority Breakdown

| Path | Source | Change Frequency | Priority | Expected Total |
|---|---|---|---|---|
| `/` | Static | `daily` | `1.0` | 1 |
| `/tracks` | Static | `daily` | `0.9` | 1 |
| `/how-it-works` | Static | `weekly` | `0.8` | 1 |
| `/privacy` | Static | `monthly` | `0.5` | 1 |
| `/terms` | Static | `monthly` | `0.5` | 1 |
| `/tracks/[id]` | Dynamic (`TRACKS_DATA`) | `weekly` | `0.8` | 7 |
| **Total URLs** | — | — | — | **12** |

---

## 3. Next.js App Router Return Type Contract

The route handler `app/sitemap.ts` must return an array satisfying `MetadataRoute.Sitemap`:

```typescript
import { MetadataRoute } from "next";

export type SitemapRouteResponse = MetadataRoute.Sitemap;
```

---

## 4. Verification & Audit Acceptance Criteria

1. Requesting `GET /sitemap.xml` returns valid XML with HTTP status `200`.
2. XML validates against Schema 0.9 (`http://www.sitemaps.org/schemas/sitemap/0.9`).
3. Exactly 12 `<url>` nodes are returned (5 static + 7 dynamic track pages).
4. No authenticated, admin, curriculum runner, or API paths exist in `<urlset>`.
5. Automated tool `.agents/skills/seo/scripts/sitemap_checker.py` must pass with 0 errors.
