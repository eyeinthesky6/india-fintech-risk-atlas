# Evidence ledger — CARD-OVERVIEW

**Record ID:** `CARD-OVERVIEW`  
**Record Title:** Card Ecosystem & Clearing Architecture  
**Product:** `cards`  
**Review Stage:** `source-checked`  
**Last Source Check:** `2026-11-25`  

---

## Assertion Ledger

| Claim ID | Evidence Layer | Exact Claim Statement | Primary Source Title | Exact Section Locator | Scope & Effective Status | Verification Result |
|---|---|---|---|---|---|---|
| `CARD-OV-001` | `official` | Issuer banks must provide controls allowing cardholders to dynamically toggle and set custom limits for domestic/international, online (CNP), POS (CP), and contactless transactions. | RBI Master Direction – Credit Card and Debit Card – Issuance and Conduct Directions, 2022 | `Ch. VI §23` & `Ch. II §6` | Scheduled Commercial Banks & NBFCs; in force | `verified` |
| `CARD-OV-002` | `official` | Plain PAN and CVV data shall not be stored in card transactions by merchants or payment aggregators; tokenized transactions must use Card-on-File Tokenisation (CoFT). | RBI Tokenisation – Card Transactions Circular | `CO.DPSS.POLC.No.S-516/02-14-003/2021-22 §2` | All payment system participants; in force | `verified` |
| `CARD-OV-003` | `official` | Digital payment transactions require a minimum of two distinct factors of authentication, with at least one dynamic factor for non-card-present transactions. | RBI Authentication mechanisms for digital payment transactions Directions, 2025 | `RBI/2025-26/79 §6(a)-(b)` | Domestic payment system providers; compliance by Apr 1, 2026 | `verified` |
| `CARD-OV-004` | `official` | Failed POS and e-commerce card transactions must be auto-reversed within T+5 days, with proactive compensation of ₹100/day for delays beyond T+5. | RBI Harmonisation of Turn Around Time (TAT) and customer compensation | `RBI/2019-20/67 Annex Sl. 3` | All authorised payment systems; in force | `verified` |
| `CARD-OV-005` | `industry` | Card clearing predominantly operates under dual-message architecture separating real-time auth hold from batch settlement presentment. | Industry clearing specifications (Visa/Mastercard/RuPay rules) | Settlement & Clearing Rules | General card payment switches | `verified` |
| `CARD-OV-006` | `atlas` | Risk ops should monitor velocity bursts to identify automated BIN brute-force probing and card guessing attacks. | Atlas editorial guidance | Analytical recommendation | Operational guidance | `verified` |

---

## Referenced URLs Register
- `https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12300`
- `https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12152&Mode=0`
- `https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0`
- `https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0`
