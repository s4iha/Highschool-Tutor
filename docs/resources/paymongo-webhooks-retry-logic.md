# PayMongo Webhooks: Retry Logic & Idempotency Reference

Source reference from PayMongo documentation and SGWS Affiliates architecture.

## Overview

PayMongo automatically retries webhook deliveries that fail to protect merchants against temporary network blips or server restarts. Understanding PayMongo's delivery failure conditions and backoff logic prevents webhook handlers from triggering retry storms and subsequent automatic endpoint deactivation.

## What Counts as a Failed Delivery

PayMongo marks a webhook delivery attempt as failed if:
- The endpoint returns any non-2xx HTTP status code (`400`, `401`, `404`, `500`, `502`, `504`).
- The endpoint does not respond within **30 seconds**.
- The connection is refused or cannot be established.

Any HTTP status code between **200 and 209** tells PayMongo that the event was received and acknowledged successfully, and no further retries will be scheduled.

## PayMongo Retry Schedule

When delivery fails, PayMongo retries delivery with exponential backoff:
- Attempt 1: Immediate delivery
- Subsequent retries: Exponential backoff intervals
- **Max Retries**: After 12 failed attempts, PayMongo marks the event as permanently failed.
- **Automatic Endpoint Disablement**: If an endpoint continuously fails deliveries across events (e.g. 5 consecutive failed events), PayMongo's monitoring engine automatically **DISABLES** the webhook endpoint in the merchant dashboard!

## Core Best Practices to Prevent Max Retries

1. **Acknowledge Fast (<500ms), Process Responsively**:
   - PayMongo's connection timeout is 30 seconds, but production latency must be kept well under 1.5 seconds.
   - Return HTTP 200 as soon as the payload and signature are verified.
2. **Safely Ignore Unhandled Events with HTTP 200**:
   - PayMongo sends diverse event types (`payment.failed`, `refund.created`, `source.chargeable`).
   - If an event is not handled, return HTTP 200 `{ received: true, skipped: true, eventType }`. **Never** return 400 or 500 for an unrecognized event.
3. **Guard Against Missing Configuration**:
   - If `PAYMONGO_WEBHOOK_SECRET` is missing in the production environment, log an error internally and return HTTP 200 `{ received: true, error: "..." }` so PayMongo doesn't disable the webhook endpoint before the admin configures the secret.
4. **Isolate Parsing Failures**:
   - Malformed JSON payloads or schema discrepancies must be caught and acknowledged with HTTP 200 `{ received: true, skipped: true, error: "Malformed JSON payload" }`.
5. **Top-Level Catch Block**:
   - Unexpected runtime exceptions during database transactions or fulfillment must be logged internally and return HTTP 200 `{ received: true, error: "..." }`, never HTTP 500.
6. **Idempotent Handling**:
   - Redelivered events (due to network retransmissions) must be checked against the database. If the payment or session is already fulfilled (`status === "PAID"`), immediately return HTTP 200 `{ received: true, alreadyFulfilled: true }` without throwing duplicate key errors.
