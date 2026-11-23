---
title: Account takeover and device-binding risk
description: UPI-003 — unauthorized account/device compromise, SIM/device binding, and post-change cooling periods.
recordId: UPI-003
products:
  - UPI
recordType: fraud-pattern
recordTypeLabel: Fraud pattern
theme: identity-auth
themeLabel: Identity, access & authentication
lifecycle:
  - onboarding
  - authentication
  - authorization
actors:
  - Payer
  - TPAP
  - PSP bank
  - Remitter bank
evidenceLayers:
  - official
  - industry
  - research
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
Account takeover (ATO) occurs when an attacker gains control of a customer's SIM/mobile number, UPI app registration, or credentials—through SIM swap, reassigned/revoked mobile numbers, malware, or social-engineered binding—to execute unauthorized transfers.

Operational gaps emerge when device/SIM re-registration lacks binding verification, when contact-detail updates permit immediate high-value transfers, or when downstream payment authorization ignores sudden device, IP, or channel shifts.

## Layer 1 — Official regulatory requirements
- **Mobile device binding & session re-auth (Banks):** Under *Digital Payment Security Controls Directions, 2026* (`id=13642` Commercial Banks, `id=13624` Payments Banks, `id=13633` Small Finance Banks), `§68(6)` mandates device binding of the mobile app using a combination of hardware, software, and service information (with defined controls if multiple devices are permitted); `§68(8)` requires re-authentication after designated inactivity and at every app launch; `§68(2)(iv)` requires detecting remote-access apps and prohibiting login access; and `§53` cites first-time mobile/internet channel usage, IP anomalies, geo-location, and behavioral biometrics among monitorable alert parameters. [1][2][3]
- **SIM/device binding & 12-hour cooling period (Non-bank PSOs):** Under *Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs* (`RBI/DPSS/2026-27/475`, Nov 5, 2026; Large/Medium effective immediately, Small effective Apr 1, 2028 per §3), `§31(c)` mandates **device binding / fingerprinting** tied to **both the device and SIM** (and re-binding after prolonged disuse), while `§31(g)` requires a **minimum 12-hour cooling period** before allowing online payment transactions after any change in registered mobile number or email ID. [4]
- **MNRL & ATO vs. APP trend (RBI Discussion Paper):** RBI's *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (Apr 9, 2026; non-binding) notes RBI directions to use the **Mobile Number Revocation List (MNRL)** on DoT's Digital Intelligence Platform (DIP) (`§vii`) and observes that while bank controls have made technical ATO frauds relatively small, Authorised Push Payment (APP) manipulation now dominates (`§x`). [5]

## Layer 4 — Candidate controls and data prerequisites
- **Multi-signal device/SIM binding & MNRL hygiene:** Bind app registration to hardware/SIM tokens (`§68(6)`, `§31(c)`), enforce cooling periods on mobile/email/device changes (`§31(g)`), and screen linked mobile numbers against MNRL updates to flag disconnected or reassigned MSISDNs.
- **Context-aware step-up & alerts:** Trigger out-of-band alerts on new device linkages (`id=13642 §46`) and step up verification when a newly bound device initiates immediate high-value or first-time-channel transfers.
- **Data prerequisites:** device fingerprint, SIM/IMSI change signals, MSISDN/email update timestamps, IP/ASN & coarse geolocation consistency, active remote-access/emulator flags, authentication success/failure logs.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Phone upgrades, lost-phone replacement SIMs, dual-SIM handsets, carrier roaming, OS updates altering device attributes, and VPN usage. Indiscriminate blocks after legitimate SIM swaps lock victims out during travel or emergencies; pair cooling periods with clear customer notifications and documented recovery channels.
- **Validation:** Test SIM-change + cooling-period enforcement in staging; verify alert delivery on new device linkages; track legitimate re-binding support tickets and false-block overturn rates.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§46, 53, 68(2)(iv), 68(6), 68(8)`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026, accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026, accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§3, 31(c), 31(g)`), accessed Nov 23, 2026.
5. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (`§§vii, x`; non-binding), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
