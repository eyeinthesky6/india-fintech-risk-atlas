---
title: Collect-request deception
description: UPI-004 — social engineering around payment direction, P2P collect discontinuation, and P2M pull controls.
recordId: UPI-004
products:
  - upi
recordType: fraud-pattern
theme: social-engineering
lifecycle:
  - initiation
  - authorization
actors:
  - payer
  - tpap
  - psp-bank
  - remitter-bank
  - merchant
evidenceLayers:
  - official
  - industry
  - atlas
reviewStage: source-checked
lastSourceCheck: "2026-11-23"
---

## What it is
A scammer sends a UPI payment request and tricks the victim into thinking that approving the popup and entering their UPI PIN will *credit* money into their account. Because authorization prompts can look routine when someone is rushed or coached on a call, victims unknowingly approve money *leaving* their account.

## Impact
- **Customer:** Immediate, real-time debit that the victim authorized under deception, leading to disputed recovery.
- **Bank & PSP:** High APP-scam complaint load and regulatory liability exposure where clear, specific scam warnings were missing.
- **Merchant & App:** Legitimate merchant pull checkouts lose trust and conversion when users fear collect popups.

## Common patterns
- **Fake marketplace buyer:** A buyer pretends to send payment for a listed item and instead sends a collect request.
- **Fake refund or prize:** A caller tells the customer to approve a pending prompt and enter their UPI PIN to receive cashback or a refund.
- **Urgency coaching:** The scammer stays on the line rushing the victim past the screen before they check payment direction.

## What to do (rules and mitigations)

| Basis | Owner | Action |
|---|---|---|
| Regulatory | Banks, PSPs, Apps | Discontinue all Person-to-Person (P2P) UPI Collect requests (banned beyond Oct 1, 2025). Keep only Merchant (P2M) collect flows active. |
| Regulatory | Commercial banks | Treat deception- or coercion-induced approvals as fraudulent transactions (effective Jan 1, 2027), and record whether directed scam warnings were shown and ignored. |
| Industry practice | Merchants, PAs | Favor app-to-app UPI Intent over Collect in mobile checkouts; keep P2M Collect and Dynamic QR mostly for desktop checkouts and exempted flows such as IPO mandates. |
| Atlas guidance | PSPs, Issuer banks | Enforce P2P collect blocks at the switch and PSP layers, and verify merchant MID/MCC records before routing any pull request. |
| Atlas guidance | UPI Apps, Banks | Show unmistakable debit framing ("Paying Rs X to verified merchant — money leaves your account") with higher-friction warnings on unusual collect prompts. |

## Watch-outs and validation
- **Legitimate lookalikes:** Desktop e-commerce checkouts, recurring utility or subscription bills, and IPO ASBA-via-UPI mandates where the payer expects a pull request.
- **Signals needed:** Initiation channel (`P2P` vs `P2M` collect vs `intent`), payee VPA/MID/MCC, payer-payee prior history, device/app context, and notification timing.
- **How to validate:** Run negative switch tests confirming P2P collect requests fail cleanly, test user comprehension of debit-direction screens, and track drop-off vs. scam loss when warnings trigger.

## References and review history
1. NPCI, [`NPCI/UPI/OC/220/2025-26`: Discontinuing the service of UPI Collect Request for Person to Person (P2P) transactions](https://www.npci.org.in/uploads/UPI_OC_No_220_FY_2025_26_Discontinuing_the_service_of_UPI_Collect_Request_for_Person_to_Person_P2_P_transactions_3fb30c60d7.pdf) (Jul 29, 2025; effective Oct 1, 2025) — applies to member banks, PSPs, and TPAPs/UPI Apps; P2M Collect remains distinct (browser-checked Nov 23, 2026).
2. NPCI, [UPI Circulars index](https://www.npci.org.in/circulars/upi) — searched 2025–2026 circulars via browser on Nov 23, 2026; no public circular restricting mobile manual VPA checkout fields was listed.
3. RBI, [Commercial Banks – Responsible Business Conduct Third Amendment Directions, 2026](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=13543&Mode=0), `RBI/2026-27/167` (Jun 24, 2026; effective Jan 1, 2027) — applies to commercial banks excluding SFBs, PBs, RRBs, and LABs (`§§3(2), 4(15A), 4(20C)(iii)`), accessed Nov 23, 2026.
4. Razorpay, [UPI Intent vs Collect: Which Flow Actually Works Better in 2026?](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/) (Apr 9, 2026) — company-reported guide noting Feb 2026 mobile-VPA restrictions (attributed solely to Razorpay pending public NPCI circular listing), accessed Nov 23, 2026.

**Review status:** Official NPCI `OC/220/2025-26`, RBI `RBI/2026-27/167`, and Razorpay sources checked 2026-11-23; independent reviewer: `PENDING`.
