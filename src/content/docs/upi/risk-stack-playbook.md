---
title: Designing a UPI risk stack
description: Practical control and validation framework across the payment lifecycle.
---

**Evidence label:** Atlas analysis — a proposed engineering checklist, **not** a regulatory mandate or production-ready detection system.

## 1. Map ownership before selecting controls

| Stage | Relevant actors | Candidate risks | Candidate controls |
| --- | --- | --- | --- |
| Registration | App, PSP bank, account-holding bank | Impersonation, device compromise | Identity/device context, customer education |
| Payment initiation | App, customer, PSP bank | Deceptive requests, wrong payee | Clear direction/payee display, confirmation |
| Authorization | Bank, scheme participants | Account takeover, suspicious activity | Applicable authentication, contextual monitoring |
| Transaction processing | Banks, NPCI, app | Retry and ambiguous status | Transaction reference, status checks |
| Merchant fulfilment | Merchant, gateway/aggregator | Duplicate callbacks, mismatched orders | Signature verification, idempotent fulfilment |
| Monitoring | Relevant regulated operator | Mule activity, unusual behavior | Behavioral/relationship review, investigator feedback |
| Dispute and recovery | Banks, PSP, merchant | Missing evidence, delayed resolution | Case ownership, reconciliation and customer updates |

These are conceptual actor groupings. The actual duties and data access depend on the entity and operative scheme/regulatory terms.

## 2. Prioritize by failure mode, not fashionable algorithms

Start with clear event identity, consistent transaction states, case ownership, and reliable labels. Add rules when simple patterns have evidence; use graph or ML approaches only if available data and evaluation justify them.

## 3. Test each candidate control

Define the hypothesis, available inputs, outcome labels, legitimate lookalikes, alert volume, investigation cost, missed-risk cost, customer friction and monitoring plan. Evaluate against a baseline and holdout period where feasible. Do not claim a model is effective because it detects more anomalies.

## 4. Feed operational learning back into controls

Record confirmed incidents, false positives, overturned decisions, delayed feedback and source changes. Treat investigation decisions as imperfect labels, not unquestionable ground truth.

## 5. Evidence layers

**Official:** entity-specific RBI/NPCI obligations and scheme controls.  
**Industry:** company-reported technical practices, such as [Razorpay webhook guidance](https://razorpay.com/blog/payment-gateway-webhooks-india/).  
**Practitioner:** named and attributed observations when verified.  
**Atlas:** this proposed design framework, subject to validation.

See [operator insights ](/india-fintech-risk-atlas/upi/operator-insights/) and [evidence policy ](/india-fintech-risk-atlas/evidence-policy/) for provenance and limitations.

## Release note

This is a reference architecture for learning and planning, not a deployable fraud stack. Independent source review and a bank/PSP-specific legal and technical assessment are required before operational use.
