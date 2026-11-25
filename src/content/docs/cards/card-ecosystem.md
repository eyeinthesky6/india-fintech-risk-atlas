---
title: Card Ecosystem & Clearing Architecture
description: Overview of the 4-party card payment model in India, dual-message clearing flows, CoFT tokenization rails, and interchange risk boundaries.
recordId: CARD-OVERVIEW
recordType: explainer
products:
  - cards
theme: overview
lifecycle:
  - processing
  - settlement
actors:
  - cardholder
  - merchant
  - acquirer-bank
  - issuer-bank
  - card-network
  - payment-aggregator
evidenceLayers:
  - official
  - industry
  - atlas
lastSourceCheck: "2026-11-25"
reviewStage: source-checked
---

## What it is

The Indian card payment ecosystem operates predominantly on the international **4-Party Model** (Cardholder, Merchant, Acquirer Bank, and Issuer Bank) facilitated by authorised Card Networks (RuPay, Visa, Mastercard, American Express). Transactions route through two distinct operational messages: **Dual-Message System (DMS)**, separating real-time authorization holds from batch settlement, or **Single-Message System (SMS)**, common in ATM cash withdrawals and PIN-based debit POS.

Under Reserve Bank of India (RBI) mandates, all domestic Card-Not-Present (CNP) e-commerce transactions require **Card-on-File Tokenisation (CoFT)**, barring merchants and payment aggregators from storing 16-digit Primary Account Numbers (PAN), and **Additional Factor of Authentication (AFA)** with at least one dynamic authentication factor.

```
┌────────────┐               ┌────────────────────┐               ┌─────────────┐
│ Cardholder │──(Presents)──►│ Merchant / Web / PA│──(Auth Req)──►│Acquirer Bank│
└────────────┘               └────────────────────┘               └──────┬──────┘
                                                                         │
                                                                         ▼
┌────────────┐               ┌────────────────────┐               ┌─────────────┐
│Issuer Bank │◄──(Auth Req)──│    Card Network    │◄──(Routes)────│Payment Switch
└─────┬──────┘               │(RuPay/Visa/MC/Amex)│               └─────────────┘
      │                      └────────────────────┘
      ▼
(Verifies Balance, Limit, AFA & Token Cryptogram)
```

---

## Impact

- **Cardholders:** Subject to unauthorized billing, card-not-present fraud, hidden subscription recurring debits, and ATM cloning if chip-and-PIN fallbacks are misconfigured.
- **Issuers & Acquirers:** Exposure to chargeback dispute liability, cross-border fraud losses, interchange settlement risk, and regulatory compensation penalties (₹100/day under RBI Harmonisation of TAT) for delayed dispute credits.
- **Ecosystem:** Settlement gridlock when merchant acquirers or payment aggregators suffer escrow reconciliation breaks between batch clearing files and network net settlement statements.

---

## Common patterns

### Pattern 1: Dual-Message Authorization vs. Presentment Discrepancy
In e-commerce and hotel/fuel pre-authorizations, the issuer places a temporary hold on the cardholder's credit limit or available balance during authorization (`Auth`). If the merchant does not capture or submit the clearing presentment file within the validity window (typically 5 to 7 days), the hold expires, yet delayed presentment files may force settlement debits unexpectedly, triggering customer disputes.

### Pattern 2: Card-on-File Tokenization (CoFT) De-tokenization Mismatch
Merchants invoke tokenized checkouts where a cryptographic token replaces the PAN. The payment aggregator routes the token to the Card Network Token Service Provider (TSP). If the TSP cryptogram fails validation (e.g. timestamp skew, domain restriction mismatch), the transaction is rejected without exposing cardholder PANs.

### Pattern 3: International Card-Not-Present (CNP) 2FA Bypass
Domestic transactions strictly enforce RBI AFA (2FA OTP/biometrics). However, foreign merchants routing through offshore acquirers outside India may initiate transactions via 1-factor paths (card number + expiry + CVV), bypassing OTP and creating cross-border chargeback exposure unless international limits are disabled by default.

---

## What to do

| Basis | Owner | Action |
|---|---|---|
| **RBI Master Direction (2022)** <a href="#ref-1">[1]</a> | **Issuer bank** | Implement mandate controls allowing cardholders to dynamically toggle and set custom limits for domestic/international, online (CNP), POS (CP), and contactless ATM transactions via mobile banking. |
| **RBI CoFT Mandate** <a href="#ref-2">[2]</a> | **Payment aggregator & Merchant** | Purge stored plain PAN/CVV records from merchant databases; use network-issued tokens for recurring and express checkout flows with explicit cardholder consent. |
| **RBI AFA Directions (2025)** <a href="#ref-3">[3]</a> | **Issuer bank** | Enforce a minimum of two distinct authentication factors for all domestic digital payment transactions, with at least one factor being dynamically generated. |
| **RBI TAT & Compensation** <a href="#ref-4">[4]</a> | **Acquirer & Issuer bank** | Auto-reverse failed POS/e-commerce transactions within `T+5` days; pay proactive compensation of ₹100/day for each day of delay beyond `T+5`. |
| **Atlas Guidance** | **Risk ops & Fraud engines** | Monitor card velocity bursts (e.g. 5 transactions within 60 seconds across distinct merchant categories) to flag automated BIN brute-force probing. |

---

## Watch-outs and validation

- **Legitimate Pre-auth Holds vs. Unauthorized Debits:** Car rentals and hotels place large pre-authorizations. Customer service teams must verify whether a pending debit is an authorization hold or a settled presentment before filing unauthorized electronic transaction claims under RBI rules.
- **Contactless Tap-and-Pay Limits:** Under RBI directions, offline contactless transactions up to ₹5,000 are exempt from AFA PIN entry, requiring issuers to maintain aggressive aggregate daily velocity thresholds to limit physical card theft exposure.
- **Testing Method:** Validate CoFT failure handling in staging by injecting expired cryptograms, invalid token domain restrictions, and simulated issuer timeouts to verify that payment gateways fail closed without falling back to plain-text PAN storage.

---

## References and review history

1. <a id="ref-1"></a>**RBI Master Direction – Credit Card and Debit Card – Issuance and Conduct Directions, 2022** (`RBI/DoS/2022-23/92`, updated 2024/2026). [https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12300](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12300).
2. <a id="ref-2"></a>**Tokenisation – Card Transactions – Extending Scope of Permitted Devices** (`RBI/DPSS/2021-22/96`, Sep 7, 2021). [https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12152&Mode=0](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12152&Mode=0).
3. <a id="ref-3"></a>**RBI Authentication mechanisms for digital payment transactions Directions, 2025** (`RBI/2025-26/79`, Sep 25, 2025). [https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0).
4. <a id="ref-4"></a>**RBI Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions** (`RBI/2019-20/67`, Sep 20, 2019). [https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0).
