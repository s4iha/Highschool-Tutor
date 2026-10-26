# Checkout API Contract

**Feature Branch**: `001-paymongo-sgws-integration`  
**Date**: 2026-10-26  
**Status**: Completed  
**Spec Reference**: [`spec.md`](../spec.md) | **Data Model**: [`data-model.md`](../data-model.md)  

---

## 1. Overview
The Checkout API facilitates secure, server-authoritative PayMongo hosted checkout session creation and asynchronous post-checkout status verification for authenticated HighSchool Tutor students and parents.

---

## 2. Endpoints

### 2.1 Create Checkout Session
Creates a PayMongo hosted checkout session (`/v2/checkout_sessions`), persists a `PaymentTransaction` record with status `PENDING`, and returns the hosted gateway URL for client redirection.

- **URL**: `/api/v1/billing/checkout/create-session`
- **Method**: `POST`
- **Authentication**: Required (Better Auth Session / JWT cookie)
- **Content-Type**: `application/json`

#### Request Headers
| Header | Value | Required | Description |
|:---|:---|:---|:---|
| `Content-Type` | `application/json` | Yes | Request payload format. |
| `Cookie` | `better-auth.session_token=...` or `auth_token=...` | Yes | Active authenticated student session. |

#### Request Body Schema (Zod)
```typescript
import { z } from "zod";

export const CreateCheckoutSessionSchema = z.object({
  plan: z.enum(["MONTHLY", "ANNUAL"]),
  referralCode: z.string().trim().min(2).max(50).optional(),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
```

#### Request Example
```json
{
  "plan": "ANNUAL",
  "referralCode": "SGWS-A001"
}
```

#### Processing Pipeline
1. Authenticate user from session headers (`getCurrentUser()`). Return `401 Unauthorized` if unauthenticated.
2. Validate request body against `CreateCheckoutSessionSchema`.
3. Resolve pricing authoritatively from server definitions / `AdminConfig`:
   - `MONTHLY`: ₱299.00 (`29900` centavos)
   - `ANNUAL`: ₱2,499.00 (`249900` centavos, saving ₱1,089 vs. monthly)
4. Check referral code:
   - If provided in request body, use it.
   - If omitted, read `sgws_ref` cookie from request headers.
   - If present, validate against SGWS Affiliates Portal with 2,500ms timeout guardrail.
5. Generate collision-free reference number:
   - If valid referral: `SGWS-highschool-tutor-{referralCode}-{timestamp}`
   - If direct: `HST-DIRECT-{timestamp}`
6. Construct PayMongo checkout session payload:
   - Currency: `PHP`
   - Payment method types: `["qrph", "card", "gcash", "paymaya", "grab_pay", "dob"]`
   - Success URL: `${NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `${NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`
7. Dispatch `POST https://api.paymongo.com/v2/checkout_sessions` with Basic Auth.
8. Persist `PaymentTransaction` in PostgreSQL:
   - `status: PENDING`
   - `paymongoSessionId: session.id`
   - `referenceNumber: ref`
   - `amountCentavos: amount`
   - `plan: plan`
   - `userId: user.id`
9. Return response with `checkoutUrl`. If referral code was validated, set `sgws_ref` cookie on response.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "checkoutUrl": "https://pm.link/org-test/cs_test_abc123xyz",
  "sessionId": "cs_test_abc123xyz",
  "referenceNumber": "SGWS-highschool-tutor-SGWS-A001-1729340000",
  "amountCentavos": 249900,
  "currency": "PHP",
  "plan": "ANNUAL"
}
```

#### Error Responses
- **`400 Bad Request`**:
  ```json
  {
    "success": false,
    "error": "Invalid plan selection. Must be MONTHLY or ANNUAL."
  }
  ```
- **`401 Unauthorized`**:
  ```json
  {
    "success": false,
    "error": "Authentication required to initiate checkout session."
  }
  ```
- **`502 Bad Gateway`**:
  ```json
  {
    "success": false,
    "error": "Payment gateway communication error. Please try again."
  }
  ```

---

### 2.2 Verify Checkout Session
Permits the dashboard UI to query transaction and fulfillment status upon return from the gateway (`/dashboard?payment=success&session_id=...`). Used to reconcile with asynchronous webhook delivery.

- **URL**: `/api/v1/billing/checkout/verify-session`
- **Method**: `GET`
- **Authentication**: Required (Better Auth Session / JWT cookie)

#### Query Parameters
| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `sessionId` | `String` | Yes | PayMongo checkout session identifier (`cs_...`). |

#### Processing Pipeline
1. Authenticate user from session headers (`getCurrentUser()`).
2. Query `PaymentTransaction` matching `paymongoSessionId === sessionId` and `userId === user.id`.
3. If found and `status === PAID`:
   - Return `{ verified: true, status: 'PAID', plan, paidAt, expiresAt }`.
4. If found and `status === PENDING`:
   - Query PayMongo API `GET https://api.paymongo.com/v2/checkout_sessions/{sessionId}` to verify if payment was completed.
   - If PayMongo confirms payment completed, trigger `fulfillPayMongoCheckoutPayment` synchronously as a reconciliation fallback.
   - Return updated status.
5. If not found or belongs to another user:
   - Return `404 Not Found`.

#### Success Response (`200 OK`) - Paid & Provisioned
```json
{
  "success": true,
  "verified": true,
  "status": "PAID",
  "referenceNumber": "SGWS-highschool-tutor-SGWS-A001-1729340000",
  "plan": "ANNUAL",
  "paidAt": "2026-10-26T11:00:00.000Z",
  "subscription": {
    "id": "sub_cm7abc123",
    "status": "ACTIVE",
    "plan": "ANNUAL",
    "expiresAt": "2027-10-26T11:00:00.000Z"
  }
}
```

#### Success Response (`200 OK`) - Still Pending (Webhook processing in-flight)
```json
{
  "success": true,
  "verified": false,
  "status": "PENDING",
  "referenceNumber": "SGWS-highschool-tutor-SGWS-A001-1729340000",
  "plan": "ANNUAL",
  "message": "Payment processing with gateway; awaiting final confirmation."
}
```

#### Error Responses
- **`400 Bad Request`**: Missing `sessionId`.
- **`401 Unauthorized`**: User not logged in.
- **`404 Not Found`**: Transaction session not found for this user.
