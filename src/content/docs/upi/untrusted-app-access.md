---
title: Untrusted app and remote-access risk
description: UPI-008 — sideloaded APKs, screen mirroring, remote-access coercion, and mobile RASP controls.
---

**ID:** UPI-008 · **Type:** Preventive & detective control · **Lifecycle:** Initiation, authentication · **Status:** Research draft (`npci.org.in` 403 / provisional NPCI mirror; independent review pending)

## Risk mechanism and operational gap
Fraudsters persuade customers to install unverified APKs (disguised as KYC updates, rewards, or support utilities) or to run legitimate remote-access / screen-sharing applications while performing a UPI transaction. Once active, attackers capture OTPs, observe UPI PIN entry or screen contents, overlay deceptive UI elements (tapjacking), or use device hooking/debugging frameworks to tamper with app execution.

## Layer 1 — Official regulatory and scheme context
- **Remote-access & untrusted install controls (RBI):**
  - *Digital Payment Security Controls Directions, 2026* (`id=13642` Commercial Banks, `id=13624` Payments Banks, `id=13633` SFBs) mandate **identifying remote-access applications (to the extent possible) and prohibiting login access** (`§68(2)(iv)`), secure download/install checks (`§68(2)(ii)`), publishing active app checksums (`§68(5)`), exploring root/jailbreak install blocks (`§68(4)`), and considering anti-malware capabilities (`§68(12)`). [1]
  - *Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs* (`RBI/DPSS/2026-27/475`, Nov 5, 2026) requires prohibiting mobile payment access **while remote access is live** (`§31(f)`) and subscribing to anti-phishing / anti-rogue-app takedown services (`§27(h)`). [2]
- **UPI Mobile App Security Framework (provisional NPCI mirror):** Visually inspected pages 1–8 of `NPCI/2025-26/IS/003` (*Comprehensive Mobile Application Security Framework for UPI - 2025*, May 19, 2025, via third-party bank mirror), addressed to **PSPs, ASPs, and TPAPs**, specify **Mandatory** controls including root/jailbreak and root-cloaking detection (`A.1`), official store installation validation (`A.2`), active screen-mirroring prevention (`B.23`), developer-option / USB-debug / active-USB prevention (`B.12`), SMS auto-read OTP without manual entry (`B.14`), trusted OTP sender-ID whitelisting (`B.15`), and real-time runtime threat alerts (`C.1, D.1`), plus **Recommended** controls for harmful/blacklisted apps (`A.3`), emulators (`A.4`), dynamic instrumentation like Frida (`B.19`), keyloggers (`B.20`), and screen overlays (`B.21`). *Confirm against `npci.org.in` original and any subsequent circulars once accessible.* [3]
- **NPCI Fraud Awareness (blocked):** Direct inspection of `npci.org.in/fraud-awareness` returned **HTTP 403 Forbidden** on 2026-11-23. [4]

## Layer 4 — Candidate controls and data prerequisites
- **Active-session protection:** Terminate or block UPI payment initiation whenever live screen mirroring, active screen-casting, or remote-access sessions are running (`§68(2)(iv)`, `§31(f)`), displaying plain-language guidance explaining why the block occurred.
- **Runtime integrity & SMS/overlay defense:** Enforce install-source checks, USB-debugging/emulator guards, and overlay protection (`FLAG_SECURE` / non-obscured touch filtering) so remote callers cannot silently guide or hijack taps.
- **Data prerequisites:** OS accessibility/projection/cast API state, active package-signature/installer-source check, debugger/root/emulator telemetry, OTP sender-ID metadata, runtime tamper alerts sent to PSP/TPAP SOC.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Screen-reader accessibility apps for visually impaired users, developer mode left enabled on personal test phones, corporate enterprise MDM/helpdesk tools, and casting to TVs. Blocking unconditionally based purely on accessibility services locks out disabled customers; target **active screen projection / live remote-control sessions** rather than all accessibility flags.
- **Validation:** Test active screen-mirroring, USB-debug, and overlay scenarios in Android/iOS QA labs; verify accessible screen-reader compatibility (`TalkBack`/`VoiceOver`) so disabled users are not excluded; audit false-positive app-launch block rates.

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§68(2)(ii),(iv), §68(4)–(5), §68(12)`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
2. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§27(h), 31(f)`), accessed Nov 23, 2026.
3. NPCI circular `NPCI/2025-26/IS/003` (May 19, 2025), *Comprehensive Mobile Application Security Framework for UPI - 2025* — [provisional third-party mirror](https://rscb.bank.in/Content/pdf/npcicircular.pdf) (visually read pp. 1–8 on Nov 23, 2026; official NPCI verification pending).
4. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) — **HTTP 403 Forbidden** on Nov 23, 2026.

**Review status:** RBI sources and third-party NPCI PDF mirror checked 2026-11-23; `npci.org.in` blocked (`HTTP 403`); independent reviewer: `PENDING`.
