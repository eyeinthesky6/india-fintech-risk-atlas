---
title: Unauthorized and fraudulent transaction customer protection
description: UPI-015 — customer liability allocation, burden of proof, 2026–2027 commercial-bank amendments vs. payments-bank baseline.
---

**ID:** UPI-015 · **Type:** Customer protection & regulatory obligation · **Lifecycle:** Servicing, dispute, recovery · **Status:** Source-checked draft (independent review pending)

## Risk mechanism and operational gap
Customer liability and recovery rules in UPI fraud differ sharply from ordinary failed-transaction reversals (`RBI/2019-20/67`). Operational and legal gaps arise when institutions blur **authorized-but-deceived** APP scams with **unauthorized** debits, ignore entity-class differences between Commercial Banks and Payments Banks/SFBs, fail to log alert/reporting timestamps, or deny claims without documented proof.

## Layer 1 — Official regulatory requirements (entity- and date-scoped)
- **Commercial Banks for transactions on or after Jan 1, 2027 (`RBI/2026-27/167`, `Id=13543`, Jun 24, 2026):** Applies to Commercial Banks (**excluding Small Finance Banks, Payments Banks, Regional Rural Banks, and Local Area Banks**) for electronic banking transactions on or after **January 1, 2027** (`§3(2)`), replacing `§§64–76` with `Section DA` (`§§76A–76V`):
  - **Definitions (`§4`):** Defines *Fraudulent EBT* (`4(15A)`) to cover both stolen credentials **and** customer approval granted under coercion, deception, or duress; defines *Unauthorised EBT* (`4(26B)`); defines *Customer negligence* (`4(20C)`) including credential sharing, delayed reporting, or ignoring specific directed bank scam warnings; defines *Shadow reversal* (`4(25A)`). [1]
  - **Alerts & 24x7 reporting (`§§76C–76J, 85`):** Mandates free SMS alerts for EBTs > ₹500 (`§76D`, `§85`), email alerts (`§76E`), 24x7 reporting including an SMS-reply objection number in alerts and homepage/app links (`§76G`), advising reporting on NCRP / Helpline 1930 (`§76G`), timestamp logging (`§76H`), immediate complaint acknowledgement (`§76I`), and preventing further unauthorized EBTs (`§76J`). [1]
  - **Liability & burden of proof (`§§76K–76S`):** **Burden of proving customer liability lies on the bank** (`§76K`). Zero liability applies to bank negligence/deficiency (`§76L`) and to third-party breach when reported within **five calendar days** (`§76M`). Bank bears post-reporting losses (`§76O`); reversals must be value-dated (`§76R`); rejections must disclose supporting reasons (`§76S`). [1]
  - **Small-value fraud compensation (`§§76T–76U`):** One-time scheme for bona fide individual/sole-proprietor victims with gross loss <= ₹50,000 under customer-negligence cases (`§76N`) who report to **both NCRP/1930 and the bank within 5 calendar days**, paying **85% of net loss up to ₹25,000** (cost-shared across RBI 65%, customer bank 10%, beneficiary bank 10% for losses < ₹29,412; ₹19,118 / ₹2,941 / ₹2,941 above that up to ₹50,000), payable within 5 calendar days of completed claim form for incidents occurring up to 1 year from effective date (`§76U`). [1]
- **Payments Banks & pre-2027 baseline (`id=13089` updated Oct 1, 2026; `RBI/2017-18/15`, `id=11040`):** Payments Banks' *Responsible Business Conduct Directions, 2025* (`id=13089 §§21–33`) and the 2017 circular (`id=11040`, covering SCBs, RRBs, SFBs, PBs prior to bank-class replacement) retain **3 working days** for zero liability, **4–7 working days** for limited liability caps, **10 working days** for shadow reversal (`§29`/`§9`), and **90 days** for final resolution (`§30`). [2][3]

## Layer 4 — Candidate controls and data prerequisites
- **Evidence-preserving alert & intake pipelines:** Log alert delivery timestamps (`§76H`), capture SMS/in-app customer objections immediately to block further transfers (`§76J`), verify directed warning impressions, and guide victims to NCRP / 1930 within the 5-calendar-day window.
- **Data prerequisites:** SMS/email/push delivery receipts, customer reporting timestamps, NCRP/1930 reference numbers, authentication/device logs for burden-of-proof review (`§76K`), reasoned rejection records (`§76S`).

## False positives, customer impact, and validation
- **Customer harms:** Misclassifying bank-negligence or third-party breaches as customer negligence, failing to stop post-report debits (`§76O`), or rejecting claims without written reasons (`§76S`). Conversely, fraudulent repeat/false claims are explicitly guarded via Annex II declarations and recovery recalculations under `§76T(3)`.
- **Validation:** Audit 24x7 SMS-reply & in-app reporting latency, verify timestamp retention (`§76H`), and sample-check rejected liability decisions against `§76K` burden-of-proof standards.

## References and review history
1. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167`, Jun 24, 2026 (`§§3–4, 76A–76V, 85`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Responsible Business Conduct Directions, 2025](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13089), updated Oct 1, 2026 (`§§21–33`), accessed Nov 23, 2026.
3. RBI, [Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions](https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=11040), `RBI/2017-18/15`, Jul 6, 2017 (`§§6–12`), accessed Nov 23, 2026.

**Review status:** RBI primary sources checked 2026-11-23; independent reviewer: `PENDING`.
