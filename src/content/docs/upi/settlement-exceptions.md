---
title: Settlement and reconciliation exceptions
description: UPI-014 — interbank settlement-file reconciliation, failed-transaction TATs, and scheme exception handling.
---

**ID:** UPI-014 · **Type:** Operational failure & control · **Lifecycle:** Settlement, reconciliation, dispute · **Status:** Research draft (`npci.org.in` HTTP 403 on NPCI Settlement doc; RBI rules checked; independent review pending)

## Risk mechanism and operational gap
Even when a merchant checkout integration handles webhooks cleanly ([Payment status and order reconciliation](/india-fintech-risk-atlas/upi/payment-status-reconciliation/)), discrepancies occur at the **interbank clearing and settlement layer**: payer accounts may be debited while beneficiary credits fail or timeout (`UDIR` / switch timeouts), settlement files may contain unmatched RRN/UTR entries, or reversals may lag statutory deadlines.

## Layer 1 — Official regulatory and scheme context
- **24-hour bank reconciliation framework (`Digital Payment Security Controls Directions, 2026`):** Under `id=13642` (Commercial Banks), `id=13624` (Payments Banks), and `id=13633` (Small Finance Banks), `§57` mandates a real-time / near-real-time reconciliation framework—**not later than 24 hours from receipt of settlement files**—between the bank and all ecosystem stakeholders (PSOs, aggregators, gateways, processors, technology providers) specifically to detect and prevent suspicious transactions, supported by monitoring of framework effectiveness. *Note: §57 governs inter-entity reconciliation timing, not the customer credit reversal SLA.* [1][2][3]
- **Binding UPI failed-transaction auto-reversal TATs (`RBI/2019-20/67`, Sep 20, 2019):** Under RBI's *Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions* (`Sl. no. 4`, applying to banks and non-banks per §6):
  - **P2P / Fund transfer (`4(a)`):** Account debited but beneficiary account not credited → auto-reversal (`R`) by the beneficiary bank latest on **`T + 1` calendar day**; delay beyond `T+1` triggers **`₹100/-` per day** *suo motu* compensation. [4]
  - **Merchant payment (`4(b)`):** Account debited but confirmation not received at merchant location → auto-reversal within **`T + 5` calendar days**; delay beyond `T+5` triggers **`₹100/-` per day** compensation. [4]
  - Same-day pass-through: `§5` requires the issuer/originator to credit the customer on the same day funds are received from the beneficiary end. [4]
- **PA escrow & reversals (`RBI/DPSS/2025-26/141`):** Non-bank PAs must maintain day-end escrow >= amounts payable to merchants (`§16`) and route reversals/refunds back through escrow (`§18(h)`). [5]
- **NPCI Settlement Process document (blocked):** Earlier project drafts cited `NPCI UPI Settlement Process` (`§4`, remitting bank / NPCI back office / beneficiary bank dispute flow, noting TATs change by operating circular). Direct retrieval of `npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf` and `/circulars/upi` returned **`HTTP 403 Forbidden`** on 2026-11-23, so current NPCI-specific settlement/UDIR cycle amendments remain pending authorized check. [6]

## Layer 4 — Candidate controls and data prerequisites
- **Automated 3-way switch/CBS/settlement matching:** Reconcile internal ledger postings, NPCI/switch response logs, and raw clearing/settlement files continuously within the <= 24-hour window (`§57`), routing hanging debits straight into `T+1` / `T+5` reversal SLA trackers.
- **Exception aging & compensation automation:** Separate technical clearing breaks (for ODR/auto-reversal under `RBI/2019-20/67`) from suspected fraud holds before triggering customer communication or *suo motu* compensation payouts.
- **Data prerequisites:** RRN/UTR, NPCI switch response codes (`00`, `RB`, timeout/deemed-approved), settlement cycle batch ID, CBS debit/credit timestamps, PA escrow ledger entries.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Asynchronous settlement cutoffs, deemed-approved/pending-resolution switch states, and merchant order-reference mismatches are operational timing gaps, not fraud. Prematurely flagging reconciliation breaks as fraud creates unnecessary freezes and customer distress.
- **Validation:** Test end-of-cycle settlement mismatches and `T+1`/`T+5` compensation triggers in reconciliation QA; audit `§57` 24-hour reconciliation SLA exceptions daily.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§57`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026 (`§57`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026 (`§57`), accessed Nov 23, 2026.
4. RBI, [Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0), `RBI/2019-20/67`, Sep 20, 2019 (`§§4–6`, Sl. no. 4), accessed Nov 23, 2026.
5. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141`, updated Nov 11, 2026 (`§§16, 18(h)`), accessed Nov 23, 2026.
6. NPCI, [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf) & [UPI Circulars](https://www.npci.org.in/circulars/upi) — **HTTP 403 Forbidden** on Nov 23, 2026 (direct verification pending).

**Review status:** RBI sources checked 2026-11-23; `npci.org.in` blocked (`HTTP 403`); independent reviewer: `PENDING`.
