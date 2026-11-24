---
title: Untrusted app and remote-access risk
description: UPI-008 — sideloaded APKs, screen mirroring, remote-access coercion, and mobile RASP controls.
recordId: UPI-008
products:
  - upi
recordType: preventive-control
theme: identity-auth
lifecycle:
  - initiation
  - authentication
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
evidenceLayers:
  - official
  - atlas
reviewStage: draft
blockerNote: "Official npci.org.in/fraud-awareness verified via browser on 2026-11-23; NPCI/2025-26/IS/003 is not listed on public npci.org.in/circulars/upi or /circulars/others (provisional bank mirror used); independent review pending."
lastSourceCheck: "2026-11-23"
---

## What it solves
Prevents attackers from spying on UPI PIN entry, intercepting OTPs, hijacking taps via screen overlays, or tampering with mobile app binaries when victims are talked into sideloading fake APKs (disguised as KYC/reward apps) or opening live screen-sharing/remote-access tools during a payment.

## Impact when missing
- **Customer:** Fraudsters watch screen state in real time, steal SMS OTPs, or guide taps across authorization screens.
- **TPAPs & Banks:** High-severity unauthorized transfers happen from the customer's own bound handset, bypassing normal device-trust assumptions.

## When it applies
- Payments initiated while live screen-mirroring, casting, or remote-access sessions are running.
- UPI apps sideloaded outside verified official app stores, on rooted/jailbroken devices, or with active USB debugging/instrumentation hooks (e.g., Frida).
- Coercion flows combining an active voice call with screen sharing or SMS-forwarding apps.

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial, Payments & Small Finance banks | Detect remote-access apps and block login access; verify secure download/install integrity, publish official app checksums, explore root/jailbreak install blocks, and consider anti-malware defenses. |
| Regulatory | Non-bank PSOs | Block mobile payment access whenever a remote-access session is live, and subscribe to anti-phishing and rogue-app takedown monitoring services. |
| Regulatory | NPCI ecosystem guidance | Public NPCI guidance warns users against downloading unknown APKs, screen-sharing tools, or SMS-forwarding apps, and advises not transacting during active calls. *(A separate NPCI 2025 mobile app security circular cited via bank mirror—specifying store install checks, screen-mirroring/USB-debug blocks, OTP auto-read, and runtime alerts—awaits public NPCI circular listing.)* |
| Atlas guidance | TPAPs, PSPs | Terminate or block UPI payment initiation whenever live screen mirroring, active casting, or remote control is detected, showing plain-language instructions on why access paused. |
| Atlas guidance | Mobile security & engineering | Enforce app-store signature verification, root/emulator/debugger detection, and overlay defense (`FLAG_SECURE` / non-obscured touch checks) without breaking OS accessibility tools. |

## Watch-outs and validation
- **Legitimate lookalikes (accessibility warning):** Screen readers used by visually impaired customers (`TalkBack`, `VoiceOver`), developer options enabled on personal test devices, corporate MDM support, and smart-TV casting. Target **active screen projection or remote-control sessions** rather than blanket-blocking all OS accessibility flags.
- **Signals needed:** OS accessibility and screen-projection/cast states, installer-source & package-signature checks, debugger/root/emulator flags, OTP sender-ID validation, and runtime SOC alerts.
- **How to validate:** Test active screen-mirroring, USB-debug, and overlay attacks in Android/iOS labs; verify `TalkBack`/`VoiceOver` accessibility compatibility so disabled users are never locked out; audit false-positive launch block rates.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` (updated Oct 1, 2026) — secure install/checksums/remote-access login blocks (`§68(2)(ii),(iv), §68(4)–(5), §68(12)`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
2. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; Large/Medium immediate, Small Apr 1, 2028) — rogue-app takedown (`§27(h)`) and blocking payments during live remote access (`§31(f)`), accessed Nov 23, 2026.
3. NPCI circular `NPCI/2025-26/IS/003` (May 19, 2025), *Comprehensive Mobile Application Security Framework for UPI - 2025* — [provisional third-party bank mirror](https://rscb.bank.in/Content/pdf/npcicircular.pdf) (inspected pp. 1–8 covering Mandatory store/root/screen-mirror/USB-debug/OTP controls `A.1–2, B.12/14/15/23, C.1, D.1` and Recommended harmful-app/emulator/Frida/keylogger/overlay controls `A.3–4, B.19–21`; **remains provisional draft pending public `npci.org.in` listing**).
4. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) (*Downloading of unknown apps*), browser-checked Nov 23, 2026.
5. NPCI, [UPI Circulars index](https://www.npci.org.in/circulars/upi), browser-checked Nov 23, 2026 (confirmed `NPCI/2025-26/IS/003` is not listed on public `/circulars/upi` or `/circulars/others`).

**Review status:** RBI sources and `npci.org.in/fraud-awareness` checked 2026-11-23; `NPCI/2025-26/IS/003` absent from public `npci.org.in` circular indexes (provisional bank mirror used; stays `draft`); independent reviewer: `PENDING`.
