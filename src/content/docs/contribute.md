---
title: Contribute & Governance
---

The India Fintech Risk Atlas is an independent, public-good reference platform. We welcome contributions from risk engineers, banking compliance officers, fraud investigators, and civil-society institutions.

---

## 🏛️ Atlas Advisory Panel & Domain Expert Working Groups

Most senior risk and compliance practitioners do not live on GitHub. We have designed our governance so that **domain experts can govern and verify content without writing code, opening pull requests, or managing Git branches.**

### 1. The Atlas Advisory Panel
We are building an **Atlas Advisory Panel** comprising senior fintech risk leaders, digital banking heads, cyber law scholars, and institutional partners (such as the Internet Freedom Foundation - IFF and digital payment councils) who serve as co-owners, governance guardians, and content sponsors.

- **Role:** High-level strategic oversight, policy consultation reviews, and institutional credibility.
- **Commitment:** Quarterly async check-ins; reviewing synthesis memos on major regulatory shifts (e.g. RBI Master Directions, Digital Competition Bill).

### 2. Domain Experts & Topic Leads
For practitioners working directly in fraud operations, payment switches, or InfoSec teams:
- **Scope:** Own a specific domain (Mobile AppSec, Mule Syndicates, Reconciliation, Social Engineering, Disputes).
- **The Zero-GitHub Review Loop:**
  1. Automated bots monitor RBI/NPCI circulars and engineering blogs daily.
  2. Maintainers or AI agents draft a **3-bullet operational summary** and table update.
  3. The Domain Expert reviews the brief via email, WhatsApp, or a simple web form (takes ~2 minutes): *"Does this match what your risk team implements in production?"*
  4. Maintainers commit the verified update with full attribution to the expert.
- **Attribution & Recognition:** Your name, role, and organization are prominently credited on the topic record:  
  *`Topic Lead: [Your Name] — Senior Fraud Architect, [FinTech / Bank]`*  
  *(Optionally anonymized if required by institutional employer policies).*

> **Interested in joining?** Reach out directly to the maintainers or email `atlas@six.tech` to join the Advisory Panel or claim a Domain Expert lead.

---

## 🔍 Report an Error or Share Operational Feedback

You do not need a GitHub account to submit corrections or practical insights:

1. **On-Page Error Reporter:** Click **Report an error** or **Looks accurate** at the bottom of any topic record. You can highlight the exact paragraph or sentence that is outdated or incorrect.
2. **Issue Form:** For structured corrections, use our pre-filled [factual correction form](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=factual-correction.yml) to point out superseded circulars or missing edge cases.
3. **Maintainer Verification:** Maintainers inspect the cited circular, update the evidence ledger, and publish the verified correction.

---

## 💻 Technical & Code Contributions (Pull Requests)

For engineers and researchers who prefer working directly in Git:

1. Click **Edit this page** or fork the repository.
2. Adhere to the [Content Schema](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/CONTENT_SCHEMA.md) and [Research Protocol](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/RESEARCH_PROTOCOL.md).
3. Every record update requires 1:1 double-ledger parity in `research/evidence/<ID>.md` and `research/attestations/<ID>.md`.
4. Run pre-commit checks:
   ```bash
   python scripts/check-attestations.py --all
   npm run build
   ```
5. Maintainers and independent domain reviewers will inspect the diff before merging.
