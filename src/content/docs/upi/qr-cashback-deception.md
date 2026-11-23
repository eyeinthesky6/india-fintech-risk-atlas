---
title: QR and fake cashback deception
description: UPI-006 — social engineering via deceptive QR codes, cashback claims, and tampered payment links.
recordId: UPI-006
products:
  - upi
recordType: fraud-pattern
theme: social-engineering
lifecycle:
  - initiation
  - authorization
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
  - merchant
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: draft
blockerNote: "Direct npci.org.in pages returned HTTP 403; RBI & industry sources checked; independent review pending."
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
Fraudsters distribute QR codes or payment links promising cashbacks, refunds, lottery winnings, or marketplace advances. Scanning the QR or opening the link pre-fills an **outgoing payment** to an attacker-controlled VPA or merchant; victims who believe entering a UPI PIN "claims" funds inadvertently authorize a debit. A technical variant tampers with unsigned UPI deep-link parameters (`pa`, `pn`, `am`) to substitute a fraudster's VPA or alter the amount.

## Layer 1 — Official regulatory and scheme context
- **NPCI Fraud Awareness (blocked):** Prior project drafts referenced NPCI's public [Fraud Awareness](https://www.npci.org.in/fraud-awareness) guidance regarding fake cashback links and QR scams. Direct inspection of `npci.org.in/fraud-awareness` returned **HTTP 403 Forbidden** on 2026-11-23, so current verbatim consumer-advisory wording could not be re-verified directly in this pass. [1]
- **Authorised Push Payment deception (RBI):** RBI's *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (Apr 9, 2026; non-binding) identifies user manipulation via social engineering as the primary driver of modern digital payment frauds (§§iii, x). [2]
- **Merchant identity in customer alerts:** Under RBI's *Digital Payment Security Controls Directions, 2026* (`id=13642 §47` Commercial Banks; `id=13624 §47` Payments Banks; `id=13633 §47` SFBs), customer alerts and OTPs for online transactions must identify the **merchant name** (wherever applicable) rather than only the intermediary payment aggregator, aiding payer verification. [3]
- **Directed warnings & coercion scope:** Under `RBI/2026-27/167` (`Id=13543`, effective Jan 1, 2027 for commercial banks), `§4(15A)` includes approvals granted under deception/duress within *Fraudulent EBT*, and `§4(20C)(iii)` makes clear, directed bank scam warnings operationally consequential. [4]

## Layer 2 — Company-reported industry practices
- **Signed Intent (`company-reported`):** Razorpay documents **Signed Intent** (digitally signing the payment request payload before mobile deep-link redirection) to prevent tampering with transaction amount or payee details during app handoff. [5]

## Layer 4 — Candidate controls, data prerequisites, and research references
- **Cryptographic intent validation (PAs / merchants / TPAPs):** Prefer Signed Intent / Dynamic QR payloads verified server-side against expected order IDs and amounts; reject or warn on unsigned or tampered deep links.
- **Payee & direction clarity at scan time (TPAPs):** Display verified payee name, merchant category, and warning prompts when a gallery-imported QR image or external link targets an unverified or high-risk VPA (especially first-time payees).
- **Data prerequisites:** initiation source (`camera_qr`, `gallery_qr`, `external_intent`, `signed_intent`), payee VPA/MID/MCC, scam/spam report history on payee VPA (`id=13642 §53`), payer-payee graph novelty.

### Research paper leads (ideas for gaps, not ready-to-use rules)
- **Text & initiation-mode signals (`arXiv:2410.19845v1`):** In Google's empirical UPI scam-detection study on GPay India data, Dahiphale et al. evaluate analyzing initiation modes (`qr_scan`, `app_intent`, `payment_request`), order memo text, payer/payee history, and user spam reports—reporting >88% recall alongside ~30% precision on evaluated splits, underscoring why ambiguous signals require step-up friction or human review rather than blind auto-blocking. [6]

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Genuine merchant cashback offers, dynamic point-of-sale QR codes, gallery-saved utility/kirana QR screenshots, and peer reimbursements.
- **Validation:** Test unsigned/mutated intent link rejection in QA; measure warning comprehension and false-positive friction rates on gallery-QR retail merchants before tightening blocks.

## References and review history
1. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) — **HTTP 403 Forbidden** on Nov 23, 2026 (direct verification pending).
2. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (§§iii, x; non-binding), accessed Nov 23, 2026.
3. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (§§47, 53), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (`§§4(15A), 4(20C)(iii)`), accessed Nov 23, 2026.
5. Razorpay, [UPI Intent vs Collect: Which Flow Actually Works Better in 2026?](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/), Apr 9, 2026, accessed Nov 23, 2026 (company-reported).
6. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1`, accessed Nov 23, 2026.

**Review status:** RBI, Razorpay, and `arXiv` sources checked 2026-11-23; `npci.org.in` blocked (`HTTP 403`); independent reviewer: `PENDING`.
