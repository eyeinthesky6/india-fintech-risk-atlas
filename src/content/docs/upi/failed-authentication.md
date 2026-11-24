---
title: Repeated failed authentication attempts
description: UPI-011 — detecting credential stuffing, wrong-PIN probing, lockouts, and customer alerts.
recordId: UPI-011
products:
  - upi
recordType: detective-control
theme: identity-auth
lifecycle:
  - authentication
  - authorization
  - monitoring
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
Catches brute-force PIN/OTP guessing, stolen-device probing, or a coerced victim mistyping credentials—while separating real security failures from harmless CBS timeouts or poor mobile network drops so genuine users aren't trapped in dead-end lockouts.

## Impact when missing
- **Security exposure:** Unlimited retries allow automated probing or stolen-device guessing until an account compromises.
- **Customer friction:** Treating switch timeouts or connectivity errors like wrong-PIN attacks locks legitimate users out during urgent payments.

## When it applies
- Sequential wrong UPI PIN, invalid OTP, or failed mobile-app login attempts inside a short time window.
- Failed-auth spikes paired with unfamiliar devices, new VPAs, or IP changes.
- Reactivation flows after temporary security lockouts.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Enforce a maximum limit on failed login/authentication attempts before blocking access; alert customers on failed attempts, maintain a secure reactivation process, and monitor declined transactions and invalid-PIN/credential strings as fraud parameters. |
| Regulatory | Non-bank PSOs | Enforce maximum failed login/auth attempts before locking app access, notify customers, keep a secure reactivation flow, and share participant failed-transaction alerts (Large/Medium immediate; Small Apr 1, 2028). |
| Atlas guidance | Remitter banks, PSPs, TPAPs | Separate `WRONG_PIN` / `INVALID_OTP` security errors from `TIMEOUT`, `SWITCH_DOWN`, or `INSUFFICIENT_FUNDS` technical declines so connectivity retries never count toward lockouts. |
| Atlas guidance | Remitter banks, TPAPs | Send instant out-of-band SMS/email alerts on failed auth lockouts, and escalate priority when wrong-PIN bursts coincide with new devices or unfamiliar payees. |

## Watch-outs and validation
- **Legitimate lookalikes:** Mistyped PINs by rushed or elderly users, poor mobile coverage causing user retries, accessibility input errors, or forgotten credentials right after reinstalling an app. Always provide a clear, documented reactivation path instead of a dead end.
- **Signals needed:** Normalized decline codes (`WRONG_PIN` vs `TIMEOUT` vs `INSUFFICIENT_FUNDS`), consecutive/windowed failure counts per account, device, and IP, and reactivation audit logs.
- **How to validate:** Test lockout counters and reactivation flows in QA staging, confirm customer alert delivery on failed attempts, and track wrong-PIN lockouts against confirmed ATO/fraud incidents.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — failed-attempt lockout, reactivation & alerts, monitoring (`§§50–53`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (updated Oct 1, 2026; `§§50–53`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (updated Oct 1, 2026; `§§50–53`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; `§§3, 28, 31(e)`), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
