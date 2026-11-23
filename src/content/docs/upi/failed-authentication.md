---
title: Repeated failed authentication attempts
description: UPI-011 — detecting credential stuffing, wrong-PIN probing, lockouts, and customer alerts.
---

**ID:** UPI-011 · **Type:** Detective & preventive control · **Lifecycle:** Authentication, authorization, monitoring · **Status:** Source-checked draft (independent review pending)

## Risk mechanism and operational gap
Repeated failed logins or incorrect UPI PIN / OTP attempts can signal brute-force guessing, stolen device testing, automated credential stuffing, or a victim hesitating/mistyping under scammer coercion. Conversely, benign connectivity drops or user typos also generate declines—so undifferentiated lockouts degrade customer trust unless paired with accurate failure-reason telemetry and safe recovery flows.

## Layer 1 — Official regulatory requirements
- **Bank lockout, alerts, and monitoring (`Digital Payment Security Controls Directions, 2026`):** Under `id=13642` (Commercial Banks, parallel `id=13624` Payments Banks and `id=13633` Small Finance Banks):
  - `§50` requires the bank to set a **maximum number of failed login or authentication attempts** after which access to the digital payment product/service is blocked. [1][2][3]
  - `§51` mandates a secure procedure to re-activate blocked access and requires **notifying the customer** of failed login or authentication attempts. [1][2][3]
  - `§52` requires mechanisms to alert customers upon failed authentication attempts alongside documented suspicious-behavior rules. [1][2][3]
  - `§53` lists **declined transactions** and credential-attack strings (e.g., string of invalid CVV/PINs) among parameters for fraud alert monitoring. [1][2][3]
- **Non-bank PSOs (`RBI/DPSS/2026-27/475`, Nov 5, 2026):**
  - `§28` requires facilitating online alerts across participants based on parameters including **failed transactions**. [4]
  - `§31(e)` mandates setting maximum failed mobile-app login/authentication attempts before blocking access, notifying customers, and maintaining a secure reactivation flow (effective immediately for Large/Medium non-bank PSOs; Apr 1, 2028 for Small PSOs per §3). [4]

## Layer 4 — Candidate controls and data prerequisites
- **Distinguish auth failure from technical decline:** Separate wrong-PIN / invalid-OTP failures from bank-CBS timeouts, switch unavailability, or insufficient funds so technical glitches do not count toward security lockouts.
- **Velocity-scoped lockout & immediate alert:** Enforce bounded wrong-PIN/login cooldowns (`§50`, `§31(e)`), alert the customer via out-of-band SMS/email (`§51`), and feed repeated auth-failure bursts into behavioral scoring when combined with new-device or new-payee signals.
- **Data prerequisites:** normalized response/decline reason codes (`WRONG_PIN`, `TIMEOUT`, `INSUFFICIENT_FUNDS`), consecutive and windowed failure counts per account/device/IP, reactivation audit events.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Mistyped PINs by elderly or hurried users, poor cellular coverage causing retry storms, accessibility input errors, or forgotten passwords after an app reinstall. Ensure blocked customers have clear, documented reactivation paths (`§51`, `§31(e)`) rather than dead-end lockouts.
- **Validation:** Test lockout thresholds and secure reactivation in staging; verify `§51` customer alert delivery on failed attempts; track wrong-PIN lockouts vs. confirmed ATO/fraud cases.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§50–53`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026 (`§§50–53`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026 (`§§50–53`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§3, 28, 31(e)`), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
