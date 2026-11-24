---
title: UPI ecosystem and participant roles
description: UPI-OVERVIEW — system architecture, participant boundaries, and asymmetric risk telemetry.
recordId: UPI-OVERVIEW
products:
  - upi
recordType: explainer
theme: overview
lifecycle:
  - onboarding
  - initiation
  - authentication
  - authorization
  - processing
  - monitoring
  - settlement
  - reconciliation
  - dispute
  - recovery
  - servicing
actors:
  - npci
  - remitter-bank
  - beneficiary-bank
  - psp-bank
  - tpap
  - payment-aggregator
  - merchant
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it covers
Unified Payments Interface (UPI) runs across separate banks, TPAP apps, Payment Aggregators, and NPCI rather than inside a single institution. Authentication, fraud monitoring, merchant onboarding, settlement reconciliation, and dispute resolution are split—each participant sees only its own slice of customer, device, and payment telemetry.

## Participant roles at a glance

| Participant | Telemetry typically visible | Blind spots | Core control ownership |
|---|---|---|---|
| **Remitter (Issuer) Bank** | Account tenure, historical outflows, PIN/auth checks, SMS alert replies | Third-party TPAP UI screens, client-side screen sharing | Authentication, outbound velocity/EFRM, customer liability, NCRP coordination |
| **Beneficiary Bank** | Payee KYC, credit inflows, onward fan-out / ATM cash-outs, shared branch/address ties | Payer's pre-payment social-engineering context | Mule-funnel detection (`MuleHunter.AI`), inflow alerts, `T+1` failed-credit reversals |
| **PSP Bank / TPAP** | VPA mapping, device/SIM binding, runtime/screen-share checks, intent metadata | Customer balance/income across unlinked banks | Mobile app security/audits, debit-direction UX clarity, in-app ODR initiation |
| **Acquiring Bank / PA** | Merchant KYC/CPV, MCC, checkout volume, chargebacks, webhook status | Payer's handset security or phone-call coercion | Merchant CDD/MCC vetting, profile-drift monitoring, escrow/dispute flows |

## Key obligations and boundaries

| Basis | Owner | Rule / operational boundary |
|---|---|---|
| Regulatory | NPCI & Non-bank PSOs | NPCI is regulated as a Large non-bank PSO (effective Nov 5, 2026; Small PSOs effective Apr 1, 2028); risk with unregulated ecosystem links is governed via agreements rather than identical bank mandates. Under NPCI scheme rules, NPCI frames operating, settlement, and dispute cutoffs while approving banks and TPAPs. |
| Regulatory | Commercial, PB & Small Finance banks | Banks follow separate entity-scoped RBI Digital Payment Security Controls covering MFA, EFRM alert parameters, 24-hour settlement reconciliation, and mobile app binding. |
| Regulatory | Domestic Payment Providers & Participants | RBI's 2025 Authentication Directions apply across domestic payment providers/participants (with explicit recurring e-mandate and Tap-and-Pay UPI exemptions), placing compliance responsibility on issuers. |
| Regulatory | PSP Banks & UPI Apps (TPAPs) | Under NPCI role rules, **PSP Banks** connect TPAP apps/merchants, onboard/link accounts, enforce app security audits, keep UPI transaction data exclusively in India, and handle grievances; **TPAPs** operate through sponsor PSP banks and must offer in-app ODR dispute lodging. |
| Regulatory | Payment Aggregators & Acquiring Banks | RBI's PA Master Direction assigns merchant KYC/CDD, MCC accuracy, profile monitoring, and escrow governance to PAs while keeping acquiring banks responsible for policy oversight. |
| Atlas guidance | Product & risk architects | Map every fraud or recon rule explicitly to its owning institution, required signals, and cross-entity handoff SLA so checks don't silently fall between TPAP and bank boundaries. |

## Watch-outs
- **Double-blocking & blind spots:** Uncoordinated heuristics across TPAPs, issuer banks, and beneficiary banks can stack conflicting friction or prolong erroneous freezes with unclear unblocking ownership.
- **No single-entity rulebooks:** Never assume a bank obligation applies identically to a TPAP or Small PSO without verifying entity class and effective dates.

## References and review history
1. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; `§§3–5`, footnote 1 — Large/Medium immediate, Small Apr 1, 2028), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (`Ch. I §3`, updated Oct 1, 2026 — excludes SFBs/PBs/LABs), accessed Nov 23, 2026.
3. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (`Ch. I §3`, updated Oct 1, 2026), accessed Nov 23, 2026.
4. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (`Ch. I §3`, updated Oct 1, 2026), accessed Nov 23, 2026.
5. RBI, [Authentication Mechanisms for Digital Payment Transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0), `RBI/2025-26/79` (Sep 25, 2025; `§§3–4, §9`, `Annexure-1`), accessed Nov 23, 2026.
6. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141` (updated Nov 11, 2026; `§§3, 13–14, 16–18`), accessed Nov 23, 2026.
7. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21` (Aug 6, 2020; `Annex §§1.1, 5.2`), accessed Nov 23, 2026.
8. NPCI, [UPI Overview](https://www.npci.org.in/product/upi) & [About UPI](https://www.npci.org.in/product/upi/about-upi) — scheme participants, browser-checked Nov 23, 2026.
9. NPCI, [UPI Roles and Responsibilities](https://www.npci.org.in/product/upi/roles-responsibilities) (NPCI, PSP Bank, and UPI App role split, data localization in India), browser-checked Nov 23, 2026.
10. NPCI, [UPI FAQs](https://www.npci.org.in/faqs/upi) (`upihelp.npci.org.in` grievance guidance across participants), browser-checked Nov 23, 2026.

**Review status:** RBI entity boundaries and browser-accessible NPCI scheme sources checked 2026-11-23; independent reviewer: `PENDING`.
