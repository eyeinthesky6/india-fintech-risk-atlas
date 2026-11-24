---
title: Potential mule-account funnel
description: UPI-002 — pass-through layering networks, RBIH MuleHunter.AI / I4C coordination, and relational detection limits.
recordId: UPI-002
products:
  - upi
recordType: fraud-pattern
theme: monitoring-mules-merchants
lifecycle:
  - onboarding
  - monitoring
  - investigation
actors:
  - beneficiary-bank
  - remitter-bank
  - psp-bank
  - payment-aggregator
evidenceLayers:
  - official
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
Money mules receive fraud proceeds from unrelated victims and quickly forward them onward across other bank accounts, wallets, or cash-outs. On its own, each UPI transaction can look like normal retail spend—the giveaway is **tight inflow-to-outflow coupling, sudden activity after dormancy, and shared infrastructure** (devices, addresses, IP/branch attributes) tying separate accounts together.

## Impact
- **Beneficiary & remitter banks:** High alert backlogs, NCRP lien/freeze coordination overhead, and regulatory scrutiny on mule onboarding.
- **Innocent sellers & community accounts:** Broad or blunt freezes lock up legitimate livelihoods when normal merchants receive a tainted scam transfer.
- **Ecosystem recovery:** Every extra hop delays inter-bank tracing and lowers funds recoverable after fraud reporting.

## Common patterns
- **Dormant-to-burst pass-through:** A low-balance or inactive account receives multiple inbound credits and immediately drains onward.
- **Shared-entity mule rings:** Separate customer accounts reuse underlying phone numbers, addresses, postal PINs, counterparties, or devices.
- **Layered cross-rail cash-out:** Inbound UPI credits rapidly scatter across linked UPI handles, cards, or ATM withdrawals.

## What to do (rules and mitigations)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Monitor new-account activity spikes, rapid velocity, beneficiary additions, and transfers to VPAs/mobile numbers linked to recorded frauds; maintain stakeholder coordination SOPs. |
| Regulatory | Commercial, Payments & Small Finance banks | Run Data Analytics/MI digital transaction monitoring and EWS frameworks; follow natural-justice due process (21-day Show Cause Notice and reasoned order) before formal fraud classification. |
| Regulatory | Banks, I4C, RBIH | Coordinate NCRP Suspect Registry intelligence with RBIH `MuleHunter.AI`; RBI's Apr 2026 discussion paper also consults on monitoring credits against KYC profile (non-binding). |
| Research & academic | Risk & ML teams | On the Indian RBIH NFPC dataset (~237.8M txns across 96,091 accounts), GBDTs (`XGBoost`/`LightGBM`) achieved 96–99% precision for tiny daily queues (`k=100`), whereas temporal heterogeneous GNNs outperformed GBDTs at deeper queues (`k=500`) by capturing 2-to-4-hop shared counterparties, addresses, and PINs. |
| Research & academic | Investigation teams | An OCBC Singapore study combined 280 account features, LightGBM, TreeSHAP, and constrained LLM case narratives to lift investigator alert yield from 61% to 89% (non-India AML comparison; dataset limits apply). |
| Atlas guidance | Banks, PAs | Score inflow/outflow ratio, onward-debit latency, fan-in/fan-out diversity, and shared device/address attributes; isolate only contested funds where permitted instead of freezing entire livelihood accounts blindly. |

## Watch-outs and validation
- **Legitimate lookalikes:** Community or housing-society collections, micro-merchants/kiranas, gig-worker payouts, and innocent sellers who unwittingly accepted payment from a scam victim.
- **Positive-unlabelled feedback trap:** Treating every uninvestigated account as "confirmed clean" teaches models to treat undetected mule rings as normal behavior.
- **Signals needed:** KYC profile/account age, credit-debit latency pairs, anonymized counterparty graph edges, shared contact/address indicators, NCRP Suspect Registry hits, and investigator dispositions.
- **How to validate:** Enforce strict per-account time cutoffs (`τ(v) <= t_seed`) to stop future label leakage, evaluate `precision@k` at your real daily analyst queue size, and audit overturned freezes separately from confirmed fraud.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` — fraud-linked monitoring parameters (`§53`) and stakeholder coordination SOPs (`§56`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
2. RBI, [Commercial Banks – Fraud Risk Management Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13641) (Jul 2026) — digital analytics/MI (`§25`), EWS/RFA (`§12`), and 21-day Show Cause Notice + reasoned order (`§6`), accessed Nov 23, 2026 (parallel `id=13623` PBs, `id=13632` SFBs).
3. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) (Apr 9, 2026; non-binding consultation) — NCRP SOP, `MuleHunter.AI` context (`§§viii–ix`), and KYC-commensurate credit monitoring (`Option 3`), accessed Nov 23, 2026.
4. PIB / Government of India, [I4C and RBIH MoU on MuleHunter.AI](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260277&reg=3&lang=2) — confirms Suspect Registry data-sharing MoU, accessed Nov 23, 2026.
5. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (`§§1, 5, 7.2, 8`) — Indian NFPC benchmark & PU-bias analysis (academic research lead, not a ready-to-use bank threshold), accessed Nov 23, 2026.
6. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1` — non-India AML explainability study, accessed Nov 23, 2026.

**Review status:** RBI, PIB, and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
