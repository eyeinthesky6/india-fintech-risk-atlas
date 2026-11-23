---
title: Authentication and payment authorization
description: UPI-009 — multi-factor authentication, dynamic factors, exemptions, and issuer responsibility.
recordId: UPI-009
products:
  - UPI
recordType: preventive-control
recordTypeLabel: Preventive control
theme: identity-auth
themeLabel: Identity, access & authentication
lifecycle:
  - authentication
  - authorization
actors:
  - Payer
  - TPAP
  - PSP bank
  - Remitter bank
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
Authentication confirms that an instruction originates from the authorized user/device rather than a replay or stolen static credential. Operational gaps arise when systems accept static/reusable factors, fail to protect sessions against man-in-the-middle (MITM) interception, mask merchant identity inside OTP/alert messages, or misapply regulatory exemptions.

## Layer 1 — Official regulatory requirements
- **Authentication Mechanisms Directions, 2025 (`RBI/2025-26/79`, Sep 25, 2025; compliance by Apr 1, 2026):**
  - **Applicability (`§4`):** Applies to all Payment System Providers and Payment System Participants (banks and non-banks) for domestic digital payment transactions, unless exempted. [1]
  - **Minimum two distinct factors + dynamic factor (`§6(a)–(b)`):** Every covered transaction requires at least two distinct authentication factors; for non-card-present transactions, at least one factor must be **dynamically created or proven** (`§6(b)`), and authentication must be robust (`§6(c)`). [1]
  - **Risk-based checks & issuer responsibility (`§§8–9`):** Enables risk-based authentication adjustments and places responsibility on the issuer (`§9`). [1]
  - **Specific exemptions (`Annexure-1`):** Enumerates active exemptions from two-factor authentication, including recurring transactions (after the first) under the e-mandate framework and **Tap and Pay UPI Payment on NFC-enabled POS machines** (citing Sep 2, 2026 letter `CO.DPSS.POLC.No. S-550/02-23-001/2026-27`). Do not assume one uniform PIN flow applies across all exempted low-value/recurring rails. [1]
- **Bank Digital Payment Security Controls (`2026`):** Under `id=13642` (Commercial Banks, parallel `id=13624` PBs, `id=13633` SFBs), `§42` mandates MFA to resist phishing/keylogging/spyware; `§43` permits **adaptive authentication** aligned to user risk profile and behavior; `§46` mandates MFA and SMS/email alerts for transactions and new account linkages; `§47` requires online transaction alerts/OTPs to identify the **merchant name** rather than only the PA; `§§48–49` mandate MITM controls and session/encryption termination on interference. [2]
- **Non-bank PSOs (`RBI/DPSS/2026-27/475`):** `§29(c)` requires OTP messages (where OTP is used) to place the OTP at the end and reference the specific transaction; `§31(b)` mandates keeping mobile sessions and encryption intact. [3]

## Layer 4 — Candidate controls and data prerequisites
- **Enforce dynamic factor & MITM-resistant channel binding:** Bind UPI PIN verification and device cryptographic tokens to exact transaction amount, payee VPA/MID, and session integrity; terminate session immediately on SSL/TLS or runtime tampering (`§49`, `§31(b)`).
- **Merchant-transparent alerts & adaptive step-up:** Always display merchant legal/trade name (`§47`) and apply adaptive step-up (e.g., for unusual geo/velocity/new payee) without leaking sensitive tokens in logs or URLs.
- **Data prerequisites:** factor types used (`PIN`, `biometric`, `device_token`, `exempt_mandate/NFC`), session TLS/pinning state, merchant descriptor fields, risk-scoring decision log.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Exempted low-value NFC Tap-and-Pay UPI payments, recurring e-mandates, or legitimate adaptive step-ups triggered during cross-city travel. Overly aggressive session termination on weak mobile networks breaks checkout conversion.
- **Validation:** Verify `Annexure-1` exemption boundaries against live product flags, test SSL/TLS error handling (`§68(13)(iv)–(v)`), and inspect customer OTP/SMS templates for `§47` / `§29(c)` compliance.

## References and review history
1. RBI, [Authentication Mechanisms for Digital Payment Transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0), `RBI/2025-26/79`, Sep 25, 2025 (`§§3–4, 6, 8–9, Annexure-1`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§42–49, 68(13)`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
3. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§29(c), 31(b)`), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
