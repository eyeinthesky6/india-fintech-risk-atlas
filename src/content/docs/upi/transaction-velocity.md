---
title: Transaction velocity and EFRM monitoring
description: UPI-010 — regulatory Enterprise Fraud Risk Management (EFRM) architecture, alert parameterization, staff calibration, and feedback loops.
recordId: UPI-010
products:
  - UPI
recordType: detective-control
recordTypeLabel: Detective & operational governance control
theme: monitoring-mules-merchants
themeLabel: Monitoring, mules & merchants
lifecycle:
  - monitoring
  - investigation
  - servicing
actors:
  - Remitter bank
  - Beneficiary bank
  - PSP bank
  - Payment aggregator
evidenceLayers:
  - official
  - industry
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
While [Unusual outbound payment velocity (`UPI-001`)](/india-fintech-risk-atlas/upi/unusual-outbound-velocity/) covers individual outbound burst features, real-world UPI fraud detection succeeds or fails at the **monitoring-program level**: choosing which parameters to combine, calibrating alert queues to investigator capacity, avoiding circular label bias, and training fraud-operations analysts to separate real attacks from benign bursts.

## Layer 1 — Official regulatory requirements
- **Bank Fraud Risk Management & EFRM (`Digital Payment Security Controls Directions, 2026`):** Under `id=13642` (Commercial Banks, Ch. I §3), `id=13624` (Payments Banks, Ch. I §3), and `id=13633` (Small Finance Banks, Ch. I §3):
  - `§52`: requires documenting and implementing configuration requirements for identifying suspicious transactional behavior, preventive/detective controls, failed-authentication customer alerts, and applicable timeframes. [1][2][3]
  - `§53`: specifies applicable monitoring parameters including transaction velocity, addition of new beneficiaries, first-time app/channel usage, high-risk MCCs, excessive new-account activity, time zones, geolocations, unusual/rogue IPs, behavioral biometrics, transactions to fraud-registered mobile numbers/wallets/VPAs, declined transactions, and missing approval codes. [1][2][3]
  - `§54`: requires **fraud analysis** to identify root causes of fraud occurrence and determine prevention mechanisms. [1][2][3]
  - `§55`: requires training fraud-control staff on fraud tools, investigation procedures, rule updates, continuous exception monitoring, LEA escalation, and **differentiating false positives from true fraud** (`§55(6)(iv)`). [1][2][3]
  - `§56`: mandates updated incident-response contact details and ecosystem SOPs. [1][2][3]
- **Non-bank PSOs (`RBI/DPSS/2026-27/475`, Nov 5, 2026):** `§27(c)` requires a real-time/near-real-time fraud monitoring solution; `§28` requires facilitating online participant alerts for failed transactions, transaction velocity, and new-account parameters (Large/Medium immediate; Small Apr 1, 2028 per §3). [4]
- **Data Analytics & Natural Justice (`RBI Fraud Risk Management Directions, 2026`):** Under `id=13641` (Commercial Banks, parallel `id=13623` PBs and `id=13632` SFBs), `§25` directs dedicated Data Analytics / MI units to monitor digital banking transactions alongside credit EWS/RFA, while `§6` mandates natural-justice procedural safeguards (including a minimum 21-day Show Cause Notice and reasoned order) before formally classifying persons/entities as fraud. [5]

## Layer 2 & Layer 3 — Industry methods and empirical evidence
- **Rule backtesting & maturity windows (`company-reported`, non-India analogy):** Stripe Radar (`Rules 101`) documents backtesting candidate fraud rules before launch to balance caught fraud against blocked legitimate payments, noting that non-fraud baselines need longer maturity windows (60–120 days) so delayed chargebacks/disputes are not mislabeled as clean. [6] *Use the evaluation method, not Stripe's card thresholds.*
- **Analyst-queue precision & explainability (`arXiv:2610.21314v1`, `arXiv:2607.17586v1`):** Quantiphi's RBIH NFPC study highlights evaluating models at realistic daily queue budgets (`k=100` vs. `k=500` alerts) rather than arbitrary probability cutoffs, while OCBC Singapore's AML study illustrates pairing calibrated GBDTs with SHAP attributions and structured analyst narratives to lift alert yield from 61% to 89% (international banking comparison). [7][8]

## Layer 4 — Operational feedback loops & data prerequisites
- **Closed-loop label hygiene:** Record investigator dispositions separately (`confirmed_fraud`, `confirmed_legitimate_false_positive`, `inconclusive`, `delayed_ncrp_complaint`) so models do not reinforce biased historical rule triggers.
- **Data prerequisites:** unified transaction + auth + device events, rule-trigger audit logs, analyst disposition timestamps, delayed NCRP/chargeback updates, segment tags (retail vs. merchant).

## False positives, customer impact, and validation
- **Legitimate lookalikes & freeze harm:** High-volume micro-merchants, payroll disbursements, festival transfers, and cooperative collections routinely breach naive static thresholds. Unreviewed freezes or slow exception resolution undermine trust and invite Ombudsman escalation.
- **Validation:** Run shadow-mode replay before activating hard blocks; track `precision@k`, false-positive overturn rate, analyst handling time, and time-to-unblock on erroneous alerts.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§52–56`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026 (`§§52–56`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026 (`§§52–56`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§3, 27(c), 28`), accessed Nov 23, 2026.
5. RBI, [Commercial Banks – Fraud Risk Management Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13641), Jul 2026 (`§§6, 25`), accessed Nov 23, 2026.
6. Stripe, [Radar: Rules 101](https://stripe.com/guides/radar-rules-101), international reference, accessed Nov 23, 2026.
7. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (§7.2), accessed Nov 23, 2026.
8. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1` (§4.5), accessed Nov 23, 2026.

**Review status:** RBI, industry, and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
