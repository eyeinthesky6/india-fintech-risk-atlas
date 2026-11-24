---
title: Unauthorized and fraudulent transaction customer protection
description: UPI-015 — customer liability allocation, burden of proof, 2026–2027 commercial-bank amendments vs. payments-bank baseline.
recordId: UPI-015
products:
  - upi
recordType: recovery-process
theme: reconciliation-disputes-protection
lifecycle:
  - servicing
  - dispute
  - recovery
actors:
  - payer
  - remitter-bank
  - beneficiary-bank
  - psp-bank
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it solves
Defines who bears the loss, what deadlines apply, and what proof banks must keep when a customer suffers an **unauthorized transaction** or an **approved-under-deception fraud**—separating these recovery rules from technical failed-payment reversals (`T+1`/`T+5`).

## Impact when mishandled
- **Customers:** Blurring bank deficiency or third-party breaches into customer negligence wrongly shifts losses onto victims, or delays shadow/value-dated reversals.
- **Banks:** Rejecting claims without documented evidence or failing to halt transfers immediately after a fraud report shifts full post-reporting liability onto the bank (with the **burden of proof resting on the bank**).

## Where it applies
- **Commercial Banks (effective Jan 1, 2027):** Covers transactions on or after Jan 1, 2027 (`RBI/2026-27/167`, *excluding* SFBs, PBs, RRBs, and LABs), covering both unauthorized EBTs and coercion/deception-induced *Fraudulent EBTs*.
- **Payments Banks & baseline circular (`RBI/2017-18/15`):** Retains the existing 3-working-day zero-liability, 4–7 working-day cap, 10-working-day shadow-reversal, and 90-day resolution timeline where bank-class replacement has not taken effect.

## What to do (rules and workflows)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Commercial banks (EBTs >= Jan 1, 2027) | Send free SMS/email alerts (EBTs > ₹500) with an SMS-reply objection number, provide 24x7 reporting links, advise NCRP/1930 filing, log all timestamps, acknowledge immediately, and halt further debits upon report. |
| Regulatory | Commercial banks (EBTs >= Jan 1, 2027) | Bear the **burden of proving customer liability**; guarantee zero liability for bank negligence and for third-party breaches reported within **5 calendar days**; bear all post-report losses; issue value-dated reversals and give written reasons for any claim rejection. |
| Regulatory | Commercial banks (EBTs >= Jan 1, 2027) | Administer the one-year small-value fraud compensation scheme for individuals/sole proprietors (gross loss <= ₹50,000 reported to **both NCRP/1930 and bank within 5 calendar days** under negligence cases): pay **85% of net loss up to ₹25,000** within 5 calendar days of completed claim (shared RBI 65%, issuer bank 10%, beneficiary bank 10% below ₹29,412; ₹19,118 / ₹2,941 / ₹2,941 up to ₹50,000). |
| Regulatory | Payments Banks & pre-2027 baseline SCBs/SFBs/RRBs | Apply **3 working days** zero liability, **4–7 working days** capped liability, **10 working days** shadow reversal, and **90 days** final resolution under the existing baseline directions. |
| Atlas guidance | Banks, Fraud ops | Build evidence-preserving intake pipelines recording alert delivery timestamps, SMS-reply blocks, directed scam-warning impressions, auth/device logs, and NCRP reference numbers from intake. |

## Watch-outs and validation
- **False or repeat claims vs unfair rejections:** Screen against statutory repeat/false-claim declarations while ensuring legitimate third-party breaches or missing-warning cases are not defaulted to "customer negligence" without documented proof.
- **Signals needed:** SMS/email/push delivery receipts, customer reporting timestamps, NCRP/1930 ticket IDs, authentication/device logs, directed warning impression logs, and written rejection records.
- **How to validate:** Test 24x7 SMS-reply freeze speed, verify immutable timestamp logging, and audit sample rejected liability claims against bank burden-of-proof criteria.

## References and review history
1. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (Jun 24, 2026; EBTs >= Jan 1, 2027; excludes SFBs, PBs, RRBs, LABs) — definitions (`§4(15A),(20C),(25A),(26B)`), alerts & 24x7/NCRP intake (`§§76C–76J, 85`), burden of proof & liability (`§§76K–76S`), small-value scheme (`§§76T–76U`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Responsible Business Conduct Directions, 2025](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13089) (updated Oct 1, 2026; `§§21–33`) — Payments Banks 3 working-day / 4–7 working-day / 10 working-day / 90-day baseline, accessed Nov 23, 2026.
3. RBI, [Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions](https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=11040), `RBI/2017-18/15` (Jul 6, 2017; `§§6–12`) — pre-replacement baseline for SCBs, RRBs, SFBs, and PBs, accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
