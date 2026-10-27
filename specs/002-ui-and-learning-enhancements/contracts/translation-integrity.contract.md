# Function Contract: Multilingual Translation Integrity

**Feature**: `002-ui-and-learning-enhancements`  
**Files**:  
- `features/curriculum/api/gemini-service.ts` (`batchTranslateQuizQuestion`)
- `features/curriculum/actions/curriculum.actions.ts` (`batchTranslateAction`)  
- `features/curriculum/schemas/curriculum.schemas.ts`  
**Purpose**: Guarantees that when a student selects a Philippine dialect (Taglish, Cebuano, Ilocano, etc.), only the question stem and explanation are translated, while multiple-choice options (A, B, C, D) remain 100% in original English with KaTeX mathematical formulas uncorrupted.  

---

## 1. Zod Validation Schemas

Defined in `features/curriculum/schemas/curriculum.schemas.ts`:

```typescript
import { z } from "zod";

export const batchTranslateQuizInputSchema = z.object({
  question: z.string().min(1, "Question stem is required"),
  options: z.object({
    A: z.string().min(1, "Option A is required"),
    B: z.string().min(1, "Option B is required"),
    C: z.string().min(1, "Option C is required"),
    D: z.string().min(1, "Option D is required"),
  }),
  explanation: z.string().min(1, "Explanation is required"),
  language: z.string().min(1, "Target language is required"),
});

export type BatchTranslateQuizInput = z.infer<typeof batchTranslateQuizInputSchema>;

export const batchTranslateResponseSchema = z.object({
  question: z.string().min(1),
  explanation: z.string().min(1),
});

export type BatchTranslateResponse = z.infer<typeof batchTranslateResponseSchema>;
```

---

## 2. Function Contract: `batchTranslateQuizQuestion`

### Signature
```typescript
export async function batchTranslateQuizQuestion(
  item: TranslatableQuizQuestion,
  language: string
): Promise<TranslatableQuizQuestion>
```

### Input Parameters
```typescript
export interface TranslatableQuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation: string;
}
```

### Return Value
```typescript
{
  question: string; // Translated problem stem
  options: {        // 100% untouched original English options
    A: string;
    B: string;
    C: string;
    D: string;
  };
  explanation: string; // Translated explanation
}
```

---

## 3. Gemini System Prompt & Structured Output Schema

### Gemini Directive Prompt
```text
Translate ONLY the question stem and the explanation into the Philippine dialect: ${language}.
CRITICAL LANGUAGE INTEGRITY RULES:
1. Do NOT translate multiple-choice options A, B, C, or D. All options must remain in their original English technical form.
2. Maintain standard Philippine Department of Education (DepEd MATATAG) high school academic terminology.
3. Preserve all mathematical and scientific formulas in exact LaTeX syntax ($...$ for inline, $$...$$ for block formulas). Do NOT drop or alter dollar signs.

Content to translate:
Question: ${item.question}
Explanation: ${item.explanation}
```

### Gemini JSON Schema
```json
{
  "type": "OBJECT",
  "properties": {
    "question": { "type": "STRING" },
    "explanation": { "type": "STRING" }
  },
  "required": ["question", "explanation"]
}
```

---

## 4. Invariants & Verification Rules

1. **Strict English Preservation (Clarification 5 & FR-007)**:
   - `output.options.A === item.options.A`
   - `output.options.B === item.options.B`
   - `output.options.C === item.options.C`
   - `output.options.D === item.options.D`
   - The generative AI call is never asked to translate or format option text.

2. **LaTeX Delimiter Preservation (FR-009)**:
   - A post-translation validation step checks that unescaped `$` counts in `translated.question` and `translated.explanation` match the parity of the original strings.
   - If a malformed KaTeX string is detected, the function falls back gracefully to the original English text for that specific field.

3. **In-Memory Caching (FR-008)**:
   - Cache key: `${language}:${item.question}`.
   - Identical question stems requested in the same dialect are served immediately from cache, eliminating redundant Gemini API hits and 429 rate limit triggers.
