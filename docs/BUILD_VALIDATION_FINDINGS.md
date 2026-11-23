# Build and validation findings — updated 2026-11-23

## Resolved build & tooling defects
1. **Content collection schema (`src/content.config.ts`):** Added documented Starlight `docsLoader` and `docsSchema` configuration (`astro.config.mjs` + Astro 5 / Starlight 0.36).
2. **Starlight sidebar root slug (`astro.config.mjs`):** Fixed `[AstroUserError] The slug "" specified in the Starlight sidebar config does not exist` (the root cause of prior CI run `#44864299170`) by changing `{ label: 'Overview', slug: '' }` to `{ label: 'Overview', link: '/' }`, and grouped UPI navigation into Starlight nested subgroups including `/upi/glossary/`.
3. **Favicon 404 (`public/favicon.svg`):** Added missing `favicon.svg` referenced by all 29 generated HTML pages.
4. **Reproducible lockfile & CI (`package-lock.json`, `.github/workflows/validate.yml`, `.github/workflows/pages.yml`):** Generated and committed `package-lock.json`; switched both workflows from `npm install` to `npm ci --no-audit --no-fund`, added `python3 scripts/check-attestations.py --all`, and added a built-HTML internal link & base-path check in `validate.yml`.
5. **Pre-commit hook & validator (`.githooks/pre-commit`, `scripts/check-attestations.py`):** Updated `.githooks/pre-commit` to detect `python3` or `python` (fixing the Windows `WindowsApps` `python3.exe` stub issue), removed duplicate legacy `content/upi/UPI-001.md`, and extended `check-attestations.py` with `--all`, duplicate-ID checks, evidence ledger checks for all records, and stage-consistency checks (`source-checked` rejects `PENDING`/`unverified`/`blocked` rows; `reviewed`/`published` requires distinct named reviewer and all 12 boxes).

## Observed build & browser verification (2026-11-23)
- **`npm ci --no-audit --no-fund && npm run build`:** Passed cleanly in `5.07s` with zero warnings; built **29 pages** including `/404.html` and `/upi/glossary/index.html`; **Pagefind v1.6.0** indexed **28 pages** (`2,996` words); `sitemap-index.xml` created.
- **Built HTML link audit:** `0` broken internal links and `0` missing `/india-fintech-risk-atlas` base prefixes across all built HTML files.
- **Pre-commit & attestation checks:** `python scripts/check-attestations.py --all` and `python scripts/check-attestations.py` exited `0`; negative tests verified invalid `reviewed` (with `PENDING` reviewer) and invalid `source-checked` (with `blocked` ledger row) states exit `1`.
- **Live `astro preview` verification (`127.0.0.1:4321/india-fintech-risk-atlas/`):**
  - Desktop (`1280×800`): Home, `/upi/`, `/upi/transaction-velocity/`, `/upi/risk-stack-playbook/`, `/upi/glossary/`, and nested sidebar navigation returned HTTP `200` with `0` console errors and `0` failed requests across 50 cumulative requests.
  - Pagefind search: Queries `"mule"` (`12 results`), `"13624"` (`14 results`), and `"reconciliation"` (`10 results`) returned expected entries and navigated cleanly under `/india-fintech-risk-atlas/`.
  - Mobile (`375×812`): Home, `/upi/`, and `/upi/customer-liability/` showed `0` horizontal overflow (`header.x == 0`, tables contained at `328px` within `360px` client width with internal horizontal scroll), working mobile menu drawer, and working mobile search dialog.

## Source retrieval status (2026-11-23)
- **Directly retrieved & inspected (`HTTP 200`):** 13 RBI primary documents (`id=13642`, `13624`, `13633`, `Id=13751`, `Id=12898`, `Id=13543`, `id=13089`, `id=11040`, `id=13641`, `id=12896`, `Id=11693`, `Id=11946`, `id=23810`), PIB release (`PRID=2260277`), Razorpay docs/blogs, Cashfree docs, Stripe Radar Rules 101, and 3 `arXiv` preprints (`2610.21314v1`, `2410.19845v1`, `2607.17586v1`).
- **Blocked on direct retrieval (`HTTP 403 Forbidden`):** All tested `www.npci.org.in` URLs (`/what-we-do/upi/faqs`, `/fraud-awareness`, `/product-overview`, `/circulars/upi`, `/uploads/UPI_Settlement_Process_256f73e1df.pdf`) returned `403`. Two third-party circular mirrors (`NPCI/2025-26/IS/003` via `rscb.bank.in` and `NPCI/UPI/OC/220/2025-26` via Avantis CDN) were visually read and marked provisional pending official `npci.org.in` check.
