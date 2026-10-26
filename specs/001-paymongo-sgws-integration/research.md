# Research & Technical Decisions: PayMongo & SGWS Affiliate Integration

**Feature Branch**: `001-paymongo-sgws-integration`  
**Date**: 2026-10-26  
**Status**: Completed  
**Spec Reference**: [`spec.md`](./spec.md)  

---

## 1. Executive Summary & Architecture Strategy

This research document analyzes the technical decisions, security boundaries, and architectural patterns for integrating the **PayMongo Hosted Checkout Gateway** (`/v2/checkout_sessions`) and the **SGWS Affiliates Portal** (`sgws-affiliates.sgws.tech`) into HighSchool Tutor.

The integration replaces the platform's legacy, manual GCash/Maya screenshot uploads and 24-hour manual administrative approvals with an automated, instant payment provisioning pipeline. It provides:
1. **Automated Checkout**: Instant checkout creation via PayMongo's hosted checkout sessions supporting all major Philippine domestic payment rails (QR Ph, GCash, Maya, Debit/Credit Cards, GrabPay, Direct Online Banking).
2. **SGWS Affiliate Attribution**: Persistent referral tracking via a secure 30-day cookie (`sgws_ref`), real-time partner validation against SGWS with a 2,500ms `AbortController` timeout guardrail, and standardized transaction references (`SGWS-highschool-tutor-{code}-{timestamp}`).
3. **Cryptographically Secure Webhooks**: HMAC-SHA256 signature verification over incoming PayMongo payloads with a 300-second replay tolerance window and timing-safe comparisons.
4. **Idempotent Fulfillment & Subscription Period Stacking**: Concurrency locking and atomic Prisma transactions that provision active student entitlements instantly, safely stacking renewal days for existing subscribers without dropping remaining days.
5. **Instant In-App Reconciliation**: Rapid client-side status polling and celebration upon return to `/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`.

---

## 2. PayMongo Hosted Checkout Integration (`/v2/checkout_sessions`)

### 2.1 API Version & Authentication
- **Endpoint**: `POST https://api.paymongo.com/v2/checkout_sessions`
- **Authentication**: HTTP Basic Authentication header formatted as:
  ```typescript
  const authHeader = `Basic ${Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64')}`;
  ```
- **Rationale**: PayMongo API v2 Checkout Sessions provide PCI-DSS compliant hosted UI with built-in 3D-Secure 2.0 (3DS2) for cards, native QR Ph generation, and direct e-wallet deep-linking (GCash and Maya), eliminating sensitive card data handling from HighSchool Tutor's servers.

### 2.2 Payment Method Rails
- Configured payment method types:
  ```json
  ["qrph", "card", "gcash", "paymaya", "grab_pay", "dob"]
  ```
- **Rationale**: QR Ph is now the National QR standard in the Philippines, interoperable across BDO, BPI, UnionBank, RCBC, GCash, and Maya. Explicitly including `qrph`, `gcash`, `paymaya`, and `card` covers >98% of Philippine student and parent payment preferences.

### 2.3 Integer Centavos Conversion & Amount Safety
- **Rule**: PayMongo requires currency amounts to be transmitted in integer minor units (centavos for PHP: ₱1.00 = 100 centavos).
- **Formula**:
  ```typescript
  export function toCentavos(amountPhp: number): number {
    return Math.round(amountPhp * 100);
  }
  ```
- **Catalog Definitions (Server-Authoritative)**:
  - **Monthly Access Pass**: ₱299.00 → `29900` centavos
  - **Annual Unlimited Pass**: ₱2,499.00 → `249900` centavos
  - *Savings Highlight*: Annual pass costs ₱2,499/year compared to ₱3,588 (12 × ₱299), providing ₱1,089 annual savings (>30% discount).
- **Security Guardrail**: Prices MUST NEVER be accepted from client payloads. The server validates the requested `plan` (`MONTHLY` or `ANNUAL`) against the server-side catalog or `AdminConfig`, guaranteeing zero client-side price tampering.

### 2.4 Hosted Checkout Payload Structure
```json
{
  "data": {
    "attributes": {
      "billing": {
        "name": "Juan Dela Cruz",
        "email": "juan@example.com"
      },
      "line_items": [
        {
          "name": "HighSchool Tutor - Annual Unlimited Pass",
          "description": "Full access to DepEd MATATAG curriculum, Socratic AI tutoring, and quizzes for 365 days (Save ₱1,089 vs. Monthly)",
          "amount": 249900,
          "currency": "PHP",
          "quantity": 1
        }
      ],
      "payment_method_types": ["qrph", "card", "gcash", "paymaya", "grab_pay", "dob"],
      "reference_number": "SGWS-highschool-tutor-SGWS-A001-1729340000",
      "send_email_receipt": true,
      "show_description": true,
      "show_line_items": true,
      "description": "HighSchool Tutor Subscription",
      "success_url": "https://highschooltutor.ph/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}",
      "cancel_url": "https://highschooltutor.ph/dashboard?payment=cancelled"
    }
  }
}
```

---

## 3. Cryptographic Webhook Verification & HMAC-SHA256

### 3.1 PayMongo Signature Header Format
PayMongo dispatches webhook events with the `Paymongo-Signature` HTTP header containing three comma-separated timestamped parameters:
```http
Paymongo-Signature: t=1729340050,te=8f9a2b...,li=6c4e1d...
```
- `t`: Unix timestamp (in seconds) when the webhook was signed.
- `te`: HMAC-SHA256 test-mode signature signature.
- `li`: HMAC-SHA256 live-mode signature signature.

### 3.2 Verification Algorithm
1. Parse header using regex or string splitting into `t`, `te`, and `li`.
2. Check timestamp freshness against a 300-second (5-minute) tolerance window to prevent replay attacks:
   ```typescript
   const nowSeconds = Math.floor(Date.now() / 1000);
   if (Math.abs(nowSeconds - t) > 300) {
     throw new Error("Webhook timestamp outside tolerance window (replay attack rejected)");
   }
   ```
3. Prepare the signed payload: `${t}.${rawBody}`.
   - *Crucial Requirement*: The raw HTTP request body string must be preserved byte-for-byte (`await req.text()`). Do not parse to JSON before hashing.
4. Compute the expected HMAC-SHA256 hash using `PAYMONGO_WEBHOOK_SECRET`:
   ```typescript
   const computedHash = crypto
     .createHmac("sha256", webhookSecret)
     .update(`${t}.${rawBody}`)
     .digest("hex");
   ```
5. Compare `computedHash` against `te` (in test mode) or `li` (in live mode) using `crypto.timingSafeEqual`:
   ```typescript
   const expectedBuffer = Buffer.from(computedHash, "hex");
   const receivedBuffer = Buffer.from(signatureToCompare, "hex");
   if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
     throw new Error("Invalid PayMongo signature");
   }
   ```

---

## 4. SGWS Affiliate Portal Integration & Referral Tracking

### 4.1 SGWS Product Slug & Architecture Standard
- **Standard Product Slug**: `highschool-tutor` (configurable via `NEXT_PUBLIC_PRODUCT_SLUG`).
- **Attribution Policy**: Attribution-only tracking. Customers pay standard pricing (₱299/mo or ₱2,499/yr), and referring partners receive commission credited in the SGWS Affiliates Portal. Referral codes do not alter checkout price unless future promotional campaigns are specifically enabled.

### 4.2 Hybrid Cookie Capture Pattern
To guarantee robust attribution across full page reloads, external campaign links, and Single-Page Application (SPA) client navigation:
1. **Server Proxy / Middleware (`proxy.ts`)**:
   - Inspects `request.nextUrl.searchParams` for `ref` or `referral`.
   - If present and valid non-empty string, attaches a `Set-Cookie` header for `sgws_ref`.
2. **Client Layout Observer (`ReferralTracker.tsx`)**:
   - Runs in root layout to observe client-side query param transitions (e.g. Next.js router transitions).
   - If `?ref=` exists in `window.location.search`, ensures `document.cookie` or server sync is refreshed.
3. **Cookie Specifications**:
   - Name: `sgws_ref`
   - Max-Age: `2,592,000` seconds (30 calendar days)
   - Path: `/`
   - SameSite: `Lax`
   - HttpOnly: `true` for server-set cookies; readable fallback for client synchronization.
   - Secure: `true` in production (`process.env.NODE_ENV === "production"`).
4. **Overwrite Protection**:
   - An existing valid affiliate code MUST NEVER be overwritten by an empty string, null, or missing query parameter.

### 4.3 Live Validation Service & Resiliency
- **Upstream Endpoint**: `POST https://sgws-affiliates.sgws.tech/api/integrations/validate-referral`
- **Request Schema**:
  ```json
  {
    "referralCode": "SGWS-A001",
    "productSlug": "highschool-tutor"
  }
  ```
- **Timeout & Failure Circuit Breaker**:
  - Enforce `AbortController` with `SGWS_API_TIMEOUT_MS = 2500` (2.5 seconds).
  - If the external API times out, returns HTTP 500/502/503, or DNS fails, the service catches the error, logs a warning, and returns:
    ```typescript
    { valid: false, affiliate: null, product: null, reason: "SERVICE_UNAVAILABLE" }
    ```
  - **Zero Checkout Blocking**: An SGWS outage or latency spike MUST NEVER block or disrupt a student from completing their purchase. The checkout automatically falls back to direct transaction mode.

### 4.4 Standardized Reference Number Generation
- **Format**:
  - Affiliate referral: `SGWS-{productSlug}-{referralCode}-{timestamp}`
    - Example: `SGWS-highschool-tutor-SGWS-A001-1729340000`
  - Direct checkout: `HST-DIRECT-{timestamp}`
    - Example: `HST-DIRECT-1729340000`
- **Parsing Utility**: `parseReferenceNumber(ref)` extracts `{ isAffiliate, prefix, productSlug, referralCode, timestamp }`.

---

## 5. Idempotent Fulfillment & Subscription Period Stacking

### 5.1 Concurrency Locking
PayMongo webhooks can deliver duplicate events in rapid succession (retries on network latency or dual event triggers: `checkout_session.payment.paid` and `payment.paid`).
To prevent race conditions:
1. **In-Memory Lock**: Maintain an in-memory lock map keyed by `sessionId`:
   ```typescript
   const executionLocks = new Map<string, Promise<FulfillmentResult>>();
   ```
2. If an active fulfillment is currently executing for the session, subsequent requests await the ongoing Promise rather than re-executing database mutations.

### 5.2 Database Idempotency Check
Inside the fulfillment transaction:
1. Lookup `PaymentTransaction` by `paymongoSessionId` or `referenceNumber`.
2. If `transaction.status === PaymentStatus.PAID`:
   - Return `{ success: true, alreadyFulfilled: true, subscriptionId: transaction.subscriptionId }` immediately without modifying records.

### 5.3 Subscription Period Stacking Architecture
A critical requirement from user design clarification is avoiding penalty when an active monthly subscriber upgrades early to an Annual Unlimited Pass.
- **Algorithm**:
  ```typescript
  const now = new Date();
  const durationDays = plan === "ANNUAL" ? 365 : 30;

  let baseDate = now;
  if (existingSubscription && existingSubscription.status === "ACTIVE" && existingSubscription.expiresAt) {
    if (existingSubscription.expiresAt > now) {
      // Stack duration onto existing expiration date
      baseDate = existingSubscription.expiresAt;
    }
  }

  const newExpiresAt = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  ```
- **Example**:
  - Student has 18 days remaining on a Monthly Pass (`expiresAt = May 18`).
  - Student purchases Annual Unlimited Pass on April 30.
  - New expiration date = `May 18 + 365 days` = May 18 of the following year.
  - Remaining 18 days are completely preserved.

### 5.4 Atomic Prisma Transaction
The fulfillment transaction executes atomically:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Update PaymentTransaction
  const updatedTx = await tx.paymentTransaction.update({
    where: { id: transaction.id },
    data: {
      status: PaymentStatus.PAID,
      paymongoPaymentId: paymentId,
      paymentMethod,
      paidAt: now,
      rawWebhookPayload: payload,
    },
  });

  // 2. Upsert/Update Subscription
  const updatedSub = await tx.subscription.upsert({
    where: { id: transaction.subscriptionId || "new-sub" },
    create: {
      userId: transaction.userId,
      plan: transaction.plan,
      status: SubStatus.ACTIVE,
      amountPhp: Math.round(transaction.amountCentavos / 100),
      startedAt: now,
      expiresAt: newExpiresAt,
    },
    update: {
      plan: transaction.plan,
      status: SubStatus.ACTIVE,
      amountPhp: Math.round(transaction.amountCentavos / 100),
      expiresAt: newExpiresAt,
    },
  });

  // 3. Link Subscription to PaymentTransaction if not previously linked
  if (!updatedTx.subscriptionId) {
    await tx.paymentTransaction.update({
      where: { id: updatedTx.id },
      data: { subscriptionId: updatedSub.id },
    });
  }
});
```

---

## 6. Post-Checkout Client Experience & Status Reconciliation

### 6.1 Return URL Handling
When a user completes payment at PayMongo, PayMongo redirects them to:
```
/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}
```
If the user clicks cancel or back:
```
/dashboard?payment=cancelled
```

### 6.2 Status Reconciliation Flow
Because webhooks are asynchronous and can arrive a few hundred milliseconds after the user browser redirects:
1. `StudentDashboardView` detects `?payment=success&session_id=...`.
2. It displays a loading modal/toast: *"Verifying your payment with PayMongo..."*.
3. It queries `GET /api/v1/billing/checkout/verify-session?sessionId=...` with polling (every 1.5 seconds, up to 3 attempts).
4. Once verified (or webhook arrives):
   - TanStack Query invalidates `["currentUser"]` cache.
   - A celebratory modal launches: *"Welcome to HighSchool Tutor Premium! Your pass is active."*
   - URL query parameters are cleanly stripped via `window.history.replaceState` to prevent re-triggering upon refresh.

---

## 7. Admin Settings Transformation

### 7.1 Deprecation of Manual GCash/Maya Setup
- Legacy manual screenshot uploads and manual admin approval in `/admin/settings` are removed.
- In `AdminSettingsPage.tsx`:
  - Replace GCash/Maya receiver phone number fields with a **PayMongo Integration Status Card**:
    - **Gateway Status**: `ACTIVE` (with Live or Test Mode badge).
    - **Webhook Endpoint**: `https://<domain>/api/v1/webhooks/paymongo` with a one-click copy button.
    - **SGWS Product Slug**: `highschool-tutor`.
    - **Supported Rails**: QR Ph, GCash, Maya, Cards, GrabPay, Online Banking.
  - Retain price configuration (`monthlyPricePhp: 299`, `annualPricePhp: 2499`).

---

## 8. Technology & Standards Matrix

| Capability | Approved Solution | Rejected Alternatives & Rationale |
|:---|:---|:---|
| **Payment Gateway** | PayMongo Hosted Checkout Sessions v2 | Xendit / Manual GCash / Dragonpay. PayMongo has native Philippine QR Ph support, zero server PCI compliance burden, and unified e-wallets. |
| **Referral Validation** | SGWS Affiliates Portal REST API via Server Route | Direct client-side calls to SGWS API. Rejected due to CORS issues, lack of server-side secret protection, and poor error handling. |
| **Referral Timeout** | `AbortController` (2.5s timeout) | Indefinite waiting. Rejected because affiliate latency would block students from subscribing. |
| **Signature Check** | `crypto.timingSafeEqual` + HMAC-SHA256 | Regular string equality (`===`). Rejected because string comparison is vulnerable to timing attacks. |
| **Concurrency Guard** | In-memory lock + DB transaction status check | Redis distributed locks. Overkill for single-server/small cluster scale; in-memory + DB row lock provides bulletproof idempotency. |
| **Currency Handling** | Server-calculated integer centavos | Client-submitted amounts or floating-point PHP. Floating point incurs IEEE 754 rounding errors; client pricing is vulnerable to tampering. |
