---
title: Authentication and payment authorization
description: UPI-009 — multi-factor authentication, dynamic factors, exemptions, and issuer responsibility.
recordId: UPI-009
products:
  - upi
recordType: preventive-control
theme: identity-auth
lifecycle:
  - authentication
  - authorization
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Ensures payment approvals genuinely come from the authorized customer and bound device rather than replayed credentials, stolen static passwords, or man-in-the-middle (MITM) tampering—while keeping exempted fast flows (like recurring mandates and Tap-and-Pay NFC UPI) correctly scoped.

## Impact when missing
- **Customer & Issuer:** Stolen static credentials or intercepted sessions let attackers authorize debits without clear merchant confirmation on alerts or OTPs.
- **Product teams:** Misreading RBI exemptions causes either broken checkout flows or non-compliant skip-auth bugs.

## When it applies
- Every domestic digital payment authorization unless explicitly covered by an active RBI two-factor exemption.
- High-risk sessions showing new geo, velocity, or payee changes suited for adaptive authentication.
- Mobile/web handshakes prone to TLS/session tampering.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Payment System Providers & Participants | Require at least two distinct authentication factors per transaction, including at least one dynamically generated/proven factor for non-card-present payments; recognize active exemptions (e.g., subsequent recurring e-mandates and NFC Tap-and-Pay UPI on POS). Issuers bear responsibility for compliance and may apply risk-based checks. |
| Regulatory | Commercial, Payments & Small Finance banks | Implement phishing/keylogger-resistant MFA, optional risk-based adaptive auth, SMS/email alerts for transactions and new linkages showing the actual merchant name (not only the PA), and MITM controls terminating interfered sessions. |
| Regulatory | Non-bank PSOs | Place OTP codes (where used) at the end of messages alongside the specific transaction reference, and preserve intact session security and encryption across mobile channels. |
| Regulatory | UPI apps and PSP banks offering additional authentication | NPCI OC-226 allows customers to opt into Aadhaar face authentication for PIN setup or reset, and on-device biometrics as an alternative to the PIN for payments. Check device compatibility and security, obtain explicit consent with an opt-out, and renew consent after device binding before allowing further biometric payments. <a href="#ref-4">[4]</a> |
| Regulatory | Issuer banks offering additional authentication | Verify customer eligibility and credentials before enabling biometrics or authorizing PIN setup or reset. If a UPI PIN changes or is reset, disable the biometric payment method for that account across UPI apps until fresh consent. <a href="#ref-4">[4]</a> |
| Atlas guidance | TPAPs, Remitter banks, PSPs | Cryptographically bind UPI PIN and device factor proofs to the exact amount, payee VPA/MID, and session integrity; terminate transactions immediately on TLS pinning or runtime tamper failures. |

## Watch-outs and validation
- **Legitimate lookalikes:** Exempted low-value NFC Tap-and-Pay UPI transactions, subsequent recurring e-mandate debits, and adaptive step-ups during genuine cross-city travel. Avoid dropping valid sessions solely on transient weak cellular handoffs.
- **Signals needed:** Auth factors verified (`PIN`, biometric, device token, exempt mandate/NFC), session TLS/pinning telemetry, merchant descriptor fields, and risk-based step-up audit logs.
- **How to validate:** Audit `Annexure-1` exemption flags against live product behavior, verify TLS error termination, and inspect live SMS/OTP alert templates for merchant-name display and end-placed OTP format.
- **Biometric rollout scope:** OC-226 initially capped on-device biometric payments at ₹5,000 per transaction. Check the current NPCI implementation documents and any later circulars before using that amount as a production limit. <a href="#ref-4">[4]</a>

## References and review history
1. RBI, [Authentication Mechanisms for Digital Payment Transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0), `RBI/2025-26/79` (Sep 25, 2025; compliance by Apr 1, 2026) — scope (`§4`), 2FA + dynamic factor (`§6`), risk-based & issuer responsibility (`§§8–9`), and exemptions including recurring e-mandates and Tap-and-Pay UPI (`Annexure-1`, citing Sep 2, 2026 letter `CO.DPSS.POLC.No. S-550/02-23-001/2026-27`), accessed Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — MFA, adaptive auth, merchant-name alerts, MITM termination (`§§42–49, 68(13)`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
3. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; Large/Medium immediate, Small Apr 1, 2028) — OTP formatting (`§29(c)`) and mobile session/encryption protection (`§31(b)`), accessed Nov 23, 2026.

4. <a id="ref-4"></a> NPCI, [Introduction of Additional Authentication methods in UPI](https://www.npci.org.in/uploads/UPI_OC_No_226_FY_2025_26_Introduction_of_Additional_Authentication_methods_in_UPI_42c3693399.pdf), OC-226/2025-26 (7 October 2025), pp. 1–2, §§1–2 and guidelines 1–5 and 7. Issuer PDF inspected November 25, 2026. Current rollout limits and later member-only changes still need confirmation.

**Review status:** RBI baseline checked 2026-11-23. NPCI OC-226 checked separately on 2026-11-25. Independent review remains pending.
