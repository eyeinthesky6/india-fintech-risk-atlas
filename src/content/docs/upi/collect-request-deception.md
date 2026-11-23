---
title: Collect-request deception
description: UPI-004 — social engineering around payment direction, P2P collect discontinuation, and P2M pull controls.
recordId: UPI-004
products:
  - UPI
recordType: fraud-pattern
recordTypeLabel: Fraud pattern
theme: social-engineering
themeLabel: Social engineering & scams
lifecycle:
  - initiation
  - authorization
actors:
  - Payer
  - TPAP
  - PSP bank
  - Remitter bank
  - Merchant
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: draft
blockerNote: "Provisional third-party mirror used for NPCI/UPI/OC/220/2025-26; direct npci.org.in returned HTTP 403; independent review pending."
lastSourceCheck: "2026-11-23"
---

## Risk mechanism and operational gap
In collect-request deception, a fraudster initiates or mimics a payment request while telling the victim that approving the notification and entering their UPI PIN will *credit* money to their account (for example, an online marketplace buyer, prize, or refund). Because authorization steps visually resemble other UPI flows, hasty or coerced users mistake a debit approval for an incoming credit.

Operational gaps arise when user interfaces fail to emphasize transaction direction ("Money is leaving your account") or when legacy Person-to-Person (P2P) pull rails remain exposed alongside legitimate Person-to-Merchant (P2M) collect flows.

## Layer 1 — Official regulatory and scheme context
- **NPCI P2P Collect discontinuation (provisional mirror):** According to a third-party legal mirror of NPCI circular `NPCI/UPI/OC/220/2025-26` (dated July 29, 2025), NPCI directed all UPI member banks, PSPs, and third-party apps to discontinue UPI Collect Request for **P2P** transactions so that no P2P Collect transaction is initiated, routed, or processed beyond **October 1, 2025**. *Because direct access to `npci.org.in` returned `HTTP 403 Forbidden` on 2026-11-23, this circular requires confirmation against the official NPCI archive.* [1][2]
- **Authorised Push Payment (APP) scam shift:** RBI's *Discussion Paper – Exploring safeguards in digital payments to curb frauds* (Apr 9, 2026; non-binding consultation) notes that technical account takeovers have declined relative to APP scams where victims are manipulated into authorizing genuine transfers (§x). [3]
- **Deception/coercion & warning relevance (`RBI/2026-27/167`):** Under the *Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026* (June 24, 2026, applying to commercial banks excluding SFBs/PBs/RRBs/LABs for EBTs on or after **Jan 1, 2027**), `§4(15A)` defines a *Fraudulent EBT* to include transactions executed by a customer granting approval under coercion, deception, or duress, while `§4(20C)(iii)` lists ignoring specific, directed, and clear scam warnings from the bank among factors in customer negligence. [4]

## Layer 2 — Company-reported industry practices
- **Shift from P2M Collect to Intent on mobile (`company-reported`):** Razorpay's April 9, 2026 engineering guide (*UPI Intent vs Collect*) distinguishes app-to-app UPI Intent from server-triggered P2M Collect (which relies on manual VPA entry and notification wait) and notes February 2026 NPCI guidelines restricting manual VPA input fields in mobile-native checkouts while retaining P2M Collect / Dynamic QR for desktop and exempted flows such as IPO mandates. [5]

## Layer 4 — Candidate controls and data prerequisites
- **Enforce scheme rail boundaries (PSPs / issuer banks / apps):** Verify at switch and PSP orchestration layers that P2P Collect requests cannot be initiated or processed post-cutover, limiting pull requests strictly to vetted P2M merchant flows with validated MCC/MID records.
- **Direction-first confirmation & directed scam warnings (TPAPs / banks):** Surface unambiguous debit framing ("Paying ₹X to [Verified Payee] — PIN authorizes money leaving your account"), verified merchant/legal names, and dynamic high-friction warnings on anomalous collect originations (`§4(20C)(iii)` alignment).
- **Data prerequisites:** transaction initiation channel (`P2P` vs `P2M` collect vs `intent`), payee VPA/MID/MCC, payer-payee prior history, device/app context, notification timestamps.

## False positives, customer impact, and validation
- **Legitimate lookalikes:** Genuine P2M e-commerce desktop checkouts, utility/subscription bills, and IPO ASBA-via-UPI mandates where a collect request is legitimately expected by the payer.
- **Validation:** Run switch-level negative tests ensuring blocked P2P collect attempts fail cleanly, audit checkout deep-link/collect UI comprehension, and measure drop-off vs. fraud reduction when directed scam warnings trigger.

## References and review history
1. NPCI circular `NPCI/UPI/OC/220/2025-26` (Jul 29, 2025), *Discontinuing the service of UPI Collect Request for Person to Person (P2P) transactions* — [provisional third-party mirror](https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/45492/NPCI-issued-a-notification-regarding-the-discontinuation-of-the-service-of-UPI-Collect-Request-for-Person-to-Person-transactions-August122025.pdf) (visually read Nov 23, 2026; official NPCI confirmation pending).
2. NPCI, [UPI Product Overview](https://www.npci.org.in/what-we-do/upi/product-overview) & [UPI Circulars](https://www.npci.org.in/circulars/upi) — **HTTP 403 Forbidden** on Nov 23, 2026.
3. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810), Apr 9, 2026 (§x; non-binding), accessed Nov 23, 2026.
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167`, Jun 24, 2026 (`§§3(2), 4(15A), 4(20C)(iii)`), accessed Nov 23, 2026.
5. Razorpay, [UPI Intent vs Collect: Which Flow Actually Works Better in 2026?](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/), Apr 9, 2026, accessed Nov 23, 2026 (company-reported).

**Review status:** RBI and Razorpay sources checked 2026-11-23; NPCI original blocked (`HTTP 403`) / provisional mirror used; independent reviewer: `PENDING`.
