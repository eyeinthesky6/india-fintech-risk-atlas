---
title: UPI ecosystem and participant roles
description: UPI-OVERVIEW — system architecture, participant boundaries, and asymmetric risk telemetry.
---

**ID:** UPI-OVERVIEW · **Type:** System explainer · **Lifecycle:** All stages · **Status:** Research draft (`npci.org.in` HTTP 403 blocker; independent review pending)

## At a glance
Unified Payments Interface (UPI) is an interoperable instant payment rail operated by NPCI across multiple regulated and contractual entities. Risk monitoring, authentication, merchant due diligence, reconciliation, and dispute handling do not sit in one place: each participant sees a different slice of transaction, device, and customer telemetry.

## Layer 1 — Official regulatory and scheme framework
RBI regulations allocate distinct statutory duties across entity classes rather than treating all UPI participants identically:

- **NPCI & Non-bank PSOs:** Under *Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank Payment System Operators* (`RBI/DPSS/2026-27/475`, Nov 5, 2026), NPCI is categorized as a large non-bank PSO (footnote 1, effective immediately upon publication; small non-bank PSOs effective Apr 1, 2028 per §3). Section 5 governs risk management across linkages with unregulated ecosystem entities through mutual agreements, not direct statutory equivalence. [1]
- **Commercial Banks, Payments Banks & Small Finance Banks:** Governed separately by entity-scoped *Digital Payment Security Controls Directions, 2026* (`id=13642` for commercial banks excluding SFBs/PBs/LABs; `id=13624` for payments banks; `id=13633` for small finance banks), covering authentication (§§42–51), fraud risk management (§§52–57), and mobile application controls (§68). [2][3][4]
- **Authentication across participants:** *Authentication Mechanisms for Digital Payment Transactions Directions, 2025* (`RBI/2025-26/79`, compliance by Apr 1, 2026) applies across domestic Payment System Providers and Participants (§4), placing issuer-side responsibility under §9. [5]
- **Payment Aggregators & Acquiring Banks:** *Master Direction on Regulation of Payment Aggregator (PA)* (`RBI/DPSS/2025-26/141`, Sep 15, 2025, updated Nov 11, 2026) assigns merchant KYC/CDD, MCC allotment, ongoing profile monitoring, and escrow governance to PAs (§§13, 16–18), while requiring acquiring banks to enforce merchant-acquiring policy oversight (§14). [6]
- **Dispute & ODR channels:** *Online Dispute Resolution (ODR) System for Digital Payments* (`RBI/2020-21/21`, Aug 6, 2020) applies to PSOs, PSPs, and requires TPAPs to provide in-app failed-transaction dispute lodging (Annex §5.2). [7]
- **NPCI scheme pages (blocked):** Direct verification of `npci.org.in` *UPI Product Overview* and *UPI FAQs* was blocked by `HTTP 403 Forbidden` on 2026-11-23; scheme-rule specifics beyond RBI texts await authorized browser verification. [8]

## Layer 4 — Operational gaps across actor boundaries

| Participant | Telemetry typically visible | Operational blind spots | Primary control ownership |
|---|---|---|---|
| **Remitter (Issuer) Bank** | Account tenure, historical balance/outflows, PIN/auth status, SMS/alert responses | Client app UI warnings, installed rogue apps on third-party TPAPs | Authentication, outbound velocity/EFRM, customer liability & NCRP coordination |
| **Beneficiary Bank** | Payee KYC, credit inflows, onward fan-out / ATM cash-out, shared address/branch links | Payer's social-engineering context prior to transfer | Mule-account detection (`MuleHunter.AI`), inflow anomaly alerts, `T+1` failed-credit auto-reversals |
| **PSP Bank / TPAP** | VPA mapping, device/SIM binding, session/screen-mirroring telemetry, payment memo/intent | Full core-banking balance/income history across non-linked banks | Mobile app RASP, intent/payee UX clarity, in-app ODR initiation |
| **Acquiring Bank / PA** | Merchant onboarding KYC/CPV, MCC, order volume, chargebacks, webhook delivery | Payer's device security or pre-checkout scam coercion | Merchant CDD/MCC vetting, transaction profile monitoring, settlement/dispute workflows |

## False positives, customer impact, and validation
- **Friction & double-blocking:** Uncoordinated rules across TPAP, remitter bank, and beneficiary bank can repeatedly block legitimate customers or impose prolonged account freezes without clear ownership of unblocking.
- **Validation:** Map every fraud or reconciliation control to its specific owning entity, data prerequisites, and cross-entity escalation SLA before deployment.

## References and review history
1. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (§§3–5, footnote 1), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (Ch. I §3), accessed Nov 23, 2026.
3. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026 (Ch. I §3), accessed Nov 23, 2026.
4. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026 (Ch. I §3), accessed Nov 23, 2026.
5. RBI, [Authentication Mechanisms for Digital Payment Transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0), `RBI/2025-26/79`, Sep 25, 2025 (§§3–4, §9), accessed Nov 23, 2026.
6. RBI, [Master Direction on Regulation of Payment Aggregator (PA)](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896), `RBI/DPSS/2025-26/141`, updated Nov 11, 2026 (§§3, 13–14, 16–18), accessed Nov 23, 2026.
7. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21`, Aug 6, 2020 (Annex §§1.1, 5.2), accessed Nov 23, 2026.
8. NPCI, [UPI Product Overview](https://www.npci.org.in/what-we-do/upi/product-overview) & [UPI FAQs](https://www.npci.org.in/what-we-do/upi/faqs) — **HTTP 403 Forbidden** on Nov 23, 2026 (direct verification pending).

**Review status:** RBI entity boundaries source-checked 2026-11-23; `npci.org.in` pages blocked (`HTTP 403`); independent reviewer: `PENDING`.
