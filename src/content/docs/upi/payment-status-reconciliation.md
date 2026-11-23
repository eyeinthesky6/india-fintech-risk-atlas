---
title: Payment status and order reconciliation
description: UPI-005 — merchant/PA payment status, webhook authenticity, idempotency, and order-fulfilment reconciliation.
recordId: UPI-005
products:
  - UPI
recordType: operational-failure
recordTypeLabel: Operational failure & control
theme: reconciliation-disputes-protection
themeLabel: Reconciliation, disputes & protection
lifecycle:
  - processing
  - reconciliation
actors:
  - Payment aggregator
  - Merchant
  - PSP bank
  - Remitter bank
  - Beneficiary bank
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
In merchant UPI integrations, customer UI status, browser redirect callbacks (`callback_url`), asynchronous Payment Aggregator (PA) webhooks, and bank settlement files represent distinct states. Operational failures occur when a merchant triggers order fulfilment on an unverified browser redirect, treats repeated webhook deliveries as multiple payments, leaves orders stuck in `PENDING` after a lost callback, or issues duplicate refunds. *(For interbank settlement-file reconciliation and `T+1`/`T+5` scheme auto-reversal TATs, see [Settlement and reconciliation exceptions](/india-fintech-risk-atlas/upi/settlement-exceptions/).)*

## Layer 1 — Official regulatory context
- **PA failed-transaction & escrow rules (`RBI/DPSS/2025-26/141`):** Under the *Master Direction on Regulation of Payment Aggregator (PA)* (updated Nov 11, 2026), `§8(b)` requires agreements among PAs, merchants, and acquiring banks to clearly define the treatment of failed transactions and manner of refunds; `§16` (Table 1) mandates transparent merchant settlement timelines and day-end escrow balance adequacy; and `§18(h)` routes reversed/refunded credits back through escrow unless directly managed by the merchant with payer awareness. [1]
- **Merchant confirmation timeout TAT (`RBI/2019-20/67`):** Where a customer's account is debited via UPI for a merchant payment and transaction confirmation is not received at the merchant location, RBI's failed-transaction TAT framework mandates auto-reversal within **`T+5` calendar days** (`₹100/day` compensation beyond `T+5`). [2]

## Layer 2 — Company-reported industry practices
- **Razorpay webhooks & idempotency (`company-reported`):** Razorpay's October 27, 2026 engineering guide explains that webhooks use at-least-once delivery, can arrive out of order, enforce a 5-second acknowledgement window, and retry with exponential backoff over 24 hours before disablement. It documents separating `callback_url` browser redirects from server-to-server webhooks, validating `X-Razorpay-Signature` via HMAC-SHA256 over the raw request bytes before JSON parsing, deduplicating `x-razorpay-event-id`, using 7-day self-service replay, and passing dedicated idempotency headers (`X-Refund-Idempotency`, `X-Payout-Idempotency`) on outbound retries. [3]
- **Cashfree webhooks & idempotency (`company-reported`):** Cashfree documents verifying `x-webhook-signature` (Base64 HMAC-SHA256 over `x-webhook-timestamp` + raw payload) prior to downstream actions, validating `x-idempotency-header` (supported from webhook version `2025-01-01`), and handling default retries (3 attempts at 2, 10, and 30 minutes). [4]

## Layer 4 — Candidate controls and data prerequisites
- **Decouple intake deduplication from business state:** Persist verified raw webhook events atomically by provider event ID before returning `2xx`, then enforce a strict order state machine (`created → authorized/paid → settled` or `failed`) keyed to merchant `order_id` and gateway `payment_id` / UTR / RRN.
- **Reconcile stuck `PENDING` orders actively:** Run scheduled server-to-server status-check APIs and daily PA settlement-report matching before cancelling or auto-refunding orders.
- **Data prerequisites:** raw HTTP payload, signature/timestamp headers, unique provider event ID, merchant `order_id`, gateway `payment_id`, RRN/UTR, settlement report rows.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Duplicate webhook delivery after a slow `2xx` response, transient network timeouts, and out-of-order `payment.captured` vs. `order.paid` notifications do **not** indicate a second debit or fraud. Conversely, auto-cancelling paid orders traps customer funds until `T+5` auto-reversal or manual refund.
- **Validation:** Replay duplicate and out-of-order payloads in staging; verify 1-byte payload mutations return `400`; test reconciliation batch jobs against unmatched order and settlement fixtures.

## References and review history
1. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141`, updated Nov 11, 2026 (`§§8(b), 16, 18(h)`), accessed Nov 23, 2026.
2. RBI, [Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0), `RBI/2019-20/67`, Sep 20, 2019 (Sl. no. 4(b)), accessed Nov 23, 2026.
3. Razorpay, [Payment Gateway Webhooks: Signatures, Retries & Logs](https://razorpay.com/blog/payment-gateway-webhooks-india/), Oct 27, 2026, accessed Nov 23, 2026 (company-reported).
4. Cashfree Docs, [Webhooks Overview](https://www.cashfree.com/docs/payments/online/webhooks/overview) & [Webhook Verification](https://www.cashfree.com/devstudio/preview/pg/tools/webhookVerification), accessed Nov 23, 2026 (company-reported).

**Review status:** RBI, Razorpay, and Cashfree sources checked 2026-11-23; independent reviewer: `PENDING`.
