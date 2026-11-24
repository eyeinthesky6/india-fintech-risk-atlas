# Domain Stewardship & Incremental Delta-Review Specification

**Status:** Living governance specification aligned with [docs/CONTENT_SCHEMA.md](CONTENT_SCHEMA.md), [docs/RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md), and [docs/SECTION_WORKFLOW.md](SECTION_WORKFLOW.md).  
**Purpose:** Replace the unsustainable bottleneck of monolithic, blank-slate re-reviews with a decentralized **Domain Steward & Section Supporter** model backed by **incremental delta-verification**.

---

## 1. Why Continuous Full-Page Validation Fails

In traditional documentation projects, regulatory updates create an impossible maintenance trap:
1. **The Blanket Invalidation Dilemma:** If an RBI circular amends a single paragraph (e.g., shortening a chargeback TAT or revising a cooling period), treating the entire page as "unverified" invalidates dozens of unchanged, mathematically sound controls and mechanism descriptions.
2. **The Solo-Reviewer Bottleneck:** No single human can continuously re-read hundreds of pages of primary legal text, operating circulars, and evidence ledgers across the entire Indian financial stack.
3. **The "Wikipedia" Reality:** Open, authoritative platforms succeed only when topic ownership is modularized and maintenance is distributed across domain specialists.

---

## 2. The Two-Tier Verification Model

To ensure content remains permanently verified without burning out reviewers, the Risk Atlas separates review into **Baseline Certification** and **Incremental Delta Verification**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TWO-TIER VERIFICATION LIFECYCLE                       │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. BASELINE CERTIFICATION (Full)     │ 2. INCREMENTAL DELTA-REVIEW (Diff)   │
│ • Conducted once per major milestone │ • Triggered on regulatory updates    │
│ • Inspects overall mechanism truth,  │ • Inspects ONLY the specific diff    │
│   telemetry, and control logic       │ • Preserves baseline certification   │
│ • Signed by designated Domain Steward│ • Approved by Section Supporter / PR │
│ • Recorded: `baselineCertifiedDate`  │ • Recorded: `lastDeltaReviewer`      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Tier A: Baseline Certification (The Foundation)
- A **Domain Steward** (a named human practitioner, risk lead, or domain expert) opens the record, verifies all assertions in `research/evidence/<ID>.md`, checks all 12 items in `research/attestations/<ID>.md`, and certifies the baseline.
- **Output:** The record is promoted to `reviewStage: reviewed` (or `published` upon release).
- The baseline certification remains permanent for the core mechanisms, failure modes, and architectural controls.

### Tier B: Incremental Delta Verification (The Maintenance Loop)
- When a regulatory feed watcher (`scripts/watch-regulators.py`) or contributor detects an amendment, addendum, or new circular:
- An isolated GitHub PR is opened modifying *only* the specific table row, section locator, or date.
- **The page is NOT reset to `draft`.** The baseline remains certified.
- A **Section Supporter** or the Domain Steward reviews **only the pull request diff** (confirming that the new text matches the cited circular passage).
- Upon merge, the frontmatter and attestation ledger update `lastSourceCheck: "YYYY-MM-DD"` and `lastDeltaReviewer: "@username"`.

---

## 3. The 5 Domain Steward Working Groups

Every canonical record in the Atlas is assigned to one of five **Domain Steward Families**. A human lead owns the baseline for their group, supported by community practitioners:

| Domain Steward Family | Focus & Scope | Assigned Canonical Records | Candidate Steward Background |
|---|---|---|---|
| **Group 1: Authentication, Identity & Device Security** | SIM binding, device fingerprinting, RASP, remote-access app blocks, biometrics, 2FA. | • `UPI-002` (Failed auth lockouts)<br>• `UPI-003` (Account takeover & binding)<br>• `UPI-008` (Untrusted apps & RASP) | Mobile Security Engineers, App Sec Leads, Identity Architects |
| **Group 2: Monitoring, Velocity & Mule Funnels** | Burst transfer velocity, uncharacteristic outbound volume, mule accounts, MNRL hygiene. | • `UPI-001` (Outbound velocity)<br>• `UPI-010` (Transaction velocity bursts)<br>• `UPI-011` (Mule account funnel) | Fraud Data Scientists, EFRM Analysts, AML Investigators |
| **Group 3: Social Engineering, Scams & Merchants** | Collect request spoofing, fake support numbers, QR cashback tricks, merchant onboarding. | • `UPI-004` (Collect request deception)<br>• `UPI-005` (Authentication context)<br>• `UPI-006` (Fake support impersonation)<br>• `UPI-009` (QR cashback tricks)<br>• `UPI-012` (Merchant onboarding) | Product Managers, Trust & Safety Ops, Merchant Risk Leads |
| **Group 4: Settlement, Reconciliations & Exceptions** | URCS settlement cycles (AUTH vs DC1/DC2), 24h bank reconciliation, PA escrow exceptions. | • `UPI-014` (Settlement exceptions)<br>• `UPI-015` (Status reconciliation) | Core Banking Engineers, Settlement Ops, Fintech Finance Leads |
| **Group 5: Dispute Routing, Liability & Scheme Governance** | URCS/UDIR chargebacks, Banking Ombudsman TATs, zero/limited customer liability, scheme rules. | • `UPI-007` (Customer liability)<br>• `UPI-013` (Dispute routing & UDIR)<br>• `UPI-016` (Risk stack playbook)<br>• `UPI-OVERVIEW` (Ecosystem explainer) | Compliance Officers, Regulatory Counsel, Fintech Founders |

---

## 4. Section Supporters Program (Community Ownership)

To scale beyond a single maintainer without sacrificing evidentiary standards:

1. **Supporter Roster (`.github/CODEOWNERS`):** Verified community practitioners can sign up as "Supporters" for specific domain families.
2. **Automated PR Tagging:** When a PR modifies files in `src/content/docs/upi/` or `research/evidence/`, GitHub automatically tags the corresponding Domain Steward and Section Supporters for review.
3. **Checklist for Supporters:**
   - [ ] Did the PR keep existing controls and watch-outs intact (anti-deletion check)?
   - [ ] Does the cited PDF/link actually support the revised text?
   - [ ] Is the entity scope legally accurate (e.g. Bank vs. TPAP vs. Aggregator)?
   - [ ] Did the PR pass `python scripts/check-attestations.py --staged` and `npm run build`?

---

## 5. Attestation Schema Extension for Topic Stewards

In `research/attestations/<RECORD-ID>.md`, attestations record both baseline and incremental stewardship:

```yaml
Record: UPI-003
Steward-Domain: Group 1 (Authentication, Identity & Device Security)
Domain-Steward: "@steward-handle"
Baseline-Certified: 2026-11-24 (by @steward-handle)
Last-Delta-Reviewer: "@supporter-handle"
Last-Delta-Date: 2026-11-24
Last-Delta-PR: "#6"
Stage: source-checked
```

This model turns review into a sustainable, distributed, collaborative practice where human experts review bite-sized deltas rather than impossible full-page rewrites.
