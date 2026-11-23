---
title: Unusual outbound payment velocity
description: UPI-001 — account-level outbound burst and rapid balance-depletion signals.
---

**ID:** UPI-001 · **Type:** Detective signal · **Lifecycle:** Initiation, authorization, monitoring · **Status:** Source-checked draft (independent review pending)

## Risk mechanism and operational gap
An unusual surge in outgoing UPI transfers—such as multiple back-to-back payments to new or unrelated beneficiaries, rapid splitting immediately after a credit, or abrupt balance drainage—can indicate account takeover, social-engineered coercion, or automated mule liquidation. Outbound velocity is a **risk indicator, not standalone proof of fraud**.

Operational gaps occur when systems measure raw transaction counts without baseline normalization (comparing against the account's own tenure, historical cadence, and typical counterparty diversity) or evaluate bursts in isolation from recent device, credential, or inflow events. *(For program-wide EFRM governance, staffing, and alert-tuning obligations, see [Transaction velocity and EFRM monitoring](/india-fintech-risk-atlas/upi/transaction-velocity/).)*

## Layer 1 — Official regulatory requirements
- **Banks (`Digital Payment Security Controls Directions, 2026`):** Under `id=13642` (Commercial Banks, parallel `id=13624` Payments Banks and `id=13633` Small Finance Banks), `§53` directs banks to parameterize and monitor system alerts across applicable indicators, expressly naming **transaction velocity (fund transfers, payments through electronic modes, and addition of new beneficiaries) in a short period**, particularly in accounts that have never previously used mobile/internet channels, as well as excessive activity on new accounts. [1][2][3]
- **Non-bank PSOs (`RBI/DPSS/2026-27/475`, Nov 5, 2026):** `§27(c)` requires real-time/near-real-time fraud monitoring for suspicious transactional behavior, and `§28` requires facilitating online alerts across participants based on parameters including **transaction velocity** and **new-account excessive activity** (Large/Medium PSOs effective immediately; Small PSOs effective Apr 1, 2028 per §3). [4]
- **No universal numeric threshold:** None of these RBI directions prescribes a universal rupee or count threshold; banks and PSOs set documented risk-based parameters (`§52`). [1]

## Layer 3 — Empirical research observations
- **Temporal flow shape vs. single transfers (`arXiv:2610.21314v1`):** In Ahmad & Deodhar's 2026 study on the Indian **RBIH NFPC** dataset, high-velocity outbound runs interleaved with matching inflows and dormant periods separated mule behavior from normal accounts whose occasional velocity excursions reverted to baseline. [5]
- **Precision vs. recall trade-off (`arXiv:2410.19845v1`):** In Google's GPay India UPI scam evaluation, high-recall models (>88% recall) exhibited ~30% precision on tested segments, demonstrating that behavioral triggers alone create unsustainable false positives if wired directly to hard account blocks. [6]

## Layer 4 — Candidate controls and data prerequisites
- **Baseline-normalized burst features:** Compare rolling 15-minute, 1-hour, and 24-hour outbound count, total value, balance depletion ratio, and unique-new-payee count against the customer's 30/90-day baseline and account age.
- **Contextual conjunctions:** Escalate score priority when an outbound burst coincides with first-time app activation, recent SIM/device binding (`UPI-003`), or an immediate prior inbound transfer from an unfamiliar payer.
- **Data prerequisites:** transaction timestamps, direction (`debit`/`credit`), status/outcome, amount, balance pre/post, anonymized counterparty VPA/account ID, account tenure, device/session context.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Small merchants paying multiple suppliers at end of day, festive shopping/gifting, shared-trip settlements, salary-day family transfers, and newly onboarded active customers.
- **Customer impact:** Indiscriminate mid-checkout declines or blanket account freezes harm low-margin merchants and salaried individuals; prefer step-up confirmation or temporary scoped holds with clear self-service/assisted resolution.
- **Validation:** Evaluate alert precision@k under actual analyst review capacity, track false-positive overturn rates by customer segment (merchant vs. retail), and test against seasonality (Diwali/month-end spikes).

## References and review history
1. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411`, updated Oct 1, 2026 (`§§52–53`), accessed Nov 23, 2026.
2. RBI, [Payments Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13624), `RBI/DoS/2026-27/429`, updated Oct 1, 2026 (`§§52–53`), accessed Nov 23, 2026.
3. RBI, [Small Finance Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13633), updated Oct 1, 2026 (`§§52–53`), accessed Nov 23, 2026.
4. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475`, Nov 5, 2026 (`§§3, 27(c), 28`), accessed Nov 23, 2026.
5. Ahmad, O. & Deodhar, A. (2026), [Money-Mule Detection as a Relational Learning Problem: A Study on the RBIH NFPC Dataset](https://arxiv.org/html/2610.21314v1), `arXiv:2610.21314v1` (§4, Fig. 2), accessed Nov 23, 2026.
6. Dahiphale, D. et al. / Google, Inc. (2024), [Enhancing Trust and Safety in Digital Payments: An LLM-Powered Approach](https://arxiv.org/html/2410.19845v1), `arXiv:2410.19845v1` (§V-A), accessed Nov 23, 2026.

**Review status:** RBI and `arXiv` sources checked 2026-11-23; independent reviewer: `PENDING`.
