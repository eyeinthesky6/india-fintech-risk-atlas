# Public Data Intelligence Roadmap: Open Data for Indian Fintech Risk & Reliability

**Status:** Proposed product direction & research specification.  
**Mission:** Transform fragmented, disparate public disclosures into the definitive open data and risk intelligence layer for Indian payments, serving both the general public and fintech risk practitioners with zero proprietary lock-in.

---

## 1. Universal Regulatory & Official Source Horizon

To ensure the Risk Atlas is exhaustive, we map the Indian regulatory and enforcement ecosystem across four clear tiers of authority. News and media are explicitly treated as **discovery signals**, not primary legal proof.

### Tier 1: Primary Statutory Regulators & Scheme Operators (Binding Law & Rules)
1. **Reserve Bank of India (RBI):**
   - *Departments:* DPSS (Payment & Settlement Systems), DoS (Supervision - CSITEG cybersecurity & fraud monitoring), DoR (Regulation - Customer liability, RBC).
   - *Scope:* Master Directions, binding circulars, discussion papers, Ombudsman annual reports.
2. **National Payments Corporation of India (NPCI):**
   - *Scope:* UPI Steering Committee circulars, Operating Circulars (OC), Technical Circulars (TC), URCS dispute rules, API specifications.
3. **Department of Telecommunications (DoT):**
   - *Scope:* Digital Intelligence Platform (DIP), Mobile Number Revocation List (MNRL), Sanchar Saathi notices, SIM allocation caps.
4. **Financial Intelligence Unit - India (FIU-IND):**
   - *Scope:* PMLA reporting standards, suspicious transaction reporting (STR) red flags, high-risk entity advisories.
5. **Unique Identification Authority of India (UIDAI):**
   - *Scope:* Aadhaar-enabled Payment System (AePS) security circulars, biometric lock protocols, face authentication mandates.
6. **Telecom Regulatory Authority of India (TRAI):**
   - *Scope:* SMS DLT header registration, commercial communications regulations, URL whitelisting in financial SMS.

### Tier 2: Central Ministries & Law Enforcement Coordination (Policy & Enforcement)
7. **Ministry of Finance (MoF) / Department of Financial Services (DFS):**
   - *Scope:* Financial Stability and Development Council (FSDC) digital fraud task forces, public sector bank directives, Parliamentary answers.
8. **Ministry of Home Affairs (MHA) / Indian Cyber Crime Coordination Centre (I4C):**
   - *Scope:* National Cybercrime Reporting Portal (NCRP), National Cyber Helpline (1930), Suspect Registry, MuleHunter.AI operational MoUs.
9. **Ministry of Electronics and Information Technology (MeitY) & CERT-In:**
   - *Scope:* Information Technology Act / Intermediary Rules, DPDP Act compliance, CERT-In cybersecurity advisories, rogue app blocking orders.
10. **State Cyber Crime Cells & Enforcement Agencies (CBI, ED, State Police):**
    - *Scope:* Modus operandi advisories on cross-border mule syndicates, fake payment gateway APKs, and "digital arrest" rings.

### Tier 3: Adjacent Financial Regulators (Cross-Rail & Synergistic Abuse)
11. **Securities and Exchange Board of India (SEBI):**
    - *Scope:* Fraudulent IPO UPI autopay mandates, unauthorized advisory services funded via payment gateways, mule demat accounts.
12. **Insurance Regulatory and Development Authority of India (IRDAI):**
    - *Scope:* Bogus insurance refund schemes exploiting UPI collect requests.

### Tier 4: Judicial Precedents & Tribunals (Enforceability & Precedent)
13. **Supreme Court & State High Courts:**
    - *Scope:* Landmark decisions on customer unauthorized electronic banking liability, police freezing powers under Section 102 CrPC / Section 106 BNSS, and liability for automated debits.
14. **Banking Ombudsman Orders:**
    - *Scope:* Compensation awards for delayed failed-transaction reversals under RBI's T+1/T+5 TAT framework.

### News & Media: The "Alert Signal" Policy
- **Outlets:** *Livemint, Economic Times, Entrackr, Medianama, Inc42, Business Standard.*
- **Policy:** Mainstream news outlets are monitored **solely as early-detection discovery leads**. We never cite journalistic paraphrases as normative regulatory law. When a financial reporter writes "RBI to require 4-hour delay on first-time UPI transfers," we track down the underlying official circular, draft notification, or speech before updating Atlas records.

---

## 2. Publicly Available Data in India: What Exists Today

Contrary to the assumption that payments risk data is locked in private bank databases, Indian institutions publish substantial granular telemetry that is currently fragmented, buried in PDFs, or unindexed:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    FRAGMENTS OF PUBLIC DATA IN INDIA                         │
├─────────────────────────┬────────────────────────────┬───────────────────────┤
│ NPCI Performance Data   │ Parliamentary Disclosures  │ RBI & Ombudsman Data  │
│ • Bank Tech Declines    │ • State-wise fraud counts  │ • Annual FMR totals   │
│ • Business Declines     │ • Amount lost vs recovered │ • Ombudsman complaints│
│ • UPI App market share  │ • Blocked SIMs & IMEIs     │ • Delayed reversal    │
│ • AutoPay success %     │ • Frozen mule accounts     │   compensation counts │
└─────────────────────────┴────────────────────────────┴───────────────────────┘
```

1. **NPCI Bank Performance & Reliability Data (Monthly):**
   - Published for the top 60+ remitter and beneficiary banks.
   - Metrics: Total Volume, Approved %, **Technical Decline (TD) %**, and **Business Decline (BD) %**.
   - *Key finding:* Major commercial banks average <0.1% TD, whereas certain regional/public banks experience periodic spikes >1%, and payments banks regularly show 18–26% BD due to low-balance retries.
2. **NPCI UPI App Metrics (Monthly):**
   - App volume, transaction value, and market share (PhonePe, Google Pay, Paytm, Navi, Cred, etc.) alongside market-share cap adherence tracking.
3. **Parliamentary Disclosures (Lok Sabha & Rajya Sabha Questions):**
   - Formal answers by the Ministry of Finance and MHA providing authoritative numbers:
     - FY 2025–26: >16.3 lakh UPI fraud cases reported involving ₹1,226 crore (average ticket size ~₹7,500).
     - Millions of telecom SIMs disconnected via DoT's ASTR tool and Sanchar Saathi.
     - Over ₹3,000 crore in defrauded assets intercepted in transit via the 1930 helpline.
4. **RBI Annual Fraud & Payment System Indicators:**
   - Fraud Monitoring Returns (FMR) categorized by channel (card, internet, UPI).
   - Digital Banking Ombudsman complaints sorted by category (unauthorized debits, non-reversal of failed transactions, phishing).
5. **Judicial Freezes & CrPC §102 (BNSS §106) Case Records:**
   - High Court rulings documenting secondary and tertiary account freezes where innocent merchants had accounts frozen due to tainted UPI money hops.

---

## 3. What Can Be Built: The Data Product Suite

By turning these public disclosures into structured, versioned open datasets, the Risk Atlas can build two powerful offerings:

### Product Lane A: For the Public (Transparency & Consumer Protection)

1. **The UPI Bank Reliability & Downtime Radar:**
   - *Problem:* A user's payment fails at a store. Is their app broken? Is the merchant's QR down? Or is their bank's core banking system having an outage?
   - *Solution:* An interactive, zero-bloat dashboard showing the monthly and historical **Technical Decline (TD)** rates across major banks.
   - *User value:* Transparent, unbiased data showing which banks are genuinely reliable for UPI.

2. **The "Did I Lose Money on UPI?" Liability & Escalation Calculator:**
   - *Problem:* Victims of UPI fraud don't know their legal rights, miss the 3-day reporting window, and get bounced between the app, bank, and police.
   - *Solution:* A client-side interactive calculator based on RBI 2017 & 2026 Master Directions:
     - *Inputs:* Transaction timestamp, Date reported to bank, Scam type (unauthorized technical debit vs. tricked into entering PIN), Entity type.
     - *Outputs:* Exact maximum statutory liability (Zero vs ₹5,000 vs ₹10,000 vs 100%), required reversal TAT (T+1, T+5, 10-day shadow credit), and an auto-generated formal complaint letter addressed to the bank's Nodal Officer and RBI Ombudsman.

3. **Public Scam & Recovery Trends:**
   - Plain-English breakdown of official parliamentary and I4C data showing the scale, average loss, and real recovery rates across major scam types (digital arrest, part-time job/telegram tasks, fake customer support, investment scams).

---

### Product Lane B: For Practitioners (Risk Engineers, Founders, Compliance Officers)

1. **Open Bank Decline Baselines & Anomaly Dataset (JSON / CSV):**
   - *Problem:* Fintech fraud engines (EFRM) often misinterpret a surge in failed transactions as an account takeover or brute-force attack when it is actually an unannounced bank server degradation.
   - *Solution:* Machine-readable monthly historical baseline datasets of Technical Decline and Business Decline rates per bank.
   - *Engineering value:* Fintech risk engines can calibrate dynamic alert thresholds based on each bank's baseline failure rate.

2. **Mule Account Telemetry & Signal Matrix:**
   - Curating parliamentary, I4C, and academic research on mule account behaviors (dormancy followed by sudden high-velocity transfers, immediate full-balance drain, multiple linked UPI IDs).
   - Synthesizing required signals (MNRL status, IMSI change, cooling period compliance) into an open implementation schema.

3. **Regulatory Dispute Resolution Decision Tree:**
   - An interactive logic tree mapping NPCI's URCS settlement cycles (AUTH cycles 1–10 vs DC1/DC2 dispute cycles) and chargeback TATs (15 calendar days under OC 235).
   - Helps fintech operations teams train support staff and automate dispute routing without expensive compliance software.

---

## 4. Product Positioning & Strategic Moat

| Dimension | Consumer / Public Positioning | Practitioner Positioning |
|---|---|---|
| **Core Promise** | "Know your rights, understand your bank's real reliability, and recover your money." | "The open-source risk telemetry and regulatory baseline before you write payment code." |
| **Tone** | Plain-English, empowering, completely objective, zero ads. | Engineering-grounded, citation-anchored, spec-compliant. |
| **Competitors** | Generic tech blogs, SEO spam, bank complaint forums. | Proprietary compliance suites, expensive consulting firms, paywalled research. |
| **Our Moat** | **Verifiable truth:** Every single calculation, claim, and chart is backed by open government data, statutory directions, or official NPCI metrics. |

---

## 5. Implementation Roadmap (v2 Data Architecture)

```
                       DATA PIPELINE (ZERO-SERVER)
                       
[Official PDF / Web Sources] ──> [Python Ingestion Script]
  • NPCI Bank Metrics              (scripts/ingest-public-metrics.py)
  • Parliament Q&A / PIB                         │
  • RBI FMR Reports                              ▼
                                 [Versioned Git Datasets]
                                   • data/public/bank-declines.json
                                   • data/public/fraud-statistics.json
                                                 │
                                                 ▼
                                 [Static Astro Visualizations]
                                   • Interactive SVGs / Tables
                                   • Client-side Liability Calculator
                                   • Raw Downloadable CSVs / llms.txt
```

1. **Phase 1: Curate the Baseline Data (`data/public/`)**
   - Digitize historical NPCI Bank Performance reports (TD/BD rates for top 40 banks) into clean JSON/CSV.
   - Index the last 3 years of parliamentary questions on UPI fraud statistics.
2. **Phase 2: Build the Public Liability Calculator**
   - Implement an interactive client-side calculator component (`AtlasLiabilityCalculator.astro`) on the Atlas website.
3. **Phase 3: Launch the Bank Reliability Radar**
   - Add a dedicated interactive page (`/upi/bank-performance/`) visualizing technical uptime vs business decline rates.
4. **Phase 4: Open API & Machine-Readable Access**
   - Expose all datasets via static URLs (`/api/v1/bank-performance.json`) and through the planned read-only MCP server.
