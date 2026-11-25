# UPI coverage delta — 25 November 2026

This is a bounded research audit, not a certification of completeness. Existing records cover cross-cutting risks; a dedicated product feature may require an additive section or new record only after duplicate review.

| Area | Evidence and locator | Finding / next action |
|---|---|---|
| Biometric and Aadhaar PIN setup/reset | [NPCI OC-226](https://www.npci.org.in/uploads/UPI_OC_No_226_FY_2025_26_Introduction_of_Additional_Authentication_methods_in_UPI_42c3693399.pdf), pp. 1–2, §§1–2 and guidelines 1–5 and 7, issuer PDF inspected | UPI-009 describes the initial limit and distinguishes app, PSP and issuer responsibilities. Verify the current rollout limit and later member-only changes. |
| UPI Lite | [RBI/2024-25/93](https://www.rbi.org.in/scripts/FS_Notification.aspx?Id=12752), paras 1–3, opened | Confirm differentiated Lite limits and immediate applicability of the Dec 2024 amendment; verify later changes, distinguish Lite from Lite X and review funding, refund and reconciliation controls. |
| Credit-line UPI | [RBI/2023-24/58](https://www.rbi.org.in/Scripts/NotificationUser.aspx/upload/Scripts/NotificationUser.aspx?Id=12532), paras 2–3 and updated addressee, opened; [RBI/2026-27/152](https://www.rbi.org.in/Scripts/NotificationUser.aspx/scripts/scripts/NotificationUser.aspx?Id=13528), para 4, new Ch. IIA 5A–5C, opened | Consent and eligible issuer scope, credit policy and underlying credit-facility prudential treatment require explicit mapping. Distinguish credit lines from RuPay card funding. Check consolidated directions and later amendments. |
| AutoPay | [NPCI OC-223](https://www.npci.org.in/uploads/UPI_OC_No_223_FY_2025_26_Enhancement_of_UPI_Autopay_88b38535cb.pdf), sections 1–2 and closing implementation paragraph, opened | Portability, user initiation, purpose-limited use of mandate data and merchant identity continuity warrant dedicated lifecycle review; confirm amendments and base e-mandate rules. |
| UPI Circle | [NPCI product page](https://www.npci.org.in/product/upi-circle), direct retrieval returned JS shell | Research lead only; obtain original operating circular and review consent, delegation scope, revocation and disputes. |
| RuPay card on UPI | [NPCI product page](https://www.npci.org.in/product/rupay/credit-card-on-upi), discovery lead | Obtain operating circular; compare eligible transaction classes, merchant acceptance, refunds and chargebacks. |
| Cross-border UPI | Original jurisdiction/partner rules not inspected | Research open; separate inbound visitor wallets from outbound merchant payments and remittance arrangements. |
| Third-party outsourcing | Original applicable directions not inspected in this delta | Review bank and non-bank scopes separately; distinguish outsourced functions from scheme participant obligations. |
| Regulatory versioning | Cross-cutting | Add claim-specific effective date, amendment and supersession checks; do not infer current force from source date or review stage. |

The original NPCI IS/003 member circular remains an independent source-access blocker. No independent reviewer boxes have been changed. Existing record-level verification date is retained because the older baseline was not fully rechecked.

## Completion gate

Each follow-up must inspect primary text, map exact actor and effective period, check later amendments, add claim-level evidence and preserve independent review status. Search snippets and JS-only pages are leads, not primary verification.
