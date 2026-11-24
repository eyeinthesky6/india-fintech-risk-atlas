---
title: Account takeover and device-binding risk
description: UPI-003 — unauthorized account/device compromise, SIM/device binding, and post-change cooling periods.
recordId: UPI-003
products:
  - upi
recordType: fraud-pattern
theme: identity-auth
lifecycle:
  - onboarding
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

## What it is
Account takeover (ATO) happens when an attacker steals control of a customer's mobile number, SIM, UPI app login, or credentials and uses that access to drain the account. While bank device checks have reduced pure technical takeovers relative to manipulation scams, silent SIM swaps, recycled mobile numbers, and malware-based re-registration still create high-speed losses.

## Impact
- **Customer:** Rapid unauthorized transfers shortly after a SIM swap, device switch, or mobile-number change.
- **Bank & PSP:** Sudden shift from trusted-device activity to risky transfers and zero-warning dispute liability checks.
- **Legitimate users:** Overly rigid device checks after genuine phone upgrades, lost SIM replacements, or travel can lock victims out during emergencies.

## Common patterns
- **SIM swap & silent re-binding:** Attackers transfer the victim's mobile number to a new SIM and re-register UPI on an unfamiliar handset.
- **Recycled or disconnected mobile numbers:** Reassigned MSISDNs expose dormant accounts or linked VPAs if telecom revocation lists are not checked.
- **Post-change draining:** Credentials or phone numbers are updated and followed immediately by high-value or first-time-channel payouts.

## What to do (rules and mitigations)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Bind mobile apps to hardware, software, and service identifiers; require re-auth at launch and after inactivity; block access when remote-access apps are detected; monitor first-time channel, IP, geo, and behavioral anomalies. |
| Regulatory | Non-bank PSOs | Enforce binding tied to both device and SIM (with re-binding after prolonged disuse), plus a minimum 12-hour cooling period for online payments after any mobile-number or email change. |
| Atlas guidance | Banks, TPAPs, PSPs | Screen customer mobile numbers against the DoT Mobile Number Revocation List (MNRL) to catch disconnected or reassigned numbers early. |
| Atlas guidance | Banks, TPAPs | Send instant out-of-band alerts on new device linkages, and apply step-up checks when a newly bound device attempts immediate high-value transfers. |

## Watch-outs and validation
- **Legitimate lookalikes:** Phone upgrades, lost-phone replacement SIMs, dual-SIM handsets, carrier roaming, OS updates altering device fingerprints, and VPN traffic. Always provide clear alerts and documented recovery paths alongside cooling periods.
- **Signals needed:** Device fingerprint, SIM/IMSI change markers, MSISDN/email update timestamps, IP/ASN & coarse location history, remote-access/emulator flags, and auth attempt logs.
- **How to validate:** Test cooling-period enforcement in staging after SIM/contact updates, verify out-of-band delivery of new-device alerts, and track support tickets plus false-block overturn rates after OS or SIM upgrades.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — device binding (`§68(6)`), session/launch re-auth (`§68(8)`), remote-access login prohibition (`§68(2)(iv)`), anomaly monitoring (`§53`), and device/limit/PIN change alerts (`§46`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429` (updated Oct 1, 2026) — parallel bank controls, accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633) (updated Oct 1, 2026) — parallel SFB controls, accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; Large/Medium effective immediately, Small effective Apr 1, 2028 per `§3`) — device+SIM binding (`§31(c)`) and 12-hour contact-change cooling period (`§31(g)`), accessed Nov 23, 2026.
5. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) (Apr 9, 2026; non-binding consultation) — DoT MNRL usage (`§vii`) and observation that technical ATO fraud is relatively small compared to APP scams (`§x`), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
