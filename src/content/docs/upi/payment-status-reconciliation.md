---
title: Payment status and order reconciliation
description: UPI-005 — merchant/PA payment status, webhook authenticity, idempotency, and order-fulfilment reconciliation.
recordId: UPI-005
products:
  - upi
recordType: operational-failure
theme: reconciliation-disputes-protection
lifecycle:
  - processing
  - reconciliation
actors:
  - payment-aggregator
  - merchant
  - psp-bank
  - remitter-bank
  - beneficiary-bank
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
In online UPI merchant checkouts, the customer's browser screen, redirect `callback_url`, asynchronous Payment Aggregator (PA) webhook, and bank settlement file are four separate states. Order fulfillment breaks when merchants trust unverified browser redirects, process retried webhooks as second payments, leave orders permanently stuck in `PENDING`, or send duplicate refunds. *(For interbank settlement-file matching and `T+1`/`T+5` reversal SLAs, see [Settlement and reconciliation exceptions](/india-fintech-risk-atlas/upi/settlement-exceptions/).)*

## Impact
- **Customer:** Account gets debited while the order stays failed or cancelled, locking funds until `T+5` auto-reversal or manual refund.
- **Merchant:** Double shipment of goods or duplicate payouts when retried webhooks are not deduplicated.
- **PA & Acquirer:** Unmatched order vs escrow records violate PA payout transparency and refund rules.

## Common failure modes
- **Browser callback spoofing / drop-off:** Customer closes the browser before redirect returns, or an attacker spoofs query parameters on an unverified `callback_url`.
- **Duplicate / out-of-order webhooks:** At-least-once delivery or `order.paid` arriving before `payment.captured` triggers double fulfillment or false state regressions.
- **Stuck `PENDING` auto-cancellation:** Premature cron job cancels a paid order whose webhook arrived slow, causing support complaints.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Payment Aggregators, Merchants, Acquirers | Define clear failed-transaction and refund terms in PA/merchant/acquirer agreements; settle merchant balances transparently with day-end escrow adequacy, and route refunds/reversals through escrow unless merchant-managed with payer clarity. |
| Regulatory | Banks, Non-bank PSOs | Auto-reverse debited-but-unconfirmed merchant UPI transactions within `T+5` calendar days (`₹100/day` customer compensation beyond `T+5`). |
| Industry practice | Merchants, PAs | Verify HMAC-SHA256 webhook signatures on raw bytes (`X-Razorpay-Signature`, or Cashfree `x-webhook-signature` + `x-webhook-timestamp`) before parsing JSON; acknowledge within 5 seconds, deduplicate on unique event IDs (`x-razorpay-event-id` / `x-idempotency-header`), and use dedicated idempotency headers on refund/payout retries *(Razorpay & Cashfree documented patterns)*. |
| Atlas guidance | Merchants, Checkout teams | Store verified webhook events atomically before returning `2xx`, drive fulfillment through a strict order state machine (`created -> authorized/paid -> settled` or `failed`) keyed to `order_id` + `payment_id`/UTR, and poll server-side status + daily settlement reports before cancelling `PENDING` orders. |

## Watch-outs and validation
- **Legitimate lookalikes:** Duplicate webhook retries after a slow `2xx` response, transient mobile network timeouts, and out-of-order capture/settlement webhooks are normal delivery behavior—never flag them as fraud or double debits.
- **Signals needed:** Raw HTTP request body, signature and timestamp headers, provider event ID, merchant `order_id`, gateway `payment_id`, RRN/UTR, and daily settlement report rows.
- **How to validate:** Replay duplicate and out-of-order webhook fixtures in staging, confirm 1-byte body tamper returns HTTP `400`, and test reconciliation jobs against unmatched `PENDING` orders and settlement files.

## References and review history
1. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141` (updated Nov 11, 2026) — failed-transaction & refund contracts (`§8(b)`), escrow adequacy (`§16`), and escrow refund routing (`§18(h)`), accessed Nov 23, 2026.
2. RBI, [Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0), `RBI/2019-20/67` (Sep 20, 2019; `Sl. no. 4(b)`) — `T+5` auto-reversal and `₹100/day` compensation, accessed Nov 23, 2026.
3. Razorpay, [Payment Gateway Webhooks: Signatures, Retries & Logs](https://razorpay.com/blog/payment-gateway-webhooks-india/) (Oct 27, 2026) — company-reported 5s timeout, 24h backoff, raw-body HMAC, event deduplication, 7-day replay, and `X-Refund-Idempotency` / `X-Payout-Idempotency` headers, accessed Nov 23, 2026.
4. Cashfree Docs, [Webhooks Overview](https://www.cashfree.com/docs/payments/online/webhooks/overview) & [Webhook Verification](https://www.cashfree.com/devstudio/preview/pg/tools/webhookVerification) — company-reported `x-webhook-signature`, `x-idempotency-header` (`2025-01-01`), and default 2/10/30 min retries, accessed Nov 23, 2026.

**Review status:** RBI, Razorpay, and Cashfree sources checked 2026-11-23; independent reviewer: `PENDING`.
