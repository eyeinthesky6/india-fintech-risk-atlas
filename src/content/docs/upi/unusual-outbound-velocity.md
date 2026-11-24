---
title: Unusual outbound payment velocity
description: UPI-001 — account-level outbound burst and rapid balance-depletion signals.
recordId: UPI-001
products:
  - upi
recordType: detective-control
theme: monitoring-mules-merchants
lifecycle:
  - initiation
  - authorization
  - monitoring
actors:
  - remitter-bank
  - psp-bank
  - tpap
  - payment-aggregator
evidenceLayers:
  - official
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Detects sudden bursts of outgoing UPI payments—such as multiple back-to-back transfers to unfamiliar payees, rapid splitting right after an incoming credit, or abrupt balance draining—early enough to flag account takeover, scam coercion, or mule cash-outs. Outbound velocity is a **risk signal, not standalone proof of fraud**.

## Impact when missing
- **Customer:** Victim balances or compromised accounts are drained across multiple rapid hops before alerts are reviewed.
- **Banks & PSPs:** Counting raw transfers without comparing against the customer's own baseline misses stealth draining or floods queues with noisy retail alerts.

## When it applies
- Multiple outbound UPI debits or new beneficiary additions compressed into a short window.
- First-time mobile/UPI channel usage on an established account, or excessive burst activity right after account opening.
- Outbound bursts immediately following a new device link or an unfamiliar large credit.

*(For program-wide EFRM governance, staffing, and alert-tuning obligations, see [Transaction velocity and EFRM monitoring](/india-fintech-risk-atlas/upi/transaction-velocity/).)*

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Parameterize monitoring alerts for transaction velocity (electronic fund transfers and new beneficiary additions in short periods), first-time mobile/internet channel usage, and excessive new-account activity. RBI sets no fixed rupee/count cutoff—banks document risk-based limits. |
| Regulatory | Non-bank PSOs | Maintain real-time/near-real-time fraud monitoring and facilitate online participant alerts for velocity and new-account spikes (effective immediately for Large/Medium PSOs; Apr 1, 2028 for Small PSOs). |
| Research & academic | Risk & ML teams | An Indian RBIH NFPC study found alternating high-velocity outbound runs paired with prior inflows and dormancy separated mules from legitimate bursts that revert quickly to baseline. |
| Research & academic | Fraud product teams | An empirical GPay India evaluation achieving >88% recall saw ~30% precision on evaluated splits—meaning behavioral velocity triggers alone create too many false blocks if wired directly to hard freezes without step-up or review. |
| Atlas guidance | Remitter banks, PSPs, TPAPs | Score rolling 15-minute, 1-hour, and 24-hour outbound counts, value, balance depletion share, and unique-new-payee ratio relative to each account's own 30/90-day baseline; prioritize bursts paired with recent device binding or unfamiliar inflows. |

## Watch-outs and validation
- **Legitimate lookalikes:** Small merchants paying suppliers at day-end, festive shopping/gifting, group-trip splits, salary-day family transfers, and active new users. Prefer step-up confirmation or scoped temporary holds over blanket account freezes.
- **Signals needed:** Timestamps, debit/credit direction, outcome status, amount, pre/post balance, anonymized counterparty VPA/account ID, account tenure, and device/session context.
- **How to validate:** Measure alert `precision@k` at your real daily analyst queue capacity, track false-positive overturn rates by segment (merchant vs retail), and stress-test against salary-week and festival spikes.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — documented rule configuration (`§52`) and monitoring parameters (`§53`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (updated Oct 1, 2026; `§§52–53`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (updated Oct 1, 2026; `§§52–53`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; `§§3, 27(c), 28`), accessed Nov 23, 2026.
5. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (`§4, Fig. 2`) — Indian benchmark study (narrow scope, not a turnkey cutoff), accessed Nov 23, 2026.
6. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1` (`§V-A`) — GPay India empirical study, accessed Nov 23, 2026.

**Review status:** RBI and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
