# UPI v1 release audit — explicit evidence and implementation status

**As of:** 2026-11-23. **Decision:** NOT READY TO CLAIM INDEPENDENTLY VERIFIED OR PUBLICLY LAUNCHED.

## Scope inventory
- **17 UPI topic entries** (`UPI-OVERVIEW` and `UPI-001` through `UPI-016`), all upgraded to the frozen four-layer schema with claim-by-claim `research/evidence/<ID>.md` ledgers and `research/attestations/<ID>.md` declarations.
- **Product-level reference pages:** `src/content/docs/upi/index.md`, `risk-stack-playbook.md`, `operator-insights.md`, `sources.md`, `glossary.md`, and `coverage.md`.
- **Internal registers:** `research/upi/PRIMARY_SOURCE_REGISTER.md` (14 verified RBI/GoI docs + 2 provisional NPCI mirrors + documented NPCI 403 status) and `research/upi/OPERATOR_EVIDENCE.md` (5 company docs + 3 `arXiv` preprints).
- **Duplicate `UPI-001` resolved:** Removed legacy `content/upi/UPI-001.md` and fixed `README.md` / `EVIDENCE_LAYERS_AND_RIGHTS.md` freeze contradictions.

## Evidence verification status (2026-11-23)
- **10 `source-checked` drafts (independent review pending):** `UPI-001`, `UPI-002`, `UPI-003`, `UPI-005`, `UPI-009`, `UPI-010`, `UPI-011`, `UPI-012`, `UPI-015`, `UPI-016`. Every cited RBI, PIB, company, or `arXiv` source in these records was directly opened and verified against exact sections/effective dates (`Independent reviewer: PENDING`).
- **7 `draft` records (`npci.org.in` HTTP 403 blocker):** `UPI-OVERVIEW`, `UPI-004`, `UPI-006`, `UPI-007`, `UPI-008`, `UPI-013`, `UPI-014`. RBI/company/research claims inside these pages were directly verified, while `npci.org.in` pages returned `HTTP 403 Forbidden` (with two third-party NPCI circular mirrors read provisionally for `UPI-004` and `UPI-008`).
- **0 `reviewed` / `published` records:** No separate independent second reviewer has signed off on any record yet.

## Technical validation status (2026-11-23)
- `npm ci --no-audit --no-fund && npm run build`: **Passed** (`29` pages, `Pagefind` indexed `28` pages / `2,996` words).
- Built HTML link & base-path audit (`/india-fintech-risk-atlas/`): **Passed** (`0` broken links).
- `python scripts/check-attestations.py --all` and `.githooks/pre-commit`: **Passed** (with negative failure checks verified).
- Live `astro preview` desktop (`1280×800`), Pagefind search, and mobile (`375×812`) checks: **Passed** (`0` console errors, `0` failed requests, `0` horizontal overflow).

## Remaining gaps that block verified public release
1. **Independent second-reviewer verification:** Required across all 17 records (`Independent reviewer: PENDING`).
2. **Direct `npci.org.in` verification:** Authorized browser inspection needed for NPCI UPI FAQs, Fraud Awareness, Product Overview, Settlement Process, and Circulars index (including UDIR timelines and official confirmation of `NPCI/2025-26/IS/003` and `NPCI/UPI/OC/220/2025-26`).
3. **Named Indian practitioner observations:** None included in v1 (deferred until original dated public posts are directly verified).
4. **Repository visibility, GitHub Pages activation & branch protection:** Repository remains private; Pages deployment and branch protection requiring `Validate site` + `Content attestation` remain unconfigured.
