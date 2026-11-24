---
title: UPI risk and payment-rail glossary
description: Core terms, participant roles, regulatory concepts, and operational distinctions across India's UPI ecosystem.
---

Definitions below reflect verified RBI regulatory terminology (where cited) and standard engineering definitions used across the Atlas.

## Ecosystem participants

- **NPCI (National Payments Corporation of India):** Scheme operator and switch for UPI; classified as a large non-bank Payment System Operator (PSO) under RBI's non-bank PSO cyber-resilience directions (`RBI/DPSS/2026-27/475`, footnote 1).
- **Remitter (Issuer) Bank:** The bank holding the payer's account from which funds are debited. Bears primary responsibility for authentication (`RBI/2025-26/79 §9`), customer transaction alerts, and customer fraud complaints.
- **Beneficiary Bank:** The bank holding the recipient's account to which funds are credited. Critical in detecting mule-account inflows (`MuleHunter.AI`) and executing `T+1` auto-reversals when unable to credit P2P transfers (`RBI/2019-20/67`).
- **Acquiring Bank:** The bank acquiring a merchant to accept digital payments, responsible for merchant policy oversight even when a merchant is onboarded via a non-bank PA (`RBI/DPSS/2025-26/141 §14`).
- **PSP (Payment Service Provider) Bank:** A bank integrated with NPCI that connects customers or TPAPs to the UPI switch and manages VPA mapping/routing.
- **TPAP (Third-Party Application Provider):** A non-bank app interface (e.g., consumer UPI apps) operating on UPI through one or more sponsor PSP banks. Covered by RBI ODR in-app grievance rules (`RBI/2020-21/21 Annex §5.2`) and NPCI's mobile security framework (see provisional mirror `NPCI/2025-26/IS/003`).
- **Payment Aggregator (PA) vs. Payment Gateway (PG):** Under `RBI/DPSS/2025-26/141 §4(i)–(j)`, a **PA** aggregates customer funds (escrow-regulated) for merchants (`PA-Online`, `PA-Physical`, `PA-Cross Border`) and performs merchant KYC/CDD and ongoing profile monitoring (`§13`); a **PG** routes payment technology without handling funds and is outside direct PA authorisation though encouraged to follow baseline security standards (`§10(g)`).

## Payment initiation & addressing

- **VPA (Virtual Payment Address):** A human-readable identifier (e.g., `name@bank`) mapped by a PSP to an underlying bank account.
- **MCC (Merchant Category Code):** A classification code assigned to onboarded merchants (`RBI/DPSS/2025-26/141 §13(e)`). High-risk MCC shifts and anomalous activity vs. declared MCC are monitoring parameters in RBI digital payment security controls (`RBI/DoS/2026-27/411 §53`).
- **UPI Intent vs. Signed Intent:** App-to-app deep-link handoff on a user's mobile device launching a UPI app with pre-filled payment parameters. **Signed Intent** cryptographically signs the payload to prevent client-side tampering of payee or amount (see Razorpay engineering docs).
- **UPI Collect (P2P vs. P2M):** A pull-style request sent to a payer's VPA requiring PIN approval. Per browser-verified NPCI circular `NPCI/UPI/OC/220/2025-26`, **P2P** collect was discontinued beyond Oct 1, 2025; **P2M** merchant collect remains distinct (with mobile checkout manual-VPA restrictions noted by operators in Feb 2026).

## Fraud, AML & liability concepts

- **Authorised Push Payment (APP) Fraud:** A fraud in which a customer is socially engineered or coerced into authorizing a genuine payment instruction to a scammer's account (highlighted in RBI's April 2026 Discussion Paper `id=23810 §x` as the dominant modern digital payment fraud category).
- **Fraudulent EBT vs. Unauthorised EBT (`RBI/2026-27/167`):** For commercial banks (for transactions on or after Jan 1, 2027), `§4(15A)` defines **Fraudulent EBT** to include both third-party credential theft *and* transactions executed by a customer granting approval under coercion, deception, or duress; `§4(26B)` defines **Unauthorised EBT** as an EBT not authorised by the customer (including bank negligence or third-party breach). Contrast with `RBI/2017-18/15` (pre-Jan-2027 / Payments Banks baseline `id=13089`).
- **Money Mule (Mule Account):** A bank account (recruited knowingly, negligently, or unwittingly) used to receive, layer, split, or withdraw proceeds of fraud or cybercrime. Monitored via transaction/relational signals and intelligence sharing between I4C's NCRP Suspect Registry and RBIH's `MuleHunter.AI`.
- **EWS / RFA (Early Warning Signal / Red Flagged Account):** Under `RBI Fraud Risk Management Directions, 2026` (`id=13641`), EWS indicators trigger deeper fraud investigation; note that formal fraud classification requires natural-justice procedural safeguards (including a minimum 21-day Show Cause Notice and reasoned order under `§6`).
- **Device Binding & RASP:** Tying a mobile payment app registration cryptographically/logically to a specific physical handset and SIM (`RBI/DoS/2026-27/411 §68(6)`, `RBI/DPSS/2026-27/475 §31(c)`), paired with Runtime Application Self-Protection checks (root/jailbreak, debugging, screen-mirroring, and untrusted install detection).

## Operations, reconciliation & disputes

- **Event Deduplication vs. Business Idempotency:** Deduplication ignores repeated delivery of the same notification ID (`x-razorpay-event-id`, `x-idempotency-header`); business idempotency ensures a single underlying payment only fulfills or settles an order once even across out-of-order webhooks and API polling.
- **TAT (Turn Around Time) & Auto-Reversal:** Statutory outer limits under `RBI/2019-20/67` for failed UPI transactions (`T+1` for P2P credit failure; `T+5` for merchant confirmation timeout), carrying automatic `₹100/day` compensation beyond the deadline.
- **ODR (Online Dispute Resolution):** Rule-based automated dispute handling mandated by `RBI/2020-21/21` across PSOs, PSPs, and TPAP apps for failed transactions with unique tracking IDs.
- **Shadow Reversal:** Temporary/provisional credit issued by a bank to a victim's account upon notification of an alleged unauthorised/fraudulent transaction prior to completion of investigation (`RBI/2017-18/15 §9`; `RBI/2026-27/167 §4(25A)`).

## Navigation

- [UPI overview](/india-fintech-risk-atlas/upi/)
- [Risk-stack playbook](/india-fintech-risk-atlas/upi/risk-stack-playbook/)
- [UPI source register](/india-fintech-risk-atlas/upi/sources/)
