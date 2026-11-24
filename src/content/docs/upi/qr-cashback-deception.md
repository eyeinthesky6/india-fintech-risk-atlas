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
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
Fraudsters share QR codes or payment links promising cashbacks, refunds, prizes, or advance payments. Scanning the QR or tapping the link pre-fills an **outgoing payment** to an attacker-controlled VPA or merchant, so victims who enter their UPI PIN thinking they are "claiming" money authorize a debit instead. In a technical variant, attackers alter unsigned UPI deep-link parameters (`pa`, `pn`, `am`) to swap the payee or amount.

## Impact
- **Customer:** Instant unauthorized-looking loss even though the victim entered their PIN, creating complex dispute cases.
- **Bank & PSP:** Repeat scam complaints against newly spun-up or compromised payee VPAs and unsigned merchant links.
- **Merchant & App:** Tampered deep links erode checkout trust when payment amounts or displayed names diverge from orders.

## Common patterns
- **Fake cashback or reward QR:** Scammer sends a QR or link claiming cashback/prize credit upon UPI PIN entry.
- **Test-transfer doubling trick:** Fraudster blames a "system error" or "wrong account", asking for a small initial payment followed by larger transfers to unlock returns.
- **Tampered payment link:** Attackers rewrite payee address (`pa`) or amount (`am`) fields inside unsigned `upi://pay` links during checkout handoff.

## What to do (rules and mitigations)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Banks, NPCI ecosystem | Warn payers clearly that scanning a QR code and entering a UPI PIN is always for paying, never receiving money; show actual merchant names (not only intermediary aggregator names) on online transaction alerts and OTPs. |
| Regulatory | Commercial banks | Classify deception-induced approvals as fraudulent transactions (effective Jan 1, 2027), and record clear, directed scam warnings shown before confirmation. |
| Industry practice | PAs, Merchants, Apps | Digitally sign UPI payment links (`Signed Intent`) before app handoff so payee VPA and amount cannot be mutated mid-flow. |
| Research & academic | Risk engineering teams | Empirical GPay India study reports >88% recall when scoring initiation mode (`qr_scan`, `app_intent`, `payment_request`), memo text, payee history, and spam flags—but ~30% precision on evaluated splits makes hard auto-blocks too noisy without step-up or analyst review. |
| Atlas guidance | TPAPs, PSPs | Verify Signed Intent / Dynamic QR payloads server-side; surface prominent warnings when gallery-imported QR images or external links pay a new or previously reported VPA. |

## Watch-outs and validation
- **Legitimate lookalikes:** Genuine merchant cashback campaigns, dynamic POS QR checkouts, gallery-saved utility/kirana QR screenshots, and peer reimbursements.
- **Signals needed:** Initiation mode (`camera_qr`, `gallery_qr`, `external_intent`, `signed_intent`), payee VPA/MID/MCC, payee scam/spam report history, and payer-payee prior history.
- **How to validate:** Test rejection of unsigned or mutated `upi://pay` deep links in QA; measure user warning comprehension and false-positive drop-off on legitimate gallery QR retail payments before tightening friction.

## References and review history
1. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) (*Fake Cash back links* and *QR Codes* under *Fraud Trends against which users should be vigilant*), browser-checked Nov 23, 2026.
2. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) (Apr 9, 2026; non-binding consultation) — identifies social-engineering user manipulation as primary digital payment fraud driver (`§§iii, x`), accessed Nov 23, 2026.
3. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` — merchant name visibility in online transaction alerts/OTPs (`§47`) and VPA/mobile-number monitoring parameters (`§53`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (Jun 24, 2026; effective Jan 1, 2027 for commercial banks excluding SFBs/PBs/RRBs/LABs) — `§§4(15A), 4(20C)(iii)`, accessed Nov 23, 2026.
5. Razorpay, [UPI Intent vs Collect: Which Flow Actually Works Better in 2026?](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/) (Apr 9, 2026) — company-reported guide documenting `Signed Intent` payload verification, accessed Nov 23, 2026.
6. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1` — empirical GPay India study (dataset/evaluation constraints prevent treating metrics as universal bank thresholds), accessed Nov 23, 2026.

**Review status:** NPCI Fraud Awareness, RBI, Razorpay, and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
