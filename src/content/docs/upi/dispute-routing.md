---
title: UPI dispute and complaint routing
description: UPI-013 — RBI Online Dispute Resolution (ODR), PA chargeback/dispute flows, and separating failed vs. fraudulent incidents.
recordId: UPI-013
products:
  - UPI
recordType: recovery-process
recordTypeLabel: Recovery process
theme: reconciliation-disputes-protection
themeLabel: Reconciliation, disputes & protection
lifecycle:
  - dispute
  - recovery
  - servicing
actors:
  - Payer
  - TPAP
  - PSP bank
  - Remitter bank
  - Beneficiary bank
  - Payment aggregator
  - NPCI
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: draft
blockerNote: "Direct npci.org.in dispute FAQs returned HTTP 403; RBI ODR/TAT/PA & Razorpay sources checked; independent review pending."
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
When a UPI payment goes wrong, customers and merchants face three fundamentally different incident classes: (1) **failed/pending technical transactions** (account debited, value not received), (2) **merchant fulfilment or goods/service disputes**, and (3) **unauthorized or socially engineered fraudulent transactions**. Operational failures occur when support systems funnel all three into one generic ticket queue—missing `T+1`/`T+5` ODR auto-reversal tracks or delaying urgent NCRP/1930 fraud containment.

## Layer 1 — Official regulatory and scheme context
- **Online Dispute Resolution (ODR) System (`RBI/2020-21/21`, Aug 6, 2020):** Mandates all authorised PSOs (banks/non-banks) and PSPs to operate a rule-based, system-driven ODR system with zero/minimal manual intervention for failed transactions (`Annex §§1.1, 2.1, 4.1`), explicitly requiring **TPAPs** in UPI to provide an in-app dispute/grievance facility (`Annex §5.2`), issuing a unique tracking reference (`§5.4`), adhering to `RBI/2019-20/67` TAT/compensation (`§4.2`), and noting RBI Integrated Ombudsman escalation if unresolved up to one month (`§4`). [1]
- **Bank digital app grievance visibility (`id=13642`, `id=13624`, `id=13633`):** `§§59–60` mandate an explicit in-app grievance lodging section with response timelines and ODR alignment, while `§66` (and `RBI/DPSS/2026-27/475 §30` for non-bank PSOs) requires an authenticated **"mark/identify transaction as fraudulent"** mechanism for immediate notification. [2]
- **PA dispute governance (`RBI/DPSS/2025-26/141 §8`):** Payment Aggregators must maintain a dispute resolution policy covering refund timelines, clearly delineate failed-transaction and refund duties with acquiring banks and merchants (`§8(b)`), and publish an escalation matrix and grievance officer (`§8(d)`). [3]
- **Fraud complaint channels (`RBI/2026-27/167`):** For commercial banks (EBTs >= Jan 1, 2027), `§76G` mandates 24x7 fraud reporting, SMS-reply objection numbers, direct website/app links, advising NCRP / 1930 reporting, and `§76I` mandates immediate complaint registration and acknowledgement. [4]
- **NPCI FAQs & Settlement doc (blocked):** Direct inspection of `npci.org.in/what-we-do/upi/faqs` and `UPI_Settlement_Process_256f73e1df.pdf` returned **`HTTP 403 Forbidden`** on 2026-11-23; scheme-specific UDIR dispute codes and timelines await authorized NPCI verification. [5]

## Layer 2 — Company-reported industry practices
- **Razorpay Disputes (`company-reported`):** Razorpay documents tracking merchant disputes across phases (*Fraud*, *Retrieval*, *Chargeback*, *Pre-Arbitration*, *Arbitration*) and statuses (`Open`, `Under Review`, `Won`, `Lost`, `Closed`) via dashboard and webhooks, allowing merchants to accept/refund or submit supporting delivery/invoice evidence (`About Disputes`, last modified Oct 8, 2026). [6]

## Layer 4 — Candidate controls and data prerequisites
- **Three-way intake triage:** Automatically route technical debits-without-credit to ODR / `T+1`–`T+5` auto-reversal tracking (`RBI/2019-20/67`), commercial non-delivery claims to PA/acquirer evidence workflows, and alleged scams/ATO directly to 24x7 fraud containment + NCRP/1930 guidance (`§76G`, `§66`).
- **Data prerequisites:** RRN/UTR, switch/settlement status, ODR unique reference ID, merchant invoice/delivery proof (for P2M), alert/response timestamps (`§76H`), NCRP complaint ID linkage.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Temporary `PENDING` transactions awaiting clearing, user-cancelled retries, and ordinary merchant return/exchange requests should not be misclassified as fraud disputes (which risks freezing merchant payouts or customer VPAs unfairly).
- **Validation:** Audit unique ODR tracking generation (`§5.4`), test 1-tap `§66` / `§30` mark-fraud flows, and reconcile unresolved complaints approaching the 30-day Ombudsman window.

## References and review history
1. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21`, Aug 6, 2020 (`§4, Annex §§1.1–5.4`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (`§§59–60, 66`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs, `Id=13751 §30` PSOs).
3. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141`, updated Nov 11, 2026 (`§8`), accessed Nov 23, 2026.
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (`§§76G, 76I`), accessed Nov 23, 2026.
5. NPCI, [UPI FAQs](https://www.npci.org.in/what-we-do/upi/faqs) & [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf) — **HTTP 403 Forbidden** on Nov 23, 2026.
6. Razorpay Docs, [About Disputes](https://razorpay.com/docs/payments/disputes), Oct 8, 2026, accessed Nov 23, 2026 (company-reported).

**Review status:** RBI and Razorpay sources checked 2026-11-23; `npci.org.in` blocked (`HTTP 403`); independent reviewer: `PENDING`.
