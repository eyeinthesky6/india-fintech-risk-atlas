# Card primary-source register

> **Internal audit ledger:** Master source register for Credit, Debit, and Prepaid Cards.  
**Last audited:** 2026-11-25 (source-checked against directly retrieved statutory RBI directions).

## 1. Directly retrieved primary RBI & statutory card documents

| ID | Publisher & document | Reference & date | Applicability & effective status | Verified provisions used in Atlas |
|---|---|---|---|---|
| `RBI-2022-CARD-MD` | [RBI Master Direction – Credit Card and Debit Card – Issuance and Conduct Directions, 2022](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12300) | `RBI/DoS/2022-23/92` (`DoS.CO.CSITEG.No.S-122/31-01-015/2022-23`), Apr 21, 2022 (updated 2024/2026) | All Scheduled Commercial Banks (excl. Payments Banks), NBFCs (`Ch. I §3`); in force | Underwriting & card issuance (`Ch. II §6`); closure TAT within 7 working days (`§8`); billing dispute redressal within 30 days (`§10`); fraud monitoring, customer alerts & compensation (`Ch. VI §23`); terms & conditions, KFS |
| `RBI-2021-COFT` | [Tokenisation – Card Transactions – Extending Scope of Permitted Devices](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12152&Mode=0) | `RBI/DPSS/2021-22/96` (`CO.DPSS.POLC.No.S-516/02-14-003/2021-22`), Sep 7, 2021 | All authorised payment system providers and participants | Prohibits storage of actual card data (CoF) by merchants/PAs; permits Card-on-File Tokenisation (CoFT) via Card Networks/Issuers; cryptogram verification rules |
| `RBI-2025-AUTH` | [RBI Authentication mechanisms for digital payment transactions Directions, 2025](https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0) | `RBI/2025-26/79` (`CO.DPSS.POLC.No. S 668/02-14-015/2025-2026`), Sep 25, 2025 | All domestic Payment System Providers and Participants (`§4`); compliance by Apr 1, 2026 (`§3`) | Min 2 distinct factors (`§6(a)`); at least 1 dynamic factor for non-CP transactions (`§6(b)`); risk-based checks (`§8`); issuer responsibility (`§9`); Annexure-1 exemptions (e-mandates, contactless NFC tap-and-pay up to ₹5,000) |
| `RBI-2019-TAT` | [RBI Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693&Mode=0) | `RBI/2019-20/67` (`DPSS.CO.PD No.629/02.01.014/2019-20`), Sep 20, 2019 | All domestic authorised payment systems (banks and non-banks) | Card-to-Card transfer auto-reversal `T+1`; ATM cash withdrawal auto-reversal `T+5` (`₹100/day` beyond `T+5`); POS/E-Commerce auto-reversal `T+5` (`₹100/day` beyond `T+5`) |
| `RBI-2017-LIAB` | [RBI Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions](https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=11040) | `RBI/2017-18/15` (`DBR.No.Leg.BC.78/09.07.005/2017-18`), Jul 6, 2017 | SCBs, SFBs, PBs (baseline customer liability) | Zero liability for third-party breach reported within 3 working days; limited liability 4–7 working days; shadow credit within 10 working days (`§9`) |

---

## 2. Verification rules
- All claims citing statutory directions map directly to specific chapter and section locators.
- CoFT tokenization rules require exact distinction between token requester (merchant/PA) and token service provider (card network/issuer).
