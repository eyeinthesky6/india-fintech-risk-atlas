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

## What this covers
On April 9, 2026, RBI published *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (`id=23810`, comments closed May 8, 2026). **A discussion paper is a non-binding public consultation—none of its proposed options should be documented or enforced as enacted regulatory law unless subsequently notified by RBI.** [1]

## Layer 1 — Verified contents of the April 2026 Discussion Paper
- **Problem framing (`§§iii, x–xi`):** RBI notes that technical account-takeover frauds have become comparatively small while **Authorised Push Payment (APP)** frauds—driven by social engineering, bogus call centres, impersonation, and mule networks—account for rising NCRP complaints. [1]
- **Existing ecosystem baseline cited (`§§vii–ix`):** Notes Digital Payment Security Controls, DoT **Mobile Number Revocation List (MNRL)** on DIP, I4C's NCRP SOP, and RBIH's **MuleHunter.AI** (2024). [1]
- **Four proposed consultation options (`§xii` & Sections IV.1–4):**
  1. **Option 1 — Lagged credit for APP transactions:** Proposes a 1-hour payer-bank delay (provisional debit with payer cancellation option, breaking urgency coercion during the "golden hour") for non-merchant, non-recurring APP transfers above a suggested **₹10,000** threshold, excluding whitelisted payees/transactions. [1]
  2. **Option 2 — Trusted-person additional authentication for vulnerable cohorts:** Proposes designating a trusted individual as an additional authenticator for high-value APP transfers (above **₹50,000**) by vulnerable customers (such as citizens aged 70+ or differently abled persons), with 24-hour cooling periods on trusted-person changes or opt-outs. [1]
  3. **Option 3 — Credits commensurate with relationship/KYC profile:** Proposes checking account inflows against documented customer financial profile and KYC rationale to catch anomalous credits. [1]
  4. **Option 4 — Customer-induced controls & kill switch:** Proposes uniform channel on/off toggles, customer-set limits across UPI/cards/netbanking, an emergency **kill switch** disabling all digital modes at once, and evaluating "secure by default" disabled modes for newly opened accounts. [1]

## Layer 4 — Operational trade-offs and design considerations
- **Immediacy vs. coercion interruption:** RBI explicitly flags that lagged credit conflicts with real-time payment expectations and that fraudsters could coach victims to whitelist payees (`Option 1 Cons`). Similarly, an emergency kill switch helps freeze compromised access quickly, yet accidental activation can disrupt legitimate retail payments (`Option 4 Cons`). [1]
- **Monitoring rule changes:** Risk teams should watch for any binding draft or final RBI Master Directions following the May 8, 2026 comment period before hardcoding thresholds like ₹10,000, ₹50,000, or 1-hour settlement lags.

## References and review history
1. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (`§§iii, vii–xii, Options 1–4`; **non-binding consultation**), accessed Nov 23, 2026.

**Review status:** RBI primary source checked 2026-11-23; independent reviewer: `PENDING`.
