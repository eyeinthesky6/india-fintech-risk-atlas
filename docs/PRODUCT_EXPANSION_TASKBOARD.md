# Product Expansion Task Board & Agent Execution Playbook

**Status:** Living execution task board aligned with [docs/ARCHITECTURE_FREEZE.md](ARCHITECTURE_FREEZE.md), [AGENTS.md](../AGENTS.md), and [docs/CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).  
**Target Audience:** Any AI coding assistant (Cursor, Claude Code, Codex, Antigravity, OpenCode, Kilo) or human contributor in any IDE picking up the next product or topic.

---

## 🎯 Purpose & Agent Autonomy Rule
This task board is designed for **100% turnkey agent execution**. Any agent opening this repository can pick the next pending topic, execute the entire end-to-end research and content cycle, verify all machine gates, and submit a complete, merge-ready pull request without guesswork or human handholding.

---

## 🚦 Live Task Board: Product Tracks & Topic Status

### 🟢 Track 1: UPI Rail (`upi`) — Baseline v1 (100% COMPLETE & MERGED)
- [x] `UPI-OVERVIEW`: UPI Ecosystem & Scheme Clearing Architecture
- [x] `UPI-001`: Unusual outbound payment velocity
- [x] `UPI-002`: Mule account funnel & dormancy-to-burst movement
- [x] `UPI-003`: Account takeover, SIM-swap & session binding
- [x] `UPI-004`: Collect request deception (P2P/P2M spoofing)
- [x] `UPI-005`: Payment status reconciliation & webhook idempotency
- [x] `UPI-006`: Dynamic/static QR & cashback reversal deception
- [x] `UPI-007`: Fake bank support impersonation & remote tools
- [x] `UPI-008`: Untrusted app access, screen overlays & RASP
- [x] `UPI-009`: Authentication context & biometrics
- [x] `UPI-010`: Enterprise transaction velocity & EFRM staffing
- [x] `UPI-011`: Failed authentication PIN retry limits & lockouts
- [x] `UPI-012`: Merchant onboarding & shell merchant laundering
- [x] `UPI-013`: Online dispute resolution (UDIR) & chargebacks
- [x] `UPI-014`: Settlement batch delays & URCS exceptions
- [x] `UPI-015`: Customer zero/limited liability reporting
- [x] `UPI-016`: RBI Discussion Paper on future fraud safeguards

---

### 🟡 Track 2: Credit, Debit & Prepaid Cards (`cards`) — PRIORITY P1 (ACTIVE EXPANSION)
*Governing Primary Directions:*
- **RBI Master Direction:** *Credit Card and Debit Card – Issuance and Conduct Directions, 2022* (`RBI/DoS/2022-23/92`, updated 2024/2026).
- **Card-on-File Tokenization (CoFT):** `RBI/DPSS/2021-22/96` & `RBI/2023-24/104`.
- **Additional Factor of Authentication (AFA):** `RBI/2025-26/79` (Authentication Mechanisms for Digital Payment Transactions).
- **Customer Liability Baseline:** `RBI/2017-18/15` & Commercial Banks RBC Directions `§§76A–76V` (effective Jan 1, 2027).

| Topic ID | Topic Title & Operational Signal | Target File Path | Primary Statutory Basis | Status |
|---|---|---|---|---|
| `CARD-OVERVIEW` | Card Ecosystem, Clearing & Interchange Architecture | `src/content/docs/cards/card-ecosystem.md` | RBI Card Master Directions `Ch. II` | 📋 Ready to Pick |
| `CARD-001` | Card-on-File Tokenization (CoFT) & Cryptogram Validation Failures | `src/content/docs/cards/coft-tokenization.md` | RBI CoFT Directions / EMVCo specs | 📋 Ready to Pick |
| `CARD-002` | Card-Not-Present (CNP) International 2FA/AFA Bypass | `src/content/docs/cards/cnp-international-bypass.md` | RBI AFA Directions `RBI/2025-26/79` | 📋 Ready to Pick |
| `CARD-003` | Automated BIN Attacks, Card Number Guessing & Velocity Bursts | `src/content/docs/cards/bin-attack-velocity.md` | RBI Cyber Resilience / Network Rules | 📋 Ready to Pick |
| `CARD-004` | ATM/POS Magstripe Cloning, Fallback Exploits & Shimming | `src/content/docs/cards/pos-atm-skimming.md` | RBI EMV Chip & PIN Mandates | 📋 Ready to Pick |
| `CARD-005` | Chargebacks, Friendly Fraud & Visa/Mastercard/RuPay Arbitration | `src/content/docs/cards/chargeback-arbitration.md` | Network Operating Regulations / RBI TAT | 📋 Ready to Pick |
| `CARD-006` | Commercial & Corporate Card Misappropriation & Limit Controls | `src/content/docs/cards/corporate-card-controls.md` | RBI Commercial Card Guidelines | 📋 Ready to Pick |
| `CARD-007` | Inactive Card Activation Fraud & Billing Dispute Redressal | `src/content/docs/cards/inactive-card-activation.md` | RBI Card Directions `§§8, 10` (Closure TAT) | 📋 Ready to Pick |

---

### ⚪ Track 3: Payment Aggregators & Gateways (`payment-aggregator`) — PRIORITY P2
*Governing Primary Direction:* *RBI Master Direction on Regulation of Payment Aggregators (PA), Sep 15, 2025 (updated Nov 11, 2026).*

| Topic ID | Topic Title & Operational Signal | Target File Path | Primary Statutory Basis | Status |
|---|---|---|---|---|
| `PA-OVERVIEW` | Payment Aggregator Escrow & Nodal Clearing Architecture | `src/content/docs/payment-aggregator/pa-ecosystem.md` | RBI PA Master Direction `§§16–18` | ⏳ Queued |
| `PA-001` | Shell Merchant Onboarding, Dummy Sites & CDD Failures | `src/content/docs/payment-aggregator/shell-merchant-cdd.md` | RBI PA MD `§13` (CPV, PAN, CKYCR) | ⏳ Queued |
| `PA-002` | Merchant Transaction Laundering (Gaming/Betting via E-Commerce) | `src/content/docs/payment-aggregator/transaction-laundering.md` | RBI PA MD `§13(i)` & PMLA rules | ⏳ Queued |
| `PA-003` | Nodal/Escrow Settlement Delays & T+1/T+2 Buffer Breaches | `src/content/docs/payment-aggregator/escrow-reconciliation.md` | RBI PA MD `§17` | ⏳ Queued |
| `PA-004` | Cross-Border Payment Aggregators (PA-CB) Import/Export Invoicing | `src/content/docs/payment-aggregator/cross-border-invoicing.md` | RBI PA-CB Framework `§24` | ⏳ Queued |

---

### ⚪ Track 4: Digital Lending (`digital-lending`) — PRIORITY P3
*Governing Primary Directions:* *RBI Guidelines on Digital Lending (Sep 2, 2022)* and *Default Loss Guarantee (DLG) in Digital Lending (Jun 8, 2023).*

| Topic ID | Topic Title & Operational Signal | Target File Path | Primary Statutory Basis | Status |
|---|---|---|---|---|
| `LEND-OVERVIEW` | Digital Lending Scheme: REs, LSPs, DLAs and Flow Architecture | `src/content/docs/digital-lending/lending-ecosystem.md` | RBI DL Guidelines `Annex 1` | ⏳ Queued |
| `LEND-001` | First-Loss Default Guarantee (FLDG/DLG) 5% Cap & Contractual Breaches | `src/content/docs/digital-lending/fldg-cap-compliance.md` | RBI DLG Circular (Jun 2023) | ⏳ Queued |
| `LEND-002` | Unauthorized Predatory Loan APKs, Contact Scraping & Blackmail | `src/content/docs/digital-lending/predatory-loan-apps.md` | RBI DL Guidelines `§§4–6` | ⏳ Queued |
| `LEND-003` | Direct Disbursement Bypass & Third-Party Pass-Through Accounts | `src/content/docs/digital-lending/direct-disbursement-bypass.md` | RBI DL Guidelines `§3` (Direct credit) | ⏳ Queued |
| `LEND-004` | Key Fact Statement (KFS), APR Deception & Hidden Charges | `src/content/docs/digital-lending/kfs-apr-deception.md` | RBI KFS Directives / DL MD `§8` | ⏳ Queued |

---

## 🛠️ The Agent Execution Contract (How to Complete a Topic)

When an agent in any IDE picks a topic from this task board, it must follow this exact 6-step recipe:

### Step 1: Branch & Taxonomy Check
1. Create a git branch: `git checkout -b feat/<track>-<topic-id>` (e.g. `feat/cards-card-001`).
2. Verify `src/taxonomy.json`: Ensure the target `products` key (e.g. `"cards": "Cards"`) and any new `actors` exist.

### Step 2: Source Discovery & Registration
1. Directly inspect the primary RBI Master Direction or scheme regulation.
2. Register the source in `research/<product>/PRIMARY_SOURCE_REGISTER.md` with:
   - Canonical title, exact URL, circular number, document date, effective date, and section locators.

### Step 3: Write the Canonical Topic Record
Create `src/content/docs/<product>/<slug>.md` using typed YAML frontmatter and the 6-part Ready-Reckoner layout:
```markdown
---
title: <Topic Title>
description: <Topic ID> — <Concise 1-line plain English summary>
recordId: <TOPIC-ID>
products:
  - <product>
recordType: <recordType from taxonomy.json>
theme: <theme from taxonomy.json>
lifecycle:
  - <lifecycle phase>
actors:
  - <actor class>
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: source-checked
lastSourceCheck: "YYYY-MM-DD"
---

## What it is (or What it solves)
<Plain-English mechanism, telemetry breakdown, and affected boundaries>

## Impact
- **Customer:** <Harm, unauthorized debit, or legal burden>
- **Banks & Gateways:** <Losses, queue clogging, or regulatory penalties>

## Common patterns (or When it applies)
- <Bulleted real-world attack scripts, scenario variants, or operational triggers>

## What to do (rules and controls)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | <Entity Class> | <Actionable requirement citing primary clause> |
| Industry practice | <Vendor / Operator> | <Engineering practice with method and caveats> |
| Atlas guidance | <Role> | <Candidate telemetry check, cooling period, or rule> |

## Watch-outs and validation
- **Legitimate lookalikes:** <False positive friction risks>
- **Signals needed:** <Required telemetry parameters and logs>
- **How to validate:** <Staging replay, shadow testing, or unit test methods>

## References and review history
1. RBI / Network, [Document Title](URL), `Circular No.` (Date; `§Section`), accessed YYYY-MM-DD.

**Review status:** Primary sources checked YYYY-MM-DD; independent reviewer: `PENDING`.
```

### Step 4: Double-Ledger Parity (Mandatory Hard Invariant)
Every record **MUST** have matching paired entries:
1. `research/evidence/<TOPIC-ID>.md`:
   - Exact 7-column table: `| Claim ID | Layer | Claim | Source | Exact locator | Scope & effective date | Result |`.
   - Result must be `supported (source checked YYYY-MM-DD; independent review pending)`.
   - Every external URL in `## References` must exist as an assertion locator.
2. `research/attestations/<TOPIC-ID>.md`:
   - 12-item declaration checklist matching `docs/ATTESTATION_TEMPLATE.md`.
   - Boxes 1–7 checked `[x]`; independent reviewer boxes 8–10, 12 left unchecked `[ ]`.

### Step 5: Run Verification Commands
Run the mandatory test suite before committing:
```bash
# 1. Attestation and ledger parity check
python scripts/check-attestations.py --all

# 2. Citation freshness and deprecation check
python scripts/verify-citations.py --offline --all

# 3. Astro build and internal link validation
npm run build
```

### Step 6: Definition of Done (Ready to Merge)
A topic is considered **"Closed Fully and Completely"** when:
- [ ] Record created with valid YAML frontmatter and Ready-Reckoner structure.
- [ ] 100% of cited primary sources directly opened and verified (zero hallucinations).
- [ ] Double-ledger parity verified (`content` $\leftrightarrow$ `evidence` $\leftrightarrow$ `attestation`).
- [ ] `npm run build` passes with **0 broken links** and search index generated.
- [ ] Git commit uses conventional commit format (`feat(cards): add CARD-001 CoFT tokenization failure modes`).
- [ ] Task board updated with `[x]` for the completed topic.
