# Quickstart: PayMongo & SGWS Affiliate Integration Validation Scenarios

**Feature Branch**: `001-paymongo-sgws-integration`  
**Date**: 2026-10-26  
**Status**: Ready for Verification  
**Spec Reference**: [`spec.md`](./spec.md) | **API Contracts**: [`contracts/`](./contracts/)  

---

## 1. Prerequisites & Environment Setup

Ensure the following environment variables are configured in `.env.local`:
```env
# PayMongo Credentials (Test Mode)
PAYMONGO_SECRET_KEY="sk_test_..."
PAYMONGO_PUBLIC_KEY="pk_test_..."
PAYMONGO_WEBHOOK_SECRET="whsk_test_..."

# SGWS Affiliates Portal API
SGWS_AFFILIATES_API_URL="https://sgws-affiliates.sgws.tech"
NEXT_PUBLIC_PRODUCT_SLUG="highschool-tutor"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Run database generation and seed:
```bash
npx prisma generate
npx prisma db push
```

---

## 2. Validation Scenarios

### Scenario 1: Direct Student Checkout Session Creation (Monthly & Annual Pass)

**Goal**: Verify that an authenticated student can generate a hosted PayMongo checkout session with server-calculated integer centavos amounts and direct reference numbers.

#### 1.1 Monthly Pass (₱299)
Execute via curl with an active session cookie:
```bash
curl -X POST http://localhost:3000/api/v1/billing/checkout/create-session \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=VALID_STUDENT_SESSION" \
  -d '{
    "plan": "MONTHLY"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "checkoutUrl": "https://pm.link/...",
  "sessionId": "cs_test_...",
  "referenceNumber": "HST-DIRECT-1729340000",
  "amountCentavos": 29900,
  "currency": "PHP",
  "plan": "MONTHLY"
}
```

#### 1.2 Annual Unlimited Pass (₱2,499)
```bash
curl -X POST http://localhost:3000/api/v1/billing/checkout/create-session \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=VALID_STUDENT_SESSION" \
  -d '{
    "plan": "ANNUAL"
  }'
```

**Expected Response**:
- `amountCentavos`: `249900`
- `referenceNumber` prefix: `HST-DIRECT-`
- In PostgreSQL: A record in `payment_transactions` with `status: PENDING`, `amountCentavos: 249900`, `plan: ANNUAL`.

---

### Scenario 2: Affiliate Referral Tracking & Partner Attribution

**Goal**: Verify that arriving via an affiliate link (`?ref=SGWS-A001`) sets a 30-day cookie, pre-populates the checkout modal, validates the partner against SGWS, and generates an affiliate-attributed transaction reference.

#### 2.1 Live Referral Code Validation Proxy
```bash
curl -X POST http://localhost:3000/api/v1/referrals/validate \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "SGWS-A001",
    "productSlug": "highschool-tutor"
  }'
```

**Expected Response**:
```json
{
  "valid": true,
  "affiliate": {
    "code": "SGWS-A001",
    "name": "Prof. Danilo Santos (DepEd NCR Partner)"
  },
  "product": {
    "slug": "highschool-tutor",
    "name": "HighSchool Tutor Pass",
    "priceMinor": 29900
  },
  "reason": null
}
```

#### 2.2 Referred Checkout Session Initiation
```bash
curl -X POST http://localhost:3000/api/v1/billing/checkout/create-session \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=VALID_STUDENT_SESSION; sgws_ref=SGWS-A001" \
  -d '{
    "plan": "ANNUAL",
    "referralCode": "SGWS-A001"
  }'
```

**Expected Response**:
- `referenceNumber`: `SGWS-highschool-tutor-SGWS-A001-1729340000`
- `amountCentavos`: `249900` (Standard retail pricing maintained; partner credited for attribution).

---

### Scenario 3: PayMongo HMAC-SHA256 Webhook Verification & Idempotency

**Goal**: Verify that validly signed webhook notifications activate subscriptions and that duplicate webhooks are processed idempotently without redundant date extensions.

#### 3.1 Scripted Webhook Simulation (`scratch/test-webhook.ts`)
Run the scratch verification script:
```typescript
import crypto from "crypto";

const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET || "whsk_test_mocksecret";
const timestamp = Math.floor(Date.now() / 1000);

const payload = JSON.stringify({
  data: {
    id: "evt_test123",
    type: "event",
    attributes: {
      type: "checkout_session.payment.paid",
      data: {
        id: "cs_test_scenario3",
        type: "checkout_session",
        attributes: {
          payments: [
            {
              id: "pay_test123",
              attributes: {
                amount: 249900,
                status: "paid",
                source: { type: "gcash" }
              }
            }
          ],
          reference_number: "SGWS-highschool-tutor-SGWS-A001-1729340000"
        }
      }
    }
  }
});

const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(`${timestamp}.${payload}`)
  .digest("hex");

const signatureHeader = `t=${timestamp},te=${signature},li=${signature}`;

// Dispatch to localhost
const res = await fetch("http://localhost:3000/api/v1/webhooks/paymongo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Paymongo-Signature": signatureHeader
  },
  body: payload
});

console.log("Initial Delivery:", await res.json());

// Immediately replay identical webhook
const replayRes = await fetch("http://localhost:3000/api/v1/webhooks/paymongo", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Paymongo-Signature": signatureHeader
  },
  body: payload
});

console.log("Replay Delivery:", await replayRes.json());
```

**Expected Outputs**:
- **Initial Delivery**:
  ```json
  { "received": true, "processed": true, "status": "PAID" }
  ```
- **Replay Delivery**:
  ```json
  { "received": true, "alreadyFulfilled": true, "status": "PAID" }
  ```
- **Database Assertion**: Subscription expiration date was extended exactly once (+365 days), and `PaymentTransaction.status` remains `PAID`.

---

### Scenario 4: Subscription Period Stacking (Active Monthly Upgrades to Annual)

**Goal**: Verify that an active subscriber upgrading before their current term ends does not lose remaining prepaid days.

#### 4.1 Initial State
- Student has an active Monthly Pass with `expiresAt = 2026-11-15T00:00:00Z` (20 days remaining).

#### 4.2 Upgrade Action
- Webhook arrives for an `ANNUAL` pass payment on `2026-10-26`.

#### 4.3 Expected Verification
- Period is stacked onto `currentExpiresAt`:
  $$\text{newExpiresAt} = \text{2026-11-15} + 365 \text{ days} = \text{2027-11-15T00:00:00Z}$$
- Database check:
  ```sql
  SELECT status, plan, "expiresAt" FROM subscriptions WHERE "userId" = 'student_123';
  ```
  Returns `status: ACTIVE`, `plan: ANNUAL`, `expiresAt: 2027-11-15`.

---

### Scenario 5: External Affiliate Service Timeout & Graceful Degradation

**Goal**: Verify that if `sgws-affiliates.sgws.tech` times out or experiences an outage, checkout continues unblocked.

#### 5.1 Test Execution
Simulate with an unreachable or intercepted SGWS endpoint:
```bash
curl -X POST http://localhost:3000/api/v1/referrals/validate \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "TIMEOUT-TEST",
    "productSlug": "highschool-tutor"
  }'
```

**Expected Behavior**:
- Returns within 2,500ms (aborted by `AbortController`).
- Returns HTTP 200:
  ```json
  {
    "valid": false,
    "affiliate": null,
    "product": null,
    "reason": "SERVICE_UNAVAILABLE"
  }
  ```
- Student clicks "Proceed to Payment" in the UI: Checkout session is generated with direct reference number `HST-DIRECT-{timestamp}` without throwing an error.

---

### Scenario 6: Post-Checkout Redirect & In-App Status Reconciliation

**Goal**: Verify that returning from PayMongo hosted checkout (`/dashboard?payment=success&session_id=...`) triggers fast verification polling and updates user entitlements.

#### 6.1 Status Verification Polling
```bash
curl -X GET "http://localhost:3000/api/v1/billing/checkout/verify-session?sessionId=cs_test_scenario3" \
  -H "Cookie: better-auth.session_token=VALID_STUDENT_SESSION"
```

**Expected Response**:
```json
{
  "success": true,
  "verified": true,
  "status": "PAID",
  "referenceNumber": "SGWS-highschool-tutor-SGWS-A001-1729340000",
  "plan": "ANNUAL",
  "paidAt": "2026-10-26T11:00:00.000Z",
  "subscription": {
    "status": "ACTIVE",
    "plan": "ANNUAL",
    "expiresAt": "2027-10-26T11:00:00.000Z"
  }
}
```

**UI Assertion**:
- The dashboard displays a celebratory confirmation dialog.
- The trial countdown widget is replaced with an Active Annual Member badge.
- Restricted curriculum lessons (Lesson 4+) and Socratic AI tutoring unlock immediately.
