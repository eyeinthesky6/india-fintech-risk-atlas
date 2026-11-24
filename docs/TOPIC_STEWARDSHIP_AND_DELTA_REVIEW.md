# Topic Ownership, Atlas Advisory Panel & Incremental Delta-Review Specification

**Status:** Living governance specification aligned with [docs/CONTENT_SCHEMA.md](CONTENT_SCHEMA.md), [docs/RESEARCH_PROTOCOL.md](RESEARCH_PROTOCOL.md), and [docs/SECTION_WORKFLOW.md](SECTION_WORKFLOW.md).  
**Purpose:** Replace the unsustainable bottleneck of monolithic re-reviews with a decentralized **Topic Ownership & Atlas Advisory Panel** model backed by **incremental delta-verification** and seamless non-GitHub workflows.

---

## 1. Governance Architecture: The 4 Distinct Classes

To keep the platform authoritative, sustainable, and credible without blurring operational roles, governance is partitioned into four distinct classes:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ATLAS GOVERNANCE & OWNERSHIP MODEL                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. INSTITUTIONAL PARTNERS & CO-OWNERS                                       │
│    • Public-interest digital rights & fintech forums (e.g., IFF - Internet  │
│      Freedom Foundation, payment councils, academic policy centres)         │
│    • Serve as institutional co-owners, content sponsors, and policy guardians│
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. ATLAS ADVISORY PANEL (Strategic & Editorial Governance)                  │
│    • Senior fintech risk leaders, digital banking heads, and legal scholars  │
│    • High-level strategic guidance, policy consultation oversight, credibility│
│    • Zero Git/coding expectation; quarterly async synthesis reviews         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. DOMAIN EXPERTS & TOPIC LEADS (Tactical Content Verification)             │
│    • On-the-ground fraud architects, RASP engineers, and settlement ops      │
│    • Own specific topic records (Mules, Mobile AppSec, Reconciliations)     │
│    • 100% async delta-reviews via email, WhatsApp, or 1-click web forms     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. TECHNICAL MAINTAINERS & AI AGENTS (Code, Git & Operations)               │
│    • Manage repository infrastructure, GitHub Actions CI, and Astro builds  │
│    • Act as 'Git Proxies' translating Domain Expert feedback into Markdown   │
│    • Run daily RSS watchers and enforce double-ledger attestation parity    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Why Continuous Full-Page Validation Fails

In traditional documentation projects, regulatory updates create an impossible maintenance trap:
1. **The Blanket Invalidation Dilemma:** If an RBI circular amends a single paragraph (e.g., shortening a chargeback TAT or revising a cooling period), treating the entire page as "unverified" invalidates dozens of unchanged, mathematically sound controls and mechanism descriptions.
2. **The Solo-Reviewer Bottleneck:** No single human can continuously re-read hundreds of pages of primary legal text, operating circulars, and evidence ledgers across the entire Indian financial stack.
3. **The Non-GitHub Reality:** Most senior risk heads and bank compliance officers will never create a GitHub account, format Markdown, or approve a pull request. The platform must meet them in their natural tools (Email, WhatsApp, Google Docs, Web Forms).

---

## 3. The Two-Tier Verification Model

Review is partitioned into **Baseline Certification** and **Incremental Delta Verification**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TWO-TIER VERIFICATION LIFECYCLE                       │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. BASELINE CERTIFICATION (Full)     │ 2. INCREMENTAL DELTA-REVIEW (Diff)   │
│ • Conducted once per major milestone │ • Triggered on regulatory updates    │
│ • Inspects overall mechanism truth,  │ • Inspects ONLY the specific diff    │
│   telemetry, and control logic       │ • Preserves baseline certification   │
│ • Signed by Domain Expert / Lead     │ • Approved via email/web-form brief  │
│ • Recorded: `baselineCertifiedDate`  │ • Recorded: `lastDeltaReviewer`      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Tier A: Baseline Certification (The Foundation)
- A **Domain Expert / Topic Lead** reviews the record, verifies assertions in `research/evidence/<ID>.md`, and confirms the mechanism matches real-world production realities.
- **Output:** The record is promoted to `reviewStage: reviewed` (or `published`).
- The baseline certification remains permanent for the core mechanisms, failure modes, and architectural controls.

### Tier B: Incremental Delta Verification (The Maintenance Loop)
- When a regulatory feed watcher (`scripts/watch-regulators.py`) or contributor detects an amendment, addendum, or new circular:
- A maintainer or agent drafts a concise **3-bullet brief** and opens an isolated PR.
- **The page is NOT reset to `draft`.** The baseline remains certified.
- The Topic Lead reviews **only the 3-bullet diff** via email or form (takes 2 minutes).
- Upon confirmation, the maintainer commits the update with attribution and updates `lastSourceCheck: "YYYY-MM-DD"` and `lastDeltaReviewer: "<Expert Name>"`.

---

## 4. The 5 Functional Domain Expert Working Groups

Every canonical record in the Atlas is assigned to one of five **Domain Working Groups**:

| Domain Working Group | Focus & Scope | Assigned Canonical Records | Target Domain Expert Profile |
|---|---|---|---|
| **1. Mobile App Security & Authentication** | SIM binding, device fingerprinting, RASP, remote-access app blocks, biometrics, 2FA. | • `UPI-003` (Account takeover & binding)<br>• `UPI-008` (Untrusted apps & RASP)<br>• `UPI-009` (Authentication context)<br>• `UPI-011` (Failed auth lockouts) | Mobile AppSec Engineers, RASP Specialists, Identity Architects (PhonePe, CRED, GPay Android leads) |
| **2. Fraud Detection & Mule Syndicates** | Burst transfer velocity, uncharacteristic outbound volume, mule accounts, MNRL hygiene. | • `UPI-001` (Outbound velocity)<br>• `UPI-002` (Mule account funnel)<br>• `UPI-010` (Enterprise EFRM monitoring)<br>• `UPI-012` (Merchant onboarding) | Fraud Data Scientists, EFRM Managers, Bank AML Investigators (HDFC, ICICI, Razorpay Risk) |
| **3. Social Engineering, Scams & Merchants** | Collect request spoofing, fake support numbers, QR cashback tricks, merchant onboarding. | • `UPI-004` (Collect request deception)<br>• `UPI-006` (QR cashback deception)<br>• `UPI-007` (Fake support impersonation) | Trust & Safety Product Managers, Consumer Fraud Prevention Leads |
| **4. Settlement, Reconciliations & Operations** | URCS settlement cycles (AUTH vs DC1/DC2), 24h bank reconciliation, PA escrow exceptions. | • `UPI-005` (Payment status reconciliation)<br>• `UPI-014` (Settlement exceptions) | Core Banking Engineers, Settlement Ops, Payment Switch Architects (Juspay, Cashfree Ops) |
| **5. Dispute Routing, Liability & Policy** | URCS/UDIR chargebacks, Banking Ombudsman TATs, zero/limited customer liability, scheme rules. | • `UPI-013` (Dispute routing & UDIR)<br>• `UPI-015` (Customer liability)<br>• `UPI-016` (Risk discussion paper)<br>• `UPI-OVERVIEW` (Ecosystem explainer) | Compliance Officers, Regulatory Counsel, Fintech Grievance Officers |

---

## 5. Domain Expert Identity & Credential Verification Protocol

To prevent spoofing and ensure only genuine practitioners certify content, the Atlas enforces a strict verification protocol before granting public attribution:

1. **Institutional Email Verification:** Confirmation via official corporate/banking address (`@bank.com`, `@fintech.com`).
2. **Professional Cross-Check:** Public LinkedIn profile verification, speaking engagements (Nullcon, cfa, Fintech summits), or GitHub security repositories.
3. **Mutual Peer References:** Confirmation by existing Advisory Panel members or known ecosystem peers.
4. **Attribution Privacy Options:**
   - **Full Public Credit:** *"Topic Lead: [Name] — Head of Fraud Operations, [Fintech/Bank]"*
   - **Anonymized Verified Credit:** *"Topic Lead: Senior Payment Security Architect at a Tier-1 Indian Scheduled Commercial Bank (Verified by Atlas Maintainers)"*

---

## 6. Communication & Alert Notification Roadmap

How maintainers communicate circular changes to non-GitHub Domain Experts:

- **v1 Baseline (Immediate / Semi-Automated):**
  - Daily RSS watchers (`watch-regulators.py`, `watch-practitioners.py`) flag newly discovered circulars and output `report.md`.
  - Maintainers copy the auto-generated 3-bullet summary into a short email or WhatsApp message to the registered Topic Lead.
  - The Topic Lead confirms or edits in 2 minutes; the maintainer commits the signed diff.
- **v2 Automation Roadmap (Future Expansion):**
  - **Automated Webhook Dispatch:** When a PR with `area/mules` or `area/appsec` is opened, a GitHub Action automatically triggers an email/WhatsApp notification with the diff summary to the registered Domain Expert via SendGrid/Twilio API.
  - **Full Membership & Newsletter Platform:** If the platform scales to hundreds of community contributors, implement self-service login, role preferences, and automated digest newsletters. For v1, maintainers preserve zero-backend simplicity with direct peer contact.
