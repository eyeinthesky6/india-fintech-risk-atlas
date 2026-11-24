---
title: Transaction velocity and EFRM monitoring
description: UPI-010 — regulatory Enterprise Fraud Risk Management (EFRM) architecture, alert parameterization, staff calibration, and feedback loops.
recordId: UPI-010
products:
  - upi
recordType: detective-control
theme: monitoring-mules-merchants
lifecycle:
  - monitoring
  - investigation
  - servicing
actors:
  - remitter-bank
  - beneficiary-bank
  - psp-bank
  - payment-aggregator
evidenceLayers:
  - official
  - industry
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Moves fraud monitoring beyond single heuristic alerts to a calibrated **monitoring program**: choosing governed rule parameters, sizing daily alert queues to analyst capacity, preventing biased rule feedback loops, and training operations teams to tell true fraud apart from benign activity. *(For account-level outbound burst features, see [Unusual outbound payment velocity (`UPI-001`)](/india-fintech-risk-atlas/upi/unusual-outbound-velocity/).)*

## Impact when missing
- **Fraud ops & analysts:** Poorly tuned alerts drown investigators in false positives while real attacks slip through unreviewed queues.
- **Legitimate merchants & users:** Naive static cutoffs trigger unexplained blocks, slow unblocking delays, and Ombudsman escalations.
- **Model drift:** Using uninvestigated past alerts as "clean" labels creates circular blind spots over time.

## When it applies
- Designing, updating, or auditing parameter sets in bank or PSO Enterprise Fraud Risk Management (EFRM) systems.
- Sizing analyst review queues and measuring true alert yield vs false-positive friction.
- Operating formal fraud investigation, root-cause review, and customer notice workflows.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Document suspicious-behavior parameters (velocity, new beneficiaries, first-time app use, high-risk MCCs, new-account activity, time-zone/geo/rogue-IP, fraud-linked VPAs/mobiles, declines, missing approval codes), run root-cause analysis, train analysts specifically to distinguish false positives from true fraud, and keep ecosystem escalation SOPs current. |
| Regulatory | Commercial, Payments & Small Finance banks | Maintain Data Analytics/MI units monitoring digital transactions alongside EWS/RFA, and follow natural-justice due process (minimum 21-day Show Cause Notice and reasoned order) before formal fraud classification. |
| Regulatory | Non-bank PSOs | Operate a real-time/near-real-time fraud monitoring solution and share online alerts across participants for failed transactions, velocity, and new-account spikes (Large/Medium immediate; Small Apr 1, 2028). |
| Industry practice | Risk & rule teams | Backtest candidate rules before activation to balance fraud caught vs false blocks, allowing 60–120 day maturity windows so delayed chargebacks/disputes are not mislabeled clean *(method drawn from Stripe Radar guidance—do not copy non-India card thresholds)*. |
| Research & academic | ML & fraud ops teams | Benchmark models at realistic daily queue budgets (`k=100` vs `k=500` alerts, RBIH NFPC study) rather than arbitrary score cutoffs; pairing calibrated GBDTs with SHAP attributions and structured analyst narratives lifted investigator alert yield from 61% to 89% in an OCBC Singapore study (international comparison, not turnkey India rules). |
| Atlas guidance | Fraud engineering teams | Tag analyst dispositions cleanly (`confirmed_fraud`, `confirmed_false_positive`, `inconclusive`, `delayed_ncrp`) so offline retraining never treats cleared backlog as clean behavior. |

## Watch-outs and validation
- **Legitimate lookalikes:** High-volume micro-merchants, payroll runs, festival transfers, and housing-society or cooperative collections routinely breach naive static thresholds.
- **Signals needed:** Unified transaction + auth + device logs, rule-trigger history, timestamped analyst dispositions, delayed NCRP/chargeback outcomes, and customer segment tags (`retail` vs `merchant`).
- **How to validate:** Replay rules in observe-only (shadow) mode before turning on hard blocks; track `precision@k`, false-positive overturn rate, analyst handling time, and time-to-unblock for erroneous alerts.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — documented config, alert parameters, root-cause fraud analysis, staff FP training, and SOPs (`Ch. I §3, §§52–56`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (updated Oct 1, 2026; `Ch. I §3, §§52–56`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (updated Oct 1, 2026; `Ch. I §3, §§52–56`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; `§§3, 27(c), 28`), accessed Nov 23, 2026.
5. RBI, [Commercial Banks – Fraud Risk Management Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13641) (Jul 2026) — Data Analytics/MI (`§25`) and 21-day Show Cause Notice + reasoned order (`§6`), accessed Nov 23, 2026 (parallel `id=13623` PBs, `id=13632` SFBs).
6. Stripe, [Radar: Rules 101](https://stripe.com/guides/radar-rules-101) — international backtesting and maturity-window reference (`company-reported`, method analogy only), accessed Nov 23, 2026.
7. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (`§7.2`) — queue-budget evaluation study, accessed Nov 23, 2026.
8. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1` (`§4.5`) — international explainable triage study, accessed Nov 23, 2026.

**Review status:** RBI, industry, and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
