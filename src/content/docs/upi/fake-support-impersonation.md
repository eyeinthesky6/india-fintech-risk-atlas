---
title: Fake support and grievance impersonation
description: UPI-007 — search-result, social-media, and bogus call-centre impersonation around refunds and failed payments.
recordId: UPI-007
products:
  - UPI
recordType: fraud-pattern
recordTypeLabel: Fraud pattern
theme: social-engineering
themeLabel: Social engineering & scams
lifecycle:
  - servicing
  - dispute
  - recovery
actors:
  - Payer
  - TPAP
  - PSP bank
  - Remitter bank
  - Payment aggregator
evidenceLayers:
  - official
  - atlas
reviewStage: draft
blockerNote: "Direct npci.org.in pages returned HTTP 403; RBI sources checked; independent review pending."
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
Customers experiencing a `PENDING` payment, failed order, or merchant refund delay frequently search online or post on social media for support numbers. Fraudsters exploit sponsored/poisoned search results, fake social-media support handles, and spoofed call centres ("bogus call centres" noted in RBI's April 2026 Discussion Paper) to impersonate bank, TPAP, or merchant support—then extracting OTPs/PINs, pushing remote-access tools, or tricking victims into executing "refund verification" debits.

The core operational gap is **unclear or hard-to-find official in-app grievance status**, which pushes anxious users onto open web search.

## Layer 1 — Official regulatory and scheme context
- **NPCI Fraud Awareness (blocked):** Direct retrieval of `npci.org.in/fraud-awareness` returned **HTTP 403 Forbidden** on 2026-11-23; exact NPCI search/grievance advisory text awaits authorized browser verification. [1]
- **In-app grievance & ODR visibility:**
  - *Digital Payment Security Controls Directions, 2026* (`id=13642` Commercial Banks, `id=13624` Payments Banks, `id=13633` SFBs) require banks to incorporate a clear section inside their digital payment application specifying grievance procedures, contact details, and complaint registration (`§59`) and to follow ODR instructions (`§60`). [2]
  - *Online Dispute Resolution (ODR) System for Digital Payments* (`RBI/2020-21/21`, Aug 6, 2020) specifically requires **TPAPs** in mobile payment systems such as UPI to provide an **in-app facility** for lodging failed-transaction disputes and grievances (`Annex §5.2`) with unique reference tracking (`§5.4`). [3]
- **Mandatory 24x7 fraud reporting & anti-phishing:**
  - *Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026* (`RBI/2026-27/167`, effective **Jan 1, 2027** for commercial banks) mandates 24x7 reporting channels, direct reporting links on bank home pages and mobile apps, SMS-reply objection numbers inside transaction alerts, and advising customers to report via **NCRP / National Cyber Crime Helpline (1930)** (`§76G`). [4]
  - *Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs* (`RBI/DPSS/2026-27/475`, Nov 5, 2026) requires covered PSOs to provide an in-app/website mark-fraud facility (`§30`), maintain a 24x7x365 customer/LEA resolution facility (`§27(d)`), and subscribe to anti-phishing / anti-rogue-app monitoring and takedown services (`§27(h)`). [5]
- **Bogus call centres & impersonation:** RBI's *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (Apr 9, 2026; non-binding) cites bogus call centres and impersonation scams as major drivers of NCRP-reported digital payment fraud (`§xi`). [6]

## Layer 4 — Candidate controls and data prerequisites
- **Zero-search in-app resolution:** Surface live transaction reconciliation status (`T+1` / `T+5` auto-reversal timers) and 1-tap ODR/fraud complaint submission directly on the transaction detail screen so users never leave the app to search for phone numbers.
- **Brand/domain impersonation takedown & verified caller IDs:** Continuously monitor search ads, social handles, and spoofed support domains (`§27(h)`); publish authenticated support channels and educate users that support never asks for UPI PIN, OTP, or screen-sharing.
- **Data prerequisites:** search/brand-monitoring alerts, in-app dispute funnel telemetry, customer complaint source tags (`in-app` vs `1930/NCRP` vs `call centre`), post-failure outbound-transaction correlation.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Authentic outsourced merchant customer-care desks or courier refund inquiries. Avoid blocking legitimate support interactions; focus instead on eliminating ambiguity inside official apps and flagging outbound payments initiated right after a failed-payment event.
- **Validation:** Track share of failed-payment inquiries initiated in-app vs. via external channels, measure takedown SLA for impersonating domains/handles, and test `§76G` 24x7 reporting links end-to-end.

## References and review history
1. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) — **HTTP 403 Forbidden** on Nov 23, 2026 (direct verification pending).
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (`§§59–60`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
3. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21`, Aug 6, 2020 (`Annex §§5.2, 5.4`), accessed Nov 23, 2026.
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167`, Jun 24, 2026 (`§76G`), accessed Nov 23, 2026.
5. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§27(d),(h), 30`), accessed Nov 23, 2026.
6. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (`§xi`; non-binding), accessed Nov 23, 2026.

**Review status:** RBI sources checked 2026-11-23; `npci.org.in` blocked (`HTTP 403`); independent reviewer: `PENDING`.
