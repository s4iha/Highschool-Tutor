# API Contract: Trial Expiration Reminders Cron

**Endpoint**: `GET /api/cron/trial-reminders` (also supports `POST /api/cron/trial-reminders`)  
**Feature**: `002-ui-and-learning-enhancements`  
**Purpose**: Scans for user accounts with exactly 7 days remaining in their 30-day free trial, dispatches reminder emails via a modular adapter, and records sent notices in PostgreSQL for idempotent execution.  

---

## 1. Security & Authentication

- **Scheme**: Bearer Token
- **Header**: `Authorization: Bearer <CRON_SECRET>`
- **Secret Validation**: Token must strictly match `process.env.CRON_SECRET`.
- **Unauthorized Behavior**: Returns HTTP `401 Unauthorized` with JSON error payload if header is missing, malformed, or invalid.

---

## 2. Request Specification

### HTTP Headers
| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | `string` | Yes | Format: `Bearer <CRON_SECRET>` |
| `Content-Type` | `string` | No | `application/json` (if POST) |

### Query Parameters
None.

---

## 3. Response Specification

### Success Response (`200 OK`)
Returned when the cron execution completes successfully, whether eligible users were found or not.

```json
{
  "success": true,
  "timestamp": "2026-10-26T08:00:00.000Z",
  "summary": {
    "totalScanned": 150,
    "eligibleForReminder": 2,
    "alreadyNotified": 1,
    "dispatched": 1,
    "failed": 0
  },
  "notices": [
    {
      "userId": "cuid_user_123",
      "email": "student@example.ph",
      "daysRemaining": 7,
      "status": "SENT"
    }
  ]
}
```

### Unauthorized Response (`401 Unauthorized`)
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or missing cron authorization token."
}
```

### Internal Error Response (`500 Internal Server Error`)
```json
{
  "success": false,
  "error": "INTERNAL_CRON_ERROR",
  "message": "Database query or email transport failure occurred during cron execution."
}
```

---

## 4. Business Logic & Invariants

1. **Eligibility Criteria**:
   - `User.createdAt` is between 23.0 and 24.0 days old (`now - createdAt >= 23 days` and `now - createdAt < 24 days`).
   - User does **not** have an active subscription:
     ```prisma
     Subscription.findFirst({
       where: {
         userId: user.id,
         status: "ACTIVE",
         expiresAt: { gte: now }
       }
     }) === null
     ```
   - User does **not** have an existing `ReminderNotice` with:
     - `userId === user.id`
     - `kind === "trial_expiring_7d"`
     - `periodKey === "day_7"`
     - `channel === "email"`

2. **Email Content Requirements**:
   - Recipient: `user.email`
   - Subject: `"Your HighSchool Tutor Free Trial Expires in 7 Days"`
   - Body Content:
     - Student greeting (`user.name` or `"Student"`)
     - Clear expiration date countdown (7 days remaining)
     - Key benefits of upgrading to an Annual Unlimited or Monthly Pass (unlimited access to 130+ DepEd subjects, full lesson guides, unlimited Gemini AI Socratic tutoring)
     - Direct CTA Link: `${BASE_URL}/pricing?ref=trial_7d_notice`

3. **Modular Transport Selection**:
   - If `process.env.RESEND_API_KEY` is present and non-empty: Call Resend API (`POST https://api.resend.com/emails`).
   - If `process.env.RESEND_API_KEY` is missing (e.g., local development): Dispatch to standard console logger outputting the email payload and recipient without throwing errors.

4. **Idempotency Guarantee**:
   - Upon successful email delivery (or local mock log), a `ReminderNotice` record is created:
     ```typescript
     await prisma.reminderNotice.create({
       data: {
         userId: user.id,
         kind: "trial_expiring_7d",
         periodKey: "day_7",
         channel: "email",
         destination: user.email,
         result: "sent",
         detail: JSON.stringify({
           daysRemaining: 7,
           sentAt: new Date().toISOString(),
         }),
       },
     });
     ```
   - Database unique constraint prevents duplicate notice inserts.
