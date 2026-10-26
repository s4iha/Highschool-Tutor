# PayMongo Webhook Engineering Best Practices

Source reference from PayMongo documentation and SGWS Affiliates architecture.

## 1. Single Registration

Register the webhook endpoint once in the PayMongo dashboard or during initial infrastructure setup. Do not dynamically register webhooks inside application runtime logic.

## 2. Verify Every Request

Every request from PayMongo includes a `Paymongo-Signature` header in the format:
`t=<timestamp>,te=<test_signature_hex>,li=<live_signature_hex>`

- Use constant-time buffer comparison (`crypto.timingSafeEqual`) to prevent side-channel timing attacks.
- Enforce a 300-second replay window tolerance (`Math.abs(now - timestamp) <= 300`).

## 3. Respond Immediately (HTTP 200)

Never perform long synchronous operations inside the webhook handler that might exceed the 30-second window. The standard pattern is:
```typescript
// 1. Verify signature
// 2. Acknowledge with 200 OK
// 3. Process idempotent state changes
```

## 4. Handle Duplicate Deliveries (Idempotency)

Because of automatic retries and network packet redelivery, duplicate webhook deliveries are normal in distributed payment systems.
- Query transaction / checkout session before mutating.
- If already fulfilled (`status === "PAID"`), return HTTP 200 `{ received: true, alreadyFulfilled: true }`.

## 5. Use `livemode` to Separate Environments

Check the payload's `attributes.livemode` against `process.env.PAYMONGO_LIVEMODE` (or `NODE_ENV`). If test events hit production or live events hit testing, acknowledge with HTTP 200 `{ received: true, skipped: true, reason: "Livemode mismatch" }`.

## 6. Only Act on Expected Events

Subscribe only to the events needed (`checkout_session.payment.paid`, `payment.paid`). If an unknown event arrives (`payment.failed`, `refund.succeeded`), acknowledge with HTTP 200 `{ received: true, skipped: true }` and ignore.
