---
title: Digital payment fraud safeguards under discussion
description: UPI-016 — RBI’s April 2026 fraud safeguards consultation and November follow-up drafts on customer controls, a Stop Switch, and trusted-person authentication.
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
lastSourceCheck: "2026-11-27"
---

## What it covers
On April 9, 2026, RBI issued *Discussion Paper – Exploring safeguards in digital payments to curb frauds*. Comments closed May 8, 2026. The paper’s options and figures are consultation proposals. <a href="#ref-1">[1]</a>

On November 23, 2026, RBI issued follow-up draft amendments to seven sets of bank conduct directions and invited comments through December 14, 2026. The drafts develop the proposals for customer controls and trusted-person authentication. They remain open for consultation as of November 27, 2026. <a href="#ref-2">[2]</a> <a href="#ref-3">[3]</a>

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
| Regulatory *(consultation)* | **November follow-up — customer controls and Stop Switch** | The commercial-bank draft proposes letting customers turn off channels, set transaction limits, and stop future outward debits, with exceptions for existing recurring payments and certain bank-initiated debits. Incoming credits would continue. <a href="#ref-3">[3]</a> |
| Regulatory *(consultation)* | **November follow-up — Trusted Person Mechanism** | The commercial-bank draft proposes voluntary enrollment and a threshold set by the customer. It expressly excludes UPI, merchant payments, and recurring payments from this mechanism. <a href="#ref-3">[3]</a> |
| Atlas guidance | Product & compliance teams | Track final RBI directions and check the applicable bank category before implementing tentative consultation figures (`₹10,000`, `₹50,000`, 1-hour settlement lags) or treating a draft control as mandatory. |

## Watch-outs
- **Consultation ≠ mandate:** Product teams should design toggleable, reversible configuration hooks rather than assuming proposed thresholds will survive intact in final circulars.
- **Usability & coercion resilience:** Any future whitelist or trusted-person mechanic needs UX friction against scammer coaching during active calls.
- **Channel scope:** Under the commercial-bank draft, UPI can be affected by customer channel controls and the Stop Switch even though UPI payments are excluded from the Trusted Person Mechanism. Check the two controls separately when assessing UPI impact. <a href="#ref-3">[3]</a>

## References and review history
1. <a id="ref-1"></a> RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), `id=23810` (Apr 9, 2026; comments closed May 8, 2026; **non-binding consultation**) — problem framing (`§§iii, x–xi`), ecosystem baseline (`§§vii–ix`), and Options 1–4 (`§xii`, Sections IV.1–4), accessed Nov 27, 2026.
2. <a id="ref-2"></a> RBI, [Draft Amendment Directions for Preventive Safeguards for Electronic Banking Transactions](https://www.rbi.org.in/scriptS/BS_PressReleaseDisplay.aspx?prid=64026), Press Release `2026-2027/1548` (Nov 23, 2026), paragraphs 2–3 list the seven draft amendments and the Dec 14, 2026 comment deadline. Accessed Nov 27, 2026.
3. <a id="ref-3"></a> RBI, [Draft Commercial Banks – Responsible Business Conduct Fifth Amendment Directions, 2026](https://www.rbi.org.in/scripts/bs_viewcontent.aspx?Id=5221), draft linked from the Nov 23, 2026 announcement. Proposed `§§76FA–76FC, 76FF–76FH` cover channel controls and the Stop Switch. Proposed `§§76FQ–76FS` cover trusted-person enrollment, scope, and exclusions. Accessed Nov 27, 2026.

**Review status:** RBI primary sources checked 2026-11-27. Independent review pending.
