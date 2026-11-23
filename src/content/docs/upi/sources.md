---
title: UPI source register
description: Verified RBI regulatory texts, NPCI circular status, and research references for UPI risk controls.
---

These sources anchor the **Layer 1 (Official)** and **Layer 3 (Research)** citations across the UPI section. A citation supports only the specific scope, entity class, effective date, and provision verified in the document—never blanket requirements across unrelated participants.

## Directly inspected RBI and government primary sources (checked 2026-11-23)

| Document | Reference & date | Entity scope & effective status | Key provisions referenced |
|---|---|---|---|
| [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642) | `RBI/DoS/2026-27/411` (Jul 31, 2026; updated Oct 1, 2026) | Commercial banks excluding SFBs, PBs, LABs (`Ch. I §3`); in force | Authentication & failed attempts (`§§42–51`); EFRM monitoring parameters, fraud analysis, staff training (`§§52–56`); 24h reconciliation (`§57`); awareness, ODR, flag-as-fraud (`§§58–66`); mobile app controls & device binding (`§68`) |
| [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624) | `RBI/DoS/2026-27/429` (Jul 31, 2026; updated Oct 1, 2026) | Payments Banks (`Ch. I §3`); in force | Parallel authentication, EFRM (`§§52–57`), customer protection (`§§58–66`), mobile controls (`§68`) |
| [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) | Updated Oct 1, 2026 | Small Finance Banks (`Ch. I §3`); in force | Parallel Chapter III (`§§52–57`) and Chapter V (`§68`) controls |
| [Non-bank PSOs Cyber Resilience and Digital Payment Security Controls Master Directions, 2026](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0) | `RBI/DPSS/2026-27/475` (Nov 5, 2026) | Large/Medium non-bank PSOs: immediate; Small PSOs: Apr 1, 2028 (`§3`); ecosystem links by agreement (`§5`) | 6h incident report (`§22(d)`); real-time fraud monitoring & 24x7x365 LEA/customer desk (`§27(c)–(d)`); velocity/failed-txn alerts (`§28`); mark-fraud (`§30`); SIM/device binding, remote-access block, 12h cooling period (`§31(c),(f),(g)`) |
| [Authentication Mechanisms for Digital Payment Transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0) | `RBI/2025-26/79` (Sep 25, 2025) | All domestic Payment System Providers & Participants; compliance by Apr 1, 2026 (`§3`) | Min 2 factors & dynamic factor (`§6`), risk-based checks (`§8`), issuer responsibility (`§9`), Annexure-1 exemptions |
| [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0) | `RBI/2026-27/167` (Jun 24, 2026) | Commercial banks excluding SFBs, PBs, RRBs, LABs; applies to EBTs **on or after Jan 1, 2027** (`§3(2)`) | Replaces `§§64–76` with `§§76A–76V`: defines Fraudulent EBT including coercion/duress (`4(15A)`), > ₹500 SMS alert (`§76D`), 24x7/SMS-reply + NCRP/1930 (`§76G`), bank burden of proof (`§76K`), 5-calendar-day zero liability (`§76M`), small-value compensation up to ₹50,000 (`§§76T–76U`) |
| [Payments Banks – Responsible Business Conduct Directions, 2025](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13089) | Updated Oct 1, 2026 | Payments Banks | Retains 3-working-day zero liability, 4–7 working-day limited liability, 10-working-day shadow reversal (`§§21–33`) |
| [Customer Protection – Limiting Liability in Unauthorised Electronic Banking Transactions](https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=11040) | `RBI/2017-18/15` (Jul 6, 2017) | Pre-2026/2027 baseline for SCBs, SFBs, PBs | 3-working-day / 4–7 working-day liability tiers, 10-working-day shadow reversal (`§9`), burden of proof (`§12`) |
| [Commercial Banks – Fraud Risk Management Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13641) | Jul 2026 (parallel `id=13623` PBs, `id=13632` SFBs) | Commercial Banks (`Ch. I §3`) | Natural-justice 21-day SCN before fraud classification (`§6`), EWS/RFA (`§12`), Data Analytics/MI monitoring (`§25`), FMR digital payment fraud category (`§46(10)`) |
| [Regulation of Payment Aggregator (PA) Master Direction, 2025](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12896) | `RBI/DPSS/2025-26/141` (Sep 15, 2025; updated Nov 11, 2026) | PAs (Online, Physical, Cross-Border) and acquiring SCBs/AD banks (`§3`) | Dispute management (`§8`), security/fraud controls (`§9`), merchant CDD/CKYCR/PAN/CPV/background check/MCC/bank validation/ongoing monitoring/FIU-IND (`§13`), acquiring bank oversight (`§14`), escrow (`§§16–18`) |
| [Harmonisation of TAT and Customer Compensation for Failed Transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0) | `RBI/2019-20/67` (Sep 20, 2019) | All domestic authorised payment systems | UPI failed P2P auto-reversal `T+1` (`₹100/day` delay penalty); UPI merchant confirmation not received `T+5` (`₹100/day` delay penalty) |
| [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0) | `RBI/2020-21/21` (Aug 6, 2020) | Authorised PSOs, PSPs, and TPAPs for mobile systems (`Annex §5.2`) | Rule-based system-driven ODR for failed transactions, unique reference tracking (`§5.4`), Ombudsman escalation after 1 month |
| [Discussion Paper: Exploring Safeguards in Digital Payments to Curb Frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) | Apr 9, 2026 | **Non-binding consultation paper** | Documents APP scam dominance; cites DoT MNRL/DIP, I4C NCRP, RBIH `MuleHunter.AI`; floats 1h lag (> ₹10,000), trusted-person approval (> ₹50,000), KYC-commensurate credits, kill switch |
| [PIB Release: I4C and RBIH MoU on MuleHunter.AI](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260277&reg=3&lang=2) | GoI / PIB | Official operational collaboration announcement | Documents I4C NCRP Suspect Registry integration with RBIH `MuleHunter.AI` |

## NPCI source access status (checked 2026-11-23)

Direct retrieval from `www.npci.org.in` (UPI FAQs, Fraud Awareness, Product Overview, Circulars index, and `UPI_Settlement_Process_256f73e1df.pdf`) returned **HTTP 403 Forbidden** during the 2026-11-23 audit pass. In line with Atlas verification rules, no `npci.org.in` page was falsely marked freshly verified.

Two third-party mirrors of NPCI circulars were visually inspected and are cited **provisionally** pending confirmation against `npci.org.in` originals:
- `NPCI/2025-26/IS/003` (*Comprehensive Mobile Application Security Framework for UPI - 2025*, May 19, 2025) — [bank mirror](https://rscb.bank.in/Content/pdf/npcicircular.pdf).
- `NPCI/UPI/OC/220/2025-26` (*Discontinuing the service of UPI Collect Request for P2P transactions*, Jul 29, 2025, effective Oct 1, 2025) — [legal update mirror](https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/45492/NPCI-issued-a-notification-regarding-the-discontinuation-of-the-service-of-UPI-Collect-Request-for-Person-to-Person-transactions-August122025.pdf).

## Open-access research references (Layer 3)

1. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1`.
2. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1`.
3. Zhang, Y. et al. / OCBC Singapore (2026), [Detection, Attribution, Narration: An End-to-End Pipeline for Explainable Money Mule Identification](https://arxiv.org/html/2607.17586v1), `arXiv:2607.17586v1` (international AML comparison).

See [full internal source register](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/release/upi-v1-freeze/research/upi/PRIMARY_SOURCE_REGISTER.md).
