# Contract: Schema.org JSON-LD Structured Data

**Consumer**: Search Engine Crawlers (Googlebot, Bingbot), AI Answer Engines (Gemini, Perplexity, ChatGPT), Rich Results Test  
**Implementation**: Server Components (`features/seo/components/JsonLd.tsx`)  
**Format**: `<script type="application/ld+json">` embedded in server HTML response  

---

## 1. Root Landing Page (`/` and `app/layout.tsx`)

### Schema: `EducationalOrganization` + `WebSite` with `SearchAction`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://highschool-tutor.sgws.tech/#organization",
      "name": "HighSchool Tutor",
      "url": "https://highschool-tutor.sgws.tech",
      "logo": "https://highschool-tutor.sgws.tech/logo/highschool-tutor-logo-favicon-squared.png",
      "description": "Philippine DepEd K-12 MATATAG classroom study companion providing structured lessons, 24 practice quizzes per lesson, and Socratic AI tutoring for Junior and Senior High School students.",
      "sameAs": [
        "https://facebook.com/highschooltutor",
        "https://twitter.com/highschooltutor"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PH"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://highschool-tutor.sgws.tech/#website",
      "name": "HighSchool Tutor",
      "url": "https://highschool-tutor.sgws.tech",
      "publisher": {
        "@id": "https://highschool-tutor.sgws.tech/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://highschool-tutor.sgws.tech/tracks?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["en-PH", "fil-PH"]
    }
  ]
}
```

---

## 2. How It Works Page (`/how-it-works`)

### Schema: `FAQPage`

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://highschool-tutor.sgws.tech/how-it-works#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is HighSchool Tutor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HighSchool Tutor is an AI-powered classroom study companion designed for Philippine Junior and Senior High School students (Grades 7 to 12). It provides 130+ DepEd K-12 MATATAG aligned subjects with structured lesson modules, verified practice quizzes, and real-time Socratic AI guidance."
      }
    },
    {
      "@type": "Question",
      "name": "Is HighSchool Tutor aligned with the new DepEd MATATAG curriculum?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All curriculum codes, learning competencies, and grading calculations strictly follow the Philippine Department of Education (DepEd) K-12 MATATAG guidelines and DepEd Order No. 015, s. 2026."
      }
    },
    {
      "@type": "Question",
      "name": "What devices can I use HighSchool Tutor on?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can use HighSchool Tutor on any smartphone, tablet, laptop, or desktop computer with an internet connection. The app is fully responsive and optimized for mobile web browsers."
      }
    },
    {
      "@type": "Question",
      "name": "How does the Socratic AI tutor help me learn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Instead of giving away answers directly, our Google Gemini AI tutor uses the Socratic method. It asks guiding questions, highlights foundational concepts, explains 'Bakit Mali Ito?' (Why is this wrong?), and translates explanations into your preferred dialect (English, Filipino, Taglish, Cebuano, Ilocano)."
      }
    },
    {
      "@type": "Question",
      "name": "Does using HighSchool Tutor violate school academic integrity rules?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HighSchool Tutor is designed strictly for study, concept mastery, and exam preparation. Using it to practice and test your understanding is encouraged. However, students should never copy AI-generated text for submission in graded classroom assignments."
      }
    },
    {
      "@type": "Question",
      "name": "How are grades transmuted on the platform?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quiz scores are automatically processed through the official DepEd Order No. 015, s. 2026 transmutation scale, showing both the raw percentage and the official transmuted grade descriptor."
      }
    }
  ]
}
```

---

## 3. Academic Tracks Directory (`/tracks`)

### Schema: `BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://highschool-tutor.sgws.tech"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Academic Tracks & Strands",
      "item": "https://highschool-tutor.sgws.tech/tracks"
    }
  ]
}
```

---

## 4. Academic Track Detail (`/tracks/[id]`, e.g., `/tracks/stem-strand`)

### Schema: `Course` + `BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://highschool-tutor.sgws.tech"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Academic Tracks & Strands",
          "item": "https://highschool-tutor.sgws.tech/tracks"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "STEM Strand (Science, Technology, Engineering, & Mathematics)",
          "item": "https://highschool-tutor.sgws.tech/tracks/stem-strand"
        }
      ]
    },
    {
      "@type": "Course",
      "@id": "https://highschool-tutor.sgws.tech/tracks/stem-strand#course",
      "name": "STEM Strand (Science, Technology, Engineering, & Mathematics)",
      "description": "Prepares Senior High School students for college science, engineering, and mathematics programs with rigorous modules in Pre-Calculus, Basic Calculus, General Biology, General Chemistry, and General Physics.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "HighSchool Tutor",
        "url": "https://highschool-tutor.sgws.tech"
      },
      "educationalLevel": "Senior High School (Grades 11-12)",
      "educationalCredentialAwarded": "DepEd MATATAG Senior High School STEM Competency Certification",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "inLanguage": ["en-PH", "fil-PH"]
      }
    }
  ]
}
```

---

## 5. Security & Escaping Contract

To prevent Cross-Site Scripting (XSS) via injected strings in JSON-LD payloads:
- All `<` characters MUST be escaped to `\u003c`.
- All `>` characters MUST be escaped to `\u003e`.
- All `&` characters MUST be escaped to `\u0026`.
- `features/seo/components/JsonLd.tsx` applies safe JSON serialization:
  ```typescript
  const serialized = JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  ```

---

## 6. Verification Criteria

1. Running `.agents/skills/seo/scripts/validate_schema.py` on `/`, `/how-it-works`, `/tracks`, and `/tracks/stem-strand` reports 0 syntax errors.
2. Google Rich Results Test emulator confirms eligible rich snippets for `Organization`, `WebSite`, `FAQPage`, and `Course`.
