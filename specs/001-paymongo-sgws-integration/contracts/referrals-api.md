# Referrals API Contract

**Feature Branch**: `001-paymongo-sgws-integration`  
**Date**: 2026-10-26  
**Status**: Completed  
**Spec Reference**: [`spec.md`](../spec.md) | **Research Reference**: [`research.md`](../research.md)  

---

## 1. Overview
The Referrals API provides a resilient server-side proxy for validating affiliate referral codes in real time against the external **SGWS Affiliates Portal** (`sgws-affiliates.sgws.tech`).

This proxy guarantees:
- Shielding external API credentials and secrets from the client.
- Enforcing an `AbortController` 2,500ms timeout guardrail.
- Graceful degradation: never throwing unhandled 500 errors or blocking checkout if the external affiliate service is slow or down.

---

## 2. Endpoints

### 2.1 Validate Referral Code
Validates whether a given affiliate referral code is active and authorized for the `highschool-tutor` product.

- **URL**: `/api/v1/referrals/validate`
- **Method**: `POST`
- **Authentication**: Public (Accessible to both unauthenticated visitors and logged-in students)
- **Content-Type**: `application/json`

#### Request Headers
| Header | Value | Required | Description |
|:---|:---|:---|:---|
| `Content-Type` | `application/json` | Yes | Request payload format. |

#### Request Body Schema (Zod)
```typescript
import { z } from "zod";

export const ValidateReferralSchema = z.object({
  referralCode: z
    .string()
    .trim()
    .min(2, "Referral code must be at least 2 characters")
    .max(50, "Referral code cannot exceed 50 characters"),
  productSlug: z.string().trim().default("highschool-tutor"),
});

export type ValidateReferralInput = z.infer<typeof ValidateReferralSchema>;
```

#### Request Example
```json
{
  "referralCode": "SGWS-A001",
  "productSlug": "highschool-tutor"
}
```

---

## 3. Upstream Integration Pipeline

1. **Sanitize Input**: Trim leading and trailing whitespace from `referralCode`.
2. **Upstream Request**:
   - URL: `POST ${SGWS_AFFILIATES_API_URL}/api/integrations/validate-referral`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "referralCode": "SGWS-A001",
       "productSlug": "highschool-tutor"
     }
     ```
3. **Resiliency Guardrail**:
   - An `AbortController` instance with a timeout of `2500ms` (`SGWS_API_TIMEOUT_MS = 2500`) aborts the upstream request if no response is received in time.
4. **Upstream Response Parsing**:
   - The response is validated against the following discriminated union schema:
   ```typescript
   export const SgwsValidationResponseSchema = z.discriminatedUnion("valid", [
     z.object({
       valid: z.literal(true),
       affiliate: z.object({
         code: z.string(),
         name: z.string(),
         type: z.string().optional(),
       }),
       product: z
         .object({
           slug: z.string(),
           name: z.string(),
           priceMinor: z.number(),
         })
         .nullable()
         .optional(),
       reason: z.null(),
     }),
     z.object({
       valid: z.literal(false),
       affiliate: z.null(),
       product: z.null(),
       reason: z.string(),
     }),
   ]);
   ```
5. **Fallback on Failure**:
   - On timeout (`AbortError`), network error, or HTTP 5xx response from SGWS, catch error and return a safe fallback:
     ```json
     {
       "valid": false,
       "affiliate": null,
       "product": null,
       "reason": "SERVICE_UNAVAILABLE"
     }
     ```
   - *Crucial Rule*: Never throw unhandled exceptions or return HTTP 500 to the client.

---

## 4. Response Specifications

### 4.1 Valid Affiliate Partner (`200 OK`)
Returned when the affiliate code exists and is in good standing.
```json
{
  "valid": true,
  "affiliate": {
    "code": "SGWS-A001",
    "name": "Prof. Danilo Santos (DepEd NCR Partner)",
    "type": "EDUCATOR_PARTNER"
  },
  "product": {
    "slug": "highschool-tutor",
    "name": "HighSchool Tutor Pass",
    "priceMinor": 29900
  },
  "reason": null
}
```

### 4.2 Invalid or Expired Referral Code (`200 OK`)
Returned when the affiliate code was not found or is expired.
```json
{
  "valid": false,
  "affiliate": null,
  "product": null,
  "reason": "INVALID_OR_EXPIRED_CODE"
}
```

### 4.3 Service Latency / Upstream Outage (`200 OK`)
Returned when SGWS exceeds 2.5 seconds or experiences downtime.
```json
{
  "valid": false,
  "affiliate": null,
  "product": null,
  "reason": "SERVICE_UNAVAILABLE"
}
```

### 4.4 Malformed Client Request (`400 Bad Request`)
Returned when client payload fails schema validation (e.g. empty string or missing parameters).
```json
{
  "valid": false,
  "error": "Referral code must be at least 2 characters."
}
```
