# Xendit Payment Gateway — Go-Live & Compliance Approval Checklist

> **Target Platform**: Highschool Tutor / LearnScope SaaS  
> **Jurisdiction**: Republic of the Philippines (BSP & DTI/SEC Regulated)  
> **Currency**: Philippine Peso (PHP / ₱)  
> **Document Purpose**: Comprehensive step-by-step checklist to satisfy Xendit Philippines compliance requirements, complete business verification (KYB), verify technical webhook integrity, and achieve live payment processing approval.

---

## 📋 Executive Summary

To activate live payment collection (GCash, Maya, Credit/Debit Cards, QR Ph, GrabPay, and Over-the-Counter) via Xendit in the Philippines, merchants must pass both **Business & Legal Verification (KYB)** and **Website & Technical Audit**.

---

## 🏛️ Phase 1: Business & Entity Verification (KYB / KYC)

Xendit Philippines operates under Bangko Sentral ng Pilipinas (BSP) regulations as an Operator of Payment Systems (OPS). The following documentation must be prepared and uploaded to the Xendit Business Settings portal:

### 1.1 Registered Entity Documents

- [ ] **SEC / DTI Registration**:
  - *Corporation / Partnership*: SEC Certificate of Incorporation, Articles of Incorporation, and By-Laws.
  - *Sole Proprietorship*: DTI Certificate of Business Name Registration (Must be active and unexpired).
  - *Cooperative*: CDA Registration Certificate.
- [ ] **BIR Form 2303 (Certificate of Registration)**:
  - Official Tax Identification Number (TIN) registered under the business entity name.
  - Verified business line / tax type corresponding to educational or software services.
- [ ] **Valid Mayor's Permit / Business Permit**:
  - Current calendar year business permit issued by the Local Government Unit (LGU) having jurisdiction over the office address.
- [ ] **General Information Sheet (GIS)** *(for SEC-registered Corporations)*:
  - Latest stamped GIS submitted to the SEC within the past 12 months.

### 1.2 Signatory & Beneficiary Identification

- [ ] **Authorized Signatory Identification**:
  - Clear color scan of at least two (2) valid Philippine government-issued photo IDs (Passport, Driver's License, UMID, PRC ID, or PhilID).
- [ ] **Proof of Authority**:
  - *Corporation*: Secretary's Certificate or Board Resolution authorizing the signatory to enter into agreements with Xendit Philippines and open payment accounts.
  - *Sole Proprietorship*: Government ID of the proprietor.
- [ ] **Ultimate Beneficial Owner (UBO) Declaration**:
  - Identification of all individuals owning or controlling 25% or more of the company.

### 1.3 Bank Account Verification (For Disbursements)

- [ ] **Corporate / Registered Business Bank Account**:
  - Bank account name **must exactly match** the SEC/DTI registered entity name (no third-party personal accounts allowed for corporate accounts).
- [ ] **Proof of Bank Account**:
  - Bank statement header, passbook copy, or online banking screenshot showing Account Name, Account Number, and Bank Branch issued within the last 3 months.

---

## 🌐 Phase 2: Website & SaaS Compliance Audit

Xendit's compliance team conducts a manual review of the merchant website prior to flipping live mode. The site must be live and accessible.

### 2.1 Domain & Security

- [ ] **SSL/TLS Encryption**: Valid HTTPS certificate active across all subdomains and checkout flows (`https://highschooltutor.ph`).
- [ ] **Clean Domain Reputation**: Domain not flagged for malware, phishing, or adult content.
- [ ] **Functional Web Experience**: No broken placeholder pages, broken images, or "Lorem Ipsum" demo text across the public landing and onboarding flow.

### 2.2 Clear Pricing & Product Description

- [ ] **Service Description**:
  - Clear disclosure that Highschool Tutor is a digital educational classroom management SaaS for DepEd MATATAG Junior and Senior High School students and educators.
- [ ] **Exact Pricing in Philippine Pesos (PHP)**:
  - Monthly Plan: **₱300.00 / month**
  - Annual Upgrade: **₱2,600.00 / year** (Save ₱1,000 compared to monthly)
  - Clear billing frequency (monthly recurring or annual one-time pass) displayed on the landing page and `UpgradeModal`.
- [ ] **Immediate Digital Fulfillment**:
  - Explicit statement that upon successful payment confirmation, premium access to all 130+ DepEd subjects, lesson materials, and practice drills is granted instantaneously without physical shipping.

### 2.3 Required Legal Policy Pages (Must be Linked in Footer)

- [ ] **Terms & Conditions (`/terms`)**:
  - Merchant legal name and business address.
  - User eligibility (high school students, guardians, educators).
  - Scope of digital services and intellectual property notices.
  - Governing law: Laws of the Republic of the Philippines.
- [ ] **Privacy Policy (`/privacy`)**:
  - Full compliance with the **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)**.
  - Clear declaration of data collected (name, email, school, grade level, quiz scores).
  - Explicit statement that payment credentials (credit card numbers, GCash MPINs) are tokenized and processed exclusively by Xendit and never stored on Highschool Tutor servers.
  - Contact information of the Data Protection Officer (DPO).
- [ ] **Refund & Cancellation Policy (`/refund-policy`)**:
  - Clear cancellation instructions for recurring subscriptions (students may cancel anytime before the next billing cycle).
  - Conditions for partial or full refunds (e.g., duplicate charges or billing errors submitted within 7 days of occurrence).
  - Policy for digital goods: access remains active until the end of the paid term.
- [ ] **Customer Support Contact Details (`/contact` or Footer)**:
  - Official support email (e.g., `support@highschooltutor.ph`).
  - Response time commitment (e.g., "Within 24 to 48 business hours").
  - Physical or registered office address in the Philippines.

---

## 💻 Phase 3: Technical Implementation & Webhook Hardening

### 3.1 Environment Secrets Protection

- [ ] **Production Keys Isolation**:
  - `XENDIT_SECRET_KEY`: Set with live secret starting with `xnd_production_...` in production environment settings.
  - `XENDIT_PUBLIC_KEY`: Used strictly for client-side card tokenization if applicable.
  - `XENDIT_WEBHOOK_VERIFICATION_TOKEN`: Secret token configured in Xendit Dashboard to sign outbound webhook events.
- [ ] **Environment Rule Compliance**:
  - Never commit `.env` or production credentials to Git repositories.

### 3.2 Webhook Signature & Idempotency

- [ ] **Signature Verification**:
  - The webhook handler (`/api/v1/webhooks/xendit`) must validate the `x-callback-token` header against `process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN`.
  - Reject unsigned or invalid callbacks with HTTP `403 Forbidden`.
- [ ] **Idempotent Database Writes**:
  - When handling `INVOICE.PAID` or `PAYMENT.SUCCESS`, verify if the `Payment` or `Subscription` record has already been marked as `ACTIVE` to prevent duplicate transaction entries.
  - Wrap multi-table updates (e.g., `Payment` log + `Subscription` activation + `User` role update) inside a `prisma.$transaction(...)`.
- [ ] **Immediate 200 OK Acknowledgement**:
  - Respond to Xendit webhook requests with HTTP `200 OK` within 5 seconds to prevent retries and automatic endpoint disabling.

### 3.3 Payment Channels Activated in Xendit Dashboard

- [ ] **E-Wallets**:
  - GCash (Direct & QR Ph)
  - Maya (PayMaya QR & Direct)
  - GrabPay
- [ ] **Credit / Debit Cards**:
  - Visa / Mastercard (with 3D Secure / OTP enabled)
- [ ] **QR Ph**:
  - National QR standard interoperable across BDO, BPI, UnionBank, GCash, and Maya.
- [ ] **Over-the-Counter / Retail Outlets** *(Optional)*:
  - 7-Eleven (Cliqq), Cebuana Lhuillier.

---

## 🧪 Phase 4: Verification & Test Transactions

### 4.1 Sandbox Simulation Checklist

- [ ] **Invoice Creation**: Successfully dispatch API request to create a ₱300 test invoice with customer email and external ID.
- [ ] **Success Simulation**: Trigger simulated GCash payment in Xendit Sandbox; verify webhook receives `PAID` payload.
- [ ] **Database State**: Verify `Subscription` status becomes `ACTIVE` and user session reflects premium status.
- [ ] **Expiry Handling**: Verify expired invoices mark pending records as `EXPIRED` without granting access.

### 4.2 Live Pilot Transaction Checklist (Post-Approval)

- [ ] **Live Switch**: Switch API credentials from `development` to `production` in staging/production environment.
- [ ] **Real ₱300 Transaction**: Run a real test transaction using a personal GCash or debit card for ₱300.
- [ ] **Access Unlock**: Verify that the account immediately gets premium badge and unlocks all 130+ subjects and quizzes.
- [ ] **Webhook Receipt**: Verify server logs show HTTP 200 response to Xendit's live webhook.
- [ ] **Refund Test**: Initiate a test refund via Xendit Dashboard to confirm the refund mechanism operates smoothly.

---

## 🚀 Phase 5: Go-Live Sign-Off Matrix

| Item | Responsible Role | Required Status | Completed Date |
| :--- | :--- | :--- | :--- |
| **SEC / DTI & BIR 2303 Uploaded** | Operations / Legal | Done | ________ |
| **Corporate Bank Account Verified** | Finance | Done | ________ |
| **Pricing Disclosed (₱300/mo & ₱2600/yr)** | Product / Tech | Done | 2026-09-17 |
| **Terms, Privacy & Refund Pages Live** | Compliance / Tech | Done | ________ |
| **Webhook Endpoint Hardened & Idempotent** | Tech Team | Done | ________ |
| **Xendit Live Mode Approval Received** | Xendit Account Mgr | Pending Review | ________ |
| **Live Pilot GCash Transaction Verified** | QA / Tech Lead | Pending Live Approval | ________ |

---

*This document serves as the official compliance roadmap for Xendit Philippines live integration.*
