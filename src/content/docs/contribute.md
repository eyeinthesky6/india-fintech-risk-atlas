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

### How the Zero-GitHub Review Loop Works
1. **Automated Monitoring:** Our automated watcher bots monitor RBI Master Directions, NPCI circulars, and engineering blogs daily.
2. **AI & Maintainer Drafting:** When a change occurs, an AI assistant or technical maintainer drafts a **concise 3-bullet operational summary** and table update.
3. **2-Minute Async Review:** You receive a short brief via email or WhatsApp:  
   > *"RBI has updated the timeline for customer unauthorized debit reporting under Circular X. We drafted this 1-line update to `UPI-015`. Does this reflect what your bank/PSP enforces in production?"*
4. **Attribution:** Once you confirm or tweak the note, the record is published with your attribution:  
   *`Topic Lead: [Your Name] — Head of Fraud Risk, [FinTech / Bank]`* (or anonymized as *`Senior Bank Risk Lead`* if required by your employer).

### How to Sign Up as a Domain Expert:
- For private contact, email your role and domain of interest to `atlas@six.tech`.
- For public registration, open a [Domain Expert Registration Issue](https://github.com/eyeinthesky6/india-fintech-risk-atlas/issues/new?template=domain-expert-signup.yml). Use a professional handle if preferred and share contact details over email.

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
