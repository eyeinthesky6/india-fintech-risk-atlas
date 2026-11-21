# UPI primary-source register — first research pass

**Research date:** 2026-11-21. **Status:** source discovery and initial passage checks; not exhaustive circular-by-circular audit. This file is the working evidence register, not a blanket certification of each article.

| ID | Publisher and document | Applicability | Useful sections |
|---|---|---|---|
| RBI-2026-CBANK | [RBI Commercial Banks Digital Payment Security Controls Directions 2026](https://www.rbi.org.in/Scripts/NotificationUser.aspx/www.mastercirculars.rbi.org.in/upload/notification/pdfs/NotificationPreVersion.aspx?id=13642) | Commercial banks as defined in Chapter I; not all fintechs | Fraud risk, reconciliation, authentication and grievance chapters |
| RBI-2026-PBANK | [RBI Payments Banks Digital Payment Security Controls Directions 2026](https://www.rbi.org.in/SCRIPTS/BS_ViewMasDirections.aspx?id=13624) | Payments banks | Fraud monitoring parameters §§52–56 and reconciliation §57; recheck current version |
| RBI-2025-AUTH | [RBI Authentication mechanisms for digital payment transactions Directions 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0) | Payment system providers and participants; specified exemptions | Effective 1 April 2026 subject to exceptions |
| RBI-2026-CUST | [RBI Customer Protection in Fraudulent Electronic Banking Transactions Directions](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0) | Banks defined in the directions | Customer protection, fraud detection and complaint channels §§76A–76B |
| NPCI-FAQ | [NPCI UPI FAQs](https://www.npci.org.in/what-we-do/upi/faqs) | Scheme information; verify changing product features | Registration, authentication, merchant onboarding, complaints, status |
| NPCI-AWARE | [NPCI Fraud Awareness](https://www.npci.org.in/fraud-awareness) | Public safety education, not legal requirements | QR, cashback, fake links, impersonation, unknown apps |
| NPCI-SETTLE | [NPCI UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf) | Scheme member settlement and disputes; check current circulars | Dispute lifecycle, reconciliation, TAT subject to updates |
| RBI-2026-DISC | [RBI Discussion Paper Exploring Safeguards in Digital Payments to Curb Frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) | Discussion paper, not binding directions | Fraud safeguards and policy options |
| RBI-2017-LIAB | [RBI Limiting Liability of Customers in Unauthorised Electronic Banking Transactions](https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=11040) | Historical direction; check 2026 replacement and applicability | Historical reference only, not current default |

## Verification rules
- A source supports only claims actually contained in its cited provision; titles alone are not evidence.
- Distinguish **binding**, **official guidance**, **illustrative practice**, and **discussion paper**.
- For NPCI settlement and scheme details, verify amendments against current circulars before stating exact turnaround times.
- Never transplant bank requirements onto a TPAP, merchant, PSP, PSO or NBFC without an applicability check.
- When citing a historical circular, determine whether later consolidated directions supersede it.

## Evidence gaps
Current NPCI UPI operating circulars and dispute-specific turnaround tables need a separate currency check. Detailed participant obligations and recent product variants require individual document inspection. No universal fraud-detection thresholds are asserted.

## Primary-source cross-check — 2026-11-21

The following statements were directly checked against current public RBI/NPCI material in this research pass (not yet an independent second reviewer):

- RBI [Payments Banks Digital Payment Security Controls Directions, updated 1 Oct 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624): Chapter I §3 limits applicability to **payments banks**; Chapter III includes fraud risk management and reconciliation. Specific monitoring parameters must be rechecked against the operative paragraph before describing them as mandatory.
- RBI [Commercial Banks Digital Payment Security Controls Directions, updated 1 Oct 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642): Chapter I §3 applies to defined **commercial banks** and expressly excludes small finance banks, payments banks and local area banks from that definition.
- RBI [non-bank PSO Cyber Resilience and Digital Payment Security Controls Master Directions, 5 Nov 2026](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0): §§3–5 distinguish timing and scope. Large/medium authorised non-bank PSOs: effective on website publication; **small non-bank PSOs: effective 1 Apr 2028**. It is incorrect to claim the same immediate effective date for all non-bank PSOs.
- NPCI [Fraud Awareness](https://www.npci.org.in/fraud-awareness): lists fake cashback links, QR codes, internet search, social-media grievances and unknown apps. This supports educational descriptions, **not** a universal mandated control.
- NPCI [UPI FAQs](https://www.npci.org.in/what-we-do/upi/faqs): identifies UPI as an NPCI-developed instant payment system and explains UPI PIN use. Verify feature-specific statements against current circulars.
- NPCI [UPI Settlement Process](https://www.npci.org.in/uploads/UPI_Settlement_Process_256f73e1df.pdf): §4 describes exception/dispute transactions and expressly notes TATs may be changed by circular. Do not publish a fixed dispute TAT without a current circular check.

**Verification status:** six source-level observations checked in this pass. This does not certify the 17 articles; each material claim still needs exact locators and independent review.
