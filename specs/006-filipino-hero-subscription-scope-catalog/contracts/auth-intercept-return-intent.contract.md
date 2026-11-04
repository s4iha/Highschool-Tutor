# Contract: Auth Intercept & Return Intent Architecture

**Feature**: `006-filipino-hero-subscription-scope-catalog`  
**Contract ID**: `CTR-AUTH-INTERCEPT-001`  
**Status**: Approved  
**Consumers**: `CheckoutModal.tsx`, `useCheckoutReturnIntent.ts`, `AuthPage.tsx`, pricing CTAs

---

## 1. Interface & Storage Contract

### 1.1 Storage Key & Serialization
- **Key**: `hst_return_intent`
- **Location**: `window.sessionStorage`
- **Fallback**: URL Query Parameters when `sessionStorage` throws or is disabled:
  `?returnToCheckout=true&planId=ANNUAL&referralCode=SGWS-A001`

### 1.2 ReturnIntent Schema

```typescript
export interface ReturnIntent {
  /** The subscription plan selected: MONTHLY (₱299/mo) or ANNUAL (₱2,499/yr) */
  planId: "MONTHLY" | "ANNUAL";
  /** Optional referral code from affiliate cookie or direct input */
  referralCode?: string;
  /** Optional subject slug for context routing upon sign-in */
  targetSubjectSlug?: string;
  /** The originating URL to return to if needed */
  sourceUrl: string;
  /** Epoch millisecond timestamp when the intent was stored */
  timestamp: number;
}
```

---

## 2. Behavioral Specifications

### 2.1 Checkout Intercept Trigger (Pre-Flight)
- **Precondition**: User clicks "Proceed to Checkout", "Start Monthly Subscription", "Get Annual Unlimited Pass", or any checkout trigger.
- **Check**: Inspect `user` from `useUser()`.
- **Condition `user !== null` (Authenticated)**:
  - Proceed immediately to call `checkoutMutation.mutate({ planId, referralCode })`.
- **Condition `user === null` (Unauthenticated Guest)**:
  - **MUST NOT** invoke `checkoutMutation.mutate(...)`.
  - **MUST NOT** invoke `POST /api/v1/billing/checkout/create-session`.
  - **MUST NOT** display any error toast or 401 Unauthorized alert.
  - Set `sessionStorage.setItem("hst_return_intent", JSON.stringify(intent))`.
  - Transition UI to the **Auth Intercept State**:
    - Display header: *"Sign In or Create an Account to Complete Your Subscription"*.
    - Display plan badge: Selected plan title, price, and domestic rail icons.
    - Provide *"Continue with Google"* button invoking Better Auth social sign-in with `callbackURL`.
    - Provide *"Sign In with Email / Register"* button routing to `/login?callbackUrl=${encodeURIComponent(sourceUrl)}`.

### 2.2 Intent Resumption Protocol (Post-Authentication)
- **Trigger**: Mounted hook `useCheckoutReturnIntent()` detects user transition to authenticated state.
- **Protocol**:
  1. Read `hst_return_intent` from `sessionStorage` (or inspect `window.location.search` for query parameters).
  2. If missing, return early (no action).
  3. Validate expiration: `Date.now() - intent.timestamp < 1000 * 60 * 60 * 2` (2 hours).
     - If expired: remove item and exit.
  4. Immediately remove `hst_return_intent` from `sessionStorage` to prevent duplicate checkout sessions or loops.
  5. Display Sonner notification:
     - Title: *"Resuming your subscription checkout..."*
     - Description: *"Redirecting you to the PayMongo secure payment gateway."*
  6. Call `checkoutMutation.mutate({ planId: intent.planId, referralCode: intent.referralCode })`.
  7. On mutation success, redirect browser to PayMongo `data.checkoutUrl`.

---

## 3. Invariants & Error Guarantees

| Invariant | Guarantee |
| :--- | :--- |
| **No 401 Toasts** | Zero unauthenticated requests sent to `/api/v1/billing/checkout/create-session`. |
| **Idempotent Resumption** | Return intent is cleared from storage *before* mutation dispatch, ensuring exactly-once execution. |
| **Affiliate Attribution** | `referralCode` is preserved throughout the intercept and passed to the PayMongo session creation. |
| **Modal Dismissal Safety** | User can close or cancel the modal at any time; closing does NOT clear active session state or break page navigation. |
