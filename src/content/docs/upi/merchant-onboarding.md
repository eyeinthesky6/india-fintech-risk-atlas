---
title: Merchant onboarding and classification
description: UPI-012 — Payment Aggregator KYC/CDD, MCC classification, acquiring bank oversight, and transaction laundering risks.
---

**ID:** UPI-012 · **Type:** Preventive & detective control · **Lifecycle:** Onboarding, processing, monitoring · **Status:** Source-checked draft (independent review pending)

## Risk mechanism and operational gap
Merchant onboarding risk arises when shell entities, banned businesses, or mule networks obtain merchant VPAs or payment aggregation accounts—via weak identity verification, misleading business descriptions (MCC miscoding), unregistered sub-merchants ("transaction laundering" on marketplaces), or settlement diversion to unrelated third-party bank accounts.

## Layer 1 — Official regulatory requirements
- **Master Direction on Regulation of Payment Aggregator (PA), 2025 (`RBI/DPSS/2025-26/141`, Sep 15, 2025; updated Nov 11, 2026):** Applies to bank and non-bank PAs (Online, Physical, Cross-Border) and acquiring Scheduled Commercial / AD banks (`§3`):
  - **KYC / CDD & CKYCR (`§13(a)–(b)`):** PAs must conduct customer due diligence per the Master Direction on KYC—retrieving CKYCR records with consent, or otherwise verifying PAN, conducting **Contact Point Verification (CPV)** of physical business address, and obtaining an OVD/equivalent e-document. (Existing merchants onboarded up to Dec 31, 2025 had a 1-year transition under `§13(j)`). [1]
  - **Background & antecedent checks (`§13(c)`):** PAs must undertake merchant background and antecedent checks (and baseline security assessments under `Annexure-1 §1.4`). [1]
  - **MCC, MID, TID & accurate merchant name (`§13(e)`):** PAs must facilitate allotment of appropriate **Merchant Category Code (MCC)**, Merchant ID, and Terminal ID, and capture the merchant's name accurately. [1]
  - **No un-onboarded marketplace sellers (`§13(f)`):** Marketplaces onboarded by a PA must not accept payments for sellers not onboarded onto the marketplace. [1]
  - **Settlement account validation & ongoing monitoring (`§13(g)–(i)`):** PAs must validate that funds are credited only to the **merchant's own bank account**, monitor merchant transactions on an ongoing basis against declared business profile, and (for non-bank PAs) register with **FIU-IND**. [1]
  - **Acquiring bank policy oversight (`§14`):** Even when a non-bank PA conducts merchant CDD, the acquiring bank must enforce its merchant-acquiring policy and retain ability to obtain merchant details. [1]
- **High-risk MCC & merchant-name transparency (`Digital Payment Security Controls, 2026`):** Under `id=13642` (Commercial Banks, parallel `id=13624` PBs and `id=13633` SFBs), `§47` requires customer alerts/OTPs for online transactions to identify the merchant name rather than only the PA, and `§53` lists **high-risk MCC parameters** among transaction-monitoring triggers. [2]
- *(Note: NPCI scheme-level VPA/merchant onboarding circulars could not be inspected directly because `npci.org.in` returned `HTTP 403 Forbidden` on 2026-11-23.)*

## Layer 4 — Candidate controls and data prerequisites
- **Pre-activation verification:** Cross-check declared business category against website/app/physical CPV, PAN/GST records, and bank-account penny-drop/beneficial-owner match (`§13(g)`) before enabling live UPI P2M acceptance.
- **Post-onboarding drift & laundering checks:** Monitor sudden ticket-size jumps, off-hours spikes, refund/chargeback surges, or URL/IP mismatches relative to assigned MCC (`§13(h)`).
- **Data prerequisites:** KYC/CKYCR/PAN/CPV verification records, assigned MCC/MID/TID, verified settlement bank account hash, transaction ticket-size distribution, dispute/chargeback rate, website/app domain telemetry.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Seasonal retailers (festive/wedding surges), newly registered D2C startups scaling quickly, and multi-line businesses adding valid product categories. Unexplained onboarding rejections or sudden payout holds can cripple legitimate SMBs.
- **Validation:** Audit sample of onboarded merchants for MCC accuracy and CPV completeness; test payout-account mismatch blocks; monitor ongoing transaction-profile drift alerts vs. confirmed laundering/fraud exits.

## References and review history
1. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141`, Sep 15, 2025, updated Nov 11, 2026 (`§§3, 13–14, Annexure-1 §1.4`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§47, 53`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
