# India Fintech Risk Atlas

An open, source-cited **reference platform first**—with candidate solutions second—covering fraud patterns, risk checks, and operational failure modes across Indian financial products.

**Purpose:** practitioner education, product design, and independent research.  
**Not:** legal advice, an exhaustive compliance checklist, or production-ready fraud detection rules.

## Stack & hosting
Static documentation site built with **Astro 7 + Starlight 0.43 + Pagefind** via GitHub Actions and deployed to GitHub Pages (`site: https://eyeinthesky6.github.io`, `base: /india-fintech-risk-atlas`, not live until enabled and deployed). No backend, database, CMS server, or runtime AI. See [Architecture Freeze](docs/ARCHITECTURE_FREEZE.md) and [astro.config.mjs](astro.config.mjs).

## Start here
- [Architecture freeze](docs/ARCHITECTURE_FREEZE.md) — governing v1 technical and product decisions
- [Content schema & data model](docs/CONTENT_SCHEMA.md) — typed frontmatter, vocabularies, and 4-layer claim model
- [Research & verification protocol](docs/RESEARCH_PROTOCOL.md) — discovery, evidence ledgers, gates, and agent prompts
- [Evidence layers & rights](docs/EVIDENCE_LAYERS_AND_RIGHTS.md) — attribution, licensing, and source quality labels
- [Operator intelligence guide](docs/OPERATOR_INTELLIGENCE.md) — field observations, failure gaps, and validation methods
- [Release status & audit](docs/RELEASE_STATUS.md) — UPI v1 readiness, blockers, and CI status
- [UPI documentation entry point](src/content/docs/upi/index.mdx) — auto-generated UPI catalogue and playbooks

## Editorial rules
Every material claim traces to an opened primary source or is explicitly labeled across four layers (`Official`, `Industry`, `Practitioner`, or `Atlas & research paper leads`). A legal requirement is mandatory only for the entity scope and effective period verified in the primary document. Academic papers belong strictly under Layer 4 as candidate ideas for gaps, not ready-to-use rules or industry/practitioner proof. Avoid sensitive operational evasion thresholds. New contributions require review and attestation checks.

## Current state
UPI v1 release candidate (`release/upi-v1-freeze`, PR `#6`):
- **Website & search:** Astro 7 / Starlight 0.43 static build validated across 29 pages with zero broken internal links (`starlight-links-validator`) and Pagefind indexing across 6 metadata filters (`record_type`, `stage`, `product`, `lifecycle`, `actor`, `evidence_layer`).
- **Evidence coverage:** 10 UPI entries are `source-checked` against directly opened RBI/GoI/industry/`arXiv` originals; 7 entries remain `draft` pending direct `npci.org.in` access (`HTTP 403` blocker). All 17 entries remain **unpublished drafts with `Independent reviewer: PENDING`**, and the repository is not yet deployed to GitHub Pages.

## Local development & verification
Run once per fresh clone so local commits trigger the same attestation gate as CI (`.githooks/pre-commit` automatically selects `python3` or `python` >= 3.8 on Windows/POSIX):

```powershell
git config core.hooksPath .githooks
npm ci --no-audit --no-fund
python scripts/check-attestations.py --all
npm run build
npx astro preview --host 127.0.0.1 --port 4321
```

Open `http://127.0.0.1:4321/india-fintech-risk-atlas/` to inspect locally.

**Licenses:** original editorial content CC BY 4.0; original website code MIT; third-party sources retain their rights. [Full terms](LICENSE.md).

**Release state:** the UPI research collection and site are not independently verified or deployed. Do not mark the project complete solely because draft pages exist.
