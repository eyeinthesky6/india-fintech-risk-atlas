# India Fintech Risk Atlas

An open, source-cited **reference platform first**—with candidate solutions second—covering fraud patterns, risk checks, and operational failure modes across Indian financial products.

**Purpose:** practitioner education, product design, and independent research.  
**Not:** legal advice, an exhaustive compliance checklist, or production-ready fraud detection rules.

## Stack & hosting
Static documentation site built with **Astro 7 + Starlight 0.43 + Pagefind** via GitHub Actions and deployed to GitHub Pages (`site: https://eyeinthesky6.github.io`, `base: /india-fintech-risk-atlas`, not live until enabled and deployed). No backend, database, CMS server, or runtime AI. See [Architecture Freeze](docs/ARCHITECTURE_FREEZE.md) and [astro.config.mjs](astro.config.mjs).

## Start here
- [Architecture freeze](docs/ARCHITECTURE_FREEZE.md) — governing v1 technical and product decisions
- [Product architecture & personas](docs/PRODUCT_ARCHITECTURE.md) — 5 user personas, canonical entities, cross-product ID reuse, and search facets
- [Content schema](docs/CONTENT_SCHEMA.md) & [Data model](docs/DATA_MODEL.md) — shared taxonomy ([src/taxonomy.json](src/taxonomy.json)), frontmatter shape, and 5-layer Ready-Reckoner layout
- [Research protocol](docs/RESEARCH_PROTOCOL.md) & [Discovery playbook](docs/RESEARCH_DISCOVERY_PLAN.md) — official source map, search query recipes, and 10-step synthesis pipeline
- [Contributor & agent workflow](docs/SECTION_WORKFLOW.md) — single bounded work unit per PR, Hard vs. Soft gates, and agent contract
- [Domain stewardship & delta-review](docs/TOPIC_STEWARDSHIP_AND_DELTA_REVIEW.md) — 5 topic steward families, baseline certification vs. incremental diff review
- [Agent router & contributor guide](AGENTS.md) — BYO-agent instructions, validation commands, and proof checks
- [Reference architectures & benchmarks](docs/ARCHITECTURE_RESEARCH.md) — lessons from Sigma, MITRE ATT&CK, OpenCTI, and synthetic scale targets
- [Site blueprint & deployment](docs/SITE_BLUEPRINT.md) — GitHub Pages configuration, routing, and template separation
- [Evidence layers & rights](docs/EVIDENCE_LAYERS_AND_RIGHTS.md) — attribution, licensing, and 5-layer quality labels
- [Operator intelligence guide](docs/OPERATOR_INTELLIGENCE.md) — field observations, failure gaps, and validation methods
- [Content update skill](.agents/skills/atlas-content-update/SKILL.md) — contributor workflow including browser computer-use fallback when HTTP fails
- [Release status & audit](docs/RELEASE_STATUS.md) — UPI v1 readiness, blockers, and CI status
- [Product expansion task board](docs/PRODUCT_EXPANSION_TASKBOARD.md) — live execution board and turnkey agent contract for Cards, PA/PG, and Digital Lending
- [UPI documentation entry point](src/content/docs/upi/index.mdx) — auto-generated UPI catalogue and playbooks

## Editorial rules
Every material claim traces to an opened primary source or is explicitly labeled across strictly **five layers** (`Regulatory` / `official`, `Industry practice` / `industry`, `Community insight` / `practitioner`, `Research & academic` / `research`, or `Atlas guidance` / `atlas`). A legal requirement is mandatory only for the entity scope and effective period verified in the primary document. Academic papers belong strictly under `Research & academic` as candidate ideas for gaps, not ready-to-use rules or company proof. Avoid sensitive operational evasion thresholds. New contributions require review and attestation checks.

## Current state
UPI v1 release candidate (`release/upi-v1-freeze`, PR `#6`):
- **Website & search:** Astro 7 / Starlight 0.43 static build validated across 29 pages with zero broken internal links (`starlight-links-validator`) and Pagefind indexing across 6 metadata filters (`record_type`, `stage`, `product`, `lifecycle`, `actor`, `evidence_layer`).
- **Evidence coverage:** All 17 UPI entries (`UPI-OVERVIEW` and `UPI-001`–`UPI-016`) are **`source-checked`** against directly opened RBI, PIB, browser-verified NPCI pages, operating circulars, and confirmed member circulars (including `NPCI/2025-26/IS/003`). All 17 entries currently have baseline research verified with **`Independent reviewer: PENDING`** across designated Domain Steward areas, and the repository is not yet deployed to GitHub Pages.

## Local development & verification
Run once per fresh clone so local commits trigger the same attestation gate as CI (`.githooks/pre-commit` automatically selects `python3` or `python` >= 3.8 on Windows/POSIX):

```powershell
git config core.hooksPath .githooks
npm ci --no-audit --no-fund
python scripts/check-attestations.py --all
python scripts/verify-citations.py --offline --all
npm run build
npx astro preview --host 127.0.0.1 --port 4321
```

Open `http://127.0.0.1:4321/india-fintech-risk-atlas/` to inspect locally.

**Licenses:** original editorial content CC BY 4.0; original website code MIT; third-party sources retain their rights. [Full terms](LICENSE.md).

**Release state:** the UPI research collection and site are not independently verified or deployed. Do not mark the project complete solely because draft pages exist.
