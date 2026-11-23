---
title: Potential mule-account funnel
description: UPI-002 — pass-through layering networks, RBIH MuleHunter.AI / I4C coordination, and relational detection limits.
recordId: UPI-002
products:
  - UPI
recordType: fraud-pattern
recordTypeLabel: Fraud & AML pattern
theme: monitoring-mules-merchants
themeLabel: Monitoring, mules & merchants
lifecycle:
  - onboarding
  - monitoring
  - investigation
actors:
  - Beneficiary bank
  - Remitter bank
  - PSP bank
  - Payment aggregator
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
Money mules receive proceeds of fraud or cybercrime from multiple unrelated victims and rapidly layer them onward across accounts, wallets, or cash-outs. Individually, each UPI transfer may resemble ordinary retail activity; the signal lies in **inflow-to-outflow coupling, dormant-to-burst account behavior, and shared relational infrastructure** across seemingly separate accounts.

## Layer 1 — Official regulatory and institutional context
- **RBI Digital Payment Security Controls (`id=13642`, `id=13624`, `id=13633`):** `§53` lists new-account excessive activity, rapid transfer velocity, beneficiary additions, and transfers to mobile numbers/VPAs linked to recorded frauds among bank monitoring parameters; `§56` requires maintaining stakeholder coordination SOPs. [1]
- **RBI Fraud Risk Management (`id=13641` Commercial Banks, `id=13623` PBs, `id=13632` SFBs):** Requires Data Analytics / MI monitoring of digital transactions (`§25`), EWS/RFA frameworks (`§12`), and natural-justice procedures (21-day Show Cause Notice and reasoned order under `§6`) before formally classifying entities as fraud. [2]
- **MuleHunter.AI & I4C NCRP Suspect Registry:** RBI's April 9, 2026 Discussion Paper (`id=23810 §§viii–ix`) highlights I4C's NCRP SOP and **MuleHunter.AI** built by RBIH (2024) for mule account detection, alongside a consultation proposal (`Option 3`) for monitoring credits commensurate with customer KYC profile (non-binding). A Government of India / PIB press release confirms an MoU between **I4C (MHA)** and **RBIH** to share mule-account intelligence from the NCRP Suspect Registry with `MuleHunter.AI`. [3][4]

## Layer 4 — Candidate controls, data prerequisites, and research references
- **Multi-hop & temporal coupling features:** Combine net inflow/outflow ratio, time-to-onward-debit latency, unique sender-to-recipient fan ratio, account age, and shared device/address/IP/branch identifiers.
- **Proportionate hold & NCRP alignment:** Route high-confidence Suspect Registry / MuleHunter alerts to rapid specialist triage; isolate disputed credits rather than freezing an entire customer's livelihood balance blindly where law/policy permits.
- **Data prerequisites:** account opening & KYC profile, credit/debit timestamps, anonymized counterparty graphs, shared contact/address attributes (within privacy/data-minimization bounds), NCRP/I4C intelligence tags, investigator outcomes.

### Research paper leads (ideas for gaps, not ready-to-use rules)
- **RBIH NFPC Indian Banking Benchmark (`arXiv:2610.21314v1`):** Analyzing ~237.8M transactions across 96,091 Indian accounts (2,683 confirmed mules, 2.6% prevalence), Ahmad & Deodhar find:
  - *Behavioural & relational shape:* Mules exhibit alternating high-velocity/directional-flow weeks and shared counterparties, addresses, or postal PINs across multi-hop database schemas. [5]
  - *Queue capacity matters:* At `k=100` daily alerts, well-featurized GBDTs (`XGBoost`/`LightGBM`) achieved 96–99% precision; at `k=500`, temporal heterogeneous GNNs (`HeteroGraphSAGE` 0.676, `RelGNN` 0.680 precision) significantly outperformed GBDTs (0.562–0.564) by capturing 2-to-4-hop shared endpoints. [5]
  - *Positive-unlabelled bias:* Treating uninvestigated accounts as negative labels teaches undetected mule rings as normal behavior. [5]
- **Explainable Mule Triage (`arXiv:2607.17586v1`, non-India AML comparison):** OCBC Singapore researchers pair 280 account features, LightGBM, TreeSHAP, and constrained LLM narratives to raise investigator alert yield from 61% to 89%. [6]

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Community/religious fundraisers, housing-society collections, micro-merchants/kirana aggregators, gig-worker payouts, and innocent sellers who unknowingly received a payment from a scam victim (experiencing collateral account freezes).
- **Validation:** Enforce strict temporal scoring cutoffs (`τ(v) <= t_seed`) to prevent future label leakage, evaluate `precision@k` at realistic analyst capacity, and audit overturned freezes to mitigate positive-unlabelled feedback bias.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (`§§53, 56`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
2. RBI, [Commercial Banks – Fraud Risk Management Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13641), Jul 2026 (`§§6, 12, 25`), accessed Nov 23, 2026.
3. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (`§§viii–ix, Option 3`; non-binding), accessed Nov 23, 2026.
4. PIB / Government of India, [I4C and RBIH MoU on MuleHunter.AI](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260277&reg=3&lang=2), accessed Nov 23, 2026.
5. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (§§1, 5, 7.2, 8), accessed Nov 23, 2026.
6. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1`, accessed Nov 23, 2026.

**Review status:** RBI, PIB, and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
