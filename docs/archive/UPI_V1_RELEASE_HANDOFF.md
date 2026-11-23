# UPI v1 — release blockers and owner handoff

Updated 2026-11-23. **This is a technically validated release candidate in PR #6, not an independently reviewed or publicly deployed release.**

## Completed on `release/upi-v1-freeze`
- Synced `release/upi-v1-freeze` with `main` (eliminating PR #6 merge conflicts while preserving both `Four-layer evidence amendment` and `Evidence integrity gate` in `docs/RESEARCH_PROTOCOL.md`).
- Fixed Starlight sidebar configuration (`link: '/'`), added missing `public/favicon.svg`, removed duplicate `content/upi/UPI-001.md`, and added P0 `src/content/docs/upi/glossary.md`.
- Generated and committed `package-lock.json`; verified clean `npm ci && npm run build`, Pagefind search, `/india-fintech-risk-atlas/` base paths, `0` broken links, and mobile (`375×812`) responsiveness on live `astro preview`.
- Hardened `.githooks/pre-commit` (Windows/POSIX Python fallback), `scripts/check-attestations.py` (`--all`, duplicate ID checks, ledger enforcement), and `.github/workflows/validate.yml` & `pages.yml` (`npm ci` + `--all` + built link check).
- Audited all 17 UPI entries, evidence ledgers, and attestations against directly retrieved RBI/GoI/industry/`arXiv` documents (10 `source-checked`, 7 `draft` due to `npci.org.in` HTTP 403; `Independent reviewer: PENDING` preserved honestly across all 17).

## Remaining blockers, ordered
1. **Independent reviewer sign-off:** A distinct reviewer must re-open each primary source, mark claim-level outcomes in `research/evidence/<ID>.md`, and sign `research/attestations/<ID>.md`. (An AI drafting/audit pass cannot certify itself as independent reviewer.)
2. **Direct `npci.org.in` circular audit:** Obtain direct access to `npci.org.in` in an authorized browser to confirm current UPI FAQs, Fraud Awareness, Settlement Process (`UPI_Settlement_Process_256f73e1df.pdf`), UDIR timelines, and official copies of `NPCI/2025-26/IS/003` and `NPCI/UPI/OC/220/2025-26` (provisional mirrors used where blocked by `HTTP 403`).
3. **Publishing & repo governance:** Confirm repository plan/visibility before making public, enable GitHub Pages (`Source: GitHub Actions`), test live URL after merge, and enable branch protection requiring `Validate site` and `Content attestation` on `main`.
4. **Overlapping PR hygiene:** Close/do not merge PRs #1, #2, #4, #5 separately after PR #6.

## No-go rules
Do not tick independent reviewer boxes without an actual separate review, label `draft` / `source-checked` material as `reviewed` or `published`, merge PR #6 as a verified public launch before blockers 1–3 are addressed (unless the owner knowingly decides to publish a clearly labeled research preview), or claim a live Pages URL without observing deployment.

## Freeze
Keep the frozen architecture (`GitHub Markdown/YAML → Astro/Starlight → Pagefind → GitHub Pages`). No backend, database, scraper, or runtime AI.
