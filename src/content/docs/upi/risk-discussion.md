---
title: Digital payment fraud safeguards under discussion
description: UPI-016 — RBI's April 2026 Discussion Paper on lagged credit, trusted-person verification, KYC credit checks, and kill switches.
recordId: UPI-016
products:
  - upi
recordType: policy-consultation
theme: policy
lifecycle:
  - initiation
  - authorization
  - servicing
actors:
  - remitter-bank
  - beneficiary-bank
  - psp-bank
  - tpap
  - payment-aggregator
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it covers
On April 9, 2026, RBI issued *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (comments closed May 8, 2026). **This is a non-binding consultation paper—none of its suggested thresholds or options is enacted law unless RBI subsequently issues formal directions.**

## Why it matters
- **Shifting fraud mix:** RBI notes that technical account takeovers have declined relative to **Authorised Push Payment (APP)** scams driven by social engineering, bogus call centres, impersonation, and mule networks targeting NCRP.
- **Current ecosystem tools cited:** Notes Digital Payment Security Controls, DoT's **Mobile Number Revocation List (MNRL)** on DIP, I4C's NCRP SOP, and RBIH's `MuleHunter.AI` (2024).

## Key proposals and trade-offs

| Basis | Focus area | Proposed option & trade-offs |
|---|---|---|
| Regulatory *(consultation)* | **Option 1 — Lagged credit** | Floats a 1-hour payer-bank delay (provisional debit with payer cancellation window) for non-merchant, non-recurring APP transfers above a suggested **₹10,000** limit (excluding whitelisted payees) to break "golden hour" coercion. RBI notes this conflicts with real-time UX expectations and attackers may coach victims to whitelist payees. |
| Regulatory *(consultation)* | **Option 2 — Trusted-person approval** | Floats requiring an additional approval from a designated trusted person for high-value transfers (above **₹50,000**) by vulnerable cohorts (such as citizens 70+ or differently abled persons), with a 24-hour cooldown on trusted-person changes or opt-outs. |
| Regulatory *(consultation)* | **Option 3 — KYC-commensurate credits** | Floats monitoring inbound account credits against documented customer relationship and financial/KYC profile to flag anomalous mule inflows early. |
| Regulatory *(consultation)* | **Option 4 — Customer controls & kill switch** | Floats uniform digital channel on/off switches, self-set limits across UPI/cards/netbanking, an instant **emergency kill switch** locking all digital modes together, and evaluating "secure by default" disabled channels on new accounts (risking accidental self-lockouts). |
| Atlas guidance | Product & compliance teams | Track formal RBI draft or final Master Directions following May 8, 2026 feedback before hardcoding tentative consultation figures (`₹10,000`, `₹50,000`, 1-hour settlement lags) into live systems. |

## Watch-outs
- **Consultation ≠ mandate:** Product teams should design toggleable, reversible configuration hooks rather than assuming proposed thresholds will survive intact in final circulars.
- **Usability & coercion resilience:** Any future whitelist or trusted-person mechanic needs UX friction against scammer coaching during active calls.

## References and review history
1. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), `id=23810` (Apr 9, 2026; comments closed May 8, 2026; **non-binding consultation**) — problem framing (`§§iii, x–xi`), ecosystem baseline (`§§vii–ix`), and Options 1–4 (`§xii`, Sections IV.1–4), accessed Nov 23, 2026.

**Review status:** RBI primary source checked 2026-11-23; independent reviewer: `PENDING`.
