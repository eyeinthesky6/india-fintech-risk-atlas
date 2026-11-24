---
title: Settlement and reconciliation exceptions
description: UPI-014 — interbank settlement-file reconciliation, failed-transaction TATs, and scheme exception handling.
recordId: UPI-014
products:
  - upi
recordType: operational-failure
theme: reconciliation-disputes-protection
lifecycle:
  - settlement
  - reconciliation
  - dispute
actors:
  - remitter-bank
  - beneficiary-bank
  - psp-bank
  - npci
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
Even when merchant checkouts handle webhooks properly ([Payment status and order reconciliation](/india-fintech-risk-atlas/upi/payment-status-reconciliation/)), clearing breaks occur at the **interbank switch and settlement layer**: a customer's account gets debited while the beneficiary bank fails to credit (`UDIR`/timeout), settlement files carry unmatched RRNs/UTRs, or reversals miss statutory deadlines.

## Impact
- **Customer:** Held debit funds awaiting manual intervention or delayed `₹100/day` failed-transaction compensation.
- **Beneficiary & remitter banks:** Unreconciled breaks create deemed-accepted chargeback losses once NPCI's shortened 15-day URCS TAT expires.
- **Wrongful freezes:** Treating routine settlement timing lags as suspected fraud unnecessarily locks accounts.

## Common failure modes
- **Unmatched clearing/CBS legs:** Core banking debits post without matching NPCI clearing confirmation within 24 hours.
- **Segregated dispute cycle lag:** AUTH cycles (`1–10`) separate cleanly from Dispute Cycles (`DC1`, `DC2`) and `DR` reports, so ignoring `DR` adjustment files leaves exceptions unresolved.
- **Missed URCS chargeback TAT:** Beneficiary banks failing to accept or reject Fraud/Wrong Credit chargebacks within **15 calendar days** lose automatically via *Deemed Accepted* closure.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Run real-time/near-real-time reconciliation across all ecosystem participants (PSOs, aggregators, processors) within **<= 24 hours of receiving settlement files** to catch suspicious or mismatched activity. *(Note: governs inter-entity reconciliation timing, distinct from customer reversal SLAs.)* |
| Regulatory | Remitter & beneficiary banks, Non-bank PSOs | Auto-reverse debited-but-uncredited **P2P** transfers by `T+1` calendar day and unconfirmed **merchant (P2M)** payments by `T+5` calendar days (`₹100/day` *suo motu* compensation after expiry), crediting customers the same day funds arrive from beneficiary side. Keep PA day-end escrow >= merchant payables. |
| Regulatory | NPCI member banks | Reconcile segregated AUTH cycles (`1–10`) separately from Dispute Cycles `DC1` (`00:00–16:00`), `DC2` (`16:00–00:00`), and non-settlement `DR` adjustment reports (`00:00–10:00`); respond to Fraud & Wrong Credit chargebacks in URCS within **15 calendar days** (reduced from 35) to prevent automatic *Deemed Accepted* closure. |
| Atlas guidance | Clearing & recon engineering | Run automated 3-way matching (CBS ledger + switch response logs + clearing/DR files) within the <= 24h window, routing hanging debits straight into `T+1`/`T+5` SLA trackers separately from fraud hold queues. |

## Watch-outs and validation
- **Legitimate lookalikes:** Asynchronous cycle cutoffs, deemed-approved/timeout switch responses, and merchant order-reference formatting mismatches are operational timing gaps, not fraud—never auto-freeze user accounts on unconfirmed recon breaks alone.
- **Signals needed:** RRN/UTR, NPCI response codes (`00`, `RB`, timeout/deemed-approved), cycle batch ID (`AUTH`/`DC1`/`DC2`/`DR`), CBS debit/credit timestamps, and PA escrow ledger rows.
- **How to validate:** Test end-of-cycle unmatched files and `T+1`/`T+5` compensation triggers in recon QA; track daily `<= 24h` reconciliation SLA breaches and approaching 15-day URCS deadlines.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — `<= 24h` inter-entity reconciliation framework (`§57`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (updated Oct 1, 2026; `§57`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (updated Oct 1, 2026; `§57`), accessed Nov 23, 2026.
4. RBI, [Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0), `RBI/2019-20/67` (Sep 20, 2019; `§§4–6`, Sl. no. 4) — `T+1` P2P (`4(a)`), `T+5` merchant (`4(b)`), same-day credit (`§5`), `₹100/day` compensation, accessed Nov 23, 2026.
5. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141` (updated Nov 11, 2026; `§§16, 18(h)`), accessed Nov 23, 2026.
6. NPCI, [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf) (`§4 Dispute Resolution Mechanism`; undated 4 pp. public PDF) & [UPI Circulars index](https://www.npci.org.in/circulars/upi), browser-checked Nov 23, 2026.
7. NPCI, [`NPCI/2025-26/UPI/222A`: Addendum – Segregation of UPI Settlement Cycles for Auth and Disputes Transactions](https://www.npci.org.in/uploads/UPI_OC_No_222_A_FY_2025_26_Addendum_segregation_of_UPI_settlement_cycles_for_Auth_and_disputes_transactions_42766ab9aa.pdf) (Oct 29, 2025; effective Dec 15, 2025), browser-checked Nov 23, 2026.
8. NPCI, [`NPCI/UPI/OC No. 235/2026-27`: Revision of TAT for Responding to Fraud and Wrong Credit Chargebacks in URCS](https://www.npci.org.in/uploads/UPI_OC_No_235_FY_2026_27_Revision_of_Turnaround_Time_TAT_for_Responding_to_Fraud_and_Wrong_Credit_Chargebacks_in_URCS_Back_Office_System_aa420e4bcc.pdf) (Jul 16, 2026; effective Aug 1, 2026) — 35 → 15 calendar days TAT, browser-checked Nov 23, 2026.

**Review status:** RBI and browser-verified NPCI Settlement Process and circulars (`222A`, `OC 235`) checked 2026-11-23; independent reviewer: `PENDING`.
