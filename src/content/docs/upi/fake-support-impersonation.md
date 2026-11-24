---
title: Fake support and grievance impersonation
description: UPI-007 — search-result, social-media, and bogus call-centre impersonation around refunds and failed payments.
recordId: UPI-007
products:
  - upi
recordType: fraud-pattern
theme: social-engineering
lifecycle:
  - servicing
  - dispute
  - recovery
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
  - payment-aggregator
evidenceLayers:
  - official
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
Customers dealing with a `PENDING` transfer, failed order, or delayed refund often search Google or post complaints on social media looking for helpline numbers. Scammers plant fake customer-care numbers in search ads, hijack brand support replies online, or run bogus call centres impersonating banks, TPAPs, or merchants—then collect OTPs/PINs, push remote-access apps, or coach victims into "refund verification" debits.

The root failure mode is **unclear in-app resolution status**, pushing anxious customers outside the app onto open web search.

## Impact
- **Customer:** A minor technical delay turns into full account compromise or secondary APP scam losses.
- **Bank, TPAP & PA:** Double burden of handling both the original transaction query and subsequent fraud reports/NCRP complaints.
- **Brand trust:** Poisoned search listings and fake handles damage confidence in official support channels.

## Common patterns
- **Search-ad customer care poisoning:** Sponsored or spoofed phone numbers appear above genuine bank/merchant help pages when a customer searches for refund help.
- **Social-media complaint hijacking:** Fraudsters watch public posts mentioning bank names, phone numbers, or UTRs and call victims pretending to resolve the ticket.
- **Bogus call-centre coaching:** Callers cite real-sounding transaction context or promise instant reversal if the victim enters a PIN or installs support software.

## What to do (rules and mitigations)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Banks, TPAPs | Provide a visible in-app grievance & failed-transaction dispute section with unique tracking IDs (under RBI ODR rules for TPAPs and digital security directions for banks); route fraud/unauthorized claims to the customer's bank. |
| Regulatory | Commercial banks | Maintain 24x7 fraud reporting channels, put direct reporting links on home pages and mobile apps, add SMS-reply objection numbers inside alerts, and advise customers to report via NCRP / 1930 (effective Jan 1, 2027). |
| Regulatory | Non-bank PSOs | Offer an in-app/website mark-fraud option, 24x7x365 customer and law-enforcement resolution desk, and active anti-phishing / anti-rogue-app monitoring and takedown services. |
| Atlas guidance | TPAPs, PSPs, PAs | Show live settlement/auto-reversal status (`T+1` / `T+5` timers) and 1-tap dispute reporting right on the transaction screen so users never need to search the web for help numbers. |
| Atlas guidance | Banks, TPAPs, PAs | Continuously take down impersonating search ads, social handles, and spoofed support domains; reinforce that official support never asks for PINs, OTPs, or screen sharing. |

## Watch-outs and validation
- **Legitimate lookalikes:** Genuine outbound calls from merchant logistics or outsourced support teams following up on orders. Focus defenses on clarity inside official apps, fast brand-impersonation takedowns, and flagging outbound transfers initiated right after a failed payment.
- **Signals needed:** Brand/domain monitoring alerts, in-app dispute funnel drop-off telemetry, complaint origin tags (`in-app` vs `NCRP/1930` vs `call centre`), and post-failure outbound payment timing.
- **How to validate:** Measure the share of failed-payment inquiries resolved in-app vs external channels, audit takedown turnaround times for fake handles/sites, and run end-to-end tests on 24x7 fraud reporting links.

## References and review history
1. NPCI, [Fraud Awareness](https://www.npci.org.in/fraud-awareness) (*Search Carried through Internet Search Engines*; *Users posting their potential Grievances on Social media platforms*), browser-checked Nov 23, 2026.
2. RBI, [Commercial Banks – Digital Payment Security Controls Directions, 2026](https://www.rbi.org.in/scripts/BS_ViewMasDirections.aspx?id=13642), `RBI/DoS/2026-27/411` — clear in-app grievance section (`§59`) and ODR adherence (`§60`), accessed Nov 23, 2026 (parallel `id=13624` PBs, `id=13633` SFBs).
3. RBI, [Online Dispute Resolution (ODR) System for Digital Payments](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11946&Mode=0), `RBI/2020-21/21` (Aug 6, 2020) — mandatory TPAP in-app dispute lodging (`Annex §5.2`) and unique reference tracking (`§5.4`), accessed Nov 23, 2026.
4. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (Jun 24, 2026; effective Jan 1, 2027 for commercial banks excluding SFBs/PBs/RRBs/LABs) — 24x7 reporting links, alert reply numbers, and NCRP/1930 guidance (`§76G`), accessed Nov 23, 2026.
5. RBI, [Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank PSOs](https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=13751&Mode=0), `RBI/DPSS/2026-27/475` (Nov 5, 2026; Large/Medium immediate, Small Apr 1, 2028) — mark-fraud facility (`§30`), 24x7x365 desk (`§27(d)`), and anti-phishing/anti-rogue-app takedowns (`§27(h)`), accessed Nov 23, 2026.
6. RBI, [Discussion Paper – Exploring safeguards in digital payments to curb frauds](https://www.rbi.org.in/scriptS/PublicationsView.aspx?id=23810) (Apr 9, 2026; non-binding consultation) — cites bogus call centres and impersonation in NCRP fraud patterns (`§xi`), accessed Nov 23, 2026.
7. NPCI, [UPI FAQs](https://www.npci.org.in/faqs/upi) (official UPI Help Assistant and grievance process), browser-checked Nov 23, 2026.
8. NPCI, [Complaint Register](https://www.npci.org.in/complaint-register) (confirms unauthorised/fraud complaints go directly to the customer's bank), browser-checked Nov 23, 2026.

**Review status:** NPCI Fraud Awareness/FAQs/Complaint Register and RBI sources checked 2026-11-23; independent reviewer: `PENDING`.
