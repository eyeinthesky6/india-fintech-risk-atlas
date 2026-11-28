---
title: Join the Atlas & Contribute
---

The India Fintech Risk Atlas is an independent, public-good reference platform. We catalog fraud vectors, regulatory controls, and technical operational failure modes across Indian financial products.

We have designed our platform so that **domain experts (bankers, compliance leads, fraud investigators) never have to touch GitHub or write code**, while **software engineers and researchers can contribute through standard Git workflows**.

---

## 🧭 Choose Your Contribution Path

```
                      ┌──────────────────────────────────────┐
                      │   How would you like to contribute?  │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   [I am a Domain Expert / Leader]                [I am an Engineer / Researcher]
   • Bank Compliance / Risk Lead                  • Open-Source Developer
   • Payment Ops / Fraud Architect                • Data & Documentation Analyst
   • Legal & Policy Scholar                       • Astro / Web Engineer
                 │                                               │
                 ▼                                               ▼
         Zero-GitHub Path                                   Git / PR Path
    (2-minute async delta reviews)                    (Task Board & Double-Ledger)
```

---

## 🏛️ Path 1: Domain Experts & Atlas Advisory Panel (Zero GitHub Required)

Most senior risk architects and banking compliance officers do not use GitHub. We guarantee that **you will never be asked to write code, resolve merge conflicts, or manage pull requests.**

- **Advisory Panel:** Give strategic and editorial guidance through quarterly asynchronous reviews.
- **Domain Expert or Topic Lead:** Review short updates in your area as evidence changes.

### How the Zero-GitHub Review Loop Works
1. **Automated Monitoring:** Our automated watcher bots monitor RBI Master Directions, NPCI circulars, and engineering blogs daily.
2. **AI & Maintainer Drafting:** When a change occurs, an AI assistant or technical maintainer drafts a **concise 3-bullet operational summary** and table update.
3. **2-Minute Async Review:** You receive a short brief via email or WhatsApp:  
   > *"RBI has updated the timeline for customer unauthorized debit reporting under Circular X. We drafted this 1-line update to `UPI-015`. Does this reflect what your bank/PSP enforces in production?"*
4. **Attribution:** Choose whether Atlas may credit you by name, professional handle, or an anonymous role. Maintainers confirm the wording with you privately before adding public credit. You can also choose to skip credit.

### Sign up as an advisor or domain expert

[Fill out the advisor signup form](https://docs.google.com/forms/d/e/1FAIpQLSew7FPSHJL3KyBL2u8wONFEDP3JiWzf--Yz3rEN2Bt6aj44bQ/viewform?usp=publish-editor). You can respond without signing in. The Atlas maintainers will use your response to follow up about your role, topics, and any public credit. Your contact details stay private.

### Available Domain Tracks:
- **UPI & Immediate Payments:** Real-time velocity, QR spoofing, collect requests, UDIR dispute flows.
- **Credit & Debit Cards:** CoFT tokenization failures, recurring mandates, chargeback pre-arbitration.
- **Payment Aggregators & Gateways:** Escrow management, merchant KYC, transaction laundering.
- **Digital Lending:** First-Loss Default Guarantees (FLDG), Regulated Entity (RE) oversight, recovery agent ethics.
- **Mule Accounts & AML:** Dormancy-to-burst patterns, shell company accounts, state cybercell freezing orders.
- **Mobile Security & RASP:** Screen-overlay attacks, root bypass, malicious APK detection, biometric step-up.
- **Atlas Advisory Panel:** Strategic institutional oversight, regulatory consultation memos, civil society coordination (e.g. Internet Freedom Foundation - IFF).

---

## 💻 Path 2: Code & Content Contributors (GitHub & Pull Requests)

For developers, technical researchers, and data engineers who want to add new topic records, improve scrapers, or enhance the Astro website.

### Step 1: Register Your Interest
Open a [Contributor Registration Issue](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=contributor-signup.yml). Our welcome bot will immediately guide you to active issues and assign topic labels.

### Step 2: Pick a Work Unit
Check the live [Product Expansion Task Board](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/PRODUCT_EXPANSION_TASKBOARD.md). Work is organized into single, bounded work units (max 1 topic record per PR).

### Step 3: Enforce Double-Ledger Parity
Every new claim or updated row in `src/content/docs/<product>/<ID>.md` must have matching 1:1 entries in:
- `research/evidence/<ID>.md` (Claim-by-claim assertion ledger mapping to one of the 5 evidence layers: `Regulatory`, `Industry practice`, `Community insight`, `Research & academic`, or `Atlas guidance`).
- `research/attestations/<ID>.md` (12-item declaration checklist; note that contributor/author agents **cannot** self-certify reviewer boxes `8–10, 12`).

### Step 4: Run Verification Before Submitting
```powershell
# 1. Verify attestation ledgers and stage parity
python scripts/check-attestations.py --all

# 2. Verify citation freshness and check link health
python scripts/verify-citations.py --offline --all

# 3. Test website build and link integrity
npm run build
```

---

## 🔍 Report an Error or Share Live Operational Feedback

If you spotted an outdated circular, missing carve-out (e.g. Small Finance Bank vs. Commercial Bank), or broken link:

1. **On-Page Error Reporter:** Use the **Report an error** button at the bottom of any topic record to highlight specific text.
2. **Factual Correction Form:** Open a structured [Factual Correction Issue](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=factual-correction.yml) with the primary source link.
3. **Maintainer triage:** A queue receipt confirms that the maintainer's private review queue accepted your report. The GitHub issue option is public.
