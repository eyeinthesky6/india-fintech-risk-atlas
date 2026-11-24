---
title: UPI dispute and complaint routing
description: UPI-013 — RBI Online Dispute Resolution (ODR), PA chargeback/dispute flows, and separating failed vs. fraudulent incidents.
recordId: UPI-013
products:
  - upi
recordType: recovery-process
theme: reconciliation-disputes-protection
lifecycle:
  - dispute
  - recovery
  - servicing
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
  - beneficiary-bank
  - payment-aggregator
  - npci
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Ensures UPI complaints reach the right operational track immediately instead of landing in one generic support queue: separating (1) **failed/pending technical debits**, (2) **merchant non-delivery/refund disputes**, and (3) **unauthorized or scam-coerced transfers**.

## Impact when misrouted
- **Customers:** Delayed `T+1`/`T+5` ODR auto-reversals or missed urgent NCRP/1930 fraud reporting windows.
- **Merchants & PAs:** Routine order returns flagged as fraud disputes risk unjustified settlement holds or VPA blocks.
- **Banks:** Missed 15-day URCS response windows convert disputes into automatic *Deemed Accepted* chargeback losses.

## Where it applies
- **Technical failure:** Account debited without beneficiary/merchant credit → rule-based ODR (`T+1` / `T+5` SLA).
- **Merchant dispute:** Paid order failed fulfilment/refund → PA/acquirer evidence workflow (invoice, delivery proof).
- **Fraud / Unauthorized / Scam:** Instant 24x7 bank/PSO intake, "mark transaction as fraudulent" flag, NCRP/1930 routing, and URCS Fraud chargeback.

## What to do (rules and workflows)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Authorised PSOs, PSPs, TPAPs | Run rule-based, minimal-intervention ODR for failed transactions aligned to `T+1`/`T+5` compensation TATs; TPAPs must embed in-app grievance lodging with unique tracking IDs (unresolved claims >1 month escalate to RBI Integrated Ombudsman). |
| Regulatory | Commercial, PB, SFB banks & PSOs | Provide an explicit in-app grievance section with timelines plus an authenticated "mark/identify transaction as fraudulent" option; commercial banks (effective Jan 1, 2027) must run 24x7 fraud reporting, SMS-reply alert objection numbers, direct links, NCRP/1930 guidance, and immediate acknowledgement. |
| Regulatory | Payment Aggregators, NPCI ecosystem | Maintain a published dispute policy, refund SLA, escalation matrix, and grievance officer with acquirers/merchants. Under NPCI rules, unauthorized/fraud claims go to the customer's bank (`Chargeback -> Re-present -> Pre-Arbitration -> Arbitration`), with **15 calendar days** in URCS for Fraud/Wrong Credit chargeback responses before automatic *Deemed Accepted* closure. |
| Industry practice | PAs, Merchants | Track disputes cleanly across phases (*Fraud*, *Retrieval*, *Chargeback*, *Pre-Arbitration*, *Arbitration*) and statuses (`Open`, `Under Review`, `Won`, `Lost`, `Closed`) via webhooks and portal workflows to submit delivery/invoice proof or refund promptly *(Razorpay documented pattern)*. |
| Atlas guidance | TPAPs, Banks, PAs | Build 3-way intake classification right on the transaction screen—routing unsettled debits to ODR/TAT timers, fulfilment issues to PA evidence queues, and scam/ATO reports directly to 24x7 fraud desks + NCRP/1930 guidance. |

## Watch-outs and validation
- **Legitimate lookalikes:** Temporary `PENDING` transactions awaiting clearing, user-cancelled retries, and normal merchant return/exchange requests should never be tagged as fraud disputes.
- **Signals needed:** RRN/UTR, switch/settlement state, unique ODR reference ID, merchant invoice/delivery proof, alert/report timestamps, and NCRP complaint ID linkage.
- **How to validate:** Audit unique ODR tracking generation, test 1-tap mark-fraud flows end-to-end, monitor unresolved tickets approaching the 30-day Ombudsman mark, and track approaching 15-day URCS deadlines.

## References and review history
1. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21` (Aug 6, 2020) — rule-based ODR, TPAP in-app facility (`Annex §5.2`), unique tracking ref (`§5.4`), Ombudsman 1-month escalation (`§4`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` — app grievance section (`§§59–60`) and mark-fraud button (`§66`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs, `Id=13751 §30` non-bank PSOs).
3. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141` (updated Nov 11, 2026; `§8`), accessed Nov 23, 2026.
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (effective Jan 1, 2027 for commercial banks excluding SFBs/PBs/RRBs/LABs; `§§76G, 76I`), accessed Nov 23, 2026.
5. NPCI, [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf) (`§4 Dispute Resolution Mechanism`, p. 4 ODR summary; undated 4 pp. public PDF), browser-checked Nov 23, 2026.
6. Razorpay Docs, [About Disputes](https://razorpay.com/docs/payments/disputes) (Oct 8, 2026) — company-reported dispute phases, statuses, and webhook evidence flow, accessed Nov 23, 2026.
7. NPCI, [UPI FAQs](https://www.npci.org.in/faqs/upi) & [Complaint Register](https://www.npci.org.in/complaint-register) — confirms unauthorised/fraud complaints go directly to the customer's bank, browser-checked Nov 23, 2026.
8. NPCI, [`NPCI/UPI/OC No. 235/2026-27`: Revision of TAT for Fraud and Wrong Credit Chargebacks in URCS](https://www.npci.org.in/uploads/UPI_OC_No_235_FY_2026_27_Revision_of_Turnaround_Time_TAT_for_Responding_to_Fraud_and_Wrong_Credit_Chargebacks_in_URCS_Back_Office_System_aa420e4bcc.pdf) (Jul 16, 2026; effective Aug 1, 2026) — 35 → 15 calendar days URCS TAT, browser-checked Nov 23, 2026.

**Review status:** RBI, browser-verified NPCI Settlement/FAQs/Complaint Register/`OC 235`, and Razorpay sources checked 2026-11-23; independent reviewer: `PENDING`.
