---
title: Merchant onboarding and classification
description: UPI-012 — Payment Aggregator KYC/CDD, MCC classification, acquiring bank oversight, and transaction laundering risks.
recordId: UPI-012
products:
  - upi
recordType: preventive-control
theme: monitoring-mules-merchants
lifecycle:
  - onboarding
  - processing
  - monitoring
actors:
  - payment-aggregator
  - beneficiary-bank
  - psp-bank
  - merchant
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Stops shell businesses, banned merchants, and mule networks from acquiring P2M UPI handles through weak identity checks, misstated business descriptions (MCC miscoding), unregistered marketplace sub-merchants ("transaction laundering"), or settlement routing into unrelated third-party accounts.

## Impact when missing
- **Ecosystem & acquirers:** Fraud proceeds flow through misclassified merchant VPAs while regulators and acquiring banks hold ultimate oversight liability.
- **Customers:** Payers see confusing intermediary PA names instead of who they actually paid, aiding checkout deception and dispute delays.

## When it applies
- Onboarding any online, physical, or cross-border merchant via a Payment Aggregator (PA) or PSP bank.
- Onboarded marketplaces hosting third-party sellers or sub-merchants.
- Ongoing post-activation monitoring when live transaction size, volume, or domain diverges from the declared business profile.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Bank & non-bank PAs, Acquiring banks | Perform full KYC/CDD (CKYCR with consent, or PAN + physical Contact Point Verification + OVD/e-document), run background/antecedent & security checks, assign accurate MCC/MID/TID/name, forbid payments for un-onboarded marketplace sellers, settle only into the merchant's own verified bank account, monitor ongoing profile drift, and (for non-bank PAs) register with FIU-IND. Acquiring banks must enforce policy oversight even when PAs execute CDD. |
| Regulatory | Commercial, Payments & Small Finance banks | Display the actual merchant name (not only the intermediary PA) on customer alerts/OTPs for online payments, and include high-risk MCCs in transaction monitoring parameters. |
| Atlas guidance | PAs, PSP banks, Acquirers | Verify business category against live app/website/CPV evidence and confirm bank account ownership match before enabling live UPI acceptance. |
| Atlas guidance | PA risk teams | Alert on ticket-size jumps, odd-hour bursts, domain/IP changes, or refund spikes relative to the assigned MCC so transaction laundering is caught early. |

## Watch-outs and validation
- **Legitimate lookalikes:** Seasonal retailers during festive/wedding peaks, fast-growing D2C startups, and multi-line businesses legitimately adding categories. Sudden unexplained onboarding rejections or payout holds harm genuine SMBs—pair profile alerts with fast merchant verification outreach.
- **Signals needed:** KYC/CKYCR/PAN/CPV verification state, assigned MCC/MID/TID, verified settlement bank account match, live domain/app telemetry, ticket-size distribution, and dispute rates.
- **How to validate:** Sample-audit onboarded merchants for CPV and MCC accuracy, run negative tests on mismatched settlement accounts, and compare profile-drift alert yield against confirmed laundering exits.

## References and review history
1. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141` (Sep 15, 2025; updated Nov 11, 2026) — PA scope (`§3`), KYC/CPV/background checks/MCC/marketplaces/settlement account/FIU-IND (`§13(a)–(i)`, `§13(j)` transition, `Annexure-1 §1.4`), and acquiring bank oversight (`§14`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — merchant name on alerts (`§47`) and high-risk MCC monitoring (`§53`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).

**Review status:** RBI primary sources checked 2026-11-23 (`npci.org.in/product/upi/roles-responsibilities` confirms PSP banks onboard merchants; no separate public NPCI merchant-onboarding circular found on `/circulars/upi`); independent reviewer: `PENDING`.
