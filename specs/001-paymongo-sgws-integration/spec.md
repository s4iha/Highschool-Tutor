# Feature Specification: PayMongo Payment Gateway & SGWS Affiliate Integration

**Feature Branch**: `001-paymongo-sgws-integration`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "Integrate the PayMongo payment gateway along with the integration in the SGWS affiliate app for HighSchool Tutor."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Direct Student Subscription Checkout via Hosted Payment Gateway (Priority: P1)

An authenticated student or parent selecting a subscription plan (Monthly Access Pass or Annual Unlimited Pass) can proceed to a secure hosted checkout supporting Philippine payment methods (QR Ph, GCash, Maya, Credit/Debit cards, GrabPay, and Direct Online Banking). Upon completing payment, their subscription is instantly activated and they are redirected back to their student dashboard with full access to curriculum lessons and Socratic tutoring, completely eliminating the legacy manual 24-hour verification wait.

**Why this priority**: Instant automated checkout is the foundational revenue and onboarding pipeline for the platform. Without automated payment processing, students face multi-hour manual verification delays before they can access DepEd MATATAG study materials.

**Independent Test**: Can be fully tested by selecting the Monthly Pass, generating a hosted checkout session, submitting a successful test payment through any supported rail, and verifying that the student's account immediately gains active access with no manual intervention.

**Acceptance Scenarios**:

1. **Given** an authenticated student on the pricing or upgrade modal selecting the Monthly Pass (₱299), **When** they click "Proceed to Payment", **Then** the system initiates a hosted checkout session displaying ₱299.00 with all supported Philippine payment rails and redirects the user to the gateway checkout page.
2. **Given** a student completing a payment on the hosted checkout, **When** payment authorization succeeds, **Then** the gateway redirects the student back to their student dashboard with a success notification, and their subscription is marked active immediately.
3. **Given** a student on the hosted checkout page, **When** they choose to cancel or navigate back, **Then** they are returned to the subscription selection view with no charge incurred and clear guidance on how to retry.
4. **Given** an authenticated student selecting the Annual Unlimited Pass (₱2,499), **When** they proceed to checkout, **Then** the hosted session displays the annual pass price (₱2,499.00) reflecting a ₱1,089 annual savings (over 30% discount compared to 12 monthly payments of ₱299) and line item description accurately in Philippine Pesos.

---

### User Story 2 - Affiliate Referral Tracking and Real-Time Partner Validation (Priority: P2)

A prospective student visits HighSchool Tutor through a partner educator or affiliate referral link (`?ref=CODE` or `?referral=CODE`). The system captures and persists the referral code in a secure 30-day cookie. When the student initiates checkout, the code is pre-filled and validated in real time against the SGWS Affiliates Portal. The generated transaction reference encodes the affiliate attribution (`SGWS-highschool-tutor-{code}-{timestamp}`), ensuring the referring partner is credited while maintaining a resilient, unblocked checkout experience even if the affiliate service is slow or unavailable.

**Why this priority**: Partner affiliates, educator networks, and student ambassadors are the primary organic growth channel for HighSchool Tutor. Seamless referral tracking enables marketing partnerships while protecting transaction completion.

**Independent Test**: Can be fully tested by accessing the site with `?ref=SGWS-EDU01`, verifying that the code persists across navigation, confirming that the checkout displays the verified partner badge, and asserting that the generated transaction reference embeds the partner code.

**Acceptance Scenarios**:

1. **Given** a visitor arriving via an affiliate link with `?ref=PARTNER123`, **When** the page loads, **Then** the referral code is stored in a secure 30-day cookie without overwriting any pre-existing valid referral code with an empty value.
2. **Given** a student with a persisted referral cookie opening the checkout summary, **When** the modal renders, **Then** the referral code is pre-populated and validated against the affiliate service, displaying a "Verified Partner" badge with the affiliate's name upon validation.
3. **Given** a student manually entering an invalid or expired referral code, **When** the code is validated, **Then** the system presents a friendly validation message and allows the student to proceed with direct checkout without halting the transaction.
4. **Given** an external affiliate validation service outage or response latency exceeding 2.5 seconds, **When** validation is triggered, **Then** the system times out gracefully and allows the student to complete checkout without blocking or throwing an application error.
5. **Given** a student checking out without an affiliate code, **When** the payment session is created, **Then** the transaction reference number defaults to the direct format (`HST-DIRECT-{timestamp}`).

---

### User Story 3 - Automated Webhook Fulfillment and Idempotent Provisioning (Priority: P3)

When a student completes payment at the gateway, the gateway delivers an encrypted webhook notification to HighSchool Tutor. The system validates the cryptographic signature against replay attacks and tampering, verifies that the payment matches an expected pending transaction, and executes an atomic fulfillment transaction that updates the payment record to PAID, provisions the student's subscription to ACTIVE for the full plan term, and logs a secure audit event. If duplicate webhooks are delivered, the system processes them idempotently with zero double-billing or subscription extension bugs.

**Why this priority**: Secure, idempotent fulfillment is vital for financial compliance and data integrity. Webhooks can fail, retry, or arrive out of order; robust fulfillment guarantees that paid students receive access instantly without duplicate side effects.

**Independent Test**: Can be fully tested by sending a simulated cryptographically signed payment webhook to the endpoint, asserting that the student's subscription transitions from PENDING to ACTIVE with correct start and expiration dates, and verifying that sending the identical webhook a second time returns success with no redundant updates.

**Acceptance Scenarios**:

1. **Given** a pending subscription checkout, **When** a valid payment webhook with a matching session identifier and valid HMAC-SHA256 signature is received, **Then** the payment status updates to PAID, the subscription status updates to ACTIVE, and the expiration date is set to 30 days (for monthly) or 365 days (for annual) from the payment timestamp.
2. **Given** an already-fulfilled payment transaction, **When** a duplicate or retried webhook notification arrives from the gateway, **Then** the system detects the fulfilled status and returns an immediate acknowledgment without duplicating subscription duration or transactions.
3. **Given** an incoming webhook payload with an invalid signature, an expired timestamp outside the 300-second replay window, or a corrupted body, **When** received, **Then** the endpoint immediately rejects the request with an unauthorized status code and makes no database modifications.

---

### User Story 4 - In-App Subscription Management & Dashboard Upgrade Flows (Priority: P4)

An enrolled student or parent can view their current subscription status, active plan type, renewal date, and remaining trial or access days from their dashboard or settings. Active monthly subscribers can seamlessly upgrade to an Annual Unlimited Pass to save on fees, while students with expired subscriptions are prompted with clear, one-click renewal actions that launch the automated checkout workflow.

**Why this priority**: Streamlined in-app subscription visibility and upgrade pathways maximize customer lifetime value, reduce churn, and prevent student disruption during active academic terms.

**Independent Test**: Can be fully tested by logging in as a monthly subscriber, viewing the dashboard membership card, clicking "Upgrade to Annual", and verifying that the checkout modal opens with the annual pass pre-selected and ready for one-click payment.

**Acceptance Scenarios**:

1. **Given** a student on a trial or expired plan viewing their dashboard, **When** they navigate to restricted curriculum lessons, **Then** they see an upgrade prompt detailing plan benefits and a button to launch the checkout modal.
2. **Given** an active monthly subscriber opening the upgrade dialog, **When** they view plan options, **Then** the dialog prominently highlights the Annual Unlimited Pass at ₱2,499 with a clear badge displaying savings of ₱1,089 per year (over 30% savings compared to paying ₱299 monthly) and allows initiating an upgrade payment session immediately.
3. **Given** a student who has successfully completed payment, **When** they return to their dashboard, **Then** the trial countdown widget is replaced by an active membership badge showing their valid subscription period.

---

### Edge Cases

- **Gateway Abandonment**: What happens when a student closes their browser tab or device on the PayMongo hosted checkout page? The pending transaction remains in PENDING status until expired by the gateway, allowing the student to restart checkout anytime without orphan lockups.
- **Webhook Delivery Failure or Network Partition**: How does the system handle temporary webhook delivery failures from the gateway? PayMongo automatically retries webhooks with exponential backoff; furthermore, when the student returns to the success redirect URL, the client queries session status to verify fulfillment.
- **Affiliate Service Latency**: How does the system behave if the external SGWS validation service experiences severe network latency or complete outage? The system enforces an `AbortController` timeout of 2,500ms; upon timeout, the UI gracefully informs the user and allows direct checkout without blocking.
- **Amount & Currency Tampering**: How does the system protect against client-side tampering with payment amounts or currency? All line item prices and amounts are retrieved authoritatively from server-side plan definitions and converted to integer centavos on the server; client-submitted price overrides are strictly ignored.
- **Concurrent Webhook Execution**: What happens when duplicate webhook retries are dispatched simultaneously within milliseconds? The system employs an in-memory execution lock keyed by session ID to serialize fulfillment and prevent race conditions.
- **Referral Cookie Preservation**: What happens when a user who arrived via an affiliate link clicks another internal link that lacks referral parameters? The referral cookie remains stored with a 30-day TTL and is never cleared or overwritten by empty query strings.
- **Mid-Lesson Subscription Expiration**: What happens if a student's subscription expires while they are actively taking a quiz or reading a lesson? The active session is allowed to complete gracefully without interruption; subsequent lesson access prompts the renewal modal.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create hosted checkout sessions via the payment gateway for authenticated students, supporting Philippine Pesos (PHP) and standard domestic payment rails: QR Ph, GCash, Maya, Credit/Debit cards, GrabPay, and Direct Online Banking.
- **FR-002**: System MUST calculate all payment amounts server-side from authoritative plan configurations and format them in integer centavos (e.g., ₱299.00 = 29900 centavos) to eliminate floating-point rounding errors.
- **FR-003**: System MUST support the core HighSchool Tutor subscription plans: Monthly Access Pass (₱299, 30 calendar days validity) and Annual Unlimited Pass (₱2,499, 365 calendar days validity), prominently highlighting an annual savings of ₱1,089 (over 30% discount compared to 12 monthly payments of ₱299).
- **FR-004**: System MUST capture inbound affiliate referral parameters (`?ref=CODE` or `?referral=CODE`) on public and authenticated routes and persist them in a secure, 30-day client cookie.
- **FR-005**: System MUST prevent empty or missing referral query parameters from overwriting an existing valid referral cookie.
- **FR-006**: System MUST generate standardized, collision-free transaction reference numbers:
  - For affiliate-referred checkouts: `SGWS-{productSlug}-{referralCode}-{timestamp}` (using product slug `highschool-tutor`).
  - For direct checkouts: `HST-DIRECT-{timestamp}`.
- **FR-007**: System MUST validate referral codes against the external affiliate service via a dedicated server endpoint with an `AbortController` timeout guardrail of 2,500ms.
- **FR-008**: System MUST fall back to a direct purchase without blocking the student if the affiliate validation service fails, times out, or returns an error.
- **FR-009**: System MUST display real-time affiliate partner verification status and partner name in the checkout modal when a valid referral code is present.
- **FR-010**: System MUST expose a public webhook receiver endpoint that validates cryptographic HMAC-SHA256 signatures against incoming gateway payloads using a 300-second replay tolerance window and timing-safe comparison.
- **FR-011**: System MUST process payment fulfillment atomically: updating the payment transaction to PAID, provisioning the student subscription to ACTIVE, setting accurate period start and end dates, and creating an audit record.
- **FR-012**: System MUST guarantee idempotent webhook execution, ensuring that duplicate webhook deliveries for the same payment session return success without creating duplicate records or extending subscription periods twice.
- **FR-013**: System MUST bind every payment transaction and checkout session to the authenticated student's unique account ID, preventing unauthenticated checkout initiation.
- **FR-014**: System MUST redirect students to designated application URLs upon payment completion (`/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`) or payment cancellation (`/dashboard?payment=cancelled`).
- **FR-015**: System MUST fully replace and deprecate legacy manual payment workflows (manual GCash screenshot uploads and manual admin approval); all subscription purchases MUST be processed exclusively and automatically through PayMongo hosted checkout sessions.
- **FR-016**: System MUST use affiliate referral codes strictly for affiliate partner attribution and commission tracking at standard pricing (₱299/mo or ₱2,499/yr), without applying automatic student checkout discounts unless explicitly configured in future promotional campaigns.

---

### Key Entities

- **User**: The authenticated learner or parent entity in HighSchool Tutor with profile data, educational grade level, and security credentials.
- **Subscription**: The access entitlement record tracking the student's active plan (`MONTHLY`, `ANNUAL`, `GRADE_LEVEL`, `ALL_LEVELS`), current status (`TRIAL`, `PENDING`, `ACTIVE`, `EXPIRED`), start date, and expiration date.
- **Payment Transaction**: The financial record capturing the payment gateway session ID, gateway payment ID, standardized reference number, referral code, product slug (`highschool-tutor`), amount in centavos, currency (`PHP`), payment method rail, transaction status (`PENDING`, `PAID`, `FAILED`, `EXPIRED`, `REFUNDED`), and raw webhook payload.
- **Referral Context**: The marketing attribution entity storing the active affiliate code, referring partner name, attribution timestamp, and cookie persistence metadata.
- **Plan Catalog**: Authoritative subscription tier definitions including display title, billing duration, standard pricing in Philippine Pesos, and curriculum feature access permissions.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful payments automatically activate student subscriptions within 3 seconds of webhook receipt without manual administrative review.
- **SC-002**: Checkout session initiation and redirect URL generation complete in under 1,500 milliseconds under normal network conditions.
- **SC-003**: 0% duplicate subscription duration extensions or redundant transaction records during webhook retries or concurrent deliveries (100% idempotency).
- **SC-004**: 100% of affiliate-referred visits result in accurate partner attribution in transaction records and reference numbers when a valid referral code exists.
- **SC-005**: 0% checkout abandonment caused by affiliate service outages, with graceful fallback to direct checkout occurring within 2,500 milliseconds.
- **SC-006**: Student checkout completion rate improves by at least 35% compared to manual payment proof submission, reducing payment verification support inquiries by over 80%.

---

## Assumptions

- **Target Audience & Payment Rails**: Students and parents residing in the Philippines have access to standard Philippine digital payment methods (GCash, Maya, QR Ph-compliant banking apps, or debit/credit cards).
- **Gateway Provisioning**: PayMongo production/sandbox API credentials and webhook signing secrets are provisioned and accessible via secure environment variables.
- **Affiliate System Availability**: The SGWS Affiliates Portal provides a REST endpoint for referral code validation using the product slug `highschool-tutor`.
- **Fixed-Period Entitlement Model**: Subscriptions operate on a fixed-period access model (30 calendar days for monthly, 365 calendar days for annual) matching prevailing Philippine e-wallet payment norms, with in-app reminders for renewal before expiration.
- **Default Pricing**: Default standard retail pricing is ₱299.00 for the Monthly Access Pass and ₱2,499.00 for the Annual Unlimited Pass (delivering ₱1,089 in annual savings vs. monthly billing), unless dynamically overridden by admin settings.
- **Authentication Dependency**: Students must have an authenticated HighSchool Tutor account (via Better Auth) prior to initiating a checkout session, ensuring purchases are securely attributed to the correct user.
- **Confirmed Clarifications**:
  - Resolution for FR-015: Full replacement of manual transfer with automated PayMongo checkout. Legacy screenshot upload and manual admin verification are completely deprecated.
  - Resolution for FR-016: Attribution-only affiliate tracking. Referral codes attribute commission to the affiliate partner while charging standard pricing (₱299 / ₱2,499).
