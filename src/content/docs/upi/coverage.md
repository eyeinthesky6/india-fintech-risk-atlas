---
title: Coverage and verification status
description: What the UPI compendium includes, which records are source-checked, and what release blockers remain.
---

## Included in the research collection

- **17 UPI topic entries** spanning scheme architecture, social engineering (collect, QR/cashback, fake support), identity/access/authentication (ATO/device binding, untrusted apps/remote access, MFA, failed auth), monitoring/mules/merchants (outbound velocity, EFRM governance, mule-account funnels, merchant/PA onboarding), reconciliation/disputes/protection (order status & webhooks, interbank settlement exceptions, ODR/disputes, customer liability & protection), and policy consultation (RBI April 2026 Discussion Paper).
- **Engineering & reference pages:** [Risk-stack playbook](/india-fintech-risk-atlas/upi/risk-stack-playbook/), [Operator practices & empirical research](/india-fintech-risk-atlas/upi/operator-insights/), [UPI source register](/india-fintech-risk-atlas/upi/sources/), and [UPI glossary](/india-fintech-risk-atlas/upi/glossary/).

## Current verification status (audited 2026-11-23)

| Verification bucket | Count | Records | Status notes |
|---|---|---|---|
| **Source-checked drafts** | 10 | `UPI-001`, `UPI-002`, `UPI-003`, `UPI-005`, `UPI-009`, `UPI-010`, `UPI-011`, `UPI-012`, `UPI-015`, `UPI-016` | All cited primary RBI, PIB, Razorpay, Cashfree, Stripe, and `arXiv` sources directly opened and checked; **independent second-reviewer sign-off pending** |
| **Drafts blocked on `npci.org.in`** | 7 | `UPI-OVERVIEW`, `UPI-004`, `UPI-006`, `UPI-007`, `UPI-008`, `UPI-013`, `UPI-014` | RBI/industry sources checked, plus two third-party NPCI circular mirrors visually read (`NPCI/2025-26/IS/003`, `NPCI/UPI/OC/220/2025-26`); direct `npci.org.in` URLs returned `HTTP 403 Forbidden` |
| **Independently reviewed / published** | 0 | None | Separate reviewer has not yet re-opened and signed off claims |

## Remaining release blockers

- **Independent second-reviewer verification** for all 17 records (`Independent reviewer: PENDING`).
- **Direct NPCI circular & FAQ verification** via an authorized browser session (`www.npci.org.in` returned `HTTP 403 Forbidden` to automated fetches on 2026-11-23), including confirming provisional third-party mirrors and current UDIR/dispute timelines.
- **Verified Indian practitioner observations** (zero LinkedIn practitioner posts promoted in v1).
- **Repository visibility, GitHub Pages activation, and branch protection** (confirm live deployed Pages URL after merge).

The presence of an article—or a passing static build—is **not** evidence of independent review. Do not present draft entries as verified compliance guidance.

[Review the evidence and release audit](https://github.com/eyeinthesky6/india-fintech-risk-atlas/blob/main/docs/UPI_RELEASE_AUDIT.md).
