---
title: Operator practices and evidence
description: Public company engineering documentation and open-access research on payment operations, fraud and AML controls.
---

This page separates **company-reported engineering practices** (Layer 2) and **open-access empirical research** (Layer 3) from **official regulatory requirements** (Layer 1) and **Atlas interpretation** (Layer 4). Company docs describe how a specific provider integrates or operates; they are neither universal bank practices nor RBI/NPCI mandates.

## 1. Payment event duplication, signatures, and ordering

**Industry — Razorpay technical documentation (`company-reported`).** Razorpay explains that webhooks follow at-least-once delivery, can arrive more than once or out of order, and use a 5-second acknowledgement timeout with 24-hour exponential-backoff retries before webhook disablement. It prescribes HMAC-SHA256 verification against raw request bytes via `X-Razorpay-Signature`, atomic deduplication on `x-razorpay-event-id`, separating browser `callback_url` redirects from server-to-server webhooks, and using idempotency headers on outbound refunds/payouts. [1]

**Industry — Cashfree technical documentation (`company-reported`).** Cashfree documents verifying `x-webhook-signature` (HMAC-SHA256 over `x-webhook-timestamp` plus raw payload) before executing downstream actions, checking `x-idempotency-header` (supported on webhook versions from `2025-01-01`), and handling default delivery retries (three attempts at 2, 10, and 30 minutes). [4]

**Atlas interpretation — operational gap.** If a merchant treats each webhook HTTP call as a fresh payment event, network timeouts or retries trigger duplicate fulfilment or premature refund reversals. Separate **event intake deduplication** (unique event ID / idempotency header after signature verification) from **business-state transitions** (allowing `created → authorized → captured/paid` once per order and reconciling with settlement/status APIs).

**Data needed:** raw payload bytes, signature and timestamp headers, provider event ID, merchant order ID, gateway payment/RRN/UTR reference, durable processing log.

**Validation:** replay duplicate and out-of-order payloads in staging; reject 1-byte tampered payloads; verify single fulfilment. **False positives:** redelivery after a slow `2xx` response does not imply a second customer debit or fraud.

## 2. Checkout initiation flows: UPI Intent vs. P2M Collect

**Industry — Razorpay payment flow engineering (`company-reported`).** Razorpay differentiates mobile app-to-app deep-linking (**UPI Intent**) from manual VPA entry (**UPI Collect**), reporting fewer VPA typos and notification timeouts on mobile Intent alongside **Signed Intent** payloads to prevent deep-link tampering of amount or payee details. Razorpay also notes February 2026 NPCI guidelines restricting manual VPA input fields on mobile-native flows while retaining Dynamic QR / Collect on desktop web. [2]

**Atlas interpretation — security & reliability gap.** Unverified deep links or manual VPA entry introduce two different risks: parameter tampering in mobile redirects (mitigated by Signed Intent / backend order matching) vs. notification spoofing and high abandonment in Collect flows. Reconcile exact paid amount and payee server-side against order state rather than trusting client redirect parameters.

## 3. Merchant dispute and chargeback workflows

**Industry — Razorpay disputes documentation (`company-reported`).** Razorpay structures merchant dispute operations across phases—*Fraud* (issuer risk alert), *Retrieval* (soft information request), *Chargeback* (formal claim), and *Pre-Arbitration / Arbitration* (card-network escalation)—tracking states (`Open`, `Under Review`, `Won`, `Lost`, `Closed`) via dashboard and webhooks, where merchants either accept/refund or contest with transaction/delivery evidence. [3]

**Atlas interpretation.** Payment aggregators surface structured merchant dispute workflows, while underlying UPI interbank settlement/dispute rules flow through NPCI back-office/UDIR and RBI's ODR/TAT rules (covered in [Dispute routing](/india-fintech-risk-atlas/upi/dispute-routing/) and [Settlement exceptions](/india-fintech-risk-atlas/upi/settlement-exceptions/)).

## 4. Rule backtesting, analyst queues, and ML trade-offs

**Industry — Stripe Radar (`company-reported`; non-India reference).** Stripe documents backtesting fraud rules against historical data (comparing fraud caught vs. legitimate sales blocked) and warns about label maturity lags (60–120 days for non-fraudulent baselines vs. recent fraud warnings). [5] *Do not transplant Stripe card rule syntax or thresholds to UPI.*

**Empirical research — RBIH NFPC Money-Mule Benchmark (India, 2026).** Using the RBIH NFPC dataset (~237.8M transactions across 96,091 Indian bank accounts, 2,683 labelled mules), Ahmad & Deodhar compare tabular gradient-boosted trees (`XGBoost`, `LightGBM`, `CatBoost`) against leakage-safe temporal heterogeneous GNNs (`HeteroGraphSAGE`, `RelGNN`). On a tight daily review budget (`k = 100` alerts), tuned GBDTs achieved 96–99% precision, matching or beating GNNs; at deeper queues (`k = 500`), graph models held ~0.676–0.680 precision while trees dropped to ~0.562–0.564. Crucially, the authors highlight **positive-unlabelled feedback bias**: uninvestigated mule rings are treated as negative labels. [6]

**Empirical research — Google Pay India UPI Scam Detection (2024).** Dahiphale et al. evaluate fine-tuned Gemini classifiers and an LLM reviewer-assistant on Indian UPI transactions, observing >88% recall alongside ~30% precision on evaluated segments, and mixed reviewer-reasoning accuracy (57% exact match with human reviewers, 32% novel valid reasons, 6% incorrect, <1% hallucinated). [7] *Operational lesson:* high-recall models with ~30% precision cannot auto-block accounts without severe false-positive customer harm; human-in-the-loop review and secondary risk tiers remain essential.

**Empirical research — Explainable Mule Triage (OCBC Singapore, 2026; non-India AML reference).** Zhang et al. describe pairing 280 customer features, calibrated LightGBM, TreeSHAP attributions, and constrained LLM narratives to lift live AML analyst yield from 61% (rules) to 89%—a workflow pattern illustrating how explainability supports investigator throughput, though dataset, CPC seizure labels, and geography differ from India UPI. [8]

## Practitioner observations

No named LinkedIn practitioner observation is promoted to a verified UPI finding in v1. Any future entry requires the author's name, stated public role, publication date, canonical URL, firsthand-vs-secondhand status, and independent verification.

## References

1. Razorpay, [Payment Gateway Webhooks in India: Signature Verification, Retries and Event Logs](https://razorpay.com/blog/payment-gateway-webhooks-india/), Oct 27, 2026 (accessed Nov 23, 2026).
2. Razorpay, [UPI Intent vs Collect: Which Flow Actually Works Better in 2026?](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/), Apr 9, 2026 (accessed Nov 23, 2026).
3. Razorpay Docs, [About Disputes](https://razorpay.com/docs/payments/disputes), last modified Oct 8, 2026 (accessed Nov 23, 2026).
4. Cashfree Docs, [Webhooks Overview](https://www.cashfree.com/docs/payments/online/webhooks/overview) and [Webhook Verification](https://www.cashfree.com/devstudio/preview/pg/tools/webhookVerification) (accessed Nov 23, 2026).
5. Stripe, [Radar: Rules 101](https://stripe.com/guides/radar-rules-101), international fraud reference (accessed Nov 23, 2026).
6. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (accessed Nov 23, 2026).
7. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1` (accessed Nov 23, 2026).
8. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1` (accessed Nov 23, 2026).

**Review status:** primary technical docs and open-access research retrieved and checked 2026-11-23; independent second-reviewer verification pending.
