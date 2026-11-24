# UPI research coverage and release gates

**Last audited:** 2026-11-23

## Target sections & current status
1. Scheme architecture and participants (`UPI-OVERVIEW` — `draft`, `npci.org.in` HTTP 403)
2. Authentication and account/device security (`UPI-003`, `UPI-009`, `UPI-011` — `source-checked`; `UPI-008` — `draft`, `npci.org.in` HTTP 403 / mirror)
3. Social engineering and customer deception (`UPI-004`, `UPI-006`, `UPI-007` — `draft`, `npci.org.in` HTTP 403 / mirror)
4. Behavioral signals and mule-account patterns (`UPI-001`, `UPI-002`, `UPI-010` — `source-checked`)
5. Merchant onboarding and abuse (`UPI-012` — `source-checked` on RBI PA Master Direction `id=12896`)
6. Reconciliation and transaction status (`UPI-005` — `source-checked`; `UPI-014` — `draft`, `npci.org.in` settlement doc HTTP 403)
7. Disputes, customer protection and recovery (`UPI-013` — `draft`, `npci.org.in` HTTP 403; `UPI-015` — `source-checked`)
8. Policy discussion (`UPI-016` — `source-checked`, marked non-binding)
9. Official source register, operator insights, playbook & glossary (`sources.md`, `operator-insights.md`, `risk-stack-playbook.md`, `glossary.md` — updated 2026-11-23)

## Remaining release blockers
- **Independent second-reviewer sign-off:** all 17 attestations remain `Independent reviewer: PENDING` (`0` records at `reviewed` or `published`).
- **Direct NPCI document audit:** `www.npci.org.in` returned `HTTP 403 Forbidden` on 2026-11-23 across FAQs, Fraud Awareness, Product Overview, Circulars index, and `UPI_Settlement_Process_256f73e1df.pdf`; provisional third-party mirrors (`NPCI/2025-26/IS/003`, `NPCI/UPI/OC/220/2025-26`) require confirmation against `npci.org.in` originals.
- **Named practitioner observations:** none promoted in v1 (zero unverified social posts added).
- **Publishing & branch protection:** make repository public only after rights/review approval, enable GitHub Pages deployment from Actions, verify live site, and require `Validate site` and `Content attestation` checks on `main`.

## Definition of complete
Complete means every agreed UPI topic family is covered by source-checked, independently reviewed articles with explicit scope, dates, limitations, and stated gaps—not that every possible fraud scheme is exhausted.
